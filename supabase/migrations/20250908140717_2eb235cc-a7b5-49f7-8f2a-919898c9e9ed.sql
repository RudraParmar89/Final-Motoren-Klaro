-- Create a simple admin credentials verification function
CREATE OR REPLACE FUNCTION public.verify_admin_credentials_simple(p_email text, p_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  stored_password text;
BEGIN
  -- Fetch the stored plain text password for the given email
  SELECT password INTO stored_password
  FROM public.admin_credentials
  WHERE email = p_email
  LIMIT 1;

  -- If no record found or password is null, reject
  IF stored_password IS NULL THEN
    RETURN false;
  END IF;

  -- Direct password comparison for admin authentication
  RETURN (stored_password = p_password);
END;
$$;