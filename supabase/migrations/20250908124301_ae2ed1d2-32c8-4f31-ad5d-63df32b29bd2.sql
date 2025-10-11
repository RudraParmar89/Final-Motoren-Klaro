-- Create admin credentials table
CREATE TABLE public.admin_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only (no public access)
CREATE POLICY "No public access to admin credentials" 
ON public.admin_credentials 
FOR ALL 
USING (false);

-- Create face recognition reference images table
CREATE TABLE public.admin_face_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  face_descriptor JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_face_images ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only (no public access)
CREATE POLICY "No public access to admin face images" 
ON public.admin_face_images 
FOR ALL 
USING (false);

-- Create trigger for automatic timestamp updates on admin_credentials
CREATE TRIGGER update_admin_credentials_updated_at
BEFORE UPDATE ON public.admin_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on admin_face_images
CREATE TRIGGER update_admin_face_images_updated_at
BEFORE UPDATE ON public.admin_face_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin credentials
INSERT INTO public.admin_credentials (email, password)
VALUES ('motorenklaro@gmail.com', 'NavnitMotor');

-- Insert placeholder face image records (will be updated with actual images and descriptors)
INSERT INTO public.admin_face_images (image_url, face_descriptor)
VALUES 
  ('placeholder1.jpg', '{}'),
  ('placeholder2.jpg', '{}');