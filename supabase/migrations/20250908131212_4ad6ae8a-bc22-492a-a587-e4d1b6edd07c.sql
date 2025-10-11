-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text AS $$
BEGIN
  -- Return bcrypt hash with auto-generated salt
  RETURN crypt(password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean AS $$
BEGIN
  RETURN (crypt(password, hash) = hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to encrypt biometric data
CREATE OR REPLACE FUNCTION public.encrypt_biometric_data(data jsonb)
RETURNS text AS $$
BEGIN
  -- Use pgp_sym_encrypt for encrypting biometric data
  RETURN pgp_sym_encrypt(data::text, 'biometric_encryption_key_2024');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to decrypt biometric data
CREATE OR REPLACE FUNCTION public.decrypt_biometric_data(encrypted_data text)
RETURNS jsonb AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, 'biometric_encryption_key_2024')::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;