import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { mapsService, type VenueLocation } from '../services/mapsService';

interface MapComponentProps {
  venues: VenueLocation[];
  center?: [number, number];
  height?: string;
  onVenueSelect?: (venue: VenueLocation) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  venues, 
  center = [20.5937, 78.9629], 
  height = '400px',
  onVenueSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = mapsService.initializeMap('wedding-venues-map', center);
      
      // Add venue markers
      if (venues.length > 0) {
        mapsService.addVenueMarkers(venues);
        
        // Fit map to show all venues
        if (mapInstanceRef.current) {
          const group = new L.FeatureGroup(
            venues.map(venue => L.marker([venue.lat, venue.lng]))
          );
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapsService.destroyMap();
        mapInstanceRef.current = null;
      }
    };
  }, [venues, center]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Map Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-playfair text-lg font-bold text-gray-800">
              Wedding Venues
            </h3>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Navigation className="w-4 h-4" />
            <span className="font-poppins">{venues.length} venues found</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        id="wedding-venues-map" 
        ref={mapRef}
        style={{ height }}
        className="w-full"
      />

      {/* Venues List */}
      {venues.length > 0 && (
        <div className="p-4 border-t border-gray-200 max-h-48 overflow-y-auto">
          <h4 className="font-poppins font-semibold text-gray-800 mb-3">
            Nearby Venues
          </h4>
          
          <div className="space-y-2">
            {venues.slice(0, 5).map((venue, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onVenueSelect?.(venue)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-poppins font-medium text-gray-800 truncate">
                      {venue.name}
                    </h5>
                    <p className="font-poppins text-sm text-gray-600 truncate">
                      {venue.address}
                    </p>
                    {venue.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="font-poppins text-sm text-gray-600">
                          {venue.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;