-- AUTO-CONFIRM USERS FOR DEVELOPMENT
-- This will automatically confirm email for all new signups
-- WARNING: Only use this in development, not production!

CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user's email
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id
  AND email_confirmed_at IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-confirm users on signup
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NULL)
  EXECUTE FUNCTION auto_confirm_user();
