-- Create inquiries table to store contact form submissions
-- Run this in Supabase SQL Editor as postgres/superuser role

-- Create the table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_brand TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Disable RLS (like we did for cars)
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO postgres;
GRANT INSERT ON public.inquiries TO anon; -- Allow public to submit forms

-- Set owner
ALTER TABLE public.inquiries OWNER TO postgres;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.inquiries(email);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON public.inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.inquiries (name, email, phone, car_brand, message) VALUES
('John Doe', 'john@example.com', '+91 98765 43210', 'BMW', 'Interested in BMW X5. Please contact me.'),
('Jane Smith', 'jane@example.com', '+91 98765 43211', 'Mercedes-Benz', 'Looking for C-Class. What is the best price?');

SELECT 'SUCCESS! Inquiries table created with sample data' as status;
SELECT COUNT(*) as total_inquiries FROM public.inquiries;
