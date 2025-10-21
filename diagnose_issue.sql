-- ============================================================================

-- DIAGNOSTIC SCRIPT - Run this first to see what's wrong
-- ============================================================================

-- Check 1: Is RLS enabled?
SELECT 
    tablename, 
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'cars' AND schemaname = 'public';
-- Expected: rowsecurity = true

-- Check 2: How many policies exist?
SELECT 
    COUNT(*) as "Number of Policies",
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ NO POLICIES - This is the problem!'
        WHEN COUNT(*) < 4 THEN '⚠️ Missing policies'
        WHEN COUNT(*) = 4 THEN '✅ All policies present'
        ELSE '❓ More than expected'
    END as "Status"
FROM pg_policies 
WHERE tablename = 'cars' AND schemaname = 'public';

-- Check 3: List all existing policies
SELECT 
    policyname as "Policy Name",
    cmd as "Operation",
    roles as "For Roles",
    permissive as "Type"
FROM pg_policies 
WHERE tablename = 'cars' AND schemaname = 'public'
ORDER BY cmd;

-- Check 4: Check permissions for authenticated role
SELECT 
    grantee as "Role",
    privilege_type as "Permission"
FROM information_schema.role_table_grants
WHERE table_name = 'cars' 
  AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- Check 5: Try to check current user role
SELECT 
    current_user as "Current User",
    current_role as "Current Role";

-- Check 6: Test if we can see cars (SELECT should work)
SELECT 
    COUNT(*) as "Total Cars in Database"
FROM public.cars;

-- ============================================================================
-- INTERPRETATION GUIDE:
-- ============================================================================
-- 
-- If "Number of Policies" = 0:
--   → Problem: No RLS policies exist
--   → Solution: Run fix_cars_permissions.sql
--
-- If "Number of Policies" = 4:
--   → Policies exist, but maybe wrong configuration
--   → Check policy names and roles
--   → May need to re-run fix_cars_permissions.sql
--
-- If "Current User" = "anon":
--   → You're not authenticated
--   → Solution: Login as admin first
--
-- If "Current Role" = "authenticated":
--   → You're logged in correctly
--   → Problem is likely with policies
--
-- ============================================================================
