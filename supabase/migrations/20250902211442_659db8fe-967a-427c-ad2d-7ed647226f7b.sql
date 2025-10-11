-- Clear existing car data
DELETE FROM cars;

-- Insert comprehensive BMW car data
INSERT INTO cars (brand, make, model, year, price, fuel_type, transmission, body_type, engine_capacity_cc, power_bhp, torque_nm, mileage_kmpl, seating_capacity, airbags, abs_ebd_esc, hill_assist, traction_control, digital_cluster, ground_clearance_mm, boot_space_liters, warranty_years, image_url, description) VALUES

-- BMW Models
('BMW', 'BMW', 'X1', 2024, 4590000, 'Petrol', 'Automatic', 'SUV', 1998, 192, 280, 14.82, 5, 6, true, true, true, true, 183, 550, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Compact luxury SUV with premium features'),
('BMW', 'BMW', 'X5', 2024, 7790000, 'Petrol', 'Automatic', 'SUV', 2998, 340, 450, 12.65, 7, 8, true, true, true, true, 214, 650, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Premium full-size luxury SUV'),
('BMW', 'BMW', 'X7', 2024, 12500000, 'Petrol', 'Automatic', 'SUV', 2998, 340, 450, 11.2, 7, 8, true, true, true, true, 205, 750, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Flagship luxury SUV with exceptional comfort'),
('BMW', 'BMW', '3 Series Gran Limousine', 2024, 5150000, 'Petrol', 'Automatic', 'Sedan', 1998, 190, 280, 16.13, 5, 6, true, true, true, true, 140, 480, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Extended wheelbase luxury sedan'),
('BMW', 'BMW', '5 Series', 2024, 7200000, 'Petrol', 'Automatic', 'Sedan', 1998, 252, 350, 15.2, 5, 8, true, true, true, true, 135, 530, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Executive luxury sedan'),
('BMW', 'BMW', '7 Series', 2024, 17500000, 'Petrol', 'Automatic', 'Sedan', 2998, 375, 520, 13.9, 5, 8, true, true, true, true, 125, 515, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Flagship luxury sedan with cutting-edge technology'),
('BMW', 'BMW', 'iX', 2024, 11650000, 'Electric', 'Automatic', 'SUV', 0, 326, 630, 0, 5, 8, true, true, true, true, 200, 500, 3, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Premium electric SUV with 425km range'),
('BMW', 'BMW', 'i4', 2024, 7200000, 'Electric', 'Automatic', 'Sedan', 0, 340, 430, 0, 5, 6, true, true, true, true, 125, 470, 3, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Electric gran coupe with 590km range'),
('BMW', 'BMW', 'i5', 2024, 9500000, 'Electric', 'Automatic', 'Sedan', 0, 340, 430, 0, 5, 8, true, true, true, true, 135, 490, 3, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Electric executive sedan with 516km range'),
('BMW', 'BMW', 'XM', 2024, 26500000, 'Hybrid', 'Automatic', 'SUV', 4395, 653, 800, 15.8, 5, 8, true, true, true, true, 205, 527, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'High-performance luxury hybrid SUV'),
('BMW', 'BMW', 'M340i', 2024, 6250000, 'Petrol', 'Automatic', 'Sedan', 2998, 387, 500, 12.2, 5, 6, true, true, true, true, 140, 480, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'High-performance sports sedan'),
('BMW', 'BMW', '2 Series Gran Coupe', 2024, 3990000, 'Petrol', 'Automatic', 'Coupe', 1998, 192, 280, 16.5, 5, 6, true, true, true, true, 140, 430, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Compact luxury coupe sedan'),

-- MINI Models
('MINI', 'MINI', '3-Door Cooper S', 2024, 3950000, 'Petrol', 'Automatic', 'Hatchback', 1998, 192, 280, 17.91, 4, 6, true, true, true, true, 140, 211, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Iconic premium compact hatchback'),
('MINI', 'MINI', 'Countryman', 2024, 4200000, 'Petrol', 'Automatic', 'SUV', 1998, 192, 280, 14.2, 5, 6, true, true, true, true, 178, 450, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Compact luxury crossover SUV'),
('MINI', 'MINI', 'Convertible', 2024, 4450000, 'Petrol', 'Automatic', 'Convertible', 1998, 192, 280, 17.2, 4, 4, true, true, true, true, 140, 160, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Open-top premium convertible'),
('MINI', 'MINI', 'Cooper SE Electric', 2024, 4750000, 'Electric', 'Automatic', 'Hatchback', 0, 184, 270, 0, 4, 4, true, true, true, true, 140, 211, 3, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'All-electric MINI with 270km range'),
('MINI', 'MINI', '5-Door Hatch', 2024, 3750000, 'Petrol', 'Automatic', 'Hatchback', 1499, 136, 220, 18.5, 5, 6, true, true, true, true, 140, 278, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'Practical 5-door premium hatchback'),
('MINI', 'MINI', 'John Cooper Works', 2024, 5200000, 'Petrol', 'Manual', 'Hatchback', 1998, 231, 320, 15.1, 4, 6, true, true, true, true, 140, 211, 2, '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png', 'High-performance track-focused MINI');