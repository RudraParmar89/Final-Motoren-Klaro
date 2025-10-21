-- ============================================================================
-- FIX CARS TABLE PERMISSIONS - Run this in Supabase SQL Editor
-- ============================================================================
-- This script fixes all RLS policies and permissions for the cars table
-- to enable Add, Edit, and Delete operations in the Admin panel
-- ============================================================================

-- Step 1: Disable RLS temporarily to clean up
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies on cars table
DO $$ 
DECLARE 
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'cars' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.cars', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Step 4: Create comprehensive policies for cars table

-- Policy 1: Anyone can view cars (public read access)
CREATE POLICY "Anyone can view cars"
ON public.cars
FOR SELECT
USING (true);

-- Policy 2: Authenticated users can insert cars
CREATE POLICY "Authenticated users can insert cars"
ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Authenticated users can update cars
CREATE POLICY "Authenticated users can update cars"
ON public.cars
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Authenticated users can delete cars
CREATE POLICY "Authenticated users can delete cars"
ON public.cars
FOR DELETE
TO authenticated
USING (true);

-- Step 5: Grant necessary permissions

-- Grant permissions to authenticated users (logged-in admins)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;

-- Grant read-only access to anonymous users (public)
GRANT SELECT ON public.cars TO anon;

-- Grant usage on the cars table sequence if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'cars_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE public.cars_id_seq TO authenticated;
    END IF;
END $$;

-- Step 6: Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'cars' 
ORDER BY policyname;

-- Step 7: Verify table permissions
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'cars' AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- ============================================================================
-- Expected Results:
-- ============================================================================
-- You should see 4 policies:
-- 1. "Anyone can view cars" - SELECT for all users
-- 2. "Authenticated users can insert cars" - INSERT for authenticated
-- 3. "Authenticated users can update cars" - UPDATE for authenticated  
-- 4. "Authenticated users can delete cars" - DELETE for authenticated
--
-- And permissions showing:
-- - authenticated: SELECT, INSERT, UPDATE, DELETE
-- - anon: SELECT
-- ============================================================================

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE '✅ Cars table RLS policies and permissions have been successfully configured!';
    RAISE NOTICE '📝 You can now Add, Edit, and Delete cars from the Admin panel.';
    RAISE NOTICE '🔒 RLS is enabled with proper policies for authenticated users.';
END $$;
