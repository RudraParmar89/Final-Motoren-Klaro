-- COMPLETE FIX for User Favorites
-- Run this as postgres/superuser role

-- Step 1: Make sure admin can see everything
GRANT ALL ON public.user_favorites TO authenticated;
GRANT ALL ON public.user_favorites TO postgres;
ALTER TABLE public.user_favorites OWNER TO postgres;

-- Step 2: Drop ALL existing RLS policies on user_favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can add their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can remove their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "admin_can_view_all_favorites" ON public.user_favorites;

-- Step 3: Create new comprehensive policies

-- Policy 1: Users can view their own favorites
CREATE POLICY "user_view_own_favorites"
ON public.user_favorites
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);
-- Note: "OR auth.uid() IS NULL" allows admin (not logged in as specific user) to see all

-- Policy 2: Users can add their own favorites
CREATE POLICY "user_add_own_favorites"
ON public.user_favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can delete their own favorites
CREATE POLICY "user_delete_own_favorites"
ON public.user_favorites
FOR DELETE
USING (auth.uid() = user_id);

-- Policy 4: Admin/authenticated can see ALL favorites (for admin panel)
CREATE POLICY "admin_view_all_favorites"
ON public.user_favorites
FOR SELECT
TO authenticated
USING (true);

-- Step 4: Verify what we created
SELECT 'Policies created:' as status, COUNT(*) as count 
FROM pg_policies 
WHERE tablename = 'user_favorites';

-- Step 5: Show all current favorites (if any)
SELECT 
    COUNT(*) as total_favorites,
    COUNT(DISTINCT user_id) as unique_users
FROM user_favorites;
