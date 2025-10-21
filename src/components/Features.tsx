import { useEffect, useRef, useState } from 'react';
import { Car, DollarSign, Gauge, Fuel, ArrowRight, Search, Filter, BarChart, CheckCircle, Star, Shield, MessageSquare, RefreshCcw, Rocket } from "lucide-react";
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { useScrollHijack } from '@/hooks/useScrollHijack';
// BrandLogos moved to Hero.tsx
import { supabase } from '@/integrations/supabase/client';

interface CarCategory {
  body_type: string;
  count: number;
  image: string;
  description: string;
}

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const hijackSectionRef = useRef<HTMLDivElement>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [currentSprint, setCurrentSprint] = useState(1);
  const totalSprints = 3;
  const isMobile = useIsMobile();
  const [carCategories, setCarCategories] = useState<CarCategory[]>([]);

  const features = [
    {
      icon: <Search className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Advanced Search",
      description: "Find your perfect car with intelligent filters for make, model, price range, fuel type, and more.",
      image: "/lovable-uploads/e1f9234f-0d40-4093-903f-f8d881714a64.png"
    },
    {
      icon: <BarChart className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Side-by-Side Comparison",
      description: "Compare multiple cars with detailed specifications, pricing, fuel economy, and safety ratings.",
      image: "/lovable-uploads/d080bb98-b854-483e-9b88-3c2fac6526e1.png"
    },
    {
      icon: <DollarSign className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Price Analysis",
      description: "Get comprehensive pricing information including MSRP, dealer pricing, and market value trends.",
      image: "/lovable-uploads/094cf863-26db-4c62-be4c-374b93a6df5f.png"
    },
    {
      icon: <Star className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Expert Reviews",
      description: "Access professional reviews, safety ratings, and real owner experiences to make informed decisions.",
      image: "/lovable-uploads/c2ecf80b-38fc-4080-8eb2-691d6031664c.png"
    }
  ];

  const { isHijacked, currentIndex } = useScrollHijack(hijackSectionRef, features.length);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-info');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in');
          (entry.target as HTMLElement).style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    if (featuresRef.current) {
      const elements = featuresRef.current.querySelectorAll('.feature-item');
      elements.forEach(el => {
        if (!el.classList.contains('animate-slide-in')) {
          (el as HTMLElement).style.opacity = '0';
          observer.observe(el);
        }
      });
    }
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const animateProgress = () => {
      setProgressValue(0);
      interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentSprint(prev => prev < totalSprints ? prev + 1 : 1);
              animateProgress();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    };
    animateProgress();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchCarCategories();
  }, []);

  const fetchCarCategories = async () => {
    try {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('body_type, brand, model, price');

      if (error) {
        console.error('Error fetching cars:', error);
        return;
      }

      // Group cars by body type and count them
      const categoryMap = new Map<string, { count: number; avgPrice: number }>();
      cars?.forEach(car => {
        if (car.body_type) {
          const existing = categoryMap.get(car.body_type) || { count: 0, avgPrice: 0 };
          categoryMap.set(car.body_type, {
            count: existing.count + 1,
            avgPrice: existing.avgPrice + (car.price || 0)
          });
        }
      });

      // Convert to array with images and descriptions
      const categories: CarCategory[] = Array.from(categoryMap.entries()).map(([bodyType, data]) => ({
        body_type: bodyType,
        count: data.count,
        image: getBodyTypeImage(bodyType),
        description: getBodyTypeDescription(bodyType)
      })).sort((a, b) => b.count - a.count); // Sort by count descending

      setCarCategories(categories);
    } catch (error) {
      console.error('Error fetching car categories:', error);
    }
  };

  const getBodyTypeImage = (bodyType: string): string => {
    const imageMap: Record<string, string> = {
      'SUV': '/lovable-uploads/0078e09e-bac5-48d7-863e-34747cfb95f1.png',
      'Sedan': '/lovable-uploads/bd784b3f-5150-4e4b-b429-84d35b6ede7d.png',
      'Hatchback': '/lovable-uploads/961c0e6b-4f09-493e-9de2-dc6a765160c9.png',
      'Coupe': '/lovable-uploads/cb0a0548-2a34-48ee-9ee0-87f454ed70a7.png',
      'Convertible': '/lovable-uploads/7f35272d-dcdc-4490-b87f-49fea193e3ae.png',
      'MPV': '/lovable-uploads/b7206415-9e5c-407a-b742-e89c1d8684ef.png',
      'Van': '/lovable-uploads/61559021-97bd-4c8b-a467-7870d9ff5dd9.png',
      'Roadster': '/lovable-uploads/d9220bc3-b78a-4761-b163-c7312ed4bb38.png',
      'Motorcycle': '/lovable-uploads/3979498c-093b-4f8a-8049-57b4fa30f8e2.png',
      'ATV': '/lovable-uploads/aad9a257-3c1d-42a6-b0ea-1735c17d3c07.png',
      'UTV': '/lovable-uploads/33010dba-5f95-4eba-a02a-ae6ba2c283ca.png'
    };
    return imageMap[bodyType] || '/lovable-uploads/0078e09e-bac5-48d7-863e-34747cfb95f1.png';
  };

  const getBodyTypeDescription = (bodyType: string): string => {
    const descriptions: Record<string, string> = {
      'SUV': `Compare spacious SUVs with safety ratings, fuel economy, and family-friendly features.`,
      'Sedan': `Explore premium sedans with performance specs, luxury features, and advanced technology.`,
      'Hatchback': `Discover compact hatchbacks with fuel efficiency, urban maneuverability, and practicality.`,
      'Coupe': `Browse sporty coupes with performance-focused features and stylish two-door designs.`,
      'Convertible': `Find convertibles with open-air driving experience and premium luxury features.`,
      'MPV': `Compare multi-purpose vehicles designed for maximum space and family comfort.`,
      'Van': `Explore commercial and passenger vans with cargo capacity and utility features.`,
      'Roadster': `Discover high-performance roadsters built for speed and driving excitement.`,
      'Motorcycle': `Compare motorcycles with engine performance, safety features, and riding styles.`,
      'ATV': `Find all-terrain vehicles designed for off-road adventures and outdoor activities.`,
      'UTV': `Explore utility terrain vehicles for work applications and recreational use.`
    };
    return descriptions[bodyType] || `Compare ${bodyType.toLowerCase()}s with detailed specifications and features.`;
  };

  const handleCategoryClick = (bodyType: string) => {
    // Navigate to cars page with body type filter (matching the current route structure)
    window.location.href = `/cars?body_type=${encodeURIComponent(bodyType)}`;
  };
  const stepFlowItems = [{
    icon: <Search className="h-10 w-10 text-gray-700" />,
    title: "Smart Search Engine",
    description: "Advanced algorithms to find cars matching your criteria"
  }, {
    icon: <BarChart className="h-10 w-10 text-gray-700" />,
    title: "Comprehensive Database",
    description: "Detailed specifications and pricing for thousands of vehicles"
  }, {
    icon: <Shield className="h-10 w-10 text-gray-700" />,
    title: "Trusted Reviews",
    description: "Expert ratings and real owner feedback for informed decisions"
  }];
  const comparisonPhases = [{
    name: "Search",
    icon: <Search className="h-4 w-4" />
  }, {
    name: "Filter",
    icon: <Filter className="h-4 w-4" />
  }, {
    name: "Compare",
    icon: <BarChart className="h-4 w-4" />
  }, {
    name: "Decide",
    icon: <CheckCircle className="h-4 w-4" />
  }];

  return <>
      <section id="features" className="relative bg-white overflow-hidden py-10 md:py-[50px] w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8" ref={featuresRef}> 
          {/* Header removed as requested */}
          
          {/* Features block removed per request */}

          <div className="mt-6 mb-8 feature-item">
            <div className="text-center mb-8">
              <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                Vehicle Categories
              </div>
              <h3 className="text-2xl font-bold">Popular Car Types</h3>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Explore different vehicle categories and find the perfect car type for your needs, 
                from family SUVs to luxury sedans and eco-friendly electric vehicles.
                <span className="block text-sm mt-1 text-blue-500">Scroll horizontally to see more categories →</span>
              </p>
            </div>
            
            <div className="rounded-xl overflow-hidden bg-white p-4 feature-item">
              <Carousel className="w-full max-w-7xl mx-auto">
                <CarouselContent className="flex">
                  {carCategories.map((category, index) => (
                    <CarouselItem key={category.body_type} className="md:basis-1/3 lg:basis-1/4 flex-shrink-0">
                      <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1" onClick={() => handleCategoryClick(category.body_type)}>
                        <CardContent className="p-0">
                          <div className="relative h-48 overflow-hidden rounded-t-lg">
                            <img 
                              src={category.image} 
                              alt={category.body_type} 
                              className="w-full h-full object-contain bg-gradient-to-br from-gray-50 to-gray-100" 
                            />
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                              {category.count} cars
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold mb-2 text-foreground">{category.body_type}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full mt-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              View {category.body_type}s
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-6 gap-2">
                  <CarouselPrevious className="relative static left-auto translate-y-0 hover:bg-gray-100" />
                  <CarouselNext className="relative static right-auto translate-y-0 hover:bg-gray-100" />
                </div>
              </Carousel>
              <div className="text-center mt-6 text-sm text-gray-600">
                <p className="font-medium">Click any category to explore {carCategories.length} different vehicle types available for comparison</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={scrollToContact} className="inline-flex items-center px-4 sm:px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all group w-full sm:w-auto">
            Need Help Finding a Car?
            <MessageSquare className="ml-2 w-4 h-4 group-hover:animate-pulse" />
          </Button>
          
          <Link to="/cars">
            <Button className="inline-flex items-center px-4 sm:px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all group w-full sm:w-auto">
              Browse All Cars
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
      
      <section id="technology" className="bg-gray-50 py-10 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              How It Works
            </div>
            <h2 className="text-3xl font-bold mb-4">Smart Car Comparison Process</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our platform combines comprehensive data, intelligent search, and expert insights 
              to help you find and compare the perfect car for your needs and budget.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-10 transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {stepFlowItems.map((item, index) => <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full cursor-pointer">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gray-50 rounded-full p-4 mb-4">
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 shadow-lg">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="text-sm">{item.description}</p>
                      {index === 0 && <p className="text-xs text-gray-500">Our proprietary technology provides the core foundation of every solution we build.</p>}
                      {index === 1 && <p className="text-xs text-gray-500">We carefully select the best off-the-shelf components to complement our proprietary technology.</p>}
                      {index === 2 && <p className="text-xs text-gray-500">Our network of production partners ensures quality manufacturing at scale.</p>}
                    </div>
                  </HoverCardContent>
                </HoverCard>)}
            </div>

            <div className="relative h-16 mb-10">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-300 to-gray-400"></div>
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full -mt-3">
                <div className="bg-gray-400 rounded-full p-1">
                  <ArrowRight className="w-5 h-5 text-white rotate-90" />
                </div>
              </div>
              
              <div className="md:hidden flex justify-center items-center h-full">
                <div className="w-1/3 h-0.5 bg-gray-300"></div>
                <div className="bg-gray-400 rounded-full p-1 mx-2">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div className="w-1/3 h-0.5 bg-gray-300"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-10 shadow-md">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold">Adaptation Project</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Iterative Development</span>
                    <RefreshCcw className="h-5 w-5 text-gray-600 animate-rotate-slow" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">Working iteratively with customers to tailor solutions to their needs</p>
                
                <div className="relative mb-2">
                  <Progress value={progressValue} className="h-3 bg-gray-200" />
                </div>
                
                <div className={cn("grid gap-1 mt-4", isMobile ? "grid-cols-2 gap-y-2" : "grid-cols-4")}>
                  {comparisonPhases.map((phase, index) => <div key={index} className={cn("text-center p-2 rounded transition-all", progressValue >= index / comparisonPhases.length * 100 && progressValue < (index + 1) / comparisonPhases.length * 100 ? "bg-blue-50 border border-blue-100" : "bg-gray-50")}>
                      <div className="flex flex-col items-center">
                        <div className={cn("rounded-full p-1 mb-1", progressValue >= index / comparisonPhases.length * 100 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500")}>
                          {phase.icon}
                        </div>
                        <span className="text-xs font-medium">{phase.name}</span>
                      </div>
                    </div>)}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-2">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-1 mr-2 shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Customer feedback integrated at every stage</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-2 sm:mt-0">
                    <span className="mr-2">Continuous improvement</span>
                    <div className="flex space-x-1">
                      <span className="inline-block w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-200"></span>
                      <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-pulse animation-delay-400"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-16 mb-10">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-300 to-gray-400"></div>
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full -mt-3">
                <div className="bg-gray-400 rounded-full p-1">
                  <ArrowRight className="w-5 h-5 text-white rotate-90" />
                </div>
              </div>
              
              <div className="md:hidden flex justify-center items-center h-full">
                <div className="w-1/3 h-0.5 bg-gray-300"></div>
                <div className="bg-gray-400 rounded-full p-1 mx-2">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div className="w-1/3 h-0.5 bg-gray-300"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg p-8 max-w-xl mx-auto text-center shadow-md hover:shadow-lg transition-all duration-300">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-black/10 rounded-full animate-pulse-slow"></div>
                <div className="relative bg-white rounded-full p-4 border border-gray-200 shadow-md">
                  <Rocket className="h-10 w-10 text-gray-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Hitting the Market</h3>
              <p className="text-gray-700">Ready to scale, produce, and launch</p>
              <div className="flex justify-center mt-4 space-x-2">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-300 animate-pulse"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-gray-500 animate-pulse animation-delay-200"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-gray-700 animate-pulse animation-delay-400"></span>
              </div>
            </div>
          </div>
          

        </div>
      </section>
      
      
    </>;
};

export default Features;
