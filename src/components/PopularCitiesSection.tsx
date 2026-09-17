import React from 'react';
import { MapPin, ArrowRight, Building } from 'lucide-react';

interface PopularCitiesSectionProps {
  onSelectCity?: (locality: string) => void;
  selectedCity?: string;
  onOpenAllCities?: () => void;
}

export const PopularCitiesSection: React.FC<PopularCitiesSectionProps> = ({
  onSelectCity,
  selectedCity,
  onOpenAllCities
}) => {
  // Major featured Jaipur localities for grid
  const featuredLocalities = [
    {
      name: 'Vaishali Nagar',
      zone: 'West Jaipur',
      count: '420+ Verified Properties',
      rentStarting: '₹18,000/mo',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      tag: 'Luxury Villas & Apartments'
    },
    {
      name: 'Jagatpura',
      zone: 'South-East Jaipur',
      count: '580+ Verified Properties',
      rentStarting: '₹12,000/mo',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
      tag: 'IT & Educational Hub'
    },
    {
      name: 'Malviya Nagar',
      zone: 'South Jaipur',
      count: '390+ Verified Properties',
      rentStarting: '₹16,000/mo',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      tag: 'GT Central & Airport Corridor'
    },
    {
      name: 'Mansarovar',
      zone: 'South-West Jaipur',
      count: '610+ Verified Properties',
      rentStarting: '₹11,000/mo',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
      tag: "Asia's Largest Residential Colony"
    },
    {
      name: 'C-Scheme',
      zone: 'Central Jaipur',
      count: '210+ Verified Properties',
      rentStarting: '₹35,000/mo',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
      tag: 'Upscale & Heritage District'
    },
    {
      name: 'Raja Park',
      zone: 'Central-East Jaipur',
      count: '180+ Verified Properties',
      rentStarting: '₹15,000/mo',
      image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=800&auto=format&fit=crop',
      tag: 'Market & Dining Boulevard'
    },
    {
      name: 'Tonk Road',
      zone: 'South Corridor',
      count: '310+ Verified Properties',
      rentStarting: '₹14,000/mo',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      tag: 'WTP & Commercial Zone'
    },
    {
      name: 'Ajmer Road',
      zone: 'West Corridor',
      count: '490+ Verified Properties',
      rentStarting: '₹10,000/mo',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
      tag: 'SEZ & Express Townships'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Jaipur Prime Locations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Popular Localities in Jaipur, Rajasthan
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Browse top residential micro-markets, JDA approved schemes, tech parks, and commercial hubs in Jaipur.
            </p>
          </div>

          <button
            onClick={onOpenAllCities}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition group self-start md:self-auto"
          >
            <span>Explore All Jaipur Localities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Localities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredLocalities.map((loc) => {
            const isSelected = (selectedCity || '').toLowerCase() === (loc.name || '').toLowerCase();
            return (
              <div
                key={loc.name}
                onClick={() => onSelectCity?.(loc.name)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/10'
                    : 'border-slate-200 hover:border-amber-400 bg-white'
                }`}
              >
                {/* Image Container with Zoom effect */}
                <div className="relative h-44 overflow-hidden bg-slate-200">
                  <img
                    src={loc.image}
                    alt={`${loc.name}, Jaipur`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Tag badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-amber-300 border border-slate-700/60">
                    {loc.tag}
                  </div>

                  {/* Listings count badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm">
                    {loc.count}
                  </div>

                  {/* Locality Name overlay on image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-extrabold font-serif">{loc.name}</h3>
                    <p className="text-xs text-slate-300">{loc.zone}, Jaipur</p>
                  </div>
                </div>

                {/* Bottom stats row */}
                <div className="p-3.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Rent starts at</span>
                    <div className="font-bold text-slate-900">{loc.rentStarting}</div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
