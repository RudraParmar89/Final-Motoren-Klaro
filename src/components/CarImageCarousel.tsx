import { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import InteractiveImage from '@/components/InteractiveImage';
import { Car } from 'lucide-react';

// Import all car images
import ferrariSide from '@/assets/ferrari-side.jpg';
import ferrariRear from '@/assets/ferrari-rear.jpg';
import ferrariFront from '@/assets/ferrari-front.jpg';
import ferrariSide2 from '@/assets/ferrari-side2.jpg';
import bmwX1Front from '@/assets/bmw-x1-front.jpg';
import bmwX1Side from '@/assets/bmw-x1-side.jpg';
import bmwX1Rear from '@/assets/bmw-x1-rear.jpg';
import bmwX5Front from '@/assets/bmw-x5-front.jpg';
import bmwX5Side from '@/assets/bmw-x5-side.jpg';
import bmwX5Rear from '@/assets/bmw-x5-rear.jpg';
import bmw3SeriesFront from '@/assets/bmw-3series-front.jpg';
import bmw3SeriesSide from '@/assets/bmw-3series-side.jpg';

// New car images
import ferrari812Front from '@/assets/ferrari-812-front.jpg';
import ferrari812Side from '@/assets/ferrari-812-side.jpg';
import ferrari812Rear from '@/assets/ferrari-812-rear.jpg';
import ferrari488Front from '@/assets/ferrari-488-front.jpg';
import ferrari488Side from '@/assets/ferrari-488-side.jpg';
import ferrari488Rear from '@/assets/ferrari-488-rear.jpg';
import bmw7SeriesFront from '@/assets/bmw-7series-front.jpg';
import bmw7SeriesSide from '@/assets/bmw-7series-side.jpg';
import bmw7SeriesRear from '@/assets/bmw-7series-rear.jpg';
import jaguarFTypeFront from '@/assets/jaguar-ftype-front.jpg';
import jaguarFTypeSide from '@/assets/jaguar-ftype-side.jpg';
import jaguarFTypeRear from '@/assets/jaguar-ftype-rear.jpg';
import rangeRoverFront from '@/assets/range-rover-front.jpg';
import rangeRoverSide from '@/assets/range-rover-side.jpg';
import rangeRoverRear from '@/assets/range-rover-rear.jpg';
import tataNexonFront from '@/assets/tata-nexon-front.jpg';
import tataNexonSide from '@/assets/tata-nexon-side.jpg';
import tataNexonRear from '@/assets/tata-nexon-rear.jpg';
import suzukiSwiftFront from '@/assets/suzuki-swift-front.jpg';
import suzukiSwiftSide from '@/assets/suzuki-swift-side.jpg';
import suzukiSwiftRear from '@/assets/suzuki-swift-rear.jpg';
import kiaSeltosFront from '@/assets/kia-seltos-front.jpg';
import kiaSeltosSide from '@/assets/kia-seltos-side.jpg';
import kiaSeltosRear from '@/assets/kia-seltos-rear.jpg';

interface CarImageCarouselProps {
  images: string[];
  carName: string;
  className?: string;
}

// Create a mapping of car models to their image arrays (exported so other components can reuse)
export const carImageMap: Record<string, string[]> = {
  // Ferrari models
  'Ferrari': [ferrariFront, ferrariSide, ferrariSide2, ferrariRear],
  'F8 Tributo': [ferrariFront, ferrariSide, ferrariSide2, ferrariRear],
  '812 Superfast': [ferrari812Front, ferrari812Side, ferrari812Rear],
  '488': [ferrari488Front, ferrari488Side, ferrari488Rear],
  '488 Pista': [ferrari488Front, ferrari488Side, ferrari488Rear],

  // BMW models
  'BMW X1': [bmwX1Front, bmwX1Side, bmwX1Rear],
  'X1': [bmwX1Front, bmwX1Side, bmwX1Rear],
  'BMW X5': [bmwX5Front, bmwX5Side, bmwX5Rear],
  'X5': [bmwX5Front, bmwX5Side, bmwX5Rear],
  '3 Series': [bmw3SeriesFront, bmw3SeriesSide],
  '3 Series Gran Limousine': [bmw3SeriesFront, bmw3SeriesSide],
  '7 Series': [bmw7SeriesFront, bmw7SeriesSide, bmw7SeriesRear],

  // Jaguar models
  'F-Type': [jaguarFTypeFront, jaguarFTypeSide, jaguarFTypeRear],
  'Jaguar F-Type': [jaguarFTypeFront, jaguarFTypeSide, jaguarFTypeRear],

  // Range Rover models
  'Range Rover': [rangeRoverFront, rangeRoverSide, rangeRoverRear],
  'Evoque': [rangeRoverFront, rangeRoverSide, rangeRoverRear],
  'Sport': [rangeRoverFront, rangeRoverSide, rangeRoverRear],
  'Velar': [rangeRoverFront, rangeRoverSide, rangeRoverRear],

  // TATA models
  'Nexon': [tataNexonFront, tataNexonSide, tataNexonRear],
  'TATA Nexon': [tataNexonFront, tataNexonSide, tataNexonRear],
  'Nexon EV': [tataNexonFront, tataNexonSide, tataNexonRear],

  // Suzuki models
  'Swift': [suzukiSwiftFront, suzukiSwiftSide, suzukiSwiftRear],
  'Suzuki Swift': [suzukiSwiftFront, suzukiSwiftSide, suzukiSwiftRear],

  // Kia models
  'Seltos': [kiaSeltosFront, kiaSeltosSide, kiaSeltosRear],
  'Kia Seltos': [kiaSeltosFront, kiaSeltosSide, kiaSeltosRear],
};

// Exported helper to get representative images for a car name
export function getRepresentativeImages(carName: string, imagesFromDb: string[] = []) {
  // First try to match with generated images based on car name
  for (const [key, imgs] of Object.entries(carImageMap)) {
    if (carName.toLowerCase().includes(key.toLowerCase())) {
      return imgs;
    }
  }

  // If no mapping found, prefer DB images that are usable (not referencing /src/assets/)
  const dbImages = imagesFromDb.filter(img => img && img.trim() !== '' && !img.includes('/src/assets/'));
  if (dbImages.length > 0) return dbImages;

  // As final fallback, return default BMW images if the name mentions BMW
  if (carName.toLowerCase().includes('bmw')) {
    return [bmwX1Front, bmwX1Side, bmwX1Rear];
  }

  return [];
}

const CarImageCarousel = ({ images, carName, className }: CarImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = getRepresentativeImages(carName, images).filter(img => img && img.trim() !== '');
  
  // If no valid images, show placeholder
  if (validImages.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-lg flex items-center justify-center">
          <Car className="w-24 h-24 text-gray-500" />
        </div>
      </div>
    );
  }

  // If only one image, show it without carousel
  if (validImages.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <InteractiveImage
          src={validImages[0]}
          alt={carName}
          className="w-full h-96 rounded-lg shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={index}>
              <InteractiveImage
                src={image}
                alt={`${carName} - Image ${index + 1}`}
                className="w-full h-96 rounded-lg shadow-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation arrows - positioned over the image */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <CarouselPrevious className="bg-white/80 backdrop-blur-sm shadow-md hover:bg-white/90" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <CarouselNext className="bg-white/80 backdrop-blur-sm shadow-md hover:bg-white/90" />
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {validImages.length}
          </div>
        </div>
        
        {/* Thumbnail dots */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default CarImageCarousel;