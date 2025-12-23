# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Bonsai Buddy app.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Supabase CLI installed (optional, for local development)

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - Project name: `bonsai-buddy` (or your preferred name)
   - Database password: (create a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project" and wait for setup to complete

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (looks like: `eyJhbGc...`)

3. Update your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for first-time setup)

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the migration
6. Verify success: You should see a success message

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 4: Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the following tables:
   - `profiles`
   - `bonsai_specimens`
   - `bonsai_posts`
   - `post_likes`
   - `specimen_subscriptions`

## Step 5: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Configure additional providers (Google, GitHub, etc.)

### Email Templates (Optional)

Customize email templates in **Authentication** → **Email Templates**:
- Confirm signup
- Reset password
- Magic link

## Step 6: Configure Storage (For Image Uploads)

1. Go to **Storage**
2. Create a new bucket called `bonsai-images`
3. Set it to **Public** (or configure RLS policies)
4. Update policies to allow authenticated users to upload

Example storage policy:
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bonsai-images');

-- Allow public read access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bonsai-images');
```

## Step 7: Seed Data (Optional)

If you want to populate the database with test data:

1. First, create test users through your app's signup flow
2. Get the user IDs from the **Authentication** → **Users** page
3. Update the UUIDs in `seed.sql` with your test user IDs
4. Run the seed file in **SQL Editor**

## Step 8: Test Your Setup

1. Start your Next.js development server: `pnpm dev`
2. Visit http://localhost:3000
3. Try signing up with a new account
4. Check Supabase dashboard to verify:
   - New user appears in **Authentication** → **Users**
   - New profile created in **profiles** table

## Database Schema Overview

### Tables

- **profiles**: User profiles (auto-created on signup)
- **bonsai_specimens**: Bonsai tree information
- **bonsai_posts**: Updates/photos about bonsai
- **post_likes**: Track post likes
- **specimen_subscriptions**: Track specimen followers

### Key Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Automatic timestamps**: `created_at` and `updated_at` auto-managed
- **Auto profile creation**: Trigger creates profile when user signs up
- **Like count sync**: Triggers keep post like counts accurate

## Troubleshooting

### "Missing Supabase environment variables" error
- Ensure `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your dev server after adding env variables

### Can't insert data
- Check Row Level Security policies
- Ensure you're authenticated (policies require `auth.uid()`)
- Check Supabase logs in **Database** → **Logs**

### Images not uploading
- Verify storage bucket is created
- Check storage policies allow your user to upload
- Ensure bucket is public or has appropriate access policies

## Next Steps

After setup is complete:
1. The app will automatically use Supabase for authentication
2. Data will persist in your Supabase database
3. You can view/manage data in the Supabase dashboard
4. Consider setting up database backups in production

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
