-- Create user_videos table for admin to upload videos for specific users
CREATE TABLE IF NOT EXISTS user_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_path text NOT NULL,
  title text,
  description text
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_user_videos_user_id ON user_videos(user_id, created_at DESC);

-- Add comment
COMMENT ON TABLE user_videos IS 'Stores admin-uploaded videos for specific users';
