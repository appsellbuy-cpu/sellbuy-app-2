import React, { useState } from 'react';
import { X, Search, MapPin, Building2, Check } from 'lucide-react';
import { INDIAN_CITIES, JAIPUR_LOCALITIES } from '../utils/formatters';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity?: (city: string) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredLocalities = (JAIPUR_LOCALITIES || []).filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.area.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCities = (INDIAN_CITIES || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Select Jaipur Location / Locality</h3>
              <p className="text-xs text-slate-500">Choose your area in Jaipur, Rajasthan for tailored properties</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search locality in Jaipur (e.g. Vaishali Nagar, Jagatpura, C-Scheme)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm text-slate-800 placeholder-slate-400 transition"
              autoFocus
            />
          </div>

          {/* All Jaipur option */}
          <button
            onClick={() => {
              onSelectCity?.('Jaipur');
              onClose();
            }}
            className={`mt-4 w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
              selectedCity === 'Jaipur' || selectedCity === 'All India'
                ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏰</span>
              <div>
                <div className="text-sm font-bold">All Jaipur, Rajasthan</div>
                <div className="text-xs text-slate-500">Search across all micro-markets & schemes in Jaipur</div>
              </div>
            </div>
            {(selectedCity === 'Jaipur' || selectedCity === 'All India') && <Check className="w-5 h-5 text-amber-600" />}
          </button>
        </div>

        {/* Locality Grid */}
        <div className="p-6 max-h-[380px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Top Jaipur Localities & Hubs
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
            {filteredLocalities.map((loc) => {
              const isSelected = (selectedCity || '').toLowerCase() === loc.name.toLowerCase();
              return (
                <button
                  key={loc.name}
                  onClick={() => {
                    onSelectCity?.(loc.name);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                    <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {loc.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Other Cities in India
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredCities.map((city) => {
              const isSelected = (selectedCity || '').toLowerCase() === (city.name || '').toLowerCase();
              return (
                <button
                  key={city.name}
                  onClick={() => {
                    onSelectCity?.(city.name);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg flex-shrink-0">{city.icon}</span>
                    <div className="truncate">
                      <div className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {city.name}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Need help finding a Jaipur property? 100% Free Consultation</span>
          <span className="text-amber-600 font-semibold">Toll Free: 1800-120-4567</span>
        </div>
      </div>
    </div>
  );
};
