-- Add images array column to cars table to support multiple images per car
ALTER TABLE public.cars ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing image_url data to images array where image_url exists
UPDATE public.cars 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Update images array to empty array for cars without images
UPDATE public.cars 
SET images = '{}' 
WHERE image_url IS NULL OR image_url = '';