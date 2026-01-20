-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES bonsai_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT content_length_check CHECK (char_length(content) <= 500)
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Add indexes for performance
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_comments_updated_at();

-- Add comments column
COMMENT ON TABLE comments IS 'User comments on bonsai posts with threading support';
COMMENT ON COLUMN comments.parent_comment_id IS 'NULL for top-level comments, references parent for replies';
COMMENT ON COLUMN comments.is_deleted IS 'Soft delete flag - deleted comments show [Comment deleted] but preserve threading';
COMMENT ON COLUMN comments.edited_at IS 'Timestamp of last edit. NULL means never edited.';

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
-- Anyone can read non-deleted comments on public posts
CREATE POLICY "Anyone can view non-deleted comments"
  ON comments FOR SELECT
  USING (
    NOT is_deleted OR
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM bonsai_posts
      WHERE bonsai_posts.id = comments.post_id
      AND bonsai_posts.user_id = auth.uid()
    )
  );

-- Authenticated users can insert comments on public posts they can see
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM bonsai_posts p
      LEFT JOIN profiles owner ON p.user_id = owner.id
      WHERE p.id = post_id
      AND p.is_public = true
      AND (owner.is_private = false OR p.user_id = auth.uid())
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments OR comments on their posts
CREATE POLICY "Users can delete own comments or comments on their posts"
  ON comments FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM bonsai_posts
      WHERE bonsai_posts.id = comments.post_id
      AND bonsai_posts.user_id = auth.uid()
    )
  );

-- RLS Policies for comment_likes
CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like comments"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);
