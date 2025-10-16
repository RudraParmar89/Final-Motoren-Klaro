import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from '@/lib/formatPrice';
import { useNavigate } from "react-router-dom";

interface Car {
  id: string;
  brand: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuel_type: string;
  image_url?: string;
  power_bhp?: number;
  mileage_kmpl?: number;
}

interface FavoriteWithCar {
  id: string;
  car_id: string;
  cars: Car;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const FavoritesModal = ({ isOpen, onClose, user }: FavoritesModalProps) => {
  const [favorites, setFavorites] = useState<FavoriteWithCar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && user) {
      fetchFavorites();
    }
  }, [isOpen, user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          car_id,
          cars (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your favorite cars.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast({
        title: "Removed",
        description: "Car removed from favorites.",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove car from favorites.",
      });
    }
  };

  // use shared formatPrice

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>My Favorite Cars</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Please sign in to view your favorite cars.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>My Favorite Cars</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">Loading your favorites...</div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">You haven't added any cars to your favorites yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Browse cars and click the heart icon to add them here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {favorite.cars.image_url && (
                        <img
                          src={favorite.cars.image_url}
                          alt={`${favorite.cars.make} ${favorite.cars.model}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {favorite.cars.make} {favorite.cars.model}
                            </h3>
                            <p className="text-sm text-gray-600">{favorite.cars.year}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigate(`/car-details/${favorite.cars.id}`);
                                onClose();
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFavorite(favorite.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{favorite.cars.brand}</Badge>
                          <Badge variant="outline">{favorite.cars.fuel_type}</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-primary">
                            {formatPrice(favorite.cars.price)}
                          </span>
                          {favorite.cars.power_bhp && (
                            <span className="text-sm text-gray-600">
                              {favorite.cars.power_bhp} BHP
                            </span>
                          )}
                        </div>
                        {favorite.cars.mileage_kmpl && (
                          <p className="text-sm text-gray-600 mt-1">
                            {favorite.cars.mileage_kmpl} km/l
                          </p>
                        )}
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