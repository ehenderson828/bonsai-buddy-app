-- =====================================================
-- ADD POST PRIVACY SETTINGS
-- Add is_public column to bonsai_posts for post-level privacy control
-- =====================================================

-- Add is_public column to bonsai_posts (default to true for existing posts)
ALTER TABLE bonsai_posts
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;

-- Add comment to document the new column
COMMENT ON COLUMN bonsai_posts.is_public IS 'Whether the post is visible to the public. Private posts are only visible to the owner.';

-- Create index for faster filtering by privacy
CREATE INDEX idx_bonsai_posts_is_public ON bonsai_posts(is_public);

-- Create index for filtering public posts by specimen
CREATE INDEX idx_bonsai_posts_public_specimen ON bonsai_posts(specimen_id, is_public);
