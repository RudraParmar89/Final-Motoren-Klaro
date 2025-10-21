-- Create pages table to store editable page content
-- Run this in Supabase SQL Editor

-- Create the table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  banner_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS (or configure as needed)
ALTER TABLE public.pages DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.pages TO authenticated;
GRANT SELECT ON public.pages TO anon; -- Allow public to read pages

-- Set owner
ALTER TABLE public.pages OWNER TO postgres;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(page_slug);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON public.pages(updated_at DESC);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION update_pages_updated_at();

-- Insert default pages
INSERT INTO public.pages (page_slug, title, content, meta_description) VALUES
  ('about-us', 'About Us', 
   '# Welcome to Motoren Klaro

Motoren Klaro is your trusted partner in finding the perfect car. We specialize in providing comprehensive information about various car models, helping you make informed decisions.

## Our Mission

To simplify the car buying experience by providing detailed, accurate, and up-to-date information about cars available in the Indian market.

## What We Offer

- **Extensive Car Database**: Browse through hundreds of car models
- **Detailed Specifications**: Get comprehensive technical details
- **Price Information**: Stay updated with latest pricing
- **User Favorites**: Save and compare your favorite cars
- **Expert Guidance**: Contact us for personalized recommendations

## Why Choose Us?

1. **Comprehensive Information**: All car details in one place
2. **User-Friendly Interface**: Easy to navigate and find what you need
3. **Regular Updates**: Latest models and pricing information
4. **Trusted Platform**: Reliable and accurate data

Contact us today to find your dream car!',
   'Learn more about Motoren Klaro - Your trusted car information platform'),
  
  ('car-news', 'Car News', 
   '# Latest Car News & Updates

Stay updated with the latest happenings in the automotive world. From new launches to industry trends, we cover it all.

## Recent Updates

### Electric Vehicles on the Rise
The Indian automotive market is witnessing a surge in electric vehicle adoption. Major manufacturers are launching new EV models to meet the growing demand.

### New Launches This Month
Several exciting car models have been launched this month, offering advanced features and competitive pricing.

### Industry Trends
- Increased focus on fuel efficiency
- Growing demand for SUVs
- Rise of connected car technology
- Enhanced safety features becoming standard

## Upcoming Events

Check back regularly for updates on upcoming auto shows, launch events, and industry announcements.

---

*Last updated: ' || TO_CHAR(NOW(), 'DD Mon YYYY') || '*',
   'Latest car news, automotive updates, and industry trends')
ON CONFLICT (page_slug) DO NOTHING;

-- Success message
SELECT 'SUCCESS! Pages table created with default content' as status;
SELECT COUNT(*) as total_pages FROM public.pages;
