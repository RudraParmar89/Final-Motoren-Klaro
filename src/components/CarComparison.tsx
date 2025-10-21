import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X, Fuel, Zap, Settings, Shield, Star, Car, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from '@/lib/formatPrice';

interface Car {
  id: string;
  brand: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  engine_capacity_cc?: number;
  power_bhp?: number;
  torque_nm?: number;
  mileage_kmpl?: number;
  seating_capacity?: number;
  airbags?: number;
  ncap_rating?: number;
  abs_ebd_esc?: boolean;
  hill_assist?: boolean;
  traction_control?: boolean;
  digital_cluster?: boolean;
  ground_clearance_mm?: number;
  boot_space_liters?: number;
  warranty_years?: number;
  image_url?: string;
  description?: string;
}

interface CarComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCars?: { make: string; model: string }[];
}

export const CarComparison = ({ isOpen, onClose, preSelectedCars }: CarComparisonProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCars();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && preSelectedCars && preSelectedCars.length > 0) {
      // Find cars matching the pre-selected ones
      const matchingCars = availableCars.filter(car => 
        preSelectedCars.some(preSelected => 
          car.brand === preSelected.make && car.model === preSelected.model
        )
      );
      setSelectedCars(matchingCars);
    }
  }, [isOpen, preSelectedCars, availableCars]);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;
      setAvailableCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCars = availableCars
    .filter(car => {
      // Category filter
      if (categoryFilter && car.body_type && car.body_type.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      return true;
    })
    .filter(car => {
      // Price filter
      if (priceFilter) {
        const price = car.price;
        switch (priceFilter) {
          case '1-20':
            return price >= 100000 && price <= 2000000;
          case '20-40':
            return price > 2000000 && price <= 4000000;
          case '40-60':
            return price > 4000000 && price <= 6000000;
          case '60-100':
            return price > 6000000 && price <= 10000000;
          case '100-200':
            return price > 10000000 && price <= 20000000;
          default:
            return true;
        }
      }
      return true;
    })
    .filter(car =>
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const addCarToComparison = (car: Car) => {
    if (selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const removeCarFromComparison = (carId: string) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  // use shared formatPrice

  const ComparisonRow = ({ label, getValue, icon: Icon, compareType }: { 
    label: string; 
    getValue: (car: Car) => string | number | undefined; 
    icon?: any;
    compareType?: 'lower-is-better' | 'higher-is-better' | 'boolean';
  }) => {
    // Calculate which values should be highlighted green
    const shouldHighlight = (car: Car, index: number) => {
      if (!compareType) return false;
      
      const values = selectedCars.map(c => {
        const val = getValue(c);
        if (typeof val === 'string') {
          // Extract numeric value from strings like "4.8 L" or "73 BHP"
          const match = val.match(/[\d.]+/);
          return match ? parseFloat(match[0]) : null;
        }
        return typeof val === 'number' ? val : null;
      }).filter(v => v !== null);

      if (values.length === 0) return false;

      const currentValue = getValue(car);
      let numericValue: number | null = null;
      
      if (typeof currentValue === 'string') {
        const match = currentValue.match(/[\d.]+/);
        numericValue = match ? parseFloat(match[0]) : null;
      } else if (typeof currentValue === 'number') {
        numericValue = currentValue;
      }

      if (numericValue === null) return false;

      if (compareType === 'lower-is-better') {
        return numericValue === Math.min(...values as number[]);
      } else if (compareType === 'higher-is-better') {
        return numericValue === Math.max(...values as number[]);
      } else if (compareType === 'boolean') {
        // For boolean comparisons, highlight 'Yes' values
        return currentValue === 'Yes';
      }

      return false;
    };

    return (
      <div className="grid grid-cols-4 gap-4 py-4 px-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          {Icon && <Icon size={18} className="text-primary" />}
          {label}
        </div>
        {selectedCars.map((car, index) => (
          <div 
            key={car.id} 
            className={`text-center font-semibold px-3 py-2 rounded-md transition-all ${
              shouldHighlight(car, index) 
                ? 'text-green-700 bg-green-50 border-2 border-green-200' 
                : 'text-gray-700'
            }`}
          >
            {getValue(car) || <span className="text-gray-400">N/A</span>}
          </div>
        ))}
        {Array.from({ length: 3 - selectedCars.length }, (_, index) => (
          <div key={`empty-${index}`} className="text-center text-gray-300 py-2">-</div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto" aria-describedby="car-comparison-description">
        <DialogHeader>
          <DialogTitle>Compare Cars Side-by-Side</DialogTitle>
          <DialogDescription id="car-comparison-description">
            Compare up to 3 cars side by side with detailed specifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search for cars to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Crossover">Crossover</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Wagon">Wagon</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Prices</option>
              <option value="1-20">₹1-20 Lakhs</option>
              <option value="20-40">₹20-40 Lakhs</option>
              <option value="40-60">₹40-60 Lakhs</option>
              <option value="60-100">₹60L-1Cr</option>
              <option value="100-200">₹1-2 Cr</option>
            </select>
          </div>

          {/* Car Selection */}
          <div className="space-y-4">

            {searchQuery && (
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {filteredCars.slice(0, 10).map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {car.image_url && (
                        <img
                          src={car.image_url}
                          alt={`${car.make} ${car.model}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{car.make} {car.model}</div>
                        <div className="text-sm text-gray-500">{car.year} • {formatPrice(car.price)}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addCarToComparison(car)}
                      disabled={selectedCars.length >= 3 || selectedCars.some(c => c.id === car.id)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Cars Display - Enhanced Design */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Selected Cars
                <Badge variant="secondary">{selectedCars.length}/3</Badge>
              </h3>
              {selectedCars.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => setSelectedCars([])}>
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedCars.map((car, idx) => (
                <Card key={car.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-primary/20">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
                  <button
                    onClick={() => removeCarFromComparison(car.id)}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-all"
                  >
                    <X size={14} className="text-white" />
                  </button>
                  <CardContent className="p-5">
                    {car.image_url ? (
                      <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={car.image_url}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Car className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">#{idx + 1}</Badge>
                      <h4 className="font-bold text-lg">{car.make} {car.model}</h4>
                      <p className="text-sm text-gray-500">{car.year}</p>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-1">Price</p>
                        <p className="text-xl font-bold text-primary">{formatPrice(car.price)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{car.fuel_type}</Badge>
                        <Badge variant="outline" className="text-xs">{car.transmission}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {Array.from({ length: 3 - selectedCars.length }, (_, index) => (
                <Card key={`placeholder-${index}`} className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors">
                  <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[280px]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                      <Plus size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Add {index === 0 && selectedCars.length === 0 ? 'First' : index === 1 && selectedCars.length === 1 ? 'Second' : 'Third'} Car</p>
                    <p className="text-xs text-gray-400 mt-1">Search above to add</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Comparison Table - Enhanced */}
          {selectedCars.length > 0 && (
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-5 text-white">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Detailed Comparison
                </h3>
                <p className="text-sm text-white/80 mt-1">Compare specifications side-by-side</p>
              </div>
              <div className="p-6 space-y-2 bg-gradient-to-b from-white to-gray-50">
                <ComparisonRow 
                  label="Price" 
                  getValue={(car) => formatPrice(car.price)}
                  icon={Car}
                  compareType="lower-is-better"
                />
                <ComparisonRow 
                  label="Engine (cc)" 
                  getValue={(car) => car.engine_capacity_cc ? `${car.engine_capacity_cc} cc` : undefined}
                  icon={Settings}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="Power (BHP)" 
                  getValue={(car) => car.power_bhp ? `${car.power_bhp} BHP` : undefined}
                  icon={Zap}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="Torque (Nm)" 
                  getValue={(car) => car.torque_nm ? `${car.torque_nm} Nm` : undefined}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="Mileage (KMPL)" 
                  getValue={(car) => car.mileage_kmpl ? `${car.mileage_kmpl} KMPL` : undefined}
                  icon={Fuel}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="Fuel Type" 
                  getValue={(car) => car.fuel_type}
                />
                <ComparisonRow 
                  label="Transmission" 
                  getValue={(car) => car.transmission}
                />
                <ComparisonRow 
                  label="Body Type" 
                  getValue={(car) => car.body_type}
                />
                <ComparisonRow 
                  label="Seating Capacity" 
                  getValue={(car) => car.seating_capacity ? `${car.seating_capacity} seats` : undefined}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="Airbags" 
                  getValue={(car) => car.airbags ? `${car.airbags} airbags` : undefined}
                  icon={Shield}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="Ground Clearance" 
                  getValue={(car) => car.ground_clearance_mm ? `${car.ground_clearance_mm} mm` : undefined}
                />
                <ComparisonRow 
                  label="Boot Space" 
                  getValue={(car) => car.boot_space_liters ? `${car.boot_space_liters} L` : undefined}
                />
                <ComparisonRow 
                  label="Warranty" 
                  getValue={(car) => car.warranty_years ? `${car.warranty_years} years` : undefined}
                  icon={Star}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="Safety Rating" 
                  getValue={(car) => car.ncap_rating ? `${car.ncap_rating} stars` : undefined}
                  icon={Shield}
                  compareType="higher-is-better"
                />
                <ComparisonRow 
                  label="ABS/EBD/ESC" 
                  getValue={(car) => car.abs_ebd_esc ? 'Yes' : 'No'}
                  compareType="boolean"
                />
                <ComparisonRow 
                  label="Hill Assist" 
                  getValue={(car) => car.hill_assist ? 'Yes' : 'No'}
                  compareType="boolean"
                />
                <ComparisonRow 
                  label="Traction Control" 
                  getValue={(car) => car.traction_control ? 'Yes' : 'No'}
                  compareType="boolean"
                />
                <ComparisonRow 
                  label="Digital Cluster" 
                  getValue={(car) => car.digital_cluster ? 'Yes' : 'No'}
                  compareType="boolean"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};