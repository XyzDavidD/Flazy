import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'
import { sendAdminNotification } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const sig = headers().get('stripe-signature')

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const submissionId = session.metadata?.submissionId

      if (submissionId) {
        // Update payment status to paid
        const { data: updateData, error: updateError } = await supabase
          .from('submissions')
          .update({ payment_status: 'paid' })
          .eq('id', submissionId)

        console.log('Supabase update result:', { data: updateData, error: updateError })

        if (updateError) {
          console.error('Error updating submission:', updateError)
        } else {
          // Fetch the submission to get all details for email
          const { data: submission, error: fetchError } = await supabase
            .from('submissions')
            .select('id, name, email, prompt, allow_public, video_path')
            .eq('id', submissionId)
            .single()

          if (fetchError) {
            console.error('Error fetching submission:', fetchError)
          } else if (submission) {
            // Compute videoUrl only if video_path exists
            let videoUrl: string | null = null
            if (submission.video_path) {
              if (submission.video_path.startsWith('http')) {
                videoUrl = submission.video_path
              } else {
                const { data: urlData } = supabase.storage
                  .from('videos')
                  .getPublicUrl(submission.video_path)
                videoUrl = urlData.publicUrl
              }
            }

            // Send admin notification email
            try {
              await sendAdminNotification({
                submissionId: submission.id,
                name: submission.name,
                email: submission.email,
                prompt: submission.prompt,
                allowPublic: submission.allow_public || false,
                videoUrl: videoUrl || '', // Pass empty string if no video
              })
            } catch (emailError) {
              // Log error but don't fail the webhook
              console.error('Error sending admin notification email:', emailError)
            }
          }
        }
      } else {
        console.warn('No submissionId found in session metadata')
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

