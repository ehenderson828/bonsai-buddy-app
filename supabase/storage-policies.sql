-- STORAGE POLICIES FOR BONSAI IMAGES BUCKET
-- Run this in SQL Editor after creating the bonsai-images bucket

-- Policy 1: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bonsai-images');

-- Policy 2: Allow public read access to all images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bonsai-images');

-- Policy 3: Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bonsai-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy 4: Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bonsai-images' AND auth.uid()::text = (storage.foldername(name))[1]);
