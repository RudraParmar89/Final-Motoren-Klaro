-- Update Maruti to Suzuki in the cars table
UPDATE cars 
SET make = 'Suzuki', brand = 'Suzuki'
WHERE make = 'Maruti' OR brand = 'Maruti';