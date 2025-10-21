import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, SUPABASE_FUNCTIONS_URL } from "@/integrations/supabase/client";
import { resolveImageUrl } from '@/lib/imageUtils';
import { formatPrice } from '@/lib/formatPrice';
import { getRepresentativeImages } from '@/components/CarImageCarousel';

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
  description?: string;
}

export const CarManagement = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSupabaseResponse, setLastSupabaseResponse] = useState<any>(null);
  // recently updated IDs to briefly highlight changed cards
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(new Set());
      const [formData, setFormData] = useState({
    brand: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    fuel_type: '',
    body_type: '',
    transmission: '',
    image_url: '',
    images: [] as string[],
    youtube_url: '',
    power_bhp: 0,
    mileage_kmpl: 0,
    description: ''
  });
    const [imageUrls, setImageUrls] = useState<string[]>(['', '', '', '']);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const { toast } = useToast();
  const broadcastChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    fetchCars();

    // Subscribe to realtime changes for cars so admin list stays in sync
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
          } else if (eventType === 'UPDATE') {
            setCars(prev => prev.map(c => (c.id === newRow.id ? newRow : c)));
          } else if (eventType === 'DELETE') {
            setCars(prev => prev.filter(c => c.id !== oldRow.id));
          }
        } catch (err) {
          console.warn('Realtime payload handling error (admin):', err);
        }
      })
      .subscribe();

    return () => {
      try {
        channel.unsubscribe();
      } catch (err) {
        // ignore
      }
    };
  }, []);

  // Establish a broadcast channel once so we can reliably send events
  useEffect(() => {
    const ch = supabase
      .channel('cars-updates')
      .subscribe();
    broadcastChannelRef.current = ch;
    return () => {
      try { ch.unsubscribe(); } catch (e) {}
      broadcastChannelRef.current = null;
    };
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

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
      setIsLoading(false);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // sanitize and normalize payload to avoid sending NaN or empty strings
      const buildPayload = (data: any) => {
        const toNumber = (v: any) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : null;
        };

        const payload: any = {
          brand: data.brand || null,
          make: data.make || null,
          model: data.model || null,
          year: toNumber(data.year),
          price: toNumber(data.price),
          fuel_type: data.fuel_type || null,
          body_type: data.body_type || null,
          transmission: data.transmission || null,
                    image_url: data.image_url || null,
          images: data.images || [],
          youtube_url: data.youtube_url || null,
          power_bhp: toNumber(data.power_bhp),
          mileage_kmpl: toNumber(data.mileage_kmpl),
          description: data.description || null,
        };

        return payload;
      };

      const payload = buildPayload(formData);

      if (editingCar) {
        // optimistic update locally
        const updatedLocal = { ...editingCar, ...payload } as Car;
        setCars(prev => prev.map(c => (c.id === editingCar.id ? updatedLocal : c)));

        // Always use direct Supabase client (simpler and works with RLS)
        const res = await supabase
          .from('cars')
          .update(payload)
          .eq('id', editingCar.id)
          .select();
        
        console.debug('Supabase update response:', res);
        setLastSupabaseResponse(res);
        
        if (res.error) throw res.error;
        
        const serverRow = Array.isArray(res.data) ? res.data[0] : res.data;

        if (serverRow) {
          // replace local with server-returned row
          setCars(prev => prev.map(c => (c.id === serverRow.id ? serverRow : c)));
          // double-check canonical row from DB to avoid stale values from function
          try {
            const { data: fresh } = await supabase
              .from('cars')
              .select('*')
              .eq('id', serverRow.id)
              .single();
            if (fresh) {
              setCars(prev => prev.map(c => (c.id === fresh.id ? fresh : c)));
            }
          } catch (_) {}
          markRecentlyUpdated(serverRow.id);
          toast({ title: "Success", description: "Car updated successfully." });
          try { await broadcastChannelRef.current?.send({ type: 'broadcast', event: 'cars-updated', payload: { id: serverRow.id, action: 'update' } }); } catch (e) {}
          try { localStorage.setItem('cars_updated_at', String(Date.now())); } catch (e) {}
        } else {
          // Some setups (RLS / function responses) may not return the updated row.
          // Treat a successful request as success: refetch canonical data and show success toast.
          toast({ title: "Success", description: "Car updated successfully." });
          await fetchCars();
          try { await broadcastChannelRef.current?.send({ type: 'broadcast', event: 'cars-updated', payload: { action: 'update' } }); } catch (e) {}
          try { localStorage.setItem('cars_updated_at', String(Date.now())); } catch (e) {}
        }
            } else {
        // optimistic add with temporary id
        const tempId = `temp-${Date.now()}`;
        const tempCar: any = { id: tempId, ...payload };
        setCars(prev => [tempCar, ...prev]);
        markRecentlyUpdated(tempId);

        // Always use direct Supabase client (simpler and works with RLS)
        const res = await supabase
          .from('cars')
          .insert([payload])
          .select();
        
        console.debug('Supabase insert response:', res);
        setLastSupabaseResponse(res);
        
        if (res.error) throw res.error;
        
        const serverRow = Array.isArray(res.data) ? res.data[0] : res.data;

        if (serverRow) {
          // replace temp entry with server row
          setCars(prev => prev.map(c => (c.id === tempId ? serverRow : c)));
          markRecentlyUpdated(serverRow.id);
          toast({ title: "Success", description: "Car added successfully." });
          try { await broadcastChannelRef.current?.send({ type: 'broadcast', event: 'cars-updated', payload: { id: serverRow.id, action: 'insert' } }); } catch (e) {}
          try { localStorage.setItem('cars_updated_at', String(Date.now())); } catch (e) {}
        } else {
          // If server didn't return the inserted row, refetch full list and consider it success
          toast({ title: "Success", description: "Car added successfully." });
          await fetchCars();
          try { await broadcastChannelRef.current?.send({ type: 'broadcast', event: 'cars-updated', payload: { action: 'insert' } }); } catch (e) {}
          try { localStorage.setItem('cars_updated_at', String(Date.now())); } catch (e) {}
        }
      }

      resetForm();
      setIsAddModalOpen(false);
      setEditingCar(null);
      fetchCars();
    } catch (err) {
      console.error('Error saving car:', err);
      setLastSupabaseResponse(err);
      const message = (err as any)?.message || JSON.stringify(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save car. ${message} (See debug panel in admin for full response)`,
      });
      // rollback by refetching
      fetchCars();
    } finally {
      setIsSaving(false);
    }
  };

    const handleDelete = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    // optimistic remove
    const previous = cars;
    setCars(prev => prev.filter(c => c.id !== carId));
    try {
      // Always use direct Supabase client (simpler and works with RLS)
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Car deleted successfully." });
      try { await broadcastChannelRef.current?.send({ type: 'broadcast', event: 'cars-updated', payload: { id: carId, action: 'delete' } }); } catch (e) {}
      try { localStorage.setItem('cars_updated_at', String(Date.now())); } catch (e) {}
    } catch (err) {
      console.error('Error deleting car:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete car.",
      });
      // rollback
      setCars(previous);
    }
  };

  const markRecentlyUpdated = (id: string) => {
    setRecentlyUpdatedIds(prev => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });
    // remove after 6s
    setTimeout(() => {
      setRecentlyUpdatedIds(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }, 6000);
  };

      const resetForm = () => {
    setFormData({
      brand: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      fuel_type: '',
      body_type: '',
      transmission: '',
      image_url: '',
      images: [],
      youtube_url: '',
      power_bhp: 0,
      mileage_kmpl: 0,
      description: ''
    });
    setImageUrls(['', '', '', '']);
  };

  const openEditModal = (car: any) => {
    setEditingCar(car);
            setFormData({
      brand: car.brand || '',
      make: car.make || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      price: car.price || 0,
      fuel_type: car.fuel_type || '',
      body_type: car.body_type || '',
      transmission: car.transmission || '',
      image_url: car.image_url || '',
      images: car.images || [],
      youtube_url: car.youtube_url || '',
      power_bhp: car.power_bhp || 0,
      mileage_kmpl: car.mileage_kmpl || 0,
      description: car.description || ''
    });
    const carImages = car.images || [];
    setImageUrls([
      carImages[0] || '',
      carImages[1] || '',
      carImages[2] || '',
      carImages[3] || ''
    ]);
    setIsAddModalOpen(true);
  };

  const filteredCars = cars.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // use shared formatPrice

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Car Management</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Car
            </Button>
          </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="car-form-description">
            <DialogHeader>
              <DialogTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
              <DialogDescription id="car-form-description">
                {editingCar ? 'Update the car details below.' : 'Fill in the details to add a new car to the inventory.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value === '' ? new Date().getFullYear() : parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fuel_type">Fuel Type</Label>
                  <Select value={formData.fuel_type} onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="CNG">CNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="body_type">Body Type</Label>
                  <Select value={formData.body_type} onValueChange={(value) => setFormData({ ...formData, body_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Convertible">Convertible</SelectItem>
                      <SelectItem value="Wagon">Wagon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                      <SelectItem value="AMT">AMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="power_bhp">Power (BHP)</Label>
                  <Input
                    id="power_bhp"
                    type="number"
                    value={formData.power_bhp}
                    onChange={(e) => setFormData({ ...formData, power_bhp: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="mileage_kmpl">Mileage (km/l)</Label>
                  <Input
                    id="mileage_kmpl"
                    type="number"
                    step="0.1"
                    value={formData.mileage_kmpl}
                    onChange={(e) => setFormData({ ...formData, mileage_kmpl: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                  />
                </div>
              </div>

                                                        <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Car Images (4 images)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUseUrlInput(!useUrlInput)}
                  >
                    {useUrlInput ? 'Switch to Upload' : 'Use URLs Instead'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {useUrlInput ? 'Paste image URLs (if already uploaded to Supabase)' : 'Upload 4 images: Main (Card Thumbnail), Side, Front, Rear (Max 5MB each)'}
                </p>
                {isUploadingImage && (
                  <p className="text-xs text-blue-600 mb-2">Uploading image, please wait...</p>
                )}
                {!useUrlInput && (
                  <p className="text-xs text-red-600 mb-2">
                    ⚠️ If upload fails, click "Use URLs Instead" and paste image URLs manually
                  </p>
                )}
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                      <Label htmlFor={`image-${index}`} className="text-xs font-semibold">
                        Image {index + 1} {index === 0 ? '(Main/Thumbnail - Shows on card)' : index === 1 ? '(Side View)' : index === 2 ? '(Front View)' : '(Rear/Back View)'}
                      </Label>
                                            <div className="flex gap-2">
                        {useUrlInput ? (
                          <Input
                            id={`image-url-${index}`}
                            type="text"
                            placeholder="https://your-project.supabase.co/storage/v1/object/public/lovable-uploads/car-images/..."
                            value={imageUrls[index]}
                            onChange={(e) => {
                              const newImageUrls = [...imageUrls];
                              newImageUrls[index] = e.target.value;
                              setImageUrls(newImageUrls);
                              
                              const validImages = newImageUrls.filter(url => url !== '');
                              setFormData(prev => ({ 
                                ...prev, 
                                images: validImages,
                                image_url: validImages[0] || prev.image_url
                              }));
                            }}
                          />
                        ) : (
                          <Input
                            id={`image-${index}`}
                            type="file"
                            accept="image/*"
                                                    onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            // Validate file
                            if (!file.type.startsWith('image/')) {
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description: "Please select an image file.",
                              });
                              return;
                            }

                            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description: "Image size must be less than 5MB.",
                              });
                              return;
                            }
                            
                            setIsUploadingImage(true);
                            try {
                              const fileExt = file.name.split('.').pop();
                              const safeBrand = (formData.brand || 'car').replace(/[^a-zA-Z0-9]/g, '_');
                              const safeModel = (formData.model || 'model').replace(/[^a-zA-Z0-9]/g, '_');
                              const fileName = `${safeBrand}_${safeModel}_${index + 1}_${Date.now()}.${fileExt}`;
                              const filePath = `car-images/${fileName}`;

                              console.log('Uploading to:', filePath);

                              const { data, error: uploadError } = await supabase.storage
                                .from('lovable-uploads')
                                .upload(filePath, file, { 
                                  cacheControl: '3600',
                                  upsert: true 
                                });

                              if (uploadError) {
                                console.error('Upload error:', uploadError);
                                throw uploadError;
                              }

                              console.log('Upload successful:', data);

                              const { data: { publicUrl } } = supabase.storage
                                .from('lovable-uploads')
                                .getPublicUrl(filePath);

                              console.log('Public URL:', publicUrl);

                              const newImageUrls = [...imageUrls];
                              newImageUrls[index] = publicUrl;
                              setImageUrls(newImageUrls);
                              
                              const validImages = newImageUrls.filter(url => url !== '');
                              setFormData(prev => ({ 
                                ...prev, 
                                images: validImages,
                                image_url: validImages[0] || prev.image_url
                              }));

                              toast({
                                title: "Success",
                                description: `Image ${index + 1} uploaded successfully.`,
                              });
                                                        } catch (error: any) {
                              console.error('Error uploading image:', error);
                              console.error('Error details:', {
                                message: error.message,
                                statusCode: error.statusCode,
                                error: error.error,
                                details: error
                              });
                              
                              let errorMsg = "Failed to upload image.";
                              if (error.message?.includes('new row violates row-level security')) {
                                errorMsg = "Storage permission denied. Run fix_storage_permissions.sql in Supabase.";
                              } else if (error.message?.includes('bucket')) {
                                errorMsg = "Storage bucket not found. Check Supabase storage settings.";
                              } else if (error.message) {
                                errorMsg = error.message;
                              }
                              
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description: errorMsg,
                              });
                            } finally {
                              setIsUploadingImage(false);
                            }
                                                    }}
                          className="flex-1"
                        />
                        )}
                        {imageUrls[index] && (
                          <img 
                            src={imageUrls[index]} 
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="youtube_url">YouTube Video URL (Embed)</Label>
                <Input
                  id="youtube_url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use embed URL format: https://www.youtube.com/embed/VIDEO_ID
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCar(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (editingCar ? 'Updating...' : 'Adding...') : (editingCar ? 'Update Car' : 'Add Car')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredCars.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No cars found.</p>
          </div>
        ) : (
          filteredCars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {(() => {
                  // Prefer explicit image_url, then first image from images[], then representative generated images
                  let imageSrc = '';
                  if (car.image_url && car.image_url.trim() !== '') {
                    imageSrc = resolveImageUrl(car.image_url);
                  } else if (car.images && car.images.length > 0) {
                    // images in DB may be stored as paths like '/src/assets/...'
                    imageSrc = resolveImageUrl(car.images[0]);
                  } else {
                    const reps = getRepresentativeImages(`${car.make} ${car.model}`, car.images || []);
                    if (reps && reps.length > 0) imageSrc = reps[0];
                  }

                  return imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={`${car.make} ${car.model}`}
                      className={`w-full h-32 object-cover rounded mb-4 ${recentlyUpdatedIds.has(car.id) ? 'ring-2 ring-emerald-400' : ''}`}
                    />
                  ) : null;
                })()}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{car.brand}</Badge>
                    <Badge variant="outline">{car.fuel_type}</Badge>
                    <Badge variant="outline">{car.year}</Badge>
                  </div>
                  <p className="font-bold text-primary text-lg">{formatPrice(car.price)}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    {car.power_bhp && <span>{car.power_bhp} BHP</span>}
                    {car.mileage_kmpl && <span>{car.mileage_kmpl} km/l</span>}
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(car)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(car.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Debug panel - only show on localhost to avoid leaking sensitive info in prod */}
      {typeof window !== 'undefined' && window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
        <div className="fixed right-4 bottom-4 w-96 max-h-60 overflow-auto bg-white border rounded p-3 shadow-lg z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Debug: last Supabase response</div>
            <button className="text-sm text-gray-500" onClick={() => setLastSupabaseResponse(null)}>Clear</button>
          </div>
          {lastSupabaseResponse ? (
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(lastSupabaseResponse, null, 2)}</pre>
          ) : (
            <div className="text-sm text-gray-500">No response captured yet. Try saving a car.</div>
          )}
        </div>
      )}
    </div>
  );
};