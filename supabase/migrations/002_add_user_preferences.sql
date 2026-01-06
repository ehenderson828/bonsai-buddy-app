-- =====================================================
-- ADD USER PREFERENCES TO PROFILES TABLE
-- Theme, email preferences, and notification settings
-- =====================================================

-- Add theme preference column (dark is default)
ALTER TABLE profiles
ADD COLUMN theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark'));

-- Add email preferences column (JSON for flexibility)
ALTER TABLE profiles
ADD COLUMN email_preferences JSONB DEFAULT '{
  "marketing": false,
  "updates": true,
  "community": true,
  "weekly_digest": false
}'::jsonb;

-- Add notification settings column (JSON for flexibility)
ALTER TABLE profiles
ADD COLUMN notification_settings JSONB DEFAULT '{
  "post_likes": true,
  "new_followers": true,
  "comments": true,
  "specimen_subscriptions": true
}'::jsonb;

-- Add account privacy setting
ALTER TABLE profiles
ADD COLUMN is_private BOOLEAN DEFAULT false;

-- Add comment to document the new columns
COMMENT ON COLUMN profiles.theme IS 'User preferred theme: light or dark';
COMMENT ON COLUMN profiles.email_preferences IS 'User email notification preferences';
COMMENT ON COLUMN profiles.notification_settings IS 'User in-app notification settings';
COMMENT ON COLUMN profiles.is_private IS 'Whether the user account is private';
