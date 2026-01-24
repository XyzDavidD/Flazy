import { createSupabaseServer } from './supabaseServer'

interface RateLimitResult {
  allowed: boolean
  reason?: string
  attemptsInWindow?: number
  blockedUntil?: Date
}

/**
 * Check if user/IP is rate limited for payment attempts
 * Rules:
 * - Max 3 attempts per user per 15 minutes
 * - Max 10 attempts per IP per hour
 * - Block IP after 5 rapid failures (within 5 minutes)
 */
export async function checkPaymentRateLimit(
  userId: string,
  ipAddress: string
): Promise<RateLimitResult> {
  const supabase = createSupabaseServer()
  const now = new Date()

  // Check 1: User rate limit (3 attempts per 15 minutes)
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000)
  const { data: userAttempts } = await supabase
    .from('payment_attempts')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', fifteenMinutesAgo.toISOString())

  if (userAttempts && userAttempts.length >= 3) {
    return {
      allowed: false,
      reason: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.',
      attemptsInWindow: userAttempts.length,
    }
  }

  // Check 2: IP rate limit (10 attempts per hour)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const { data: ipAttempts } = await supabase
    .from('payment_attempts')
    .select('id')
    .eq('ip_address', ipAddress)
    .gte('created_at', oneHourAgo.toISOString())

  if (ipAttempts && ipAttempts.length >= 10) {
    return {
      allowed: false,
      reason: 'Trop de tentatives depuis cette adresse IP. Veuillez réessayer plus tard.',
      attemptsInWindow: ipAttempts.length,
    }
  }

  // Check 3: Rapid failures (5 failures within 5 minutes = block IP for 1 hour)
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  const { data: recentFailures } = await supabase
    .from('payment_attempts')
    .select('created_at')
    .eq('ip_address', ipAddress)
    .eq('success', false)
    .gte('created_at', fiveMinutesAgo.toISOString())
    .order('created_at', { ascending: false })

  if (recentFailures && recentFailures.length >= 5) {
    const blockedUntil = new Date(now.getTime() + 60 * 60 * 1000) // Block for 1 hour
    return {
      allowed: false,
      reason: 'Votre IP a été temporairement bloquée en raison d\'une activité suspecte.',
      blockedUntil,
    }
  }

  return { allowed: true }
}

/**
 * Log a payment attempt
 */
export async function logPaymentAttempt(
  userId: string,
  ipAddress: string,
  success: boolean,
  sessionId?: string,
  errorMessage?: string
): Promise<void> {
  const supabase = createSupabaseServer()

  await supabase.from('payment_attempts').insert({
    user_id: userId,
    ip_address: ipAddress,
    success,
    session_id: sessionId,
    error_message: errorMessage,
  })
}

/**
 * Check if a Stripe session has already been processed
 */
export async function isSessionProcessed(sessionId: string): Promise<boolean> {
  const supabase = createSupabaseServer()

  const { data } = await supabase
    .from('processed_sessions')
    .select('session_id')
    .eq('session_id', sessionId)
    .single()

  return !!data
}

/**
 * Mark a session as processed
 */
export async function markSessionProcessed(
  sessionId: string,
  userId: string,
  creditsGranted: number,
  amountTotal: number
): Promise<void> {
  const supabase = createSupabaseServer()

  await supabase.from('processed_sessions').insert({
    session_id: sessionId,
    user_id: userId,
    credits_granted: creditsGranted,
    amount_total: amountTotal,
  })
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
  const headers = request.headers

  // Try different header patterns (Vercel, Cloudflare, etc.)
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const real = headers.get('x-real-ip')
  if (real) {
    return real
  }

  return headers.get('cf-connecting-ip') || '0.0.0.0'
}
