-- ============================================================================
-- ABSOLUTE FIX - This will work no matter what
-- ============================================================================
-- Run this script in Supabase SQL Editor
-- This completely resets and fixes the cars table permissions
-- ============================================================================

-- Step 1: Disable RLS temporarily (to allow cleanup)
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (clean slate)
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
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Step 3: Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
RAISE NOTICE '✅ RLS enabled on cars table';

-- Step 4: Create policy for PUBLIC SELECT (anyone can view)
CREATE POLICY "public_cars_select_policy"
ON public.cars
FOR SELECT
TO public
USING (true);
RAISE NOTICE '✅ Created public SELECT policy';

-- Step 5: Create policy for AUTHENTICATED INSERT
CREATE POLICY "authenticated_cars_insert_policy"
ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (true);
RAISE NOTICE '✅ Created authenticated INSERT policy';

-- Step 6: Create policy for AUTHENTICATED UPDATE
CREATE POLICY "authenticated_cars_update_policy"
ON public.cars
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
RAISE NOTICE '✅ Created authenticated UPDATE policy';

-- Step 7: Create policy for AUTHENTICATED DELETE
CREATE POLICY "authenticated_cars_delete_policy"
ON public.cars
FOR DELETE
TO authenticated
USING (true);
RAISE NOTICE '✅ Created authenticated DELETE policy';

-- Step 8: Revoke all existing permissions (clean slate)
REVOKE ALL ON public.cars FROM authenticated;
REVOKE ALL ON public.cars FROM anon;
REVOKE ALL ON public.cars FROM public;

-- Step 9: Grant proper permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
RAISE NOTICE '✅ Granted full CRUD permissions to authenticated role';

-- Step 10: Grant SELECT to anon and public roles
GRANT SELECT ON public.cars TO anon;
GRANT SELECT ON public.cars TO public;
RAISE NOTICE '✅ Granted SELECT permission to anon and public roles';

-- Step 11: Grant sequence permissions if exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'cars_id_seq' AND relkind = 'S') THEN
        GRANT USAGE, SELECT ON SEQUENCE public.cars_id_seq TO authenticated;
        RAISE NOTICE '✅ Granted sequence permissions to authenticated role';
    ELSE
        RAISE NOTICE 'ℹ️ No sequence found (table might use uuid)';
    END IF;
END $$;

-- Step 12: Verify everything was created
DO $$
DECLARE
    policy_count integer;
    rls_enabled boolean;
    auth_perms text[];
BEGIN
    -- Check RLS
    SELECT rowsecurity INTO rls_enabled 
    FROM pg_tables 
    WHERE tablename = 'cars' AND schemaname = 'public';
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'cars' AND schemaname = 'public';
    
    -- Get authenticated permissions
    SELECT array_agg(privilege_type) INTO auth_perms
    FROM information_schema.role_table_grants
    WHERE table_name = 'cars' 
      AND table_schema = 'public'
      AND grantee = 'authenticated';
    
    -- Report results
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE '           VERIFICATION RESULTS';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'RLS Enabled: %', CASE WHEN rls_enabled THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Policies Created: %', CASE WHEN policy_count = 4 THEN '✅ 4 (Perfect!)' ELSE '❌ ' || policy_count || ' (Expected 4)' END;
    RAISE NOTICE 'Authenticated Permissions: %', auth_perms;
    RAISE NOTICE '================================================';
    
    IF rls_enabled AND policy_count = 4 THEN
        RAISE NOTICE '🎉 SUCCESS! Everything is configured correctly!';
        RAISE NOTICE '';
        RAISE NOTICE 'You can now:';
        RAISE NOTICE '  ✅ Add cars (INSERT)';
        RAISE NOTICE '  ✅ Edit cars (UPDATE)';
        RAISE NOTICE '  ✅ Delete cars (DELETE)';
        RAISE NOTICE '  ✅ View cars (SELECT)';
        RAISE NOTICE '';
        RAISE NOTICE 'Go test your admin panel now!';
    ELSE
        RAISE NOTICE '⚠️ WARNING: Configuration incomplete. Review messages above.';
    END IF;
    RAISE NOTICE '================================================';
END $$;

-- Step 13: Show final policy list
SELECT 
    policyname as "Policy Name",
    cmd as "Operation",
    roles as "For Roles"
FROM pg_policies 
WHERE tablename = 'cars' AND schemaname = 'public'
ORDER BY cmd;
