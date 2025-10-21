import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Eye, 
  UserX,
  UserCheck,
  Trash2,
  Clock,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  banned_until: string | null;
}

interface UserWithStats extends User {
  favorites_count: number;
  inquiries_count: number;
  status: 'active' | 'inactive';
}

interface UserStats {
  total: number;
  active: number;
  new_this_month: number;
  with_favorites: number;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, new_this_month: 0, with_favorites: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [userInquiries, setUserInquiries] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    
    // Real-time subscription for user changes
    const usersChannel = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_favorites'
        },
        () => {
          fetchUsers(); // Refresh when favorites change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      // Get all users from auth.users
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.log('Cannot fetch auth users (requires service role). Using fallback method.');
        // Fallback: Get users from user_favorites and inquiries
        await fetchUsersFromActivities();
        return;
      }

      // Get favorites count for each user
      const { data: favoritesData } = await supabase
        .from('user_favorites')
        .select('user_id');

      // Get inquiries count (by email)
      const { data: inquiriesData } = await supabase
        .from('inquiries')
        .select('email');

      // Combine data
      const usersWithStats: UserWithStats[] = authUsers.map(user => {
        const favCount = favoritesData?.filter(f => f.user_id === user.id).length || 0;
        const inquiryCount = inquiriesData?.filter(i => i.email === user.email).length || 0;
        
        // Determine if active (logged in within last 30 days)
        const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const isActive = lastSignIn ? lastSignIn > thirtyDaysAgo : false;

        return {
          id: user.id,
          email: user.email || 'No email',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          banned_until: user.banned_until,
          favorites_count: favCount,
          inquiries_count: inquiryCount,
          status: isActive ? 'active' : 'inactive'
        };
      });

      setUsers(usersWithStats);
      calculateStats(usersWithStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Using fallback data.",
      });
      // Use fallback
      await fetchUsersFromActivities();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersFromActivities = async () => {
    // Fallback: Create user list from user_favorites and inquiries
    try {
      const { data: favoritesData } = await supabase
        .from('user_favorites')
        .select('user_id, created_at');

      const { data: inquiriesData } = await supabase
        .from('inquiries')
        .select('email, created_at');

      // Get unique users from favorites
      const uniqueUserIds = [...new Set(favoritesData?.map(f => f.user_id) || [])];
      
      // Create a map of user emails from inquiries if available
      // Note: This is a best-effort approach since we can't access auth.users
      const emailMap = new Map<string, string>();
      
      // Try to get user email from inquiries by matching timestamps or patterns
      // Since we don't have a direct user_id->email mapping, we'll use placeholder
      
      const usersWithStats: UserWithStats[] = uniqueUserIds.map(userId => {
        const userFavs = favoritesData?.filter(f => f.user_id === userId) || [];
        const oldestFav = userFavs.length > 0 ? userFavs[userFavs.length - 1].created_at : new Date().toISOString();
        
        // Check if we can find an inquiry email that might match this user
        // This is approximate - we can't perfectly match without auth access
        const possibleInquiry = inquiriesData?.find(() => false); // Removed the incorrect matching logic
        
        // Format email or show placeholder
        const userEmail = possibleInquiry?.email || `user-${userId.slice(0, 8)}@system.local`;
        
        // Count inquiries (this won't be accurate without email matching)
        const inquiriesCount = 0;
        
        return {
          id: userId,
          email: userEmail,
          created_at: oldestFav,
          last_sign_in_at: null,
          email_confirmed_at: null,
          banned_until: null,
          favorites_count: userFavs.length,
          inquiries_count: inquiriesCount,
          status: 'active' as const
        };
      });

      // Also add users from inquiries who might not have favorites
      const inquiryEmails = [...new Set(inquiriesData?.map(i => i.email) || [])];
      const existingEmails = new Set(usersWithStats.map(u => u.email));
      
      inquiryEmails.forEach(email => {
        if (!existingEmails.has(email)) {
          const userInquiries = inquiriesData?.filter(i => i.email === email) || [];
          const oldestInquiry = userInquiries.length > 0 ? userInquiries[userInquiries.length - 1].created_at : new Date().toISOString();
          
          usersWithStats.push({
            id: `inquiry-${email.split('@')[0]}-${Date.now()}`,
            email: email,
            created_at: oldestInquiry,
            last_sign_in_at: null,
            email_confirmed_at: null,
            banned_until: null,
            favorites_count: 0,
            inquiries_count: userInquiries.length,
            status: 'active' as const
          });
        }
      });

      setUsers(usersWithStats);
      calculateStats(usersWithStats);
    } catch (error) {
      console.error('Error in fallback:', error);
    }
  };

  const calculateStats = (usersList: UserWithStats[]) => {
    const total = usersList.length;
    const active = usersList.filter(u => u.status === 'active').length;
    
    // New users this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = usersList.filter(u => new Date(u.created_at) >= firstDayOfMonth).length;
    
    // Users with favorites
    const withFavorites = usersList.filter(u => u.favorites_count > 0).length;

    setStats({
      total,
      active,
      new_this_month: newThisMonth,
      with_favorites: withFavorites
    });
  };

  const viewUserDetails = async (user: UserWithStats) => {
    setSelectedUser(user);
    
    // Fetch user's favorites
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        cars (
          id,
          make,
          model,
          year,
          price,
          image_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setUserFavorites(favorites || []);

    // Fetch user's inquiries
    const { data: inquiries } = await supabase
      .from('inquiries')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false });

    setUserInquiries(inquiries || []);
    setIsViewModalOpen(true);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will remove all their data including favorites.')) {
      return;
    }

    try {
      // Delete user's favorites
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId);

      // Try to delete from auth (requires service role)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. You may need service role permissions.",
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      // This would require admin API to ban/unban users
      // For now, just show a message
      toast({
        title: "Info",
        description: "User status management requires additional setup with service role.",
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Logged in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.new_this_month}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Favorites</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.with_favorites}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by email or user ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No users found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          {user.email || 'No email available'}
                        </h3>
                        <p className="text-xs text-gray-500">ID: {user.id.slice(0, 16)}...</p>
                      </div>
                      <Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                        {user.status === 'active' ? (
                          <span className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <UserX className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{user.favorites_count} Favorites</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span>{user.inquiries_count} Inquiries</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                      {user.last_sign_in_at && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Last seen {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewUserDetails(user)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View User Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="user-details-description">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription id="user-details-description">
              View detailed information about this user including their favorites and inquiries.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div className="md:col-span-2">
                  <Label className="text-gray-600">Email Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${selectedUser.email}`} className="font-medium text-primary hover:underline">
                      {selectedUser.email}
                    </a>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">User ID</Label>
                  <p className="font-mono text-sm mt-1">{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">
                    <Badge className={selectedUser.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                      {selectedUser.status === 'active' ? (
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserX className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Joined</Label>
                  <p className="font-medium mt-1">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Last Sign In</Label>
                  <p className="font-medium mt-1">
                    {selectedUser.last_sign_in_at 
                      ? new Date(selectedUser.last_sign_in_at).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Total Favorites</Label>
                  <p className="font-medium text-red-500 mt-1 flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {selectedUser.favorites_count}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Total Inquiries</Label>
                  <p className="font-medium text-blue-500 mt-1 flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {selectedUser.inquiries_count}
                  </p>
                </div>
              </div>

              {/* User Favorites */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Favorite Cars ({userFavorites.length})
                </h3>
                {userFavorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No favorites yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userFavorites.map((fav: any) => (
                      <Card key={fav.id}>
                        <CardContent className="p-3 flex gap-3">
                          {fav.cars?.image_url && (
                            <img 
                              src={fav.cars.image_url} 
                              alt={`${fav.cars.make} ${fav.cars.model}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{fav.cars?.make} {fav.cars?.model}</p>
                            <p className="text-sm text-gray-600">{fav.cars?.year}</p>
                            <p className="text-xs text-gray-500">
                              Added {new Date(fav.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* User Inquiries */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Inquiries ({userInquiries.length})
                </h3>
                {userInquiries.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No inquiries submitted</p>
                ) : (
                  <div className="space-y-3">
                    {userInquiries.map((inquiry: any) => (
                      <Card key={inquiry.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{inquiry.car_brand}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(inquiry.created_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge>{inquiry.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{inquiry.message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};