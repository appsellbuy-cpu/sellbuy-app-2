import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Compass, 
  RotateCcw, 
  ExternalLink, 
  Train, 
  Coffee, 
  HeartPulse, 
  GraduationCap, 
  TreePine, 
  Sparkles,
  Maximize2,
  Building2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { resolveCoordinates, getNearbyPOIs, NearbyPointOfInterest } from '../utils/geoUtils';

export interface PropertyMapData {
  id: string;
  title: string;
  location: string;
  city: string;
  price?: number;
  priceDisplay?: string;
  image?: string;
  type?: string;
  purpose?: string;
  reraId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface PropertyLeafletMapProps {
  property: PropertyMapData;
  className?: string;
}

type MapLayerType = 'clean' | 'street' | 'satellite';

// Helper component that updates map center and ensures container size is correctly measured
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const centerKey = `${center[0]},${center[1]}`;

  useEffect(() => {
    // Invalidate size immediately and with slight delay for modal transitions
    map.invalidateSize();
    map.setView(center, zoom, { animate: true });

    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [centerKey, zoom, map]);

  return null;
}

export const PropertyLeafletMap: React.FC<PropertyLeafletMapProps> = ({ property, className = '' }) => {
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('clean');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const markerRef = useRef<L.Marker | null>(null);

  // Derive coordinates based on city and locality
  const coords = useMemo(() => {
    return resolveCoordinates(property.location, property.coordinates, property.city);
  }, [property.location, property.coordinates, property.city]);

  // Contextual points of interest based on location
  const allPOIs = useMemo(() => {
    return getNearbyPOIs(property.location, property.city, coords);
  }, [property.location, property.city, coords]);

  const filteredPOIs = useMemo(() => {
    if (activeCategory === 'all') return allPOIs;
    return allPOIs.filter(p => p.category === activeCategory);
  }, [allPOIs, activeCategory]);

  // Custom DivIcon for the Main Property Marker
  const propertyPinIcon = useMemo(() => {
    const formattedPrice = property.priceDisplay || (property.price ? `₹${property.price.toLocaleString()}` : 'Featured');
    return L.divIcon({
      className: 'property-leaflet-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <!-- Price Badge -->
          <div style="background: #0f172a; color: #f59e0b; border: 1.5px solid #f59e0b; padding: 3px 9px; border-radius: 9999px; font-size: 11px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.35); display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>
            <span>${formattedPrice}</span>
          </div>
          <!-- Pulse Radar and Core Pin -->
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(245, 158, 11, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: #0f172a; border: 2.5px solid #f59e0b; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.45);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
          </div>
          <!-- Pin Pointer Tip -->
          <div style="width: 2px; height: 6px; background: #f59e0b;"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -42]
    });
  }, [property.priceDisplay, property.price]);

  // Custom DivIcon for POIs
  const createPoiIcon = (poi: NearbyPointOfInterest) => {
    let color = '#3b82f6'; // default blue
    let iconChar = '📍';
    if (poi.category === 'transit') {
      color = '#0284c7';
      iconChar = '🚆';
    } else if (poi.category === 'dining') {
      color = '#f97316';
      iconChar = '☕';
    } else if (poi.category === 'healthcare') {
      color = '#ef4444';
      iconChar = '🏥';
    } else if (poi.category === 'education') {
      color = '#8b5cf6';
      iconChar = '🎓';
    } else if (poi.category === 'nature') {
      color = '#10b981';
      iconChar = '🌳';
    }

    return L.divIcon({
      className: 'poi-leaflet-marker',
      html: `
        <div style="transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #ffffff; border: 2px solid ${color}; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: 12px; cursor: pointer;">
          <span>${iconChar}</span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -14]
    });
  };

  // Tile layer configurations
  const layersConfig: Record<MapLayerType, { url: string; attribution: string; maxZoom: number }> = {
    clean: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
      maxZoom: 18
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${encodeURIComponent(property.title + ' ' + property.location)}`;

  return (
    <div className={`relative flex flex-col bg-slate-900 overflow-hidden ${className}`}>
      
      {/* Top Map Control Bar */}
      <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </span>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>{property.location}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                {property.city}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Coordinates: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
            </p>
          </div>
        </div>

        {/* Layer Switcher & Quick Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveLayer('clean')}
              className={`px-2 py-1 rounded-md font-medium transition ${activeLayer === 'clean' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
            >
              Voyager
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('street')}
              className={`px-2 py-1 rounded-md font-medium transition ${activeLayer === 'street' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
            >
              OSM
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('satellite')}
              className={`px-2 py-1 rounded-md font-medium transition ${activeLayer === 'satellite' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
            >
              Satellite
            </button>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition shadow-xs"
            title="Open in Google Maps"
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden sm:inline">Directions</span>
          </a>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-950">
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={zoomLevel}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full z-0"
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            key={activeLayer}
            url={layersConfig[activeLayer].url}
            attribution={layersConfig[activeLayer].attribution}
            maxZoom={layersConfig[activeLayer].maxZoom}
          />

          <ZoomControl position="bottomright" />
          <MapUpdater center={[coords.lat, coords.lng]} zoom={zoomLevel} />

          {/* Main Property Marker */}
          <Marker 
            position={[coords.lat, coords.lng]} 
            icon={propertyPinIcon}
            ref={markerRef}
          >
            <Popup className="custom-leaflet-popup" autoPan={false}>
              <div className="p-1 max-w-[210px] text-slate-900">
                {property.image && (
                  <div className="relative h-24 rounded-lg overflow-hidden mb-2 bg-slate-100">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-amber-400">
                      {property.type || 'Property'}
                    </div>
                  </div>
                )}
                <h5 className="font-bold text-xs text-slate-900 line-clamp-1 mb-0.5">
                  {property.title}
                </h5>
                <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{property.location}</span>
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="font-black text-xs text-amber-600">
                    {property.priceDisplay || (property.price ? `₹${property.price.toLocaleString()}` : 'Available')}
                  </span>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    <span>Route</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Nearby Points of Interest Markers */}
          {filteredPOIs.map((poi) => {
            if (typeof poi.lat !== 'number' || typeof poi.lng !== 'number') return null;
            return (
              <Marker
                key={poi.id}
                position={[poi.lat, poi.lng]}
                icon={createPoiIcon(poi)}
              >
                <Popup className="custom-leaflet-popup" autoPan={false}>
                  <div className="p-1 min-w-[150px] text-slate-900">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      {poi.category}
                    </span>
                    <p className="font-bold text-xs text-slate-900 mt-0.5">{poi.name}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-600 border-t pt-1">
                      <span>Distance: <strong>{poi.distance}</strong></span>
                      <span className="text-amber-600 font-semibold">{poi.duration}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating POI Category Filter Overlay */}
        <div className="absolute top-3 left-3 z-[400] flex flex-wrap gap-1 max-w-[85%]">
          {[
            { id: 'all', label: 'All Places' },
            { id: 'transit', label: '🚆 Metro/Transit' },
            { id: 'healthcare', label: '🏥 Healthcare' },
            { id: 'dining', label: '☕ Food & Malls' },
            { id: 'education', label: '🎓 Schools' },
            { id: 'nature', label: '🌳 Parks' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md transition shadow-xs ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border border-amber-400'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/80 hover:bg-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Recenter Button */}
        <button
          onClick={() => {
            setZoomLevel(15);
            if (markerRef.current) {
              markerRef.current.openPopup();
            }
          }}
          className="absolute bottom-3 left-3 z-[400] px-2.5 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md border border-slate-700 shadow-md transition"
        >
          <RotateCcw className="w-3 h-3 text-amber-400" />
          <span>Recenter Property</span>
        </button>
      </div>

      {/* Commute and Locality Highlights Bar */}
      <div className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Neighborhood Connectivity & Proximity
          </h5>
          <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Prime Hub
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {allPOIs.slice(0, 4).map((poi) => (
            <div 
              key={poi.id}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
            >
              <p className="text-[10px] text-slate-400 truncate font-medium">{poi.name}</p>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="font-bold text-white">{poi.distance}</span>
                <span className="text-amber-400 font-medium text-[10px]">{poi.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
