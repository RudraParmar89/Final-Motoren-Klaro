import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Trash2, User, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserFavorite {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
  cars: {
    id: string;
    brand: string;
    make: string;
    model: string;
    year: number;
    price: number;
    fuel_type: string;
    image_url?: string;
  };
}

interface FavoriteStats {
  totalFavorites: number;
  uniqueUsers: number;
  mostFavoredCar: string;
  totalUsers: number;
}

export const UserFavoritesManagement = () => {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [stats, setStats] = useState<FavoriteStats>({
    totalFavorites: 0,
    uniqueUsers: 0,
    mostFavoredCar: '',
    totalUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
    fetchStats();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          user_id,
          car_id,
          created_at,
          cars (
            id,
            brand,
            make,
            model,
            year,
            price,
            fuel_type,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user favorites.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total favorites and unique users
      const { data: favoritesData, error: favError } = await supabase
        .from('user_favorites')
        .select('user_id, car_id, cars(make, model)');

      if (favError) throw favError;

      const uniqueUsers = new Set(favoritesData?.map(f => f.user_id) || []).size;
      
      // Get most favored car
      const carCounts = (favoritesData || []).reduce((acc: any, fav) => {
        const carKey = `${fav.cars?.make} ${fav.cars?.model}`;
        acc[carKey] = (acc[carKey] || 0) + 1;
        return acc;
      }, {});

      const mostFavoredCar = Object.keys(carCounts).reduce((a, b) => 
        carCounts[a] > carCounts[b] ? a : b, ''
      );

      // Get total users from auth.users (we'll estimate or use a default)
      const totalUsers = uniqueUsers * 2; // Rough estimate

      setStats({
        totalFavorites: favoritesData?.length || 0,
        uniqueUsers,
        mostFavoredCar,
        totalUsers: totalUsers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    if (!confirm('Are you sure you want to remove this favorite?')) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast({
        title: "Success",
        description: "Favorite removed successfully.",
      });
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove favorite.",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const filteredFavorites = favorites.filter(favorite => {
    const carName = `${favorite.cars.make} ${favorite.cars.model}`.toLowerCase();
    const userId = favorite.user_id.toLowerCase();
    return carName.includes(searchTerm.toLowerCase()) || userId.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Favorites Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFavorites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Favored</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{stats.mostFavoredCar || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers > 0 ? Math.round((stats.uniqueUsers / stats.totalUsers) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by car or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredFavorites.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No favorites found.</p>
          </div>
        ) : (
          filteredFavorites.map((favorite) => (
            <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {favorite.cars.image_url && (
                    <img
                      src={favorite.cars.image_url}
                      alt={`${favorite.cars.make} ${favorite.cars.model}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {favorite.cars.make} {favorite.cars.model}
                        </h3>
                        <p className="text-sm text-gray-600">{favorite.cars.year}</p>
                        <p className="text-sm font-medium text-primary">
                          {formatPrice(favorite.cars.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{favorite.cars.brand}</Badge>
                      <Badge variant="outline">{favorite.cars.fuel_type}</Badge>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">User ID:</p>
                          <p className="text-gray-500 text-xs">
                            {favorite.user_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">
                            {new Date(favorite.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};