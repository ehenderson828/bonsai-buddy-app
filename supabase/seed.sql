-- =====================================================
-- SEED DATA FOR TESTING
-- This file contains sample data to populate the database
-- =====================================================

-- Note: In production, users will be created through Supabase Auth
-- For testing, you'll need to create users through the Supabase dashboard or signup flow
-- Then update the UUIDs below to match your test users

-- Example seed data structure (commented out - update with real user IDs after signup)

/*
-- Insert test profiles (these will be auto-created via trigger on auth.users insert)
-- You can manually insert additional profile data if needed

-- Update existing profiles with avatars
UPDATE profiles SET avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sakura'
WHERE email = 'sakura@example.com';

UPDATE profiles SET avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji'
WHERE email = 'kenji@example.com';

-- Insert sample bonsai specimens
INSERT INTO bonsai_specimens (id, user_id, name, species, age, health, image_url, care_notes)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM profiles WHERE email = 'sakura@example.com' LIMIT 1),
    'Ancient Pine',
    'Japanese White Pine',
    45,
    'excellent',
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd0',
    'Water twice weekly, full morning sun, indoor placement during winter'
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    (SELECT id FROM profiles WHERE email = 'sakura@example.com' LIMIT 1),
    'Cascade Maple',
    'Japanese Maple',
    12,
    'good',
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd1',
    'Requires shade in afternoon, water daily in summer'
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    (SELECT id FROM profiles WHERE email = 'kenji@example.com' LIMIT 1),
    'Serene Juniper',
    'Chinese Juniper',
    28,
    'excellent',
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd2',
    'Hardy specimen, minimal watering needed in winter'
  ),
  (
    'd4e5f6a7-b8c9-0123-def1-234567890123',
    (SELECT id FROM profiles WHERE email = 'kenji@example.com' LIMIT 1),
    'Dawn Azalea',
    'Satsuki Azalea',
    8,
    'needs-attention',
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd3',
    'Recently repotted, monitoring for transplant shock. Flowers blooming in spring.'
  );

-- Insert sample posts
INSERT INTO bonsai_posts (specimen_id, user_id, image_url, caption, likes)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM profiles WHERE email = 'sakura@example.com' LIMIT 1),
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd0',
    'Spring growth is looking amazing! The new needles have such a vibrant green color.',
    12
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    (SELECT id FROM profiles WHERE email = 'sakura@example.com' LIMIT 1),
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd1',
    'First autumn colors starting to show. Love this time of year!',
    8
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    (SELECT id FROM profiles WHERE email = 'kenji@example.com' LIMIT 1),
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd2',
    'After 3 years of training, the cascade style is really taking shape.',
    15
  ),
  (
    'd4e5f6a7-b8c9-0123-def1-234567890123',
    (SELECT id FROM profiles WHERE email = 'kenji@example.com' LIMIT 1),
    'https://images.unsplash.com/photo-1585828923837-ac4c05bbddd3',
    'Flowers are blooming! Despite the recent stress, she is pushing through beautifully.',
    20
  );
*/

-- =====================================================
-- HELPER QUERIES FOR TESTING
-- =====================================================

-- View all specimens with owner information
-- SELECT
--   s.id,
--   s.name,
--   s.species,
--   s.age,
--   s.health,
--   p.name as owner_name,
--   p.email as owner_email
-- FROM bonsai_specimens s
-- JOIN profiles p ON s.user_id = p.id;

-- View all posts with specimen and owner information
-- SELECT
--   posts.id,
--   posts.caption,
--   posts.likes,
--   posts.created_at,
--   specimens.name as specimen_name,
--   profiles.name as owner_name
-- FROM bonsai_posts posts
-- JOIN bonsai_specimens specimens ON posts.specimen_id = specimens.id
-- JOIN profiles profiles ON posts.user_id = profiles.id
-- ORDER BY posts.created_at DESC;

-- Count specimens by user
-- SELECT
--   p.name,
--   COUNT(s.id) as specimen_count
-- FROM profiles p
-- LEFT JOIN bonsai_specimens s ON p.id = s.user_id
-- GROUP BY p.id, p.name;
