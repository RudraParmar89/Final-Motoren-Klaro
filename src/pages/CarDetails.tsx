import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Car, Fuel, Settings, Gauge, Users, Shield, Calendar, Star } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import CarImageCarousel from '@/components/CarImageCarousel';
import { EMICalculator } from '@/components/EMICalculator';
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
  abs_ebd_esc?: boolean;
  hill_assist?: boolean;
  traction_control?: boolean;
  digital_cluster?: boolean;
  ground_clearance_mm?: number;
  boot_space_liters?: number;
  warranty_years?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  features?: string[];
  dealer_name?: string;
  dealer_contact?: string;
  youtube_url?: string;
}

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCarDetails();
      if (user) {
        checkIfFavorite();
      }
      const storageListener = (e: StorageEvent) => {
        if (e.key === 'cars_updated_at') {
          fetchCarDetails();
        }
      };
      const onVisibility = () => {
        if (document.visibilityState === 'visible') {
          fetchCarDetails();
        }
      };
      window.addEventListener('storage', storageListener);
      document.addEventListener('visibilitychange', onVisibility);
      // subscribe to realtime updates for this car id
      const channel = supabase
        .channel(`public:cars:${id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cars', filter: `id=eq.${id}` }, (payload) => {
          try {
            const newRow = (payload as any).new;
            if (newRow) {
              setCar(newRow);
            } else {
              // deleted
              setCar(null);
            }
          } catch (err) {
            console.warn('CarDetails realtime error:', err);
          }
        })
        .subscribe();

      // Also listen for admin broadcast to refetch as fallback
      const broadcast = supabase
        .channel('cars-updates')
        .on('broadcast', { event: 'cars-updated' }, () => {
          fetchCarDetails();
        })
        .subscribe();

      return () => {
        window.removeEventListener('storage', storageListener);
        document.removeEventListener('visibilitychange', onVisibility);
        try { channel.unsubscribe(); } catch (e) {}
        try { broadcast.unsubscribe(); } catch (e) {}
      };
    }
  }, [id, user]);

  const fetchCarDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load car details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('car_id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add cars to favorites.",
      });
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', id);

        if (error) throw error;
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Car removed from your favorites.",
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            car_id: id,
          });

        if (error) throw error;
        setIsFavorite(true);
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
    } finally {
      setFavoriteLoading(false);
    }
  };

  // use shared formatPrice

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!car) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
            <p className="text-gray-600 mb-6">The car you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO 
        title={`${car.make} ${car.model} ${car.year} - Car Details | Motoren Klaro`}
        description={`Detailed specifications and pricing for ${car.make} ${car.model} ${car.year}. ${car.description || 'Compare features, performance, and make an informed decision.'}`}
        imageUrl={car.image_url}
        keywords={[car.make, car.model, car.brand, 'car details', 'specifications', 'motoren klaro']}
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cars
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Car Images Carousel */}
            <CarImageCarousel
              images={car.images || []}
              carName={`${car.make} ${car.model}`}
              className="w-full"
            />

            {/* Car Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {car.make} {car.model}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={isFavorite ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{car.brand}</Badge>
                  <Badge variant="outline">{car.year}</Badge>
                  <Badge variant="outline">{car.body_type}</Badge>
                </div>
                <div className="text-3xl font-bold text-primary mb-4">
                  {formatPrice(car.price)}
                </div>
                {car.description && (
                  <p className="text-gray-600">{car.description}</p>
                )}
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Fuel Type</p>
                    <p className="text-sm font-medium">{car.fuel_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="text-sm font-medium">{car.transmission}</p>
                  </div>
                </div>
                {car.power_bhp && (
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Power</p>
                      <p className="text-sm font-medium">{car.power_bhp} BHP</p>
                    </div>
                  </div>
                )}
                {car.seating_capacity && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Seating</p>
                      <p className="text-sm font-medium">{car.seating_capacity} Seats</p>
                    </div>
                  </div>
                )}
                {car.engine_capacity_cc && (
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Engine</p>
                      <p className="text-sm font-medium">{car.engine_capacity_cc} cc</p>
                    </div>
                  </div>
                )}
                {car.mileage_kmpl && (
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Mileage</p>
                      <p className="text-sm font-medium">{car.mileage_kmpl} km/l</p>
                    </div>
                  </div>
                )}
                {car.airbags && (
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Airbags</p>
                      <p className="text-sm font-medium">{car.airbags}</p>
                    </div>
                  </div>
                )}
                {car.warranty_years && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Warranty</p>
                      <p className="text-sm font-medium">{car.warranty_years} years</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Dealer */}
              {car.dealer_name && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Dealer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{car.dealer_name}</p>
                    {car.dealer_contact && (
                      <p className="text-gray-600">{car.dealer_contact}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* EMI Calculator */}
          <div className="mb-8">
            <EMICalculator carPrice={car.price} />
          </div>

          {/* YouTube Video Section */}
          {car.youtube_url && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-red-600" />
                  Video Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={car.youtube_url}
                    title={`${car.make} ${car.model} Video Review`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Engine & Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Engine & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {car.engine_capacity_cc && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engine</span>
                    <span className="font-medium">{car.engine_capacity_cc} cc</span>
                  </div>
                )}
                {car.power_bhp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Power</span>
                    <span className="font-medium">{car.power_bhp} BHP</span>
                  </div>
                )}
                {car.torque_nm && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Torque</span>
                    <span className="font-medium">{car.torque_nm} Nm</span>
                  </div>
                )}
                {car.mileage_kmpl && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage</span>
                    <span className="font-medium">{car.mileage_kmpl} km/l</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Safety Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {car.airbags && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Airbags</span>
                    <span className="font-medium">{car.airbags}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">ABS/EBD/ESC</span>
                  <span className="font-medium">{car.abs_ebd_esc ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hill Assist</span>
                  <span className="font-medium">{car.hill_assist ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Traction Control</span>
                  <span className="font-medium">{car.traction_control ? 'Yes' : 'No'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions & Capacity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Dimensions & Capacity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {car.seating_capacity && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seating</span>
                    <span className="font-medium">{car.seating_capacity} seats</span>
                  </div>
                )}
                {car.ground_clearance_mm && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ground Clearance</span>
                    <span className="font-medium">{car.ground_clearance_mm} mm</span>
                  </div>
                )}
                {car.boot_space_liters && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Boot Space</span>
                    <span className="font-medium">{car.boot_space_liters} L</span>
                  </div>
                )}
                {car.warranty_years && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-medium">{car.warranty_years} years</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {car.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CarDetails;