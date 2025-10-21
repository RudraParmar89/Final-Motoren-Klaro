-- COPY THIS ONE LINE AND RUN IN SUPABASE SQL EDITOR
-- This will disable RLS completely and make everything work

ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.cars TO authenticated;
GRANT SELECT ON public.cars TO anon;
GRANT ALL ON public.cars TO postgres;
