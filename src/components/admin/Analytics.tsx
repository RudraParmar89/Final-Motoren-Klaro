import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Heart, 
  MessageSquare, 
  Eye,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalyticsData {
  // Cars Analytics
  totalCars: number;
  carsByBrand: { brand: string; count: number }[];
  carsByFuelType: { fuel_type: string; count: number }[];
  carsByPriceRange: { range: string; count: number }[];
  mostExpensiveCar: any;
  cheapestCar: any;
  
  // User Analytics
  totalUsers: number;
  totalFavorites: number;
  avgFavoritesPerUser: number;
  mostFavoritedCars: any[];
  
  // Inquiries Analytics
  totalInquiries: number;
  inquiriesByStatus: { status: string; count: number }[];
  recentInquiries: any[];
  
  // News Analytics
  totalArticles: number;
  articlesByCategory: { category: string; count: number }[];
  featuredArticles: number;
}

export const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch Cars Data
      const { data: cars, error: carsError } = await supabase
        .from('cars')
        .select('*');

      if (carsError) throw carsError;

      // Fetch Favorites Data
      const { data: favorites, error: favError } = await supabase
        .from('user_favorites')
        .select('*, cars(*)');

      if (favError) throw favError;

      // Fetch Inquiries Data
      const { data: inquiries, error: inqError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (inqError) throw inqError;

      // Fetch News Data
      const { data: articles, error: newsError } = await supabase
        .from('car_news')
        .select('*');

      if (newsError) console.log('News table might not exist yet');

      // Process Cars Analytics
      const carsByBrand = processGroupBy(cars || [], 'brand');
      const carsByFuelType = processGroupBy(cars || [], 'fuel_type');
      const carsByPriceRange = processPriceRanges(cars || []);
      
      const sortedByPrice = [...(cars || [])].sort((a, b) => b.price - a.price);
      const mostExpensiveCar = sortedByPrice[0];
      const cheapestCar = sortedByPrice[sortedByPrice.length - 1];

      // Process Favorites Analytics
      const uniqueUsers = new Set((favorites || []).map(f => f.user_id)).size;
      const favCount = favorites?.length || 0;
      const avgFavorites = uniqueUsers > 0 ? (favCount / uniqueUsers).toFixed(1) : '0';

      // Most favorited cars
      const carFavCounts: Record<string, { car: any; count: number }> = {};
      favorites?.forEach(fav => {
        if (fav.cars) {
          const carId = fav.cars.id;
          if (!carFavCounts[carId]) {
            carFavCounts[carId] = { car: fav.cars, count: 0 };
          }
          carFavCounts[carId].count++;
        }
      });
      const mostFavoritedCars = Object.values(carFavCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Process Inquiries Analytics
      const inquiriesByStatus = processGroupBy(inquiries || [], 'status');

      // Process News Analytics
      const articlesByCategory = processGroupBy(articles || [], 'category');
      const featuredCount = articles?.filter(a => a.is_featured).length || 0;

      setData({
        // Cars
        totalCars: cars?.length || 0,
        carsByBrand,
        carsByFuelType,
        carsByPriceRange,
        mostExpensiveCar,
        cheapestCar,
        
        // Users & Favorites
        totalUsers: uniqueUsers,
        totalFavorites: favCount,
        avgFavoritesPerUser: parseFloat(avgFavorites),
        mostFavoritedCars,
        
        // Inquiries
        totalInquiries: inquiries?.length || 0,
        inquiriesByStatus,
        recentInquiries: inquiries || [],
        
        // News
        totalArticles: articles?.length || 0,
        articlesByCategory,
        featuredArticles: featuredCount,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processGroupBy = (items: any[], key: string) => {
    const grouped: Record<string, number> = {};
    items.forEach(item => {
      const value = item[key] || 'Unknown';
      grouped[value] = (grouped[value] || 0) + 1;
    });
    return Object.entries(grouped)
      .map(([name, count]) => ({ [key]: name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const processPriceRanges = (cars: any[]) => {
    const ranges = [
      { range: 'Under ₹10L', min: 0, max: 1000000 },
      { range: '₹10L - ₹20L', min: 1000000, max: 2000000 },
      { range: '₹20L - ₹40L', min: 2000000, max: 4000000 },
      { range: '₹40L - ₹60L', min: 4000000, max: 6000000 },
      { range: '₹60L - ₹1Cr', min: 6000000, max: 10000000 },
      { range: 'Above ₹1Cr', min: 10000000, max: Infinity },
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: cars.filter(car => car.price >= min && car.price < max).length,
    }));
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-2">Platform insights and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCars}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs text-muted-foreground">With favorites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalFavorites}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {data.avgFavoritesPerUser} per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">Customer inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cars by Brand - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cars by Brand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.carsByBrand.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cars by Fuel Type - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Cars by Fuel Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.carsByFuelType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ fuel_type, percent }: any) => `${fuel_type}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.carsByFuelType.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Price Ranges - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cars by Price Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.carsByPriceRange}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Most Expensive & Cheapest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.mostExpensiveCar && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Most Expensive Car
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {data.mostExpensiveCar.image_url && (
                  <img 
                    src={data.mostExpensiveCar.image_url} 
                    alt={`${data.mostExpensiveCar.make} ${data.mostExpensiveCar.model}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-bold text-lg">
                    {data.mostExpensiveCar.make} {data.mostExpensiveCar.model}
                  </p>
                  <p className="text-sm text-gray-600">{data.mostExpensiveCar.year}</p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatPrice(data.mostExpensiveCar.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {data.cheapestCar && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-500" />
                Most Affordable Car
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {data.cheapestCar.image_url && (
                  <img 
                    src={data.cheapestCar.image_url} 
                    alt={`${data.cheapestCar.make} ${data.cheapestCar.model}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-bold text-lg">
                    {data.cheapestCar.make} {data.cheapestCar.model}
                  </p>
                  <p className="text-sm text-gray-600">{data.cheapestCar.year}</p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatPrice(data.cheapestCar.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Most Favorited Cars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Most Favorited Cars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.mostFavoritedCars.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No favorites yet</p>
            ) : (
              data.mostFavoritedCars.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.car.image_url && (
                      <img 
                        src={item.car.image_url} 
                        alt={`${item.car.make} ${item.car.model}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold">
                        {item.car.make} {item.car.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.car.year} • {formatPrice(item.car.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span className="font-bold text-lg">{item.count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Status - Horizontal Bar Chart */}
      {data.inquiriesByStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Inquiries by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.inquiriesByStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b">
                  {data.inquiriesByStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#10b981', '#6b7280'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* News Analytics */}
      {data.totalArticles > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                News Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Articles:</span>
                  <span className="font-bold">{data.totalArticles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-bold">{data.featuredArticles}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Articles by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.articlesByCategory.map((item: any, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.category}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
