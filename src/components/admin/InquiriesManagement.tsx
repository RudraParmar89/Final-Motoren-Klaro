import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Mail, Phone, Car, Clock, CheckCircle, XCircle, MessageSquare, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  car_brand: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  notes?: string;
}

interface InquiryStats {
  total: number;
  new: number;
  contacted: number;
  resolved: number;
}

export const InquiriesManagement = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats>({ total: 0, new: 0, contacted: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
    
    // Real-time subscription
    const inquiriesChannel = supabase
      .channel('inquiries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inquiries'
        },
        (payload) => {
          console.log('Inquiry changed:', payload);
          fetchInquiries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inquiriesChannel);
    };
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInquiries(data || []);
      
      // Calculate stats
      const newCount = data?.filter(i => i.status === 'new').length || 0;
      const contactedCount = data?.filter(i => i.status === 'contacted').length || 0;
      const resolvedCount = data?.filter(i => i.status === 'resolved').length || 0;
      
      setStats({
        total: data?.length || 0,
        new: newCount,
        contacted: contactedCount,
        resolved: resolvedCount
      });
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load inquiries.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId);

      if (error) throw error;

      setInquiries(prev => 
        prev.map(inq => inq.id === inquiryId ? { ...inq, status: newStatus as any } : inq)
      );
      
      toast({
        title: "Success",
        description: "Status updated successfully.",
      });
      
      fetchInquiries(); // Refresh to update stats
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    }
  };

  const saveNotes = async () => {
    if (!selectedInquiry) return;
    
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ notes })
        .eq('id', selectedInquiry.id);

      if (error) throw error;

      setInquiries(prev => 
        prev.map(inq => inq.id === selectedInquiry.id ? { ...inq, notes } : inq)
      );
      
      toast({
        title: "Success",
        description: "Notes saved successfully.",
      });
      
      setIsViewModalOpen(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notes.",
      });
    }
  };

  const viewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
    setIsViewModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <Phone className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inquiry.name.toLowerCase().includes(searchLower) ||
      inquiry.email.toLowerCase().includes(searchLower) ||
      inquiry.car_brand?.toLowerCase().includes(searchLower) ||
      inquiry.message.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inquiries Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <Phone className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.contacted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, car brand, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredInquiries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No inquiries found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                      <Badge className={`${getStatusColor(inquiry.status)} text-white`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${inquiry.email}`} className="hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${inquiry.phone}`} className="hover:underline">
                          {inquiry.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car className="h-4 w-4" />
                        {inquiry.car_brand || 'Not specified'}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {inquiry.message}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(inquiry.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => updateStatus(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewInquiry(inquiry)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View/Edit Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="inquiry-modal-description">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription id="inquiry-modal-description">
              View and manage customer inquiry details and status.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <Label>Car Brand</Label>
                  <p className="font-medium">{selectedInquiry.car_brand || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <Label>Phone</Label>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>
              
              <div>
                <Label>Message</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded">{selectedInquiry.message}</p>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(value) => updateStatus(selectedInquiry.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this inquiry..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Submitted: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
                <span>Updated: {new Date(selectedInquiry.updated_at).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={saveNotes}>
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};