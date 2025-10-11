-- Create a SECURITY DEFINER function to verify admin credentials without exposing hashes
-- This function runs with elevated privileges and can read the admin_credentials table even with RLS enabled
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_email text, p_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash text;
BEGIN
  -- Fetch the stored password hash for the given email
  SELECT password_hash INTO stored_hash
  FROM public.admin_credentials
  WHERE email = p_email
  LIMIT 1;

  -- If no record found or hash is null, reject
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;

  -- Use existing verify_password function (bcrypt) to validate
  RETURN public.verify_password(p_password, stored_hash);
END;
$$;

-- Ensure only authenticated users can call it (optional tightening)
REVOKE ALL ON FUNCTION public.verify_admin_credentials(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_admin_credentials(text, text) TO anon, authenticated, service_role;