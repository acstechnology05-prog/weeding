import L from 'leaflet';

export interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface VenueLocation extends Location {
  type: 'venue' | 'hotel' | 'restaurant';
  rating?: number;
  priceRange?: string;
}

class MapsService {
  private map: L.Map | null = null;

  // Initialize OpenStreetMap
  initializeMap(containerId: string, center: [number, number] = [20.5937, 78.9629]) {
    this.map = L.map(containerId).setView(center, 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    return this.map;
  }

  // Add venue markers to map
  addVenueMarkers(venues: VenueLocation[]) {
    if (!this.map) return;

    venues.forEach(venue => {
      const marker = L.marker([venue.lat, venue.lng]).addTo(this.map!);
      
      const popupContent = `
        <div class="p-3">
          <h3 class="font-bold text-lg">${venue.name}</h3>
          <p class="text-gray-600 text-sm">${venue.address}</p>
          ${venue.rating ? `<p class="text-yellow-500">★ ${venue.rating}/5</p>` : ''}
          ${venue.priceRange ? `<p class="text-green-600">${venue.priceRange}</p>` : ''}
          <button class="mt-2 px-3 py-1 bg-primary text-white rounded text-sm">
            View Details
          </button>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });
  }

  // Get nearby wedding venues using Nominatim (OpenStreetMap's geocoding service)
  async searchVenues(city: string, state: string): Promise<VenueLocation[]> {
    try {
      const query = `wedding venue ${city} ${state} India`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=in`
      );
      
      const data = await response.json();
      
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        name: item.display_name.split(',')[0],
        address: item.display_name,
        type: 'venue' as const,
      }));
    } catch (error) {
      console.error('Search venues error:', error);
      return [];
    }
  }

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<Location | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name.split(',')[0],
          address: result.display_name,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocode error:', error);
      return null;
    }
  }

  // Calculate distance between two points
  calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2[0] - point1[0]);
    const dLon = this.toRadians(point2[1] - point1[1]);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1[0])) * Math.cos(this.toRadians(point2[0])) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Clean up map instance
  destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export const mapsService = new MapsService();