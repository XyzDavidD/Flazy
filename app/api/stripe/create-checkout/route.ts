import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '@/lib/supabaseServer'
import { checkPaymentRateLimit, logPaymentAttempt, getClientIp } from '@/lib/paymentSecurity'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const getSiteUrl = () => {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? 'http://localhost:3000' : 'https://www.flazy.app'
}

// Map pack names to price IDs using server env vars
const PACK_TO_PRICE_ID: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || '',
  creator: process.env.STRIPE_PRICE_CREATOR || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
  boost: process.env.STRIPE_PRICE_BOOST || '',
}

export async function POST(request: NextRequest) {
  let userId: string | undefined
  let ipAddress: string | undefined

  try {
    // Get client IP address
    ipAddress = getClientIp(request)

    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const supabase = createSupabaseServer()

    // Verify the user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Session invalide. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }

    userId = user.id

    // SECURITY: Check rate limits
    const rateLimitCheck = await checkPaymentRateLimit(userId, ipAddress)
    if (!rateLimitCheck.allowed) {
      // Log failed attempt due to rate limit
      await logPaymentAttempt(userId, ipAddress, false, undefined, rateLimitCheck.reason)
      
      return NextResponse.json(
        { error: rateLimitCheck.reason },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { pack } = body

    if (!pack || typeof pack !== 'string') {
      await logPaymentAttempt(userId, ipAddress, false, undefined, 'Missing pack parameter')
      return NextResponse.json(
        { error: 'Pack manquant. Veuillez sélectionner un pack.' },
        { status: 400 }
      )
    }

    // Map pack to priceId
    const priceId = PACK_TO_PRICE_ID[pack.toLowerCase()]

    if (!priceId) {
      // Check which env var is missing
      const missingEnv = !process.env.STRIPE_PRICE_STARTER ? 'STRIPE_PRICE_STARTER' :
                        !process.env.STRIPE_PRICE_CREATOR ? 'STRIPE_PRICE_CREATOR' :
                        !process.env.STRIPE_PRICE_PRO ? 'STRIPE_PRICE_PRO' :
                        !process.env.STRIPE_PRICE_BOOST ? 'STRIPE_PRICE_BOOST' :
                        `STRIPE_PRICE_${pack.toUpperCase()}`
      
      console.error(`Missing Stripe price ID for pack "${pack}". Missing env var: ${missingEnv}`)
      await logPaymentAttempt(userId, ipAddress, false, undefined, `Missing price ID for pack: ${pack}`)
      
      return NextResponse.json(
        { error: `Configuration manquante pour le pack "${pack}". Variable d'environnement manquante: ${missingEnv}` },
        { status: 500 }
      )
    }

    const siteUrl = getSiteUrl()

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      metadata: {
        userId: user.id,
        priceId: priceId,
        pack: pack,
      },
      // SECURITY: Prevent session reuse
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    })

    // Log successful checkout session creation
    await logPaymentAttempt(userId, ipAddress, true, session.id)

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error('POST /api/stripe/create-checkout error:', error)
    
    // Log failed attempt
    if (userId && ipAddress) {
      await logPaymentAttempt(
        userId,
        ipAddress,
        false,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur. Veuillez réessayer plus tard.' },
      { status: 500 }
    )
  }
}

