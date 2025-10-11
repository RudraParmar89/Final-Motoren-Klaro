-- Update all car models with their respective generated images

-- Ferrari 812 Superfast
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/ferrari-812-front.jpg',
  '/src/assets/ferrari-812-side.jpg',
  '/src/assets/ferrari-812-rear.jpg'
]
WHERE make = 'Ferrari' AND model = '812 Superfast';

-- Ferrari 488 and 488 Pista
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/ferrari-488-front.jpg',
  '/src/assets/ferrari-488-side.jpg',
  '/src/assets/ferrari-488-rear.jpg'
]
WHERE make = 'Ferrari' AND (model = '488' OR model = '488 Pista');

-- BMW 7 Series
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/bmw-7series-front.jpg',
  '/src/assets/bmw-7series-side.jpg',
  '/src/assets/bmw-7series-rear.jpg'
]
WHERE make = 'BMW' AND model = '7 Series';

-- Jaguar F-Type
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/jaguar-ftype-front.jpg',
  '/src/assets/jaguar-ftype-side.jpg',
  '/src/assets/jaguar-ftype-rear.jpg'
]
WHERE make = 'Jaguar' AND model = 'F-Type';

-- Range Rover models
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/range-rover-front.jpg',
  '/src/assets/range-rover-side.jpg',
  '/src/assets/range-rover-rear.jpg'
]
WHERE make = 'Range Rover' OR (make = 'Land Rover' AND model IN ('Range Rover', 'Evoque', 'Sport', 'Velar'));

-- TATA Nexon and Nexon EV
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/tata-nexon-front.jpg',
  '/src/assets/tata-nexon-side.jpg',
  '/src/assets/tata-nexon-rear.jpg'
]
WHERE make = 'Tata' AND (model = 'Nexon' OR model = 'Nexon EV');

-- Suzuki Swift
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/suzuki-swift-front.jpg',
  '/src/assets/suzuki-swift-side.jpg',
  '/src/assets/suzuki-swift-rear.jpg'
]
WHERE make = 'Suzuki' AND model = 'Swift';

-- Kia Seltos
UPDATE public.cars 
SET images = ARRAY[
  '/src/assets/kia-seltos-front.jpg',
  '/src/assets/kia-seltos-side.jpg',
  '/src/assets/kia-seltos-rear.jpg'
]
WHERE make = 'Kia' AND model = 'Seltos';