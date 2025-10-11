-- Check if extensions and functions exist, create only if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create functions for secure password handling (only if they don't exist)
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

-- Add encrypted biometric data column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'admin_face_images' 
                   AND column_name = 'face_descriptor_encrypted') THEN
        ALTER TABLE public.admin_face_images ADD COLUMN face_descriptor_encrypted text;
    END IF;
END $$;

-- Create biometric encryption functions
CREATE OR REPLACE FUNCTION public.encrypt_biometric_data(data jsonb)
RETURNS text AS $$
BEGIN
  -- Use pgp_sym_encrypt for encrypting biometric data
  RETURN pgp_sym_encrypt(data::text, 'biometric_encryption_key_2024');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrypt_biometric_data(encrypted_data text)
RETURNS jsonb AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, 'biometric_encryption_key_2024')::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing passwords to hashed versions if not already done
UPDATE public.admin_credentials 
SET password_hash = public.hash_password(password)
WHERE password_hash IS NULL OR password_hash = '';

-- Encrypt existing biometric data if not already done
UPDATE public.admin_face_images 
SET face_descriptor_encrypted = public.encrypt_biometric_data(face_descriptor)
WHERE face_descriptor IS NOT NULL 
  AND (face_descriptor_encrypted IS NULL OR face_descriptor_encrypted = '');