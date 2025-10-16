import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import BrandLogos from '@/components/BrandLogos';
import CarListings from '@/components/CarListings';
import WhyMotorenKlaro from '@/components/WhyMotorenKlaro';
import SEO from '@/components/SEO';
import { useEffect } from 'react';

const Index = () => {
  // Fix any ID conflicts when the page loads
  useEffect(() => {
    const carsElements = document.querySelectorAll('[id="cars"]');
    if (carsElements.length > 1) {
      // If there are multiple elements with id="cars", rename one
      carsElements[1].id = 'cars-footer';
    }
  }, []);

  return (
    <PageLayout>
      <SEO 
        title="Motoren Klaro - Best Car Comparison Platform" 
        description="Compare cars side-by-side with detailed specs, pricing, and expert reviews. Find your perfect car with Motoren Klaro's smart comparison platform."
        imageUrl="/lovable-uploads/37999ffc-9cf9-4d97-8f56-0ec7fd532245.png"
        keywords={['car comparison', 'motoren klaro', 'car specs', 'car prices', 'vehicle comparison', 'car reviews', 'auto shopping']}
      />
    <Hero />
    <BrandLogos />
    <Features />
    <CarListings />
      <WhyMotorenKlaro />
    </PageLayout>
  );
};

export default Index;