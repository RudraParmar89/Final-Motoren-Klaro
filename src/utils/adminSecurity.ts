import { supabase } from '@/integrations/supabase/client';

/**
 * Securely hash a password for admin credentials
 */
export const hashAdminPassword = async (password: string): Promise<string> => {
  const { data, error } = await supabase.rpc('hash_password', { password });
  
  if (error) {
    throw new Error('Failed to hash password');
  }
  
  return data;
};

/**
 * Verify an admin password against its hash
 */
export const verifyAdminPassword = async (password: string, hash: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('verify_password', { 
    password, 
    hash 
  });
  
  if (error) {
    throw new Error('Failed to verify password');
  }
  
  return data === true;
};

/**
 * Encrypt biometric data for secure storage
 */
export const encryptBiometricData = async (data: Float32Array): Promise<string> => {
  const jsonData = Array.from(data);
  const { data: encrypted, error } = await supabase.rpc('encrypt_biometric_data', { 
    data: jsonData 
  });
  
  if (error) {
    throw new Error('Failed to encrypt biometric data');
  }
  
  return encrypted;
};

/**
 * Decrypt biometric data for face recognition
 */
export const decryptBiometricData = async (encryptedData: string): Promise<Float32Array> => {
  const { data: decrypted, error } = await supabase.rpc('decrypt_biometric_data', { 
    encrypted_data: encryptedData 
  });
  
  if (error) {
    throw new Error('Failed to decrypt biometric data');
  }
  
  // Convert JSON array back to Float32Array
  const jsonArray = typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;
  return new Float32Array(jsonArray);
};

/**
 * Create or update admin credentials with secure password hashing
 */
export const createOrUpdateAdminCredentials = async (email: string, password: string) => {
  const hashedPassword = await hashAdminPassword(password);
  
  const { data, error } = await supabase
    .from('admin_credentials')
    .upsert({
      email,
      password_hash: hashedPassword,
      // Keep old password field for backward compatibility during migration
      password: 'DEPRECATED_USE_HASH'
    }, {
      onConflict: 'email'
    });

  if (error) {
    throw new Error('Failed to create/update admin credentials');
  }

  return data;
};
