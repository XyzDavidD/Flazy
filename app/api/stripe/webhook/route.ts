import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createSupabaseServer } from '@/lib/supabaseServer'
import { isSessionProcessed, markSessionProcessed } from '@/lib/paymentSecurity'

export const runtime = 'nodejs'

// Map price IDs to token amounts
const PRICE_TO_TOKENS: Record<string, number> = {
  [process.env.STRIPE_PRICE_STARTER || '']: 5,
  [process.env.STRIPE_PRICE_CREATOR || '']: 10,
  [process.env.STRIPE_PRICE_PRO || '']: 25,
  [process.env.STRIPE_PRICE_BOOST || '']: 50,
}

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
      const userId = session.metadata?.userId
      const priceId = session.metadata?.priceId

      if (!userId || !priceId) {
        console.warn('Missing userId or priceId in session metadata:', { userId, priceId })
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // SECURITY: Check if session already processed (prevent double-crediting)
      const alreadyProcessed = await isSessionProcessed(session.id)
      if (alreadyProcessed) {
        console.warn(`Session ${session.id} already processed. Skipping.`)
        return NextResponse.json({ received: true, message: 'Already processed' }, { status: 200 })
      }

      // SECURITY: Verify payment status
      if (session.payment_status !== 'paid') {
        console.warn(`Session ${session.id} payment not confirmed. Status: ${session.payment_status}`)
        return NextResponse.json({ received: true, message: 'Payment not confirmed' }, { status: 200 })
      }

      // SECURITY: Check session age (ignore sessions older than 24 hours)
      const sessionCreatedAt = session.created * 1000 // Convert to milliseconds
      const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000)
      if (sessionCreatedAt < twentyFourHoursAgo) {
        console.warn(`Session ${session.id} is older than 24 hours. Ignoring.`)
        return NextResponse.json({ received: true, message: 'Session too old' }, { status: 200 })
      }

      // Determine tokens granted
      const tokens = PRICE_TO_TOKENS[priceId] || 0

      if (tokens === 0) {
        console.warn(`Unknown priceId: ${priceId}. No tokens granted.`)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const supabase = createSupabaseServer()

      // Get current credits (or 0 if row doesn't exist)
      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', userId)
        .single()

      const currentCredits = creditsData?.credits ?? 0

      // Upsert user_credits (increment by tokens)
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userId,
          credits: currentCredits + tokens,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        })

      if (creditsError) {
        console.error('Error updating user_credits:', creditsError)
        return NextResponse.json(
          { error: 'Failed to update credits' },
          { status: 500 }
        )
      }

      console.log(`Granted ${tokens} tokens to user ${userId}. New total: ${currentCredits + tokens}`)

      // SECURITY: Mark session as processed BEFORE inserting purchase record
      await markSessionProcessed(session.id, userId, tokens, session.amount_total || 0)

      // Insert purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          stripe_session_id: session.id,
          price_id: priceId,
          tokens: tokens,
          amount_total: session.amount_total || 0,
          currency: session.currency || 'eur',
        })

      if (purchaseError) {
        console.error('Error inserting purchase record:', purchaseError)
        // Don't fail the webhook if purchase record fails
      } else {
        console.log(`Purchase record created for user ${userId}, session ${session.id}`)
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

