import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { CarComparison } from "./CarComparison";
import { supabase } from "@/integrations/supabase/client";

interface CarSelection {
  make: string;
  model: string;
}

const ComparisonSection = () => {
  const [selectedCars, setSelectedCars] = useState<CarSelection[]>([
    { make: "", model: "" },
    { make: "", model: "" },
    { make: "", model: "" }
  ]);
  const [showComparison, setShowComparison] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<{[brand: string]: string[]}>({});

  useEffect(() => {
    fetchBrandsAndModels();
  }, []);

  const fetchBrandsAndModels = async () => {
    try {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('brand, model');

      if (error) {
        console.error('Error fetching cars:', error);
        return;
      }

      // Get unique brands (no filtering - show all brands)
      const brands = [...new Set(cars?.map(car => car.brand) || [])].sort();
      setAvailableBrands(brands);

      // Group models by brand
      const modelsByBrand: {[brand: string]: string[]} = {};
      cars?.forEach(car => {
        if (!modelsByBrand[car.brand]) {
          modelsByBrand[car.brand] = [];
        }
        if (!modelsByBrand[car.brand].includes(car.model)) {
          modelsByBrand[car.brand].push(car.model);
        }
      });

      // Sort models for each brand
      Object.keys(modelsByBrand).forEach(brand => {
        modelsByBrand[brand].sort();
      });

      setAvailableModels(modelsByBrand);
    } catch (error) {
      console.error('Error fetching brands and models:', error);
    }
  };

  const updateCarSelection = (index: number, field: 'make' | 'model', value: string) => {
    const newSelection = [...selectedCars];
    if (field === 'make') {
      // Reset model when brand changes
      newSelection[index] = { make: value, model: "" };
    } else {
      newSelection[index] = { ...newSelection[index], [field]: value };
    }
    setSelectedCars(newSelection);
  };

  const isComparisonReady = selectedCars.some(car => car.make && car.model);

  return (
    <>
      <div className="relative z-10 bg-white py-16 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-3 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              Compare Cars
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Compare Cars Side by Side
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Make informed decisions by comparing specifications, features, and pricing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {["first", "second", "third"].map((carPosition, index) => (
              <motion.div
                key={carPosition}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Car Image Section */}
                <div className="relative h-64 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src={
                        index === 0 ? "/lovable-uploads/e7e8edae-1561-44e7-9f59-7b88a4009c67.png" :
                        index === 1 ? "/lovable-uploads/c637c340-31fb-4297-b74f-d7b224b6265b.png" :
                        "/lovable-uploads/55090973-0e91-47bf-97c2-2d0d974886ad.png"
                      }
                      alt={`${carPosition} car comparison`}
                      className="w-4/5 h-auto max-h-48 object-contain filter brightness-110"
                    />
                  </div>
                </div>
                
                {/* Car Selection Form */}
                <div className="p-6 space-y-6">
                  <h3 className="text-2xl font-bold text-foreground capitalize">
                    Add {carPosition} car
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Make Selection */}
                    <div className="space-y-2">
                      <Label htmlFor={`make-${carPosition}`} className="text-sm font-medium text-muted-foreground">
                        Brand
                      </Label>
                      <Select value={selectedCars[index].make} onValueChange={(value) => updateCarSelection(index, 'make', value)}>
                        <SelectTrigger className="w-full h-12 border-input bg-background">
                          <SelectValue placeholder="Choose a make" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Model Selection */}
                    <div className="space-y-2">
                      <Label htmlFor={`model-${carPosition}`} className="text-sm font-medium text-muted-foreground">
                        Model
                      </Label>
                       <Select 
                         value={selectedCars[index].model} 
                         onValueChange={(value) => updateCarSelection(index, 'model', value)}
                         disabled={!selectedCars[index].make}
                       >
                         <SelectTrigger className="w-full h-12 border-input bg-background">
                           <SelectValue placeholder={selectedCars[index].make ? "Choose a model" : "Select a brand first"} />
                         </SelectTrigger>
                         <SelectContent>
                           {selectedCars[index].make && availableModels[selectedCars[index].make]?.map((model) => (
                             <SelectItem key={model} value={model}>
                               {model}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 text-base"
              onClick={() => setShowComparison(true)}
              disabled={!isComparisonReady}
            >
              Compare Selected Cars
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <CarComparison 
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        preSelectedCars={selectedCars}
      />
    </>
  );
};

export default ComparisonSection;