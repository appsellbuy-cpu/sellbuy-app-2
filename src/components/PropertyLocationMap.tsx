import React, { useEffect, useRef, useState } from 'react';
import { Property } from '../types';
import { resolveCoordinates, getNearbyPOIs, NearbyPointOfInterest } from '../utils/geoUtils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Coffee, 
  Train, 
  TreePine, 
  GraduationCap, 
  Sparkles,
  Compass,
  RotateCcw
} from 'lucide-react';

interface PropertyLocationMapProps {
  property: Property;
  className?: string;
}

type MapLayerType = 'editorial' | 'satellite' | 'street';

export const PropertyLocationMap: React.FC<PropertyLocationMapProps> = ({ property, className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('editorial');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePoiFilter, setActivePoiFilter] = useState<string>('all');

  const coords = resolveCoordinates(property.location, property.coordinates);
  const pois = getNearbyPOIs(property.location);

  // Filtered POIs
  const filteredPois = activePoiFilter === 'all' 
    ? (pois || []) 
    : (pois || []).filter(p => p.category === activePoiFilter);

  // Initialize and update map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if container changed
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add Attribution in bottom right with minimal styling
    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>')
      .addTo(map);

    // Custom Zoom Control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Define Tile layers
    const layerUrls: Record<MapLayerType, { url: string; options: L.TileLayerOptions }> = {
      editorial: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        options: {
          subdomains: 'abcd',
          maxZoom: 19
        }
      },
      satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 18
        }
      },
      street: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          maxZoom: 19
        }
      }
    };

    const currentLayerConfig = layerUrls[activeLayer];
    const tileLayer = L.tileLayer(currentLayerConfig.url, currentLayerConfig.options).addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom Luxury Pin Marker
    const customIcon = L.divIcon({
      className: 'custom-property-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(197, 160, 89, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #0A192F; border: 2.5px solid #C5A059; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(10, 25, 47, 0.35); cursor: pointer;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });

    const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map);
    markerRef.current = marker;

    // Popup content
    const popupContent = `
      <div style="font-family: inherit; font-size: 12px; color: #0A192F; width: 190px; padding: 4px;">
        <div style="position: relative; height: 90px; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
          <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 6px; left: 6px; background: #0A192F; color: #C5A059; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px;">
            ${property.category}
          </span>
        </div>
        <strong style="display: block; font-size: 13px; margin-bottom: 2px; line-height: 1.3;">${property.title}</strong>
        <span style="color: #64748B; font-size: 11px; display: block; margin-bottom: 6px;">${property.location}</span>
        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 6px;">
          <span style="font-size: 14px; font-weight: bold; color: #0A192F;">$${property.price.toLocaleString()}</span>
          <span style="font-size: 10px; color: #C5A059; font-weight: 600;">NavikX Prime</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      closeButton: false,
      maxWidth: 240,
      className: 'custom-leaflet-popup'
    });

    // Auto open popup after subtle delay
    const timer = setTimeout(() => {
      marker.openPopup();
      map.invalidateSize();
    }, 400);

    // Invalidate size on window resize
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coords.lat, coords.lng, property.id]);

  // Handle Layer change dynamically without full re-render
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const layerUrls: Record<MapLayerType, { url: string; options: L.TileLayerOptions }> = {
      editorial: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        options: { subdomains: 'abcd', maxZoom: 19 }
      },
      satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 18 }
      },
      street: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: { maxZoom: 19 }
      }
    };

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const config = layerUrls[activeLayer];
    const newLayer = L.tileLayer(config.url, config.options).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [activeLayer]);

  // Reset View to original coordinates
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14, { duration: 1 });
      markerRef.current?.openPopup();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dining':
        return <Coffee className="w-3.5 h-3.5 text-amber-600" />;
      case 'transit':
        return <Train className="w-3.5 h-3.5 text-blue-600" />;
      case 'nature':
        return <TreePine className="w-3.5 h-3.5 text-emerald-600" />;
      case 'education':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />;
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${encodeURIComponent(property.title + ' ' + property.location)}`;
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=15/${coords.lat}/${coords.lng}`;

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs ${className}`}>
      
      {/* Map Header & Controls Bar */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0A192F] text-[#C5A059]">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#0A192F] tracking-tight flex items-center gap-2">
                Geographic Location & Neighborhood
              </h4>
              <p className="text-xs text-gray-500">
                {property.location} &bull; Coordinates: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
              </p>
            </div>
          </div>
        </div>

        {/* Layer Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveLayer('editorial')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              activeLayer === 'editorial'
                ? 'bg-[#0A192F] text-white font-semibold'
                : 'text-gray-600 hover:text-[#0A192F] hover:bg-gray-50'
            }`}
          >
            Editorial
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              activeLayer === 'satellite'
                ? 'bg-[#0A192F] text-white font-semibold'
                : 'text-gray-600 hover:text-[#0A192F] hover:bg-gray-50'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('street')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              activeLayer === 'street'
                ? 'bg-[#0A192F] text-white font-semibold'
                : 'text-gray-600 hover:text-[#0A192F] hover:bg-gray-50'
            }`}
          >
            Street
          </button>
        </div>
      </div>

      {/* Map Display Frame */}
      <div className={`relative w-full ${isFullscreen ? 'h-[500px]' : 'h-[320px] sm:h-[360px]'} transition-all duration-300`}>
        {/* Leaflet Map DOM Node */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md shadow-md text-[#0A192F] hover:bg-white hover:text-[#C5A059] border border-gray-100 transition-all text-xs font-medium flex items-center gap-1.5"
            title="Recenter property"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline">Recenter</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
              }, 320);
            }}
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md shadow-md text-[#0A192F] hover:bg-white border border-gray-100 transition-all text-xs font-medium flex items-center gap-1.5"
            title={isFullscreen ? 'Collapse map' : 'Expand map view'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>

        {/* Floating External Directions Button */}
        <div className="absolute bottom-3 left-3 z-20">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#0A192F]/90 backdrop-blur-md text-white hover:bg-[#0A192F] transition-all text-xs font-medium flex items-center gap-1.5 shadow-lg border border-white/20"
          >
            <Navigation className="w-3 h-3 text-[#C5A059]" />
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </div>

      {/* Neighborhood Points of Interest Section */}
      <div className="p-5 border-t border-gray-100 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">
              What's Nearby & Transit Accessibility
            </h5>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {['all', 'transit', 'dining', 'nature', 'education'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActivePoiFilter(cat)}
                className={`px-2.5 py-0.5 rounded-full capitalize font-medium transition-all ${
                  activePoiFilter === cat
                    ? 'bg-[#C5A059] text-[#0A192F] font-semibold'
                    : 'text-gray-500 hover:text-[#0A192F] hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* POI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredPois.map((poi) => (
            <div
              key={poi.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5]/80 border border-gray-100 text-xs hover:border-[#C5A059]/40 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="p-1 rounded-md bg-white shadow-2xs shrink-0">
                  {getCategoryIcon(poi.category)}
                </span>
                <span className="text-[#0A192F] font-medium truncate">
                  {poi.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-gray-800 font-semibold block">{poi.distance}</span>
                <span className="text-[10px] text-gray-500 block">{poi.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Walkability & Transit Index Score Bar */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong className="text-gray-800">92/100</strong> Walk Score (Walker's Paradise)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <strong className="text-gray-800">86/100</strong> Transit Score
            </span>
          </div>

          <a
            href={openStreetMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View on OpenStreetMap</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};
