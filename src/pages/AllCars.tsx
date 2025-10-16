import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, Filter, Car as CarIcon } from 'lucide-react';
import { resolveImageUrl } from '@/lib/imageUtils';
import { getRepresentativeImages } from '@/components/CarImageCarousel';
import { formatPrice } from '@/lib/formatPrice';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { CarComparison } from '@/components/CarComparison';

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
  power_bhp?: number;
  mileage_kmpl?: number;
  image_url?: string;
  images?: string[];
}

const AllCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams();
  
  // Dynamic filter options from database
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
  const [availableBodyTypes, setAvailableBodyTypes] = useState<string[]>([]);
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(new Set());
  
  const { user } = useAuth();
  const { toast } = useToast();

  const priceRanges = [
    { label: '₹1-20 Lakhs', value: '1-20', min: 100000, max: 2000000 },
    { label: '₹20-40 Lakhs', value: '20-40', min: 2000000, max: 4000000 },
    { label: '₹40-60 Lakhs', value: '40-60', min: 4000000, max: 6000000 },
    { label: '₹60 Lakhs - 1 Cr', value: '60-100', min: 6000000, max: 10000000 },
    { label: '1 cr and above', value: '100-above', min: 10000000, max: 999999999 }
  ];

  useEffect(() => {
    fetchCars();
    fetchFilterOptions();
    if (user) {
      fetchFavorites();
    }
    const storageListener = (e: StorageEvent) => {
      if (e.key === 'cars_updated_at') {
        fetchCars();
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchCars();
      }
    };
    window.addEventListener('storage', storageListener);
    document.addEventListener('visibilitychange', onVisibility);
    
    // Handle URL parameters
    const bodyTypeParam = searchParams.get('body_type');
    const fuelTypeParam = searchParams.get('fuel_type');
    const priceRangeParam = searchParams.get('price_range');
    if (bodyTypeParam) {
      setSelectedBodyType(bodyTypeParam);
    }
    if (fuelTypeParam) {
      setSelectedFuelType(fuelTypeParam);
    }
    if (priceRangeParam) {
      setSelectedPriceRange(priceRangeParam);
    }
    
    // Handle brand parameter
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
    return () => {
      window.removeEventListener('storage', storageListener);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user, searchParams]);

  // Subscribe to realtime changes so public list updates when admin edits/deletes
  useEffect(() => {
    const channel = supabase
      .channel('public:cars')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, (payload) => {
        try {
          const newRow = (payload as any).new;
          const oldRow = (payload as any).old;
          const eventType = (payload as any).eventType || (payload as any).event;

          if (eventType === 'INSERT') {
            setCars(prev => prev.filter(c => c.id !== newRow.id));
            setCars(prev => [newRow, ...prev]);
            markRecentlyUpdated(newRow.id);
          } else if (eventType === 'UPDATE') {
            setCars(prev => prev.map(c => (c.id === newRow.id ? newRow : c)));
            markRecentlyUpdated(newRow.id);
          } else if (eventType === 'DELETE') {
            setCars(prev => prev.filter(c => c.id !== oldRow.id));
            markRecentlyUpdated(oldRow.id);
          }
        } catch (err) {
          console.warn('Realtime payload handling error (public):', err);
        }
      })
      .subscribe();

    // Listen for admin broadcast to refetch as fallback
    const broadcast = supabase
      .channel('cars-updates')
      .on('broadcast', { event: 'cars-updated' }, () => {
        fetchCars();
      })
      .subscribe();

    return () => {
      try {
        channel.unsubscribe();
        broadcast.unsubscribe();
      } catch (err) {
        // ignore
      }
    };
  }, []);

  const markRecentlyUpdated = (id: string) => {
    setRecentlyUpdatedIds(prev => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });
    setTimeout(() => {
      setRecentlyUpdatedIds(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }, 6000);
  };

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, selectedBrand, selectedFuelType, selectedBodyType, selectedPriceRange]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cars.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      // Fetch unique brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('cars')
        .select('make')
        .not('make', 'is', null);
      
      if (brandsError) throw brandsError;
      const uniqueBrands = [...new Set(brandsData.map(car => car.make))].sort();
      setAvailableBrands(uniqueBrands);

      // Fetch unique fuel types
      const { data: fuelData, error: fuelError } = await supabase
        .from('cars')
        .select('fuel_type')
        .not('fuel_type', 'is', null);
      
      if (fuelError) throw fuelError;
      const uniqueFuelTypes = [...new Set(fuelData.map(car => car.fuel_type))].sort();
      setAvailableFuelTypes(uniqueFuelTypes);

      // Fetch unique body types
      const { data: bodyData, error: bodyError } = await supabase
        .from('cars')
        .select('body_type')
        .not('body_type', 'is', null);
      
      if (bodyError) throw bodyError;
      const uniqueBodyTypes = [...new Set(bodyData.map(car => car.body_type))].sort();
      setAvailableBodyTypes(uniqueBodyTypes);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('car_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(new Set(data.map(fav => fav.car_id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const filterCars = () => {
    let filtered = cars;

    if (searchQuery) {
      filtered = filtered.filter(car =>
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(car => car.make === selectedBrand);
    }

    if (selectedFuelType) {
      filtered = filtered.filter(car => car.fuel_type === selectedFuelType);
    }

    if (selectedBodyType) {
      filtered = filtered.filter(car => car.body_type === selectedBodyType);
    }

    if (selectedPriceRange) {
      const priceRange = priceRanges.find(range => range.value === selectedPriceRange);
      if (priceRange) {
        if (selectedPriceRange === '100-above') {
          filtered = filtered.filter(car => car.price >= priceRange.min);
        } else {
          filtered = filtered.filter(car => car.price >= priceRange.min && car.price <= priceRange.max);
        }
      }
    }

    setFilteredCars(filtered);
  };

  const toggleFavorite = async (carId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add cars to favorites.",
      });
      return;
    }

    try {
      if (favorites.has(carId)) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', carId);

        if (error) throw error;
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(carId);
          return newSet;
        });
        toast({
          title: "Removed from favorites",
          description: "Car removed from your favorites.",
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            car_id: carId,
          });

        if (error) throw error;
        setFavorites(prev => new Set([...prev, carId]));
        toast({
          title: "Added to favorites",
          description: "Car added to your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites.",
      });
    }
  };

  // use shared formatPrice

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedFuelType('');
    setSelectedBodyType('');
    setSelectedPriceRange('');
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading cars...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO 
        title="All Cars - Browse & Compare | Motoren Klaro"
        description="Browse our complete collection of cars with advanced filtering and comparison tools. Find the perfect car for your needs."
        keywords={['all cars', 'car listings', 'compare cars', 'motoren klaro', 'car search']}
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Cars</h1>
            <p className="text-gray-600">Browse our complete collection of cars with detailed specifications and pricing.</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button onClick={() => setShowComparison(true)}>
                  Compare Cars
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {availableBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  {availableFuelTypes.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Body Type" />
                </SelectTrigger>
                <SelectContent>
                  {availableBodyTypes.map(body => (
                    <SelectItem key={body} value={body}>{body}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCars.length} of {cars.length} cars
            </p>
          </div>

          {/* Cars Grid */}
          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <Card
                  key={car.id}
                  onClick={() => navigate(`/car/${car.id}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/car/${car.id}`); }}
                  role="button"
                  tabIndex={0}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-48 bg-gray-100">
                    {car.image_url ? (
                      <img 
                        src={resolveImageUrl(car.image_url)} 
                        alt={`${car.make} ${car.model}`}
                        className={`w-full h-full object-cover ${recentlyUpdatedIds.has(car.id) ? 'ring-2 ring-emerald-400' : ''}`}
                      />
                    ) : (
                      (() => {
                        const reps = getRepresentativeImages(`${car.make} ${car.model}`, car.images || []);
                        if (reps && reps.length > 0) {
                          return <img src={reps[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />;
                        }
                        return (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <CarIcon className="w-12 h-12 text-gray-500" />
                          </div>
                        );
                      })()
                    )}
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(car.id)}
                        className={`${favorites.has(car.id) ? 'text-red-500' : 'text-gray-400'} hover:scale-110`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(car.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        {car.year}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-sm text-gray-500">{car.brand}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">{car.body_type}</Badge>
                      <Badge variant="outline" className="text-xs">{car.fuel_type}</Badge>
                      <Badge variant="outline" className="text-xs">{car.transmission}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(car.price)}
                      </span>
                      {car.power_bhp && (
                        <span className="text-sm text-gray-600">
                          {car.power_bhp} BHP
                        </span>
                      )}
                    </div>
                    
                    {car.mileage_kmpl && (
                      <p className="text-sm text-gray-600 mb-3">
                        {car.mileage_kmpl} km/l
                      </p>
                    )}
                    
                    <Link to={`/car/${car.id}`}>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CarComparison 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
      />
    </PageLayout>
  );
};

export default AllCars;