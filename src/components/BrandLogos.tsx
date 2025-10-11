import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const BrandLogos = () => {
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableBrands();
  }, []);

  const fetchAvailableBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('make')
        .not('make', 'is', null);
      
      if (error) throw error;
      const uniqueBrands = [...new Set(data.map(car => car.make))].sort();
      setAvailableBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/cars?brand=${encodeURIComponent(brand)}`);
  };

  // Brand logo mapping with actual images
  const getBrandLogo = (brand: string, imgProps?: any) => {
    const brandLogos: { [key: string]: string } = {
      'Suzuki': '/lovable-uploads/45ef892c-5e7c-40f7-b2bd-916cbcd4822b.png',
      'Jaguar': '/lovable-uploads/43a6e75c-4df0-49e9-ae62-312a50cab0af.png',
      'Polaris': '/lovable-uploads/5920705c-b1a7-4d73-88d2-3ee835435b21.png',
      'Tata': '/lovable-uploads/363189f4-ad92-4a74-930a-60b875b9c4d6.png',
      'Kia': '/lovable-uploads/517eb90a-f217-49f5-a815-b146a171935b.png',
      'Ferrari': '/lovable-uploads/c89a4887-1462-4690-a1e1-dbd67530bea5.png',
      'BMW': '/lovable-uploads/a1d085fc-9a1c-42eb-b848-2d8ddb9a258a.png',
      'MINI': '/lovable-uploads/078699e9-a6bf-4115-b415-e98c9c0d0c5b.png',
      'Land Rover': '/lovable-uploads/0bf99f8d-0753-4dfe-b6af-ddc7c0b73ca3.png',
      'Range Rover': '/lovable-uploads/b4cbecf5-78f3-4ec3-95db-8c8b5f14ab53.png'
    };

    const logoUrl = brandLogos[brand];

    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt={`${brand} logo`}
          className="h-28 w-auto md:h-32 object-contain cursor-pointer"
          {...imgProps}
        />
      );
    }
    
    return null;
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50/50 py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Explore by Brand
          </div>
          <h2 className="text-3xl font-bold mb-4">Choose Your Favorite Car Brand</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Browse cars from top automotive brands available in our database
          </p>
        </div>

        <div className="grid grid-cols-5 gap-8 mb-12 place-items-center">
          {availableBrands.map((brand) => (
            <div key={brand}>
              {getBrandLogo(brand, { onClick: () => handleBrandClick(brand) })}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/cars')}
            size="lg"
            className="px-8"
          >
            View All Cars
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;