import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Map = () => {
  // Navnit Motors coordinates (Andheri West, Mumbai)
  const navnitLocation = {
    lat: 19.1334,
    lng: 72.8263,
    address: "C-Wing, WATER FORD-C, Ground, CD Barfiwala Road, Juhu Lane, Ganga Vihar, Andheri West, Mumbai, Maharashtra 400058"
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${navnitLocation.lat},${navnitLocation.lng}`;
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.9!2d${navnitLocation.lng}!3d${navnitLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA4JzAwLjIiTiA3MsKwNDknMzMuMyJF!5e0!3m2!1sen!2sin!4v1644000000000!5m2!1sen!2sin`;

  return (
    <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
      {/* Google Maps Embed */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
        title="Navnit Motors Location"
      />
      
      {/* Overlay with location info */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <MapPin className="text-red-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              BMW Showroom | Navnit Motors
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {navnitLocation.address}
            </p>
            <Button 
              asChild
              size="sm"
              className="w-full"
            >
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} />
                Open in Google Maps
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;