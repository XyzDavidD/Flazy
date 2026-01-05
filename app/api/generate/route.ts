import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const supabase = createSupabaseServer()

    // Verify the user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    let body: any
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('JSON parse error in /api/generate:', jsonError)
      return NextResponse.json(
        { error: 'Invalid request body. Please provide a valid JSON payload.' },
        { status: 400 }
      )
    }

    const { prompt } = body

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get current credits
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    if (creditsError && creditsError.code !== 'PGRST116') {
      console.error('Error fetching credits:', creditsError)
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      )
    }

    const currentCredits = creditsData?.credits ?? 0

    if (currentCredits <= 0) {
      return NextResponse.json(
        { error: 'Crédits insuffisants.' },
        { status: 402 }
      )
    }

    // Atomically decrement credits
    const { data: updatedCredits, error: updateError } = await supabase
      .from('user_credits')
      .upsert({
        user_id: user.id,
        credits: currentCredits - 1,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select('credits')
      .single()

    if (updateError) {
      console.error('Error updating credits:', updateError)
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      )
    }

    const remainingCredits = updatedCredits.credits

    // Send admin notification email
    try {
      await resend.emails.send({
        from: 'FLAZY <onboarding@resend.dev>',
        to: process.env.ADMIN_NOTIFICATION_EMAIL || '',
        subject: 'Nouveau prompt (1 token consommé)',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <h2 style="color: #ff8a1f; margin-bottom: 20px;">Nouveau prompt (1 token consommé)</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #020314; margin-top: 0;">Informations</h3>
              <p><strong>Email utilisateur:</strong> ${user.email}</p>
              <p><strong>ID utilisateur:</strong> ${user.id}</p>
              <p><strong>Crédits restants:</strong> ${remainingCredits}</p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #020314; margin-top: 0;">Prompt</h3>
              <p style="white-space: pre-wrap; color: #64748b;">${prompt}</p>
            </div>
          </div>
        `,
      })
      console.log('Admin notification email sent successfully')
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('Error sending admin notification email:', emailError)
    }

    console.log(`Token consumed for user ${user.id}. Remaining credits: ${remainingCredits}`)

    return NextResponse.json({
      ok: true,
      remainingCredits,
    })
  } catch (error) {
    console.error('POST /api/generate error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

