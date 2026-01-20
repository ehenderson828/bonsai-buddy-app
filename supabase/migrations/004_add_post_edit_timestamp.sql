-- Add edited_at column to track post edits
ALTER TABLE bonsai_posts
ADD COLUMN edited_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN bonsai_posts.edited_at IS 'Timestamp of last edit. NULL means never edited.';

-- Create index for efficient sorting by most recent activity
CREATE INDEX idx_bonsai_posts_activity ON bonsai_posts(COALESCE(edited_at, created_at) DESC);
