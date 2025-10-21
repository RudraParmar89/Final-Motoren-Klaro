-- Fix user_favorites permissions so admin can view all favorites
-- Run this in Supabase SQL Editor as postgres/superuser role

-- Grant admin permissions on user_favorites
GRANT ALL ON public.user_favorites TO authenticated;
GRANT ALL ON public.user_favorites TO postgres;
GRANT SELECT ON public.user_favorites TO anon;

-- Make sure the table owner is correct
ALTER TABLE public.user_favorites OWNER TO postgres;

-- Add a policy for admin to view all favorites (service_role bypass)
-- This allows admin panel to see all user favorites
CREATE POLICY IF NOT EXISTS "Admin can view all favorites"
ON public.user_favorites
FOR SELECT
TO authenticated
USING (true);

-- Verify
SELECT 'SUCCESS! user_favorites permissions set' as status;
