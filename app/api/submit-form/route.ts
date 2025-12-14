import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  console.log('submit-form API called')
  try {
    const body = await request.json()
    const { name, email, prompt, allowPublic, videoPath } = body

    // Validate fields
    if (!name || !email || !prompt || !videoPath) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis.' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          name,
          email,
          prompt,
          allow_public: allowPublic || false,
          video_path: videoPath,
          payment_status: 'pending',
        },
      ])
      .select()

    console.log('supabase insert result:', { data, error })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('submit-form error:', error)
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue.' },
      { status: 500 }
    )
  }
}


