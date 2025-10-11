-- Clear existing admin face images and add new ones
DELETE FROM public.admin_face_images;

-- Insert the new face images for authentication
INSERT INTO public.admin_face_images (image_url) VALUES 
('/lovable-uploads/453b85c9-3452-4747-be6b-df846ccd9d99.png'),
('/lovable-uploads/cdf51e30-e923-410c-8143-d25a8a13b911.png');