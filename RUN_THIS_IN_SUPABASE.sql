-- ============================================================================
-- COPY THIS ENTIRE BLOCK AND RUN IN SUPABASE SQL EDITOR
-- ============================================================================

-- Step 1: Disable RLS temporarily
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DO $$ 
DECLARE pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'cars' AND schemaname = 'public'
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.cars', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
CREATE POLICY "cars_select_policy" ON public.cars FOR SELECT TO public USING (true);
CREATE POLICY "cars_insert_policy" ON public.cars FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "cars_update_policy" ON public.cars FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cars_delete_policy" ON public.cars FOR DELETE TO authenticated USING (true);

-- Step 5: Revoke and grant fresh permissions
REVOKE ALL ON public.cars FROM authenticated;
REVOKE ALL ON public.cars FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT SELECT ON public.cars TO anon;

-- Step 6: Verify
SELECT 'SUCCESS! Policies created: ' || COUNT(*)::text as "Status" FROM pg_policies WHERE tablename = 'cars';
