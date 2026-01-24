-- Create payment_attempts table to track checkout attempts and prevent card testing
CREATE TABLE IF NOT EXISTS payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  success boolean NOT NULL DEFAULT false,
  session_id text,
  error_message text
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_id ON payment_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_ip ON payment_attempts(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_created_at ON payment_attempts(created_at DESC);

-- Create processed_sessions table to prevent double-processing webhooks
CREATE TABLE IF NOT EXISTS processed_sessions (
  session_id text PRIMARY KEY,
  processed_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_granted integer NOT NULL,
  amount_total bigint NOT NULL
);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_processed_sessions_processed_at ON processed_sessions(processed_at DESC);

-- Add comments
COMMENT ON TABLE payment_attempts IS 'Tracks all payment checkout attempts for rate limiting and abuse detection';
COMMENT ON TABLE processed_sessions IS 'Prevents double-processing of Stripe webhook events';
