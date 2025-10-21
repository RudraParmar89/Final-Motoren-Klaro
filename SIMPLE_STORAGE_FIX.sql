-- SIMPLE FIX FOR STORAGE PERMISSIONS
-- Copy and run this ENTIRE script in Supabase SQL Editor

-- Step 1: Make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('lovable-uploads', 'lovable-uploads', true)
ON CONFLICT (id) 
DO UPDATE SET public = true;

-- Step 2: Drop all existing policies on storage.objects
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- Step 3: Create new simple policies

-- Allow everyone to read (view) images
CREATE POLICY "Public can view all images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lovable-uploads');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lovable-uploads');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'lovable-uploads');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'lovable-uploads');

-- Step 4: Verify
SELECT 'SUCCESS! Storage bucket configured with public access' as status;
SELECT id, name, public FROM storage.buckets WHERE id = 'lovable-uploads';
SELECT COUNT(*) as "Total Policies" FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';
