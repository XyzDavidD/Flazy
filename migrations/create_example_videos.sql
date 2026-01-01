-- Create example_videos table for admin-managed homepage example videos
CREATE TABLE IF NOT EXISTS example_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  video_path text NOT NULL,
  position integer NOT NULL UNIQUE CHECK (position >= 1 AND position <= 4),
  title text NOT NULL,
  description text NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_example_videos_position ON example_videos(position);

-- Add comment
COMMENT ON TABLE example_videos IS 'Stores admin-managed example videos for homepage ExamplesSection (4 fixed positions)';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_example_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_example_videos_updated_at_trigger
  BEFORE UPDATE ON example_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_example_videos_updated_at();

