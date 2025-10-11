-- Update cars with generated multi-angle images
-- First, let's find a Ferrari in our database if it exists, or add sample data
DO $$
BEGIN
  -- Update BMW X1 with generated images
  UPDATE public.cars 
  SET images = ARRAY[
    '/src/assets/bmw-x1-front.jpg',
    '/src/assets/bmw-x1-side.jpg', 
    '/src/assets/bmw-x1-rear.jpg'
  ]
  WHERE make = 'BMW' AND model = 'X1';

  -- Update BMW X5 with generated images
  UPDATE public.cars 
  SET images = ARRAY[
    '/src/assets/bmw-x5-front.jpg',
    '/src/assets/bmw-x5-side.jpg',
    '/src/assets/bmw-x5-rear.jpg'
  ]
  WHERE make = 'BMW' AND model = 'X5';

  -- Update BMW 3 Series with generated images
  UPDATE public.cars 
  SET images = ARRAY[
    '/src/assets/bmw-3series-front.jpg',
    '/src/assets/bmw-3series-side.jpg'
  ]
  WHERE make = 'BMW' AND (model = '3 Series' OR model = '3 Series Gran Limousine');

  -- If no Ferrari exists, let's add one with the generated images
  INSERT INTO public.cars (
    make, model, brand, year, price, fuel_type, transmission, body_type,
    engine_capacity_cc, power_bhp, torque_nm, mileage_kmpl, seating_capacity,
    airbags, abs_ebd_esc, hill_assist, traction_control, digital_cluster,
    images, description, dealer_name
  ) VALUES (
    'Ferrari', 'F8 Tributo', 'Ferrari', 2024, 50000000, 'Petrol', 'Automatic', 'Coupe',
    3902, 710, 770, 8.5, 2,
    2, true, true, true, true,
    ARRAY[
      '/src/assets/ferrari-front.jpg',
      '/src/assets/ferrari-side.jpg',
      '/src/assets/ferrari-side2.jpg',
      '/src/assets/ferrari-rear.jpg'
    ],
    'The Ferrari F8 Tributo is the new mid-rear-engined sports car that represents the highest expression of the company''s classic two-seater berlinetta.',
    'Ferrari Delhi'
  ) ON CONFLICT DO NOTHING;

END $$;