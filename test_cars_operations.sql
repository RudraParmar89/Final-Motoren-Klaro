-- ============================================================================
-- TEST CARS OPERATIONS - Run this to verify Add/Edit/Delete works
-- ============================================================================
-- This script tests all CRUD operations on the cars table
-- Run this AFTER applying fix_cars_permissions.sql
-- ============================================================================

-- Test 1: INSERT (Add) Operation
-- This simulates adding a new car
DO $$ 
DECLARE
    new_car_id uuid;
BEGIN
    INSERT INTO public.cars (
        brand, 
        make, 
        model, 
        year, 
        price, 
        fuel_type,
        body_type,
        transmission,
        description
    ) VALUES (
        'Test Brand',
        'Test Make',
        'Test Model',
        2024,
        1000000,
        'Petrol',
        'Sedan',
        'Automatic',
        'This is a test car for verification'
    ) RETURNING id INTO new_car_id;
    
    RAISE NOTICE '✅ Test 1: INSERT successful! Car ID: %', new_car_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 1: INSERT failed! Error: %', SQLERRM;
END $$;

-- Test 2: UPDATE (Edit) Operation
-- This simulates editing an existing car
DO $$ 
DECLARE
    test_car_id uuid;
    updated_count integer;
BEGIN
    -- Get the test car we just inserted
    SELECT id INTO test_car_id 
    FROM public.cars 
    WHERE brand = 'Test Brand' AND make = 'Test Make'
    LIMIT 1;
    
    IF test_car_id IS NULL THEN
        RAISE NOTICE '⚠️ Test 2: No test car found to update. Run Test 1 first.';
        RETURN;
    END IF;
    
    -- Update the test car
    UPDATE public.cars
    SET 
        price = 1500000,
        description = 'Updated test car description',
        power_bhp = 150,
        mileage_kmpl = 18.5
    WHERE id = test_car_id;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    IF updated_count > 0 THEN
        RAISE NOTICE '✅ Test 2: UPDATE successful! Updated % row(s)', updated_count;
    ELSE
        RAISE NOTICE '❌ Test 2: UPDATE failed! No rows updated';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 2: UPDATE failed! Error: %', SQLERRM;
END $$;

-- Test 3: SELECT (Read) Operation
-- This simulates viewing cars
DO $$ 
DECLARE
    car_count integer;
BEGIN
    SELECT COUNT(*) INTO car_count FROM public.cars;
    
    IF car_count > 0 THEN
        RAISE NOTICE '✅ Test 3: SELECT successful! Found % car(s)', car_count;
    ELSE
        RAISE NOTICE '⚠️ Test 3: SELECT returned 0 cars';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 3: SELECT failed! Error: %', SQLERRM;
END $$;

-- Test 4: DELETE Operation
-- This simulates deleting a car
DO $$ 
DECLARE
    test_car_id uuid;
    deleted_count integer;
BEGIN
    -- Get the test car we inserted
    SELECT id INTO test_car_id 
    FROM public.cars 
    WHERE brand = 'Test Brand' AND make = 'Test Make'
    LIMIT 1;
    
    IF test_car_id IS NULL THEN
        RAISE NOTICE '⚠️ Test 4: No test car found to delete. It may have been already deleted.';
        RETURN;
    END IF;
    
    -- Delete the test car
    DELETE FROM public.cars
    WHERE id = test_car_id;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    IF deleted_count > 0 THEN
        RAISE NOTICE '✅ Test 4: DELETE successful! Deleted % row(s)', deleted_count;
    ELSE
        RAISE NOTICE '❌ Test 4: DELETE failed! No rows deleted';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 4: DELETE failed! Error: %', SQLERRM;
END $$;

-- Summary
DO $$ 
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE '  CRUD OPERATIONS TEST COMPLETE';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Review the messages above to see test results.';
    RAISE NOTICE 'All operations should show ✅ (success).';
    RAISE NOTICE '';
    RAISE NOTICE 'If any tests failed:';
    RAISE NOTICE '1. Make sure you ran fix_cars_permissions.sql first';
    RAISE NOTICE '2. Check that RLS is enabled: SELECT * FROM pg_tables WHERE tablename = ''cars'';';
    RAISE NOTICE '3. Verify policies exist: SELECT * FROM pg_policies WHERE tablename = ''cars'';';
    RAISE NOTICE '================================================';
END $$;

-- View current test cars (if any remain)
SELECT 
    id,
    brand,
    make,
    model,
    year,
    price,
    description
FROM public.cars
WHERE brand = 'Test Brand'
ORDER BY created_at DESC
LIMIT 5;
