import { createClient, SupabaseClient } from '@supabase/supabase-js'

function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time, if env vars are missing, use placeholders to avoid build errors
  // At runtime, API routes will fail if env vars are actually missing
  if (!supabaseUrl || !supabaseAnonKey) {
    // Use placeholder values that won't cause validation errors during build
    return createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Lazy initialization - only create client when accessed
let _supabase: SupabaseClient | null = null

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      _supabase = createSupabaseClient()
    }
    const value = _supabase[prop as keyof SupabaseClient]
    if (typeof value === 'function') {
      return value.bind(_supabase)
    }
    return value
  },
})

