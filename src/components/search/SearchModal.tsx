import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageUrl } from '@/lib/imageUtils';
import { getRepresentativeImages } from '@/components/CarImageCarousel';
import { formatPrice } from '@/lib/formatPrice';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Car {
  id: string;
  brand: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuel_type: string;
  image_url?: string;
  images?: string[];
  power_bhp?: number;
  mileage_kmpl?: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const brands = ['all', 'BMW', 'MINI', 'Ferrari', 'Jaguar', 'Land Rover', 'Maruti Suzuki', 'Polaris', 'TATA', 'Kia'];
  const fuelTypes = ['all', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-500000', label: 'Under ₹5 Lakh' },
    { value: '500000-1000000', label: '₹5-10 Lakh' },
    { value: '1000000-2000000', label: '₹10-20 Lakh' },
    { value: '2000000-5000000', label: '₹20-50 Lakh' },
    { value: '5000000-999999999', label: 'Above ₹50 Lakh' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchCars();
    }
  }, [isOpen]);

  useEffect(() => {
    filterCars();
  }, [searchQuery, cars, selectedBrand, selectedFuelType, priceRange]);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = cars;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }

    // Fuel type filter
    if (selectedFuelType !== 'all') {
      filtered = filtered.filter(car => car.fuel_type === selectedFuelType);
    }

    // Price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(car => car.price >= min && car.price <= max);
    }

    setFilteredCars(filtered);
  };

  // use shared formatPrice

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Cars</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search by brand, make, or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand === 'all' ? 'All Brands' : brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map(fuel => (
                  <SelectItem key={fuel} value={fuel}>
                    {fuel === 'all' ? 'All Fuel Types' : fuel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading cars...</div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No cars found matching your criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCars.map((car) => (
                <Card
                  key={car.id}
                  onClick={() => { navigate(`/car/${car.id}`); onClose(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { navigate(`/car/${car.id}`); onClose(); } }}
                  role="button"
                  tabIndex={0}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {car.image_url ? (
                        <img
                          src={resolveImageUrl(car.image_url)}
                          alt={`${car.make} ${car.model}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        (() => {
                          const reps = getRepresentativeImages(`${car.make} ${car.model}`, car.images || []);
                          if (reps && reps.length > 0) {
                            return <img src={reps[0]} alt={`${car.make} ${car.model}`} className="w-20 h-20 object-cover rounded" />;
                          }
                          return null;
                        })()
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-sm text-gray-600">{car.year}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{car.brand}</Badge>
                          <Badge variant="outline">{car.fuel_type}</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-primary">
                            {formatPrice(car.price)}
                          </span>
                          {car.power_bhp && (
                            <span className="text-sm text-gray-600">
                              {car.power_bhp} BHP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};