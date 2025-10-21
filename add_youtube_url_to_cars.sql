-- Add youtube_url column to cars table
-- Run this in Supabase SQL Editor

ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Add some example YouTube URLs for BMW cars (you can update these later)
UPDATE public.cars 
SET youtube_url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
WHERE brand = 'BMW' AND model LIKE '%X7%';

UPDATE public.cars 
SET youtube_url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
WHERE brand = 'BMW' AND model LIKE '%7 Series%';

-- Success message
SELECT 'SUCCESS! youtube_url column added to cars table' as status;
SELECT COUNT(*) as cars_with_youtube FROM public.cars WHERE youtube_url IS NOT NULL;
