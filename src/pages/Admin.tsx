import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, User, Heart, Settings, LogOut, BarChart3, MessageSquare, FileEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarManagement } from "@/components/admin/CarManagement";
import { UserFavoritesManagement } from "@/components/admin/UserFavoritesManagement";
import { InquiriesManagement } from "@/components/admin/InquiriesManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { CarNewsManagement } from "@/components/admin/CarNewsManagement";
import { Analytics } from "@/components/admin/Analytics";

interface DashboardStats {
  totalCars: number;
  totalUsers: number;
  totalFavorites: number;
  totalInquiries: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'dashboard' | 'cars' | 'favorites' | 'inquiries' | 'users' | 'news' | 'analytics'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalUsers: 0,
    totalFavorites: 0,
    totalInquiries: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    // Check if user has admin session
    const adminSession = localStorage.getItem('admin_authenticated');
    if (!adminSession) {
      navigate('/');
      return;
    }
    
    // Fetch dashboard stats
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // Get total cars
      const { count: carsCount } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });

      // Get total favorites
      const { count: favoritesCount } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true });

      // Get total inquiries
      const { count: inquiriesCount } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true });

      // Get unique users from favorites (as we can't access auth.users without service role)
      const { data: favoritesData } = await supabase
        .from('user_favorites')
        .select('user_id');

      const uniqueUsers = new Set(favoritesData?.map(f => f.user_id) || []).size;

      setStats({
        totalCars: carsCount || 0,
        totalUsers: uniqueUsers,
        totalFavorites: favoritesCount || 0,
        totalInquiries: inquiriesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('admin_authenticated');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'cars':
        return <CarManagement />;
      case 'favorites':
        return <UserFavoritesManagement />;
      case 'inquiries':
        return <InquiriesManagement />;
      case 'users':
        return <UserManagement />;
      case 'news':
        return <CarNewsManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats ? '...' : stats.totalCars}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total cars in inventory
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats ? '...' : stats.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Registered users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats ? '...' : stats.totalFavorites}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total favorites
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveView('inquiries')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats ? '...' : stats.totalInquiries}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customer inquiries
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('cars')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Manage Cars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Add, edit, or remove car listings</p>
                  <Button className="w-full">View Cars</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('users')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage user accounts and profiles</p>
                  <Button className="w-full">View Users</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('analytics')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">View platform analytics and insights</p>
                  <Button className="w-full">View Analytics</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('favorites')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    User Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track user favorite cars and trends</p>
                  <Button className="w-full">View Favorites</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('inquiries')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">View and manage customer inquiries</p>
                  <Button className="w-full">View Inquiries</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('news')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileEdit className="h-5 w-5" />
                    Car News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Create and manage car news articles</p>
                  <Button className="w-full">Manage News</Button>
                </CardContent>
              </Card>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {activeView !== 'dashboard' && (
              <Button variant="outline" onClick={() => setActiveView('dashboard')}>
                ← Back to Dashboard
              </Button>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {activeView === 'cars' ? 'Car Management' : 
                 activeView === 'favorites' ? 'User Favorites' : 
                 activeView === 'inquiries' ? 'Inquiries Management' :
                 activeView === 'users' ? 'User Management' :
                 activeView === 'news' ? 'Car News Management' :
                 activeView === 'analytics' ? 'Analytics Dashboard' : 'Admin Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">Manage Motoren Klaro platform</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
