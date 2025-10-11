-- Create secure password hashing function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add salt column for additional security
ALTER TABLE public.admin_credentials ADD COLUMN password_hash text;
ALTER TABLE public.admin_credentials ADD COLUMN salt text;

-- Create function to hash passwords securely
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean AS $$
BEGIN
  RETURN (crypt(password, hash) = hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Encrypt biometric data column
ALTER TABLE public.admin_face_images ADD COLUMN face_descriptor_encrypted text;

-- Create function to encrypt biometric data
CREATE OR REPLACE FUNCTION public.encrypt_biometric_data(data jsonb)
RETURNS text AS $$
BEGIN
  -- Use pgp_sym_encrypt for encrypting biometric data
  -- In production, use a proper secret key from environment
  RETURN pgp_sym_encrypt(data::text, 'biometric_encryption_key_2024');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrypt biometric data
CREATE OR REPLACE FUNCTION public.decrypt_biometric_data(encrypted_data text)
RETURNS jsonb AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, 'biometric_encryption_key_2024')::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing admin credentials with hashed passwords
-- Note: This will require manual intervention to set proper passwords
-- For now, we'll hash existing passwords (though they should be changed)
UPDATE public.admin_credentials 
SET password_hash = public.hash_password(password),
    salt = gen_salt('bf', 12)
WHERE password_hash IS NULL;

-- Encrypt existing biometric data
UPDATE public.admin_face_images 
SET face_descriptor_encrypted = public.encrypt_biometric_data(face_descriptor)
WHERE face_descriptor IS NOT NULL AND face_descriptor_encrypted IS NULL;