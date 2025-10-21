-- Run create_car_news_table.sql in Supabase SQL Editor

-- Create the table
CREATE TABLE IF NOT EXISTS public.car_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  featured_image TEXT,
  author TEXT DEFAULT 'Motoren Klaro',
  is_featured BOOLEAN DEFAULT false,
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for simplicity
ALTER TABLE public.car_news DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.car_news TO authenticated;
GRANT SELECT ON public.car_news TO anon;

-- Set owner
ALTER TABLE public.car_news OWNER TO postgres;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_car_news_slug ON public.car_news(slug);
CREATE INDEX IF NOT EXISTS idx_car_news_published_date ON public.car_news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_car_news_category ON public.car_news(category);
CREATE INDEX IF NOT EXISTS idx_car_news_featured ON public.car_news(is_featured);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_car_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_car_news_updated_at ON public.car_news;
CREATE TRIGGER update_car_news_updated_at
    BEFORE UPDATE ON public.car_news
    FOR EACH ROW
    EXECUTE FUNCTION update_car_news_updated_at();

-- Delete existing sample data if any
DELETE FROM public.car_news WHERE slug IN (
  'autonomous-driving-future',
  'luxury-sports-cars-2025',
  'suv-market-dominance',
  'green-technology-vehicles',
  'connected-car-revolution',
  'electric-revolution-evs'
);

-- Insert sample car news articles
INSERT INTO public.car_news (title, slug, excerpt, content, category, featured_image, is_featured) VALUES
(
  'Autonomous Driving: The Future of Transportation is Here',
  'autonomous-driving-future',
  'Discover the latest developments in self-driving car technology, from Level 5 autonomy to the regulatory challenges shaping the future.',
  '# Autonomous Driving: The Future of Transportation is Here

The automotive industry is witnessing a revolutionary shift with autonomous driving technology. From advanced sensors to AI-powered decision-making systems, self-driving cars are becoming a reality.

## Current State of Autonomous Technology

Major manufacturers are investing billions in developing Level 4 and Level 5 autonomous systems. These vehicles can navigate complex urban environments without human intervention.

## Key Technologies

- **LiDAR and Radar Systems**: Providing 360-degree environmental awareness
- **AI and Machine Learning**: Enabling real-time decision making
- **5G Connectivity**: Allowing vehicle-to-vehicle communication
- **Advanced Sensors**: Detecting obstacles and pedestrians

## The Road Ahead

While fully autonomous vehicles are still being refined, semi-autonomous features like adaptive cruise control and lane-keeping assist are already available in many modern cars.

The future of transportation is autonomous, and it''s closer than you think.',
  'Technology',
  '/lovable-uploads/autonomous-car.jpg',
  true
),
(
  'Luxury Sports Cars: Performance Meets Innovation in 2025',
  'luxury-sports-cars-2025',
  'Explore the newest luxury sports cars combining breathtaking performance with cutting-edge technology and sustainable engineering.',
  '# Luxury Sports Cars: Performance Meets Innovation in 2025

The world of luxury sports cars is evolving rapidly. Manufacturers are blending incredible performance with eco-friendly technologies.

## Top Performance Features

- **Hybrid Powertrains**: Combining electric motors with traditional engines
- **Lightweight Materials**: Carbon fiber and aluminum construction
- **Advanced Aerodynamics**: Active aerodynamic elements for optimal performance
- **Track-Ready Technology**: Launch control and performance data systems

## Leading the Pack

Brands like Ferrari, Porsche, and McLaren are pushing boundaries with their latest models, delivering over 1000 horsepower while reducing emissions.

The future of luxury sports cars is both powerful and responsible.',
  'Luxury',
  '/lovable-uploads/sports-car.jpg',
  false
),
(
  'SUV Market Dominance: Why Crossovers Rule the Roads',
  'suv-market-dominance',
  'Analyze the continued growth of the SUV and crossover market, from compact city SUVs to full-size luxury models.',
  '# SUV Market Dominance: Why Crossovers Rule the Roads

SUVs and crossovers have become the dominant force in the automotive market, outselling traditional sedans year after year.

## Why SUVs Are Popular

1. **Versatility**: Ample cargo space and seating capacity
2. **Elevated Driving Position**: Better visibility and road presence
3. **All-Weather Capability**: Available AWD systems
4. **Family-Friendly Features**: Advanced safety and entertainment systems

## Market Trends

From subcompact crossovers to full-size luxury SUVs, there''s an option for every buyer. Even supercar manufacturers like Lamborghini and Ferrari have entered the SUV market.

## The Future

Electric SUVs are gaining traction, combining the practicality of an SUV with zero-emission driving.',
  'Market Trends',
  '/lovable-uploads/suv-crossover.jpg',
  false
),
(
  'Green Technology in Modern Vehicles: Beyond Electric',
  'green-technology-vehicles',
  'Discover how eco-friendly technologies are implementing sustainable technologies beyond electrification, from hydrogen fuel cells to bio-based materials.',
  '# Green Technology in Modern Vehicles: Beyond Electric

While electric vehicles dominate sustainability discussions, manufacturers are exploring various green technologies.

## Alternative Technologies

- **Hydrogen Fuel Cells**: Zero-emission with quick refueling
- **Sustainable Materials**: Recycled plastics and bio-based interiors
- **Solar Panels**: Integrated solar charging systems
- **Efficient Manufacturing**: Reducing production carbon footprint

## The Multi-Path Approach

The future isn''t just electric - it''s a combination of technologies working together to create truly sustainable transportation.',
  'Sustainability',
  '/lovable-uploads/green-tech.jpg',
  false
),
(
  'Connected Car Revolution: IoT and Smart Vehicle Features',
  'connected-car-revolution',
  'Explore how Internet of Things (IoT) technology is transforming vehicles into smart, connected platforms with advanced infotainment and safety features.',
  '# Connected Car Revolution: IoT and Smart Vehicle Features

Modern vehicles are becoming sophisticated connected devices, offering seamless integration with our digital lives.

## Smart Features

- **Over-the-Air Updates**: Software updates without dealer visits
- **Remote Control**: Start, lock, and monitor your car from anywhere
- **Advanced Navigation**: Real-time traffic and route optimization
- **Digital Assistants**: Voice-controlled vehicle functions

## Safety Benefits

Connected technology enables vehicle-to-vehicle (V2V) communication, enhancing safety by alerting drivers to potential hazards.

## The Connected Future

As 5G networks expand, vehicles will become even more integrated into the broader IoT ecosystem.',
  'Technology',
  '/lovable-uploads/connected-car.jpg',
  false
),
(
  'Electric Revolution: How EVs Are Transforming the Automotive Landscape',
  'electric-revolution-evs',
  'Explore how electric vehicles are reshaping the automotive industry with breakthrough battery technology, charging infrastructure, and sustainable manufacturing.',
  '# Electric Revolution: How EVs Are Transforming the Automotive Landscape

The electric vehicle revolution is here, and it''s transforming every aspect of the automotive industry.

## Battery Breakthroughs

Recent advances in battery technology have dramatically improved range and reduced charging times. Modern EVs can now travel over 400 miles on a single charge.

## Charging Infrastructure

The rapid expansion of fast-charging networks is making long-distance EV travel practical and convenient.

## Sustainable Manufacturing

EV manufacturers are prioritizing sustainability not just in the vehicles themselves, but throughout the entire production process.

The electric future is bright, and it''s arriving faster than most predicted.',
  'Featured',
  '/lovable-uploads/electric-car.jpg',
  true
);

-- Success message
SELECT 'SUCCESS! Car news table created with sample articles' as status;
SELECT COUNT(*) as total_articles FROM public.car_news;
SELECT title, category, is_featured FROM public.car_news ORDER BY published_date DESC;
