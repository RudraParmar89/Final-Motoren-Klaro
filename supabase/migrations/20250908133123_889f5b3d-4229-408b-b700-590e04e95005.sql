-- Insert admin credentials with secure password hash
INSERT INTO public.admin_credentials (email, password, password_hash)
VALUES (
  'motorenklaro@gmail.com',
  'NavnitMotor', 
  public.hash_password('NavnitMotor')
);