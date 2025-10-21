-- ============================================================================
-- TEST WITH AUTH CHECK - Run this to test if you're actually logged in
-- ============================================================================

-- Test 1: Check current session
SELECT 
    auth.uid() as "User ID",
    auth.role() as "Current Role",
    CASE 
        WHEN auth.uid() IS NULL THEN '❌ NOT LOGGED IN - This is your problem!'
        WHEN auth.role() = 'authenticated' THEN '✅ Logged in as authenticated user'
        WHEN auth.role() = 'anon' THEN '⚠️ Logged in as anonymous (not admin)'
        ELSE '❓ Unknown role: ' || auth.role()
    END as "Auth Status";

-- Test 2: Try to INSERT a test car (this will fail if not authenticated or no policy)
DO $$
DECLARE
    new_car_id uuid;
    error_msg text;
BEGIN
    BEGIN
        INSERT INTO public.cars (brand, make, model, year, price, fuel_type)
        VALUES ('TEST', 'TEST', 'AUTH TEST', 2024, 100000, 'Petrol')
        RETURNING id INTO new_car_id;
        
        RAISE NOTICE '✅ INSERT successful! Car ID: %', new_car_id;
        RAISE NOTICE 'This means:';
        RAISE NOTICE '  ✅ You are authenticated';
        RAISE NOTICE '  ✅ RLS policies are working';
        RAISE NOTICE '  ✅ Permissions are correct';
        
        -- Clean up test car
        DELETE FROM public.cars WHERE id = new_car_id;
        RAISE NOTICE '✅ Test car cleaned up';
        
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
        RAISE NOTICE '❌ INSERT failed with error: %', error_msg;
        RAISE NOTICE '';
        RAISE NOTICE 'Common causes:';
        RAISE NOTICE '  1. Not logged in as authenticated user';
        RAISE NOTICE '  2. Missing RLS policy for INSERT';
        RAISE NOTICE '  3. Missing permissions on table';
        RAISE NOTICE '';
        RAISE NOTICE 'Solutions:';
        RAISE NOTICE '  → If "not logged in": Login to admin panel first';
        RAISE NOTICE '  → If "policy": Run ABSOLUTE_FIX.sql';
        RAISE NOTICE '  → If "permission": Run ABSOLUTE_FIX.sql';
    END;
END $$;

-- Test 3: Try to UPDATE (if you have any cars)
DO $$
DECLARE
    test_car_id uuid;
    updated_count integer;
    error_msg text;
BEGIN
    -- Get first car
    SELECT id INTO test_car_id FROM public.cars LIMIT 1;
    
    IF test_car_id IS NULL THEN
        RAISE NOTICE 'ℹ️ No cars in database to test UPDATE';
        RETURN;
    END IF;
    
    BEGIN
        UPDATE public.cars
        SET description = 'AUTH TEST - ' || NOW()::text
        WHERE id = test_car_id;
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        
        IF updated_count > 0 THEN
            RAISE NOTICE '✅ UPDATE successful!';
            
            -- Restore original (just set to NULL)
            UPDATE public.cars SET description = NULL WHERE id = test_car_id;
        ELSE
            RAISE NOTICE '❌ UPDATE returned 0 rows';
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
        RAISE NOTICE '❌ UPDATE failed: %', error_msg;
    END;
END $$;

-- Test 4: Check if service_role is being used (this should be false in normal client)
SELECT 
    CASE 
        WHEN current_setting('role', true) = 'service_role' THEN '⚠️ Running as service_role (bypass RLS)'
        WHEN current_setting('role', true) = 'authenticated' THEN '✅ Running as authenticated (normal)'
        WHEN current_setting('role', true) = 'anon' THEN '❌ Running as anon (not logged in)'
        ELSE '❓ Running as: ' || current_setting('role', true)
    END as "Database Role";

-- ============================================================================
-- WHAT TO DO BASED ON RESULTS:
-- ============================================================================
-- 
-- If "User ID" is NULL:
--   → YOU ARE NOT LOGGED IN
--   → Go to your admin panel and login first
--   → Then come back and run this script again
--
-- If "Current Role" is "anon":
--   → YOU ARE NOT AUTHENTICATED
--   → Login to admin panel as admin user
--   → Make sure login is successful
--
-- If INSERT test fails with "policy":
--   → RUN: ABSOLUTE_FIX.sql
--   → This will create proper RLS policies
--
-- If INSERT test fails with "permission denied":
--   → RUN: ABSOLUTE_FIX.sql
--   → This will grant proper permissions
--
-- If INSERT test succeeds but your UI still fails:
--   → Check browser console for errors
--   → Check if you're calling the right endpoint
--   → Check if SUPABASE_FUNCTIONS_URL is set correctly
--
-- ============================================================================
