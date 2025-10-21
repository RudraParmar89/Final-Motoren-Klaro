-- COMPLETE FIX FOR USER FAVORITES
-- Run this as postgres/superuser role in Supabase SQL Editor

-- Step 1: Disable RLS on user_favorites (like we did for cars)
ALTER TABLE public.user_favorites DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant full permissions to authenticated users (admin)
GRANT ALL ON public.user_favorites TO authenticated;
GRANT ALL ON public.user_favorites TO postgres;
GRANT SELECT ON public.user_favorites TO anon;

-- Step 3: Make sure table owner is correct
ALTER TABLE public.user_favorites OWNER TO postgres;

-- Step 4: Check if data exists
SELECT 
    COUNT(*) as total_favorites,
    'If this shows 0, no one has added favorites yet' as note
FROM public.user_favorites;

-- Step 5: Show all favorites (if any exist)
SELECT 
    uf.id,
    uf.user_id,
    LEFT(uf.user_id::text, 8) as user_id_short,
    uf.car_id,
    c.make,
    c.model,
    uf.created_at
FROM public.user_favorites uf
LEFT JOIN public.cars c ON c.id = uf.car_id
ORDER BY uf.created_at DESC
LIMIT 10;

-- Success message
SELECT 'SUCCESS! User favorites table is now accessible to admin' as status;
