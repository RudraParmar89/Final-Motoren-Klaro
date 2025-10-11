-- First, let's add all the missing columns to the cars table to accommodate comprehensive car data
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS mileage_kmpl numeric;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS mileage_range_km integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS engine_capacity_cc integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS engine_capacity_liters numeric;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS power_bhp integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS power_ps integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS power_kw integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS torque_nm integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS ground_clearance_mm integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS boot_space_liters integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS seating_capacity integer DEFAULT 5;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS ncap_rating integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS airbags integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS abs_ebd_esc boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS hill_assist boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS traction_control boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS adas_features text[];
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS infotainment_system text;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS climate_control text;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS seat_material text;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS digital_cluster boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS connected_car_tech text[];
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS driver_aids text[];
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS service_cost_per_year numeric;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS warranty_years integer;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'Unknown';

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create user_favorites table for liked cars
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, car_id)
);

-- Enable RLS on user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_brand ON public.cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON public.cars(make, model);
CREATE INDEX IF NOT EXISTS idx_cars_price ON public.cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON public.cars(year);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_car_id ON public.user_favorites(car_id);