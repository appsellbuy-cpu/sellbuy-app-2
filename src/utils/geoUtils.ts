export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NearbyPointOfInterest {
  id: string;
  name: string;
  category: 'transit' | 'dining' | 'lifestyle' | 'education' | 'nature';
  distance: string; // e.g. "0.4 mi"
  duration: string; // e.g. "5 min walk"
}

const CITY_COORDINATES: Record<string, Coordinates> = {
  bali: { lat: -8.8055, lng: 115.1133 },
  indonesia: { lat: -8.8055, lng: 115.1133 },
  'new york': { lat: 40.7233, lng: -74.003 },
  manhattan: { lat: 40.7233, lng: -74.003 },
  ny: { lat: 40.7233, lng: -74.003 },
  aspen: { lat: 39.1911, lng: -106.8175 },
  colorado: { lat: 39.6403, lng: -106.3742 },
  dubai: { lat: 25.1972, lng: 55.2744 },
  uae: { lat: 25.1972, lng: 55.2744 },
  santorini: { lat: 36.4618, lng: 25.3753 },
  greece: { lat: 36.4618, lng: 25.3753 },
  london: { lat: 51.5014, lng: -0.1607 },
  uk: { lat: 51.5014, lng: -0.1607 },
  algarve: { lat: 37.0902, lng: -8.2439 },
  portugal: { lat: 37.0902, lng: -8.2439 },
  paris: { lat: 48.8566, lng: 2.3522 },
  france: { lat: 48.8566, lng: 2.3522 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  japan: { lat: 35.6762, lng: 139.6503 },
  miami: { lat: 25.7617, lng: -80.1918 },
  florida: { lat: 25.7617, lng: -80.1918 },
  'los angeles': { lat: 34.0736, lng: -118.4004 },
  california: { lat: 34.0736, lng: -118.4004 },
  monaco: { lat: 43.7384, lng: 7.4246 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  zurich: { lat: 47.3769, lng: 8.5417 },
  switzerland: { lat: 46.8182, lng: 8.2275 }
};

export function resolveCoordinates(locationStr: string, explicitCoords?: Coordinates): Coordinates {
  if (explicitCoords && typeof explicitCoords.lat === 'number' && typeof explicitCoords.lng === 'number') {
    return explicitCoords;
  }

  const normalized = locationStr.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }

  // Fallback to Greenwich / Global prime
  return { lat: 40.7128, lng: -74.006 };
}

export function getNearbyPOIs(location: string): NearbyPointOfInterest[] {
  const loc = location.toLowerCase();
  
  if (loc.includes('bali')) {
    return [
      { id: '1', name: 'Echo Beach & Surfer Promenade', category: 'nature', distance: '0.2 mi', duration: '4 min walk' },
      { id: '2', name: 'La Brisa Beach Club & Dining', category: 'dining', distance: '0.4 mi', duration: '7 min walk' },
      { id: '3', name: 'Canggu International Academy', category: 'education', distance: '1.2 mi', duration: '5 min drive' },
      { id: '4', name: 'Ngurah Rai International Airport (DPS)', category: 'transit', distance: '12.4 mi', duration: '35 min drive' }
    ];
  }

  if (loc.includes('new york')) {
    return [
      { id: '1', name: 'Spring Street Subway (C, E)', category: 'transit', distance: '0.1 mi', duration: '2 min walk' },
      { id: '2', name: 'Balthazar French Brasserie', category: 'dining', distance: '0.2 mi', duration: '4 min walk' },
      { id: '3', name: 'Washington Square Park', category: 'nature', distance: '0.6 mi', duration: '12 min walk' },
      { id: '4', name: 'Equinox SoHo Luxury Fitness Club', category: 'lifestyle', distance: '0.3 mi', duration: '5 min walk' }
    ];
  }

  if (loc.includes('colorado') || loc.includes('aspen')) {
    return [
      { id: '1', name: 'Gondola Plaza & High Peak Express', category: 'transit', distance: '0.3 mi', duration: '6 min walk' },
      { id: '2', name: 'The Little Nell Wine Cellar & Bistro', category: 'dining', distance: '0.4 mi', duration: '8 min walk' },
      { id: '3', name: 'Aspen Country Day Academy', category: 'education', distance: '2.5 mi', duration: '7 min drive' },
      { id: '4', name: 'Aspen/Pitkin County Airport (ASE)', category: 'transit', distance: '3.8 mi', duration: '10 min drive' }
    ];
  }

  if (loc.includes('dubai')) {
    return [
      { id: '1', name: 'Burj Khalifa & Dubai Mall Promenade', category: 'lifestyle', distance: '0.5 mi', duration: '8 min walk' },
      { id: '2', name: 'Armani Ristorante Fine Dining', category: 'dining', distance: '0.6 mi', duration: '10 min walk' },
      { id: '3', name: 'Dubai Opera Cultural Arts Center', category: 'lifestyle', distance: '0.7 mi', duration: '12 min walk' },
      { id: '4', name: 'Dubai International Airport (DXB)', category: 'transit', distance: '8.5 mi', duration: '15 min drive' }
    ];
  }

  if (loc.includes('santorini')) {
    return [
      { id: '1', name: 'Oia Sunset Panoramic Viewpoint', category: 'nature', distance: '0.1 mi', duration: '3 min walk' },
      { id: '2', name: 'Ammoudi Bay Seafood Tavernas', category: 'dining', distance: '0.5 mi', duration: '10 min walk' },
      { id: '3', name: 'Santorini Yacht Club & Marina', category: 'transit', distance: '2.1 mi', duration: '8 min drive' },
      { id: '4', name: 'Santorini Thira Airport (JTR)', category: 'transit', distance: '9.2 mi', duration: '22 min drive' }
    ];
  }

  if (loc.includes('london')) {
    return [
      { id: '1', name: 'Knightsbridge Underground Station (Piccadilly)', category: 'transit', distance: '0.2 mi', duration: '4 min walk' },
      { id: '2', name: 'Harrods Luxury Department Store', category: 'lifestyle', distance: '0.3 mi', duration: '5 min walk' },
      { id: '3', name: 'Hyde Park South Gates', category: 'nature', distance: '0.2 mi', duration: '4 min walk' },
      { id: '4', name: 'Dinner by Heston Blumenthal (2-Star)', category: 'dining', distance: '0.4 mi', duration: '7 min walk' }
    ];
  }

  // Default universal high-end POIs
  return [
    { id: '1', name: 'Metro & Regional Transit Station', category: 'transit', distance: '0.4 mi', duration: '7 min walk' },
    { id: '2', name: 'Artisan Waterfront Bistro & Cafe', category: 'dining', distance: '0.3 mi', duration: '5 min walk' },
    { id: '3', name: 'Botanical Gardens & Jogging Trail', category: 'nature', distance: '0.7 mi', duration: '12 min walk' },
    { id: '4', name: 'Premier Preparatory Academy', category: 'education', distance: '1.4 mi', duration: '6 min drive' }
  ];
}
