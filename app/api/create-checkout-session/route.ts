import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, prompt, allowPublic, videoPath } = body

    // Validate required fields (videoPath is now optional)
    if (!name || !email || !prompt) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis.' },
        { status: 400 }
      )
    }

    // Insert into Supabase submissions table
    const { data: submissionData, error: insertError } = await supabase
      .from('submissions')
      .insert([
        {
          name,
          email,
          prompt,
          allow_public: allowPublic || false, // Use the value from the form
          video_path: videoPath || '', // Use empty string if not provided (database has NOT NULL constraint)
          payment_status: 'pending',
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      )
    }

    const submissionId = submissionData.id

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    // Get Stripe price ID
    const stripePriceId = process.env.STRIPE_PRICE_ID
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured' },
        { status: 500 }
      )
    }

    // Get site URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        submissionId: submissionId,
      },
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}/?canceled=true`,
    })

    // Update Supabase row with stripe_session_id
    await supabase
      .from('submissions')
      .update({ stripe_session_id: session.id })
      .eq('id', submissionId)

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error('create-checkout-session error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Une erreur est survenue.' },
      { status: 400 }
    )
  }
}

