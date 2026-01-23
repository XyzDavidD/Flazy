import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Get all users or a specific user by ID
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // If userId is provided, fetch specific user
    if (userId) {
      const { data, error } = await client.auth.admin.getUserById(userId)

      if (error || !data.user) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
          { error: 'User not found', details: error?.message },
          { status: 404 }
        )
      }

      return NextResponse.json({ 
        user: {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        }
      })
    }
    
    // Otherwise, fetch all users from auth.users
    const { data, error } = await client.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      )
    }

    // Return simplified user data
    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
