-- Fix Storage Bucket Permissions for Image Uploads
-- Run this in Supabase SQL Editor

-- Enable storage for authenticated users
INSERT INTO storage.buckets (id, name, public)
VALUES ('lovable-uploads', 'lovable-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Create policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lovable-uploads');

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'lovable-uploads');

-- Create policy for everyone to view images
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lovable-uploads');

-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'lovable-uploads');

-- Verify
SELECT 'SUCCESS! Storage permissions configured' as status;
SELECT * FROM storage.buckets WHERE id = 'lovable-uploads';
