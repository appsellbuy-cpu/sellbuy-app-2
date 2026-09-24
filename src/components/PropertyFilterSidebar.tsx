import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Layers, 
  CheckSquare, 
  SlidersHorizontal, 
  X, 
  Building2, 
  Sparkles, 
  User, 
  Calendar, 
  RotateCcw,
  Compass,
  Smile,
  ShieldAlert
} from 'lucide-react';
import { INDIAN_CITIES } from '../utils/formatters';

export interface FilterState {
  location: string;
  propertyTypes: string[];
  bhk: string[];
  maxPrice: number;
  bathrooms: string[];
  maxArea: number;
  furnishing: string[];
  amenities: string[];
  postedBy: string[];
  availability: string;
  constructionStatus: string[];
  propertyAge: string[];
  facing: string[];
  parking: string[];
  reraApproved: boolean;
  zeroBrokerage: boolean;
  petFriendly: boolean;
}

interface PropertyFilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClearAll: () => void;
  isRentMode?: boolean;
}

export const PropertyFilterSidebar: React.FC<PropertyFilterSidebarProps> = ({
  filters,
  onChange,
  onClearAll,
  isRentMode = false
}) => {
  // Collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: true,
    propertyType: true,
    bhk: true,
    budget: true,
    bathroom: false,
    area: false,
    furnishing: false,
    amenities: false,
    postedBy: false,
    availability: false,
    constructionStatus: false,
    propertyAge: false,
    facing: false,
    parking: false,
    moreFilters: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (field: keyof FilterState, value: string) => {
    const currentList = filters[field] as string[];
    let newList: string[];
    if (currentList.includes(value)) {
      newList = currentList.filter(item => item !== value);
    } else {
      newList = [...currentList, value];
    }
    onChange({ ...filters, [field]: newList });
  };

  const updateSingleField = (field: keyof FilterState, value: any) => {
    onChange({ ...filters, [field]: value });
  };

  // Helper lists
  const propertyTypesList = [
    { value: 'office', label: '🏢 Commercial Office Space' },
    { value: 'commercial', label: '🏬 Commercial Building & Retail' },
    { value: 'factory', label: '🏭 Factory / Industrial Plant' },
    { value: 'godown', label: '📦 Godown / Warehouse' },
    { value: 'apartment', label: '🏠 Flats & Apartments' },
    { value: 'villa', label: '🏡 Villas & Bungalows' },
    { value: 'house', label: '🏘️ Independent Houses' },
    { value: 'plot', label: '📐 Plots / Land' },
    { value: 'shop', label: '🏪 Shops & Showrooms' },
    { value: 'pg', label: '🛏️ PG / Co-Living' }
  ];

  const amenitiesList = [
    'Modular Kitchen', 'Lift', 'Clubhouse', 'Gym', 
    'Swimming Pool', 'Security Guard', 'Balcony', 'Power Backup', 
    'Kids Play Area', 'Water Harvesting', 'Intercom'
  ];

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters?.location && filters.location !== 'All India') count++;
    count += (filters?.propertyTypes || []).length;
    count += (filters?.bhk || []).length;
    if (filters?.maxPrice < (isRentMode ? 200000 : 50000000)) count++;
    count += (filters?.bathrooms || []).length;
    if (filters?.maxArea < 8000) count++;
    count += (filters?.furnishing || []).length;
    count += (filters?.amenities || []).length;
    count += (filters?.postedBy || []).length;
    if (filters?.availability && filters.availability !== 'all') count++;
    count += (filters?.constructionStatus || []).length;
    count += (filters?.propertyAge || []).length;
    count += (filters?.facing || []).length;
    count += (filters?.parking || []).length;
    if (filters?.reraApproved) count++;
    if (filters?.zeroBrokerage) count++;
    if (filters?.petFriendly) count++;
    return count;
  }, [filters, isRentMode]);

  return (
    <aside className="w-full bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-max select-none">
      {/* Header Panel */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">Property Filter Engine</h3>
            <p className="text-[9px] text-slate-400">Apply multi-parameter parameters</p>
          </div>
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg border border-red-500/30 transition font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      {/* Selected Filters chips row */}
      {activeFiltersCount > 0 && (
        <div className="p-3 bg-slate-50/80 border-b border-slate-200/60 flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
          {filters.location && filters.location !== 'All India' && (
            <span className="inline-flex items-center gap-1 bg-amber-500/15 text-[#9A7632] text-[9px] font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
              📍 {filters.location}
              <X className="w-2.5 h-2.5 cursor-pointer ml-1 text-slate-500 hover:text-slate-800" onClick={() => updateSingleField('location', 'All India')} />
            </span>
          )}

          {filters.propertyTypes.map(t => (
            <span key={t} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
              🏘️ {t}
              <X className="w-2.5 h-2.5 cursor-pointer ml-1 text-slate-500 hover:text-slate-800" onClick={() => handleCheckboxChange('propertyTypes', t)} />
            </span>
          ))}

          {filters.bhk.map(b => (
            <span key={b} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
              🛏️ {b} BHK
              <X className="w-2.5 h-2.5 cursor-pointer ml-1 text-slate-500 hover:text-slate-800" onClick={() => handleCheckboxChange('bhk', b)} />
            </span>
          ))}

          {filters.furnishing.map(f => (
            <span key={f} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
              🛋️ {f}
              <X className="w-2.5 h-2.5 cursor-pointer ml-1 text-slate-500 hover:text-slate-800" onClick={() => handleCheckboxChange('furnishing', f)} />
            </span>
          ))}

          {filters.reraApproved && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
              ✓ RERA
              <X className="w-2.5 h-2.5 cursor-pointer ml-1 text-slate-500 hover:text-slate-800" onClick={() => updateSingleField('reraApproved', false)} />
            </span>
          )}

          {filters.zeroBrokerage && (
            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-indigo-200">
              💰 No Broker
              <X className="w-2.5 h-2.5 cursor-pointer ml-1 text-slate-500 hover:text-slate-800" onClick={() => updateSingleField('zeroBrokerage', false)} />
            </span>
          )}

          {filters.petFriendly && (
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-rose-200">
              🐾 Pet Friendly
              <X className="w-2.5 h-2.5 cursor-pointer ml-1 text-slate-500 hover:text-slate-800" onClick={() => updateSingleField('petFriendly', false)} />
            </span>
          )}
        </div>
      )}

      {/* Accordion List Content */}
      <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto scrollbar-thin">
        
        {/* 1. Location Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Location</span>
            </span>
            {openSections.location ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.location && (
            <div className="mt-2.5 pt-1 space-y-2">
              <select
                value={filters.location}
                onChange={(e) => updateSingleField('location', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#C5A059]"
              >
                <option value="All India">🇮🇳 All India</option>
                {INDIAN_CITIES.map(c => (
                  <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 2. Property Type Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('propertyType')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Property Type</span>
            </span>
            {openSections.propertyType ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.propertyType && (
            <div className="mt-2 pt-1 space-y-1.5">
              {propertyTypesList.map(item => (
                <label key={item.value} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.propertyTypes.includes(item.value)}
                    onChange={() => handleCheckboxChange('propertyTypes', item.value)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 3. BHK Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('bhk')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>BHK</span>
            </span>
            {openSections.bhk ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.bhk && (
            <div className="mt-2 pt-1 flex flex-wrap gap-1.5">
              {['1', '2', '3', '4', '5'].map(val => {
                const isSelected = filters.bhk.includes(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleCheckboxChange('bhk', val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400 font-black'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {val} BHK
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Budget Slider Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('budget')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>💰</span>
              <span>{isRentMode ? 'Monthly Budget (Rent)' : 'Budget (Sale)'}</span>
            </span>
            {openSections.budget ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.budget && (
            <div className="mt-2.5 pt-1 space-y-2 text-xs">
              <div className="text-slate-600 font-bold text-[11px]">
                Max: <span className="text-[#9A7632] font-extrabold">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={isRentMode ? 5000 : 2500000}
                max={isRentMode ? 200000 : 50000000}
                step={isRentMode ? 5000 : 1000000}
                value={filters.maxPrice}
                onChange={(e) => updateSingleField('maxPrice', Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{isRentMode ? '₹5K' : '₹25L'}</span>
                <span>{isRentMode ? '₹2 Lakh' : '₹5 Crore'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Bathrooms Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('bathroom')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>🛁</span>
              <span>Bathrooms</span>
            </span>
            {openSections.bathroom ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.bathroom && (
            <div className="mt-2 pt-1 flex flex-wrap gap-1.5">
              {['1', '2', '3', '4+'].map(val => {
                const isSelected = filters.bathrooms.includes(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleCheckboxChange('bathrooms', val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {val} Bath
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Area Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('area')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>📐</span>
              <span>Super Area (Sq.Ft.)</span>
            </span>
            {openSections.area ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.area && (
            <div className="mt-2.5 pt-1 space-y-2 text-xs">
              <div className="text-slate-600 font-bold text-[11px]">
                Up to <span className="text-[#9A7632] font-extrabold">{filters.maxArea} Sq.Ft.</span>
              </div>
              <input
                type="range"
                min={200}
                max={8000}
                step={100}
                value={filters.maxArea}
                onChange={(e) => updateSingleField('maxArea', Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>200 Sqft</span>
                <span>8000 Sqft</span>
              </div>
            </div>
          )}
        </div>

        {/* 7. Furnishing Status Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('furnishing')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>🛋️</span>
              <span>Furnishing Status</span>
            </span>
            {openSections.furnishing ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.furnishing && (
            <div className="mt-2 pt-1 space-y-1.5">
              {[
                { value: 'Fully Furnished', label: '✨ Fully Furnished (Plug & Play)' },
                { value: 'Semi-Furnished', label: '🛋️ Semi-Furnished' },
                { value: 'Unfurnished', label: '🧱 Unfurnished / Bare Shell' }
              ].map(f => (
                <label key={f.value} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.furnishing.includes(f.value) || (f.value === 'Fully Furnished' && filters.furnishing.includes('Furnished'))}
                    onChange={() => handleCheckboxChange('furnishing', f.value)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 8. Amenities Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('amenities')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Amenities</span>
            </span>
            {openSections.amenities ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.amenities && (
            <div className="mt-2 pt-1 space-y-1.5">
              {amenitiesList.map(a => (
                <label key={a} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(a)}
                    onChange={() => handleCheckboxChange('amenities', a)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 9. Posted By Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('postedBy')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Posted By</span>
            </span>
            {openSections.postedBy ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.postedBy && (
            <div className="mt-2 pt-1 space-y-1.5">
              {['Owner', 'Verified Agent', 'Builder'].map(poster => (
                <label key={poster} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.postedBy.includes(poster)}
                    onChange={() => handleCheckboxChange('postedBy', poster)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{poster}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 10. Availability Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Availability</span>
            </span>
            {openSections.availability ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.availability && (
            <div className="mt-2 pt-1 space-y-2">
              <select
                value={filters.availability}
                onChange={(e) => updateSingleField('availability', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#C5A059]"
              >
                <option value="all">Any Availability</option>
                <option value="Immediate">Immediate Move-In</option>
                <option value="30 Days">Within 30 Days</option>
                <option value="60 Days">Within 60 Days</option>
              </select>
            </div>
          )}
        </div>

        {/* 11. Construction Status Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('constructionStatus')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>🏗️</span>
              <span>Construction Status</span>
            </span>
            {openSections.constructionStatus ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.constructionStatus && (
            <div className="mt-2 pt-1 space-y-1.5">
              {['Ready to Move', 'Under Construction'].map(status => (
                <label key={status} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.constructionStatus.includes(status)}
                    onChange={() => handleCheckboxChange('constructionStatus', status)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 12. Property Age Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('propertyAge')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>⌛</span>
              <span>Property Age</span>
            </span>
            {openSections.propertyAge ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.propertyAge && (
            <div className="mt-2 pt-1 space-y-1.5">
              {['New Construction', '1-3 Years', '3-5 Years', '5+ Years'].map(age => (
                <label key={age} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.propertyAge.includes(age)}
                    onChange={() => handleCheckboxChange('propertyAge', age)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{age}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 13. Facing Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('facing')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Facing (Vastu Direction)</span>
            </span>
            {openSections.facing ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.facing && (
            <div className="mt-2 pt-1 space-y-1.5">
              {['East', 'North-East', 'North', 'West', 'South'].map(dir => (
                <label key={dir} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.facing.includes(dir)}
                    onChange={() => handleCheckboxChange('facing', dir)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{dir}-Facing</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 14. Parking Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('parking')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>🚗</span>
              <span>Parking</span>
            </span>
            {openSections.parking ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.parking && (
            <div className="mt-2 pt-1 space-y-1.5">
              {['Covered Parking', 'Open Parking', 'None'].map(pOption => (
                <label key={pOption} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.parking.includes(pOption)}
                    onChange={() => handleCheckboxChange('parking', pOption)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <span>{pOption}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 15. More Filters Section */}
        <div className="p-3">
          <button 
            type="button" 
            onClick={() => toggleSection('moreFilters')}
            className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>More Filters</span>
            </span>
            {openSections.moreFilters ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openSections.moreFilters && (
            <div className="mt-2 pt-1 space-y-3">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.reraApproved}
                  onChange={(e) => updateSingleField('reraApproved', e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800 block">RERA Approved Only</span>
                  <span className="text-[10px] text-slate-400">Filter fully verified RERA properties</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.zeroBrokerage}
                  onChange={(e) => updateSingleField('zeroBrokerage', e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Zero Brokerage</span>
                  <span className="text-[10px] text-slate-400">Direct owner & builder listings</span>
                </div>
              </label>

              {isRentMode && (
                <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.petFriendly}
                    onChange={(e) => updateSingleField('petFriendly', e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">Pet Friendly Only</span>
                    <span className="text-[10px] text-slate-400">Properties welcoming pets</span>
                  </div>
                </label>
              )}
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};
