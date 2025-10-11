import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  description?: string;
}

export const CarManagement = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
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
    power_bhp: 0,
    mileage_kmpl: 0,
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
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
    
    try {
      if (editingCar) {
        const { error } = await supabase
          .from('cars')
          .update(formData)
          .eq('id', editingCar.id);

        if (error) throw error;
        toast({ title: "Success", description: "Car updated successfully." });
      } else {
        const { error } = await supabase
          .from('cars')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Success", description: "Car added successfully." });
      }

      resetForm();
      setIsAddModalOpen(false);
      setEditingCar(null);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save car.",
      });
    }
  };

  const handleDelete = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;
      
      toast({ title: "Success", description: "Car deleted successfully." });
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete car.",
      });
    }
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
      power_bhp: 0,
      mileage_kmpl: 0,
      description: ''
    });
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
      power_bhp: car.power_bhp || 0,
      mileage_kmpl: car.mileage_kmpl || 0,
      description: car.description || ''
    });
    setIsAddModalOpen(true);
  };

  const filteredCars = cars.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
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
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, power_bhp: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="mileage_kmpl">Mileage (km/l)</Label>
                  <Input
                    id="mileage_kmpl"
                    type="number"
                    step="0.1"
                    value={formData.mileage_kmpl}
                    onChange={(e) => setFormData({ ...formData, mileage_kmpl: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/car-image.jpg"
                />
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
                <Button type="submit">
                  {editingCar ? 'Update Car' : 'Add Car'}
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
                {car.image_url && (
                  <img
                    src={car.image_url}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                )}
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
    </div>
  );
};