import React, { useState, useMemo } from 'react';
import { Compass, Search, CheckCircle2, ShieldCheck, PlusCircle, Trees } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { INDIAN_CITIES } from '../utils/formatters';

interface PlotsPageProps {
  onSelectProperty: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
  onOpenInquiry: (property: Property) => void;
  onOpenPostProperty: () => void;
}

export const PlotsPage: React.FC<PlotsPageProps> = ({
  onSelectProperty,
  onOpenBooking,
  onOpenInquiry,
  onOpenPostProperty
}) => {
  const { properties, selectedCity, setSelectedCity } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');

  const plotProperties = useMemo(() => {
    return (properties || []).filter(p => {
      if (p.listingType !== 'plot' && p.category !== 'plot') return false;

      if (selectedCity && selectedCity !== 'All India' && p.city && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLoc = (p.locality || p.location).toLowerCase().includes(q);
        if (!matchTitle && !matchLoc) return false;
      }

      return true;
    });
  }, [properties, selectedCity, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
                <Compass className="w-4 h-4" /> Residential & Commercial Land Plots
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight">
                Plots & Land for Sale in {selectedCity || 'India'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                Clear title freehold plots, gated community layouts, corner plots, and farm lands with complete legal verification and demarcation.
              </p>
            </div>

            <button
              onClick={onOpenPostProperty}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Land / Plot FREE</span>
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by highway, corridor, or micro-market..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
          >
            <option value="All India">🇮🇳 All India</option>
            {INDIAN_CITIES.map(c => (
              <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-900">
            Showing <span className="text-amber-600 font-extrabold">{plotProperties.length}</span> plot & land listings
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plotProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
              onOpenBooking={onOpenBooking}
              onOpenInquiry={onOpenInquiry}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
