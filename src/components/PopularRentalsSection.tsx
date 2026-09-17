import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Filter, Building } from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface PopularRentalsSectionProps {
  properties: Property[];
  onOpenDetail: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
  onOpenInquiry: (property: Property) => void;
  onViewAllRentals: () => void;
  selectedCity: string;
}

export const PopularRentalsSection: React.FC<PopularRentalsSectionProps> = ({
  properties,
  onOpenDetail,
  onOpenBooking,
  onOpenInquiry,
  onViewAllRentals,
  selectedCity
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | '1bhk' | '2bhk' | '3bhk' | 'furnished' | 'petFriendly'>('all');

  // Filter properties strictly for rent
  const rentalProperties = (properties || []).filter(p => p.listingType === 'rent');

  const filteredRentals = rentalProperties.filter(p => {
    // City filter if specific city selected
    if (selectedCity && selectedCity !== 'All India') {
      const targetCity = (selectedCity || '').toLowerCase();
      const matchCity = (p.city && p.city.toLowerCase() === targetCity) ||
                        (p.location && p.location.toLowerCase().includes(targetCity));
      if (!matchCity) return false;
    }

    if (activeFilter === '1bhk') return p.beds === 1;
    if (activeFilter === '2bhk') return p.beds === 2;
    if (activeFilter === '3bhk') return p.beds === 3;
    if (activeFilter === 'furnished') return p.furnished || p.furnishing === 'Furnished';
    if (activeFilter === 'petFriendly') return p.petFriendly;
    return true;
  });

  // Take top 6 for the homepage showcase
  const displayedRentals = filteredRentals.length > 0 ? filteredRentals.slice(0, 6) : rentalProperties.slice(0, 6);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Zero Brokerage Rentals
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Popular Properties for Rent {selectedCity !== 'All India' ? `in ${selectedCity}` : 'in India'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Verified owner listings with zero brokerage, immediate move-in options, and online rent agreement support.
            </p>
          </div>

          <button
            onClick={onViewAllRentals}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition group self-start md:self-auto"
          >
            <span>View All {rentalProperties.length} Rental Homes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {[
            { id: 'all', label: 'All Rentals' },
            { id: '1bhk', label: '1 BHK' },
            { id: '2bhk', label: '2 BHK' },
            { id: '3bhk', label: '3 BHK' },
            { id: 'furnished', label: 'Fully Furnished' },
            { id: 'petFriendly', label: '🐾 Pet Friendly' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Property Grid */}
        {displayedRentals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRentals.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onOpenDetail={onOpenDetail}
                onOpenBooking={onOpenBooking}
                onOpenInquiry={onOpenInquiry}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching rentals in {selectedCity}</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing your filters or switching to All India.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700/60 shadow-lg">
          <div>
            <h3 className="text-lg font-bold">Are you a Property Owner in India?</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              List your flat or house for rent in under 2 minutes. 100% Free • Verified tenants.
            </p>
          </div>
          <button
            onClick={onViewAllRentals}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm whitespace-nowrap shadow-md shadow-amber-500/20 transition"
          >
            Post Rental Free
          </button>
        </div>
      </div>
    </section>
  );
};
