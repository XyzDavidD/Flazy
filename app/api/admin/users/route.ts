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
    
    // Fetch user IDs who have ever made a purchase (bought a Stripe plan)
    const { data: purchaseData, error: purchaseError } = await client
      .from('purchases')
      .select('user_id')
    if (purchaseError) {
      console.error('Error fetching purchases (non-fatal):', purchaseError)
    }

    // Fetch user IDs who have a credits row (manually given free trial credits)
    const { data: creditsData, error: creditsError } = await client
      .from('user_credits')
      .select('user_id')
    if (creditsError) {
      console.error('Error fetching user_credits (non-fatal):', creditsError)
    }

    // Merge and deduplicate: show anyone who purchased OR has a credits row
    const allUserIds = [
      ...(purchaseData || []).map((p: { user_id: string }) => p.user_id),
      ...(creditsData || []).map((c: { user_id: string }) => c.user_id),
    ]
    const qualifiedUserIds = [...new Set(allUserIds)]

    if (qualifiedUserIds.length === 0) {
      return NextResponse.json({ users: [] })
    }

    // Fetch all auth users and filter to only those who purchased
    const { data, error } = await client.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      )
    }

    const users = data.users
      .filter(user => qualifiedUserIds.includes(user.id))
      .map(user => ({
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
