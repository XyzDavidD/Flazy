import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
    })
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// GET: Fetch admin password from Supabase
export async function GET(request: NextRequest) {
  try {
    let client
    try {
      client = getSupabaseClient()
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      return NextResponse.json(
        { error: 'Server configuration error', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }
    
    const { data, error } = await client
      .from('admin_config')
      .select('config_value')
      .eq('config_key', 'admin_password')
      .single()

    if (error) {
      console.error('Error fetching admin password:', error)
      return NextResponse.json(
        { error: 'Failed to fetch admin password', details: error.message },
        { status: 500 }
      )
    }

    if (!data || !data.config_value) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 404 }
      )
    }

    return NextResponse.json({ password: data.config_value }, { status: 200 })
  } catch (error) {
    console.error('GET /api/admin/config error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

