-- Create a function to get user email from auth.users
-- This allows admin to see user emails in the favorites panel
-- Run this in Supabase SQL Editor as postgres/superuser

-- Drop if exists
DROP FUNCTION IF EXISTS public.get_user_email(uuid);

-- Create function to get email from auth.users
CREATE OR REPLACE FUNCTION public.get_user_email(user_id_param uuid)
RETURNS TABLE (email text)
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to access auth.users
AS $$
BEGIN
  RETURN QUERY
  SELECT au.email::text
  FROM auth.users au
  WHERE au.id = user_id_param;
END;
$$;

-- Grant execute to authenticated users (admin)
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;

-- Test the function (replace with an actual user_id from your favorites)
-- SELECT * FROM get_user_email('your-user-id-here');

SELECT 'SUCCESS! User email function created' as status;

-- Example usage in a frontend component
-- <h3 className="text-lg font-semibold flex items-center gap-2">
--   <Mail className="h-4 w-4 text-primary" />
--   {user.email || 'No email available'}
-- </h3>
-- <p className="text-xs text-gray-500">ID: {user.id.slice(0, 16)}...</p>
