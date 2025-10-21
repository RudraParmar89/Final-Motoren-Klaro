-- Fix RLS policies for cars table to allow admin operations

-- This migration ensures that the cars table has proper RLS policies

-- First, check if RLS is enabled on cars table and disable it if needed
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view cars" ON public.cars;
DROP POLICY IF EXISTS "Service role can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Service role can update cars" ON public.cars;
DROP POLICY IF EXISTS "Service role can delete cars" ON public.cars;
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Authenticated users can update cars" ON public.cars;
DROP POLICY IF EXISTS "Authenticated users can delete cars" ON public.cars;

-- Create policy for public read access (anyone can view cars)
CREATE POLICY "Anyone can view cars"
ON public.cars
FOR SELECT
USING (true);

-- Create policies for authenticated users (admins) to manage cars
-- For INSERT
CREATE POLICY "Authenticated users can insert cars"
ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (true);

-- For UPDATE
CREATE POLICY "Authenticated users can update cars"
ON public.cars
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- For DELETE
CREATE POLICY "Authenticated users can delete cars"
ON public.cars
FOR DELETE
TO authenticated
USING (true);

-- Grant necessary permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT USAGE ON SEQUENCE cars_id_seq TO authenticated;

-- Also ensure anon role can read
GRANT SELECT ON public.cars TO anon;
