-- ============================================================
-- Enable Row Level Security (RLS) on all tables
-- This blocks direct public access via the anon key.
-- All server-side code uses the service role key which
-- bypasses RLS entirely, so nothing breaks.
-- ============================================================

-- admin_config: only server-side (service role) should ever read this
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- carousel_videos: public read-only (shown on homepage)
ALTER TABLE carousel_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published carousel videos"
  ON carousel_videos
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- example_videos: public read-only (shown on homepage)
ALTER TABLE example_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read example videos"
  ON example_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- payment_attempts: only server-side (service role) should access this
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;

-- processed_sessions: only server-side (service role) should access this
ALTER TABLE processed_sessions ENABLE ROW LEVEL SECURITY;

-- user_videos: authenticated users can only read their own videos
ALTER TABLE user_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own videos"
  ON user_videos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
