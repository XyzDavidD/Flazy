-- Create carousel_videos table for admin-managed homepage carousel videos
CREATE TABLE IF NOT EXISTS carousel_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  video_path text NOT NULL,
  is_published boolean NOT NULL DEFAULT true
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_carousel_videos_published ON carousel_videos(is_published, created_at DESC);

-- Add comment
COMMENT ON TABLE carousel_videos IS 'Stores admin-uploaded videos for homepage carousel display';

