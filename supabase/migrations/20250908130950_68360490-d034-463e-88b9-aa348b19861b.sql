-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.hash_password(password text, salt text DEFAULT NULL)
RETURNS text AS $$
DECLARE
  password_salt text;
BEGIN
  -- Generate salt if not provided
  IF salt IS NULL THEN
    password_salt := gen_salt('bf', 12);
  ELSE
    password_salt := salt;
  END IF;
  
  -- Return bcrypt hash
  RETURN crypt(password, password_salt);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix verify password function
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean AS $$
BEGIN
  RETURN (crypt(password, hash) = hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix encrypt biometric data function
CREATE OR REPLACE FUNCTION public.encrypt_biometric_data(data jsonb)
RETURNS text AS $$
BEGIN
  -- Use pgp_sym_encrypt for encrypting biometric data
  RETURN pgp_sym_encrypt(data::text, 'biometric_encryption_key_2024');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix decrypt biometric data function
CREATE OR REPLACE FUNCTION public.decrypt_biometric_data(encrypted_data text)
RETURNS jsonb AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, 'biometric_encryption_key_2024')::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;