-- Secure profiles table: restrict SELECT to owner only
-- Keep existing INSERT/UPDATE policies intact

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove overly permissive public read policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Allow users to view only their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);
