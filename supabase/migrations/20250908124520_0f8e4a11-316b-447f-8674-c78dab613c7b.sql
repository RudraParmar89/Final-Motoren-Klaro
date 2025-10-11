-- Update the admin face images with actual image URLs
UPDATE public.admin_face_images 
SET image_url = '/lovable-uploads/b906ea1f-f28d-4022-869f-52adb13daa09.png'
WHERE id = (SELECT id FROM public.admin_face_images LIMIT 1);

UPDATE public.admin_face_images 
SET image_url = '/lovable-uploads/7db56748-632e-4935-8504-9981529a0224.png'
WHERE id = (SELECT id FROM public.admin_face_images WHERE image_url != '/lovable-uploads/b906ea1f-f28d-4022-869f-52adb13daa09.png' LIMIT 1);