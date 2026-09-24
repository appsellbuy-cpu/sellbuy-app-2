export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NearbyPointOfInterest {
  id: string;
  name: string;
  category: 'transit' | 'dining' | 'lifestyle' | 'education' | 'healthcare' | 'nature';
  distance: string; // e.g. "0.4 km"
  duration: string; // e.g. "5 min walk"
  lat?: number;
  lng?: number;
}

// Comprehensive coordinates lookup for Indian cities and prime localities
const LOCALITY_AND_CITY_COORDINATES: Record<string, Coordinates> = {
  // Jaipur localities
  'vaishali nagar': { lat: 26.9056, lng: 75.7412 },
  'mansarovar': { lat: 26.8530, lng: 75.7686 },
  'malviya nagar': { lat: 26.8535, lng: 75.8197 },
  'c-scheme': { lat: 26.9100, lng: 75.8010 },
  'c scheme': { lat: 26.9100, lng: 75.8010 },
  'jagatpura': { lat: 26.8228, lng: 75.8647 },
  'raja park': { lat: 26.8970, lng: 75.8270 },
  'tonk road': { lat: 26.8620, lng: 75.7980 },
  'ajmer road': { lat: 26.8870, lng: 75.7320 },
  'sikar road': { lat: 26.9600, lng: 75.7720 },
  'vidhyadhar nagar': { lat: 26.9600, lng: 75.7720 },
  'chomu bypass': { lat: 26.9800, lng: 75.7600 },
  'nirman nagar': { lat: 26.8890, lng: 75.7460 },
  'bapu nagar': { lat: 26.8900, lng: 75.8090 },
  'civil lines': { lat: 26.9090, lng: 75.7860 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },

  // Mumbai localities
  'bandra west': { lat: 19.0596, lng: 72.8295 },
  'bandra': { lat: 19.0596, lng: 72.8295 },
  'bandstand': { lat: 19.0435, lng: 72.8190 },
  'juhu': { lat: 19.1075, lng: 72.8263 },
  'andheri': { lat: 19.1136, lng: 72.8697 },
  'powai': { lat: 19.1176, lng: 72.9060 },
  'worli': { lat: 19.0178, lng: 72.8178 },
  'lower parel': { lat: 18.9950, lng: 72.8290 },
  'dadar': { lat: 19.0178, lng: 72.8478 },
  'south mumbai': { lat: 18.9322, lng: 72.8264 },
  'navi mumbai': { lat: 19.0330, lng: 73.0297 },
  'thane': { lat: 19.2183, lng: 72.9781 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },

  // Bangalore localities
  'koramangala': { lat: 12.9352, lng: 77.6245 },
  'indiranagar': { lat: 12.9719, lng: 77.6412 },
  'whitefield': { lat: 12.9698, lng: 77.7500 },
  'hsr layout': { lat: 12.9121, lng: 77.6446 },
  'hsr': { lat: 12.9121, lng: 77.6446 },
  'electronic city': { lat: 12.8452, lng: 77.6602 },
  'jayanagar': { lat: 12.9308, lng: 77.5838 },
  'near university campus': { lat: 12.9380, lng: 77.5360 },
  'university campus': { lat: 12.9380, lng: 77.5360 },
  'malleshwaram': { lat: 13.0031, lng: 77.5643 },
  'marathahalli': { lat: 12.9591, lng: 77.6974 },
  'bellandur': { lat: 12.9304, lng: 77.6784 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },

  // Hyderabad localities
  'banjara hills': { lat: 17.4156, lng: 78.4350 },
  'jubilee hills': { lat: 17.4319, lng: 78.4073 },
  'hitec city': { lat: 17.4474, lng: 78.3762 },
  'hitech city': { lat: 17.4474, lng: 78.3762 },
  'gachibowli': { lat: 17.4401, lng: 78.3489 },
  'madhapur': { lat: 17.4483, lng: 78.3915 },
  'kondapur': { lat: 17.4645, lng: 78.3587 },
  'kukatpally': { lat: 17.4933, lng: 78.3914 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },

  // Gurgaon / Gurugram localities
  'dlf phase 5': { lat: 28.4550, lng: 77.0980 },
  'dlf phase 2': { lat: 28.4862, lng: 77.0878 },
  'dlf phase 1': { lat: 28.4780, lng: 77.0940 },
  'dlf phase 3': { lat: 28.4920, lng: 77.0990 },
  'dlf phase 4': { lat: 28.4680, lng: 77.0880 },
  'golf course road': { lat: 28.4610, lng: 77.1020 },
  'golf course ext': { lat: 28.4200, lng: 77.0890 },
  'cyber city': { lat: 28.4950, lng: 77.0890 },
  'sohna road': { lat: 28.3980, lng: 77.0420 },
  'gurgaon': { lat: 28.4595, lng: 77.0266 },
  'gurugram': { lat: 28.4595, lng: 77.0266 },

  // Pune localities
  'koregaon park': { lat: 18.5362, lng: 73.8940 },
  'kothrud': { lat: 18.5074, lng: 73.8077 },
  'kalyani nagar': { lat: 18.5463, lng: 73.9034 },
  'viman nagar': { lat: 18.5679, lng: 73.9143 },
  'hinjewadi': { lat: 18.5913, lng: 73.7389 },
  'baner': { lat: 18.5590, lng: 73.7868 },
  'wakad': { lat: 18.5987, lng: 73.7632 },
  'aundh': { lat: 18.5580, lng: 73.8074 },
  'magarpatta': { lat: 18.5135, lng: 73.9288 },
  'pune': { lat: 18.5204, lng: 73.8567 },

  // Delhi & NCR localities
  'vasant kunj': { lat: 28.5273, lng: 77.1517 },
  'dwarka': { lat: 28.5921, lng: 77.0460 },
  'south delhi': { lat: 28.5562, lng: 77.2215 },
  'connaught place': { lat: 28.6315, lng: 77.2167 },
  'saket': { lat: 28.5244, lng: 77.2167 },
  'noida': { lat: 28.5355, lng: 77.3910 },
  'greater noida': { lat: 28.4744, lng: 77.5040 },
  'sector 62': { lat: 28.6270, lng: 77.3620 },
  'sector 150': { lat: 28.4500, lng: 77.4700 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },

  // Other major Indian cities
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'goa': { lat: 15.2993, lng: 74.1240 },
  'panaji': { lat: 15.4909, lng: 73.8278 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'kochi': { lat: 9.9312, lng: 76.2673 },
  'cochin': { lat: 9.9312, lng: 76.2673 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },

  // Global cities (preserves international fallback)
  'bali': { lat: -8.8055, lng: 115.1133 },
  'indonesia': { lat: -8.8055, lng: 115.1133 },
  'new york': { lat: 40.7233, lng: -74.003 },
  'manhattan': { lat: 40.7233, lng: -74.003 },
  'dubai': { lat: 25.1972, lng: 55.2744 },
  'london': { lat: 51.5014, lng: -0.1607 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
};

/**
 * Deterministic pseudo-random offset based on property/location text
 * so unknown addresses still land stably and sensibly nearby.
 */
function getDeterministicOffset(str: string): { latOffset: number; lngOffset: number } {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 1000) / 1000 - 0.5) * 0.015;
  const lngOffset = ((Math.abs(hash >> 8) % 1000) / 1000 - 0.5) * 0.015;
  return { latOffset, lngOffset };
}

export function resolveCoordinates(
  locationStr: string,
  explicitCoords?: Coordinates,
  city?: string
): Coordinates {
  if (explicitCoords && typeof explicitCoords.lat === 'number' && typeof explicitCoords.lng === 'number') {
    return explicitCoords;
  }

  const query = `${locationStr || ''} ${city || ''}`.toLowerCase().trim();
  
  // 1. Check for exact locality or key matches (longest match priority)
  const keys = Object.keys(LOCALITY_AND_CITY_COORDINATES).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (query.includes(key)) {
      const baseCoords = LOCALITY_AND_CITY_COORDINATES[key];
      // If it's a city-level match rather than specific locality, add subtle deterministic offset
      const isSpecificLocality = key.includes(' ') || (key !== city?.toLowerCase());
      if (isSpecificLocality) {
        const offset = getDeterministicOffset(locationStr || query);
        return {
          lat: Number((baseCoords.lat + offset.latOffset).toFixed(6)),
          lng: Number((baseCoords.lng + offset.lngOffset).toFixed(6))
        };
      }
      return baseCoords;
    }
  }

  // 2. City fallback if query had no direct match
  if (city) {
    const cityKey = city.toLowerCase().trim();
    if (LOCALITY_AND_CITY_COORDINATES[cityKey]) {
      const base = LOCALITY_AND_CITY_COORDINATES[cityKey];
      const offset = getDeterministicOffset(locationStr);
      return {
        lat: Number((base.lat + offset.latOffset).toFixed(6)),
        lng: Number((base.lng + offset.lngOffset).toFixed(6))
      };
    }
  }

  // 3. Fallback to central Jaipur (NavikX primary hub) with offset
  const defaultBase = LOCALITY_AND_CITY_COORDINATES['jaipur'];
  const offset = getDeterministicOffset(locationStr || 'default');
  return {
    lat: Number((defaultBase.lat + offset.latOffset).toFixed(6)),
    lng: Number((defaultBase.lng + offset.lngOffset).toFixed(6))
  };
}

export function getNearbyPOIs(location: string, city?: string, baseCoords?: Coordinates): NearbyPointOfInterest[] {
  const loc = `${location || ''} ${city || ''}`.toLowerCase();
  const centerLat = baseCoords?.lat || 26.9056;
  const centerLng = baseCoords?.lng || 75.7412;

  // Jaipur contextual POIs
  if (loc.includes('jaipur') || loc.includes('vaishali') || loc.includes('mansarovar') || loc.includes('malviya')) {
    return [
      { 
        id: '1', 
        name: 'Metro Station (Mansarovar - Badi Chopar Line)', 
        category: 'transit', 
        distance: '0.9 km', 
        duration: '10 min walk',
        lat: centerLat + 0.004,
        lng: centerLng - 0.003
      },
      { 
        id: '2', 
        name: 'Vaishali Urban Square & Starbucks', 
        category: 'dining', 
        distance: '450 m', 
        duration: '5 min walk',
        lat: centerLat - 0.003,
        lng: centerLng + 0.004
      },
      { 
        id: '3', 
        name: 'SMS Multi-Specialty Hospital', 
        category: 'healthcare', 
        distance: '1.4 km', 
        duration: '6 min drive',
        lat: centerLat + 0.006,
        lng: centerLng + 0.005
      },
      { 
        id: '4', 
        name: 'Delhi Public School & Cambridge Academy', 
        category: 'education', 
        distance: '1.8 km', 
        duration: '7 min drive',
        lat: centerLat - 0.005,
        lng: centerLng - 0.006
      },
      { 
        id: '5', 
        name: 'Central Eco Park & Jogging Trail', 
        category: 'nature', 
        distance: '600 m', 
        duration: '7 min walk',
        lat: centerLat + 0.002,
        lng: centerLng + 0.006
      }
    ];
  }

  // Mumbai contextual POIs
  if (loc.includes('mumbai') || loc.includes('bandra') || loc.includes('juhu') || loc.includes('andheri')) {
    return [
      { 
        id: '1', 
        name: 'Bandra Railway / Metro Interchange', 
        category: 'transit', 
        distance: '1.1 km', 
        duration: '12 min walk',
        lat: centerLat + 0.005,
        lng: centerLng - 0.004
      },
      { 
        id: '2', 
        name: 'Bandstand Promenade & Sea Breeze Deck', 
        category: 'nature', 
        distance: '350 m', 
        duration: '4 min walk',
        lat: centerLat - 0.004,
        lng: centerLng - 0.003
      },
      { 
        id: '3', 
        name: 'Lilavati Hospital & Research Center', 
        category: 'healthcare', 
        distance: '1.2 km', 
        duration: '5 min drive',
        lat: centerLat + 0.003,
        lng: centerLng + 0.006
      },
      { 
        id: '4', 
        name: 'Pali Village Cafe & Fine Dining', 
        category: 'dining', 
        distance: '600 m', 
        duration: '7 min walk',
        lat: centerLat - 0.002,
        lng: centerLng + 0.003
      },
      { 
        id: '5', 
        name: 'St. Andrew’s International College', 
        category: 'education', 
        distance: '850 m', 
        duration: '10 min walk',
        lat: centerLat + 0.006,
        lng: centerLng + 0.002
      }
    ];
  }

  // Bangalore contextual POIs
  if (loc.includes('bangalore') || loc.includes('bengaluru') || loc.includes('koramangala') || loc.includes('indiranagar')) {
    return [
      { 
        id: '1', 
        name: 'Namma Metro Yellow / Purple Line', 
        category: 'transit', 
        distance: '800 m', 
        duration: '9 min walk',
        lat: centerLat + 0.004,
        lng: centerLng - 0.003
      },
      { 
        id: '2', 
        name: 'Nexus Koramangala Mall & IMAX', 
        category: 'lifestyle', 
        distance: '600 m', 
        duration: '7 min walk',
        lat: centerLat - 0.003,
        lng: centerLng + 0.004
      },
      { 
        id: '3', 
        name: 'Manipal Hospital Multi-Specialty', 
        category: 'healthcare', 
        distance: '1.5 km', 
        duration: '6 min drive',
        lat: centerLat + 0.006,
        lng: centerLng + 0.003
      },
      { 
        id: '4', 
        name: 'Third Wave Coffee Roasters & Co-work', 
        category: 'dining', 
        distance: '300 m', 
        duration: '3 min walk',
        lat: centerLat - 0.002,
        lng: centerLng - 0.003
      },
      { 
        id: '5', 
        name: 'Koramangala 4th Block Green Park', 
        category: 'nature', 
        distance: '450 m', 
        duration: '5 min walk',
        lat: centerLat + 0.003,
        lng: centerLng + 0.005
      }
    ];
  }

  // Hyderabad contextual POIs
  if (loc.includes('hyderabad') || loc.includes('banjara') || loc.includes('hitec') || loc.includes('jubilee')) {
    return [
      { 
        id: '1', 
        name: 'Hitec City / Road No 5 Metro Station', 
        category: 'transit', 
        distance: '750 m', 
        duration: '8 min walk',
        lat: centerLat + 0.004,
        lng: centerLng - 0.004
      },
      { 
        id: '2', 
        name: 'Inorbit Mall & Durgam Cheruvu Lakefront', 
        category: 'lifestyle', 
        distance: '1.2 km', 
        duration: '5 min drive',
        lat: centerLat - 0.005,
        lng: centerLng + 0.004
      },
      { 
        id: '3', 
        name: 'Apollo Hospital & Health City', 
        category: 'healthcare', 
        distance: '1.6 km', 
        duration: '7 min drive',
        lat: centerLat + 0.006,
        lng: centerLng + 0.002
      },
      { 
        id: '4', 
        name: 'Cyber Towers & IT Hub Campus', 
        category: 'lifestyle', 
        distance: '900 m', 
        duration: '10 min walk',
        lat: centerLat - 0.003,
        lng: centerLng - 0.005
      }
    ];
  }

  // Gurgaon contextual POIs
  if (loc.includes('gurgaon') || loc.includes('gurugram') || loc.includes('dlf') || loc.includes('cyber')) {
    return [
      { 
        id: '1', 
        name: 'Rapid Metro Station (DLF Phase 5)', 
        category: 'transit', 
        distance: '400 m', 
        duration: '5 min walk',
        lat: centerLat + 0.003,
        lng: centerLng - 0.003
      },
      { 
        id: '2', 
        name: 'One Horizon Center & Cyber Hub Dining', 
        category: 'dining', 
        distance: '650 m', 
        duration: '8 min walk',
        lat: centerLat - 0.003,
        lng: centerLng + 0.004
      },
      { 
        id: '3', 
        name: 'Fortis Memorial Research Institute', 
        category: 'healthcare', 
        distance: '2.1 km', 
        duration: '8 min drive',
        lat: centerLat + 0.007,
        lng: centerLng + 0.003
      },
      { 
        id: '4', 
        name: 'The Shri Ram School (Aravali Campus)', 
        category: 'education', 
        distance: '1.3 km', 
        duration: '5 min drive',
        lat: centerLat - 0.004,
        lng: centerLng - 0.005
      }
    ];
  }

  // Pune contextual POIs
  if (loc.includes('pune') || loc.includes('koregaon') || loc.includes('kothrud') || loc.includes('viman')) {
    return [
      { 
        id: '1', 
        name: 'Pune Metro Line 2 (Vanaz to Ramwadi)', 
        category: 'transit', 
        distance: '850 m', 
        duration: '10 min walk',
        lat: centerLat + 0.004,
        lng: centerLng - 0.003
      },
      { 
        id: '2', 
        name: 'Phoenix Marketcity & High Street', 
        category: 'lifestyle', 
        distance: '1.4 km', 
        duration: '6 min drive',
        lat: centerLat - 0.004,
        lng: centerLng + 0.005
      },
      { 
        id: '3', 
        name: 'Ruby Hall Clinic Multi-Specialty', 
        category: 'healthcare', 
        distance: '1.8 km', 
        duration: '7 min drive',
        lat: centerLat + 0.006,
        lng: centerLng + 0.002
      },
      { 
        id: '4', 
        name: 'Osho Teerth Botanical Gardens', 
        category: 'nature', 
        distance: '500 m', 
        duration: '6 min walk',
        lat: centerLat - 0.002,
        lng: centerLng - 0.004
      }
    ];
  }

  // Default universal high-end POIs with coordinates
  return [
    { 
      id: '1', 
      name: 'Metro & Regional Rapid Transit Station', 
      category: 'transit', 
      distance: '650 m', 
      duration: '7 min walk',
      lat: centerLat + 0.004,
      lng: centerLng - 0.003
    },
    { 
      id: '2', 
      name: 'Prime Retail Promenade & Gourmet Supermarket', 
      category: 'dining', 
      distance: '400 m', 
      duration: '5 min walk',
      lat: centerLat - 0.003,
      lng: centerLng + 0.004
    },
    { 
      id: '3', 
      name: 'Green Community Park & Walking Trails', 
      category: 'nature', 
      distance: '500 m', 
      duration: '6 min walk',
      lat: centerLat + 0.003,
      lng: centerLng + 0.005
    },
    { 
      id: '4', 
      name: 'Premier Multi-Specialty Hospital', 
      category: 'healthcare', 
      distance: '1.4 km', 
      duration: '5 min drive',
      lat: centerLat + 0.006,
      lng: centerLng + 0.002
    }
  ];
}
