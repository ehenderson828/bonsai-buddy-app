-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extended user information beyond auth.users
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- BONSAI SPECIMENS TABLE
-- Main table for bonsai tree information
-- =====================================================
CREATE TABLE bonsai_specimens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0),
  health TEXT NOT NULL CHECK (health IN ('excellent', 'good', 'fair', 'needs-attention')),
  image_url TEXT NOT NULL,
  care_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_specimens_user_id ON bonsai_specimens(user_id);
CREATE INDEX idx_specimens_created_at ON bonsai_specimens(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bonsai_specimens ENABLE ROW LEVEL SECURITY;

-- Policies for bonsai_specimens
CREATE POLICY "Bonsai specimens are viewable by everyone"
  ON bonsai_specimens FOR SELECT
  USING (true);

CREATE POLICY "Users can create own bonsai specimens"
  ON bonsai_specimens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bonsai specimens"
  ON bonsai_specimens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bonsai specimens"
  ON bonsai_specimens FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- BONSAI POSTS TABLE
-- Updates and photos about bonsai specimens
-- =====================================================
CREATE TABLE bonsai_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specimen_id UUID NOT NULL REFERENCES bonsai_specimens(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_posts_specimen_id ON bonsai_posts(specimen_id);
CREATE INDEX idx_posts_user_id ON bonsai_posts(user_id);
CREATE INDEX idx_posts_created_at ON bonsai_posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bonsai_posts ENABLE ROW LEVEL SECURITY;

-- Policies for bonsai_posts
CREATE POLICY "Bonsai posts are viewable by everyone"
  ON bonsai_posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts for own specimens"
  ON bonsai_posts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM bonsai_specimens
      WHERE id = specimen_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own posts"
  ON bonsai_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON bonsai_posts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POST LIKES TABLE
-- Track which users liked which posts
-- =====================================================
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES bonsai_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes
CREATE INDEX idx_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_likes_user_id ON post_likes(user_id);

-- Enable Row Level Security
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Policies for post_likes
CREATE POLICY "Post likes are viewable by everyone"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- SPECIMEN SUBSCRIPTIONS TABLE
-- Track which users subscribe to specimen updates
-- =====================================================
CREATE TABLE specimen_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specimen_id UUID NOT NULL REFERENCES bonsai_specimens(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(specimen_id, user_id)
);

-- Create indexes
CREATE INDEX idx_subscriptions_specimen_id ON specimen_subscriptions(specimen_id);
CREATE INDEX idx_subscriptions_user_id ON specimen_subscriptions(user_id);

-- Enable Row Level Security
ALTER TABLE specimen_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for specimen_subscriptions
CREATE POLICY "Subscriptions are viewable by everyone"
  ON specimen_subscriptions FOR SELECT
  USING (true);

CREATE POLICY "Users can subscribe to specimens"
  ON specimen_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsubscribe from specimens"
  ON specimen_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specimens_updated_at BEFORE UPDATE ON bonsai_specimens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON bonsai_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to sync profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE bonsai_posts
    SET likes = likes + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE bonsai_posts
    SET likes = GREATEST(likes - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for post likes count
CREATE TRIGGER increment_post_likes
  AFTER INSERT ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER decrement_post_likes
  AFTER DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
