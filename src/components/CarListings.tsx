import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, DollarSign, Fuel, Gauge, Calendar, Car, Users } from 'lucide-react';
import { resolveImageUrl } from '@/lib/imageUtils';
import { getRepresentativeImages } from '@/components/CarImageCarousel';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  engine_size?: number;
  horsepower?: number;
  fuel_economy_city?: number;
  fuel_economy_highway?: number;
  safety_rating?: number;
  image_url?: string;
  dealer_name?: string;
  features?: string[];
}

const CarListings = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .limit(6)
          .order('year', { ascending: false });

        if (error) throw error;
        setCars(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
    const storageListener = (e: StorageEvent) => {
      if (e.key === 'cars_updated_at') {
        fetchCars();
      }
    };
    const broadcast = supabase
      .channel('cars-updates')
      .on('broadcast', { event: 'cars-updated' }, () => {
        fetchCars();
      })
      .subscribe();
    window.addEventListener('storage', storageListener);
    return () => {
      try { broadcast.unsubscribe(); } catch (e) {}
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-[50px] w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              Featured Cars
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Loading Cars...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="bg-white p-6 rounded-b-lg border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-[50px] w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-block mb-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
            Error
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            Unable to Load Cars
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="cars" className="bg-white py-[50px] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            Featured Cars
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Find Your Perfect Car
          </h2>
          <p className="text-gray-600">
            Browse our curated selection of vehicles with detailed specifications, pricing, and expert insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cars.map((car) => (
            <Card
              key={car.id}
              onClick={() => navigate(`/car/${car.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/car/${car.id}`); }}
              role="button"
              tabIndex={0}
              className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {car.image_url ? (
                  <img 
                    src={resolveImageUrl(car.image_url)} 
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (() => {
                    const reps = getRepresentativeImages(`${car.make} ${car.model}`, []);
                    if (reps && reps.length > 0) {
                      return (
                        <img src={reps[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                      );
                    }
                    return (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-500" />
                      </div>
                    );
                  })()
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {car.year}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-500 text-sm">{car.body_type} • {car.transmission}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>${car.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Fuel className="w-4 h-4 mr-1" />
                    <span>{car.fuel_type}</span>
                  </div>
                  {car.horsepower && (
                    <div className="flex items-center text-gray-600">
                      <Gauge className="w-4 h-4 mr-1" />
                      <span>{car.horsepower} HP</span>
                    </div>
                  )}
                  {car.fuel_economy_city && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{car.fuel_economy_city} MPG</span>
                    </div>
                  )}
                </div>
                
                {car.features && car.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {car.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {car.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{car.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  {car.dealer_name && (
                    <span className="text-xs text-gray-500">
                      by {car.dealer_name}
                    </span>
                  )}
                  <Link to={`/car/${car.id}`}>
                    <Button variant="outline" size="sm" className="group">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/cars">
            <Button className="bg-gray-700 hover:bg-gray-800 text-white">
              View All Cars
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CarListings;