import React, { useState } from 'react';
import { Search, MapPin, Building2, Home, Sparkles, ChevronDown, Check, ShieldCheck, ArrowRight, Tag, SlidersHorizontal } from 'lucide-react';
import { INDIAN_CITIES } from '../utils/formatters';
import { useProperties } from '../context/PropertyContext';

interface HeroProps {
  onNavigate?: (view: string, extraParams?: { listingType?: string; category?: string; city?: string }) => void;
  activeTab?: 'rent' | 'buy' | 'commercial' | 'pg' | 'plot';
  setActiveTab?: (tab: 'rent' | 'buy' | 'commercial' | 'pg' | 'plot') => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedBhk?: string;
  setSelectedBhk?: (bhk: string) => void;
  selectedBudget?: string;
  setSelectedBudget?: (budget: string) => void;
  onSearch?: () => void;
  onOpenPostProperty?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  selectedCity: propSelectedCity,
  onSelectCity: propOnSelectCity,
  searchQuery: propSearchQuery,
  setSearchQuery: propSetSearchQuery,
  selectedBhk: propSelectedBhk,
  setSelectedBhk: propSetSelectedBhk,
  selectedBudget: propSelectedBudget,
  setSelectedBudget: propSetSelectedBudget,
  onSearch: propOnSearch,
  onOpenPostProperty
}) => {
  const { searchLocation, setSearchLocation } = useProperties();

  const [localActiveTab, setLocalActiveTab] = useState<'rent' | 'buy' | 'commercial' | 'pg' | 'plot'>('buy');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localBhk, setLocalBhk] = useState('all');
  const [localBudget, setLocalBudget] = useState('all');

  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propSetActiveTab || setLocalActiveTab;
  const selectedCity = propSelectedCity || searchLocation || 'All India';

  const onSelectCity = (city: string) => {
    if (propOnSelectCity) propOnSelectCity(city);
    if (setSearchLocation) setSearchLocation(city);
  };

  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localSearchQuery;
  const setSearchQuery = propSetSearchQuery || setLocalSearchQuery;
  const selectedBhk = propSelectedBhk !== undefined ? propSelectedBhk : localBhk;
  const setSelectedBhk = propSetSelectedBhk || setLocalBhk;
  const selectedBudget = propSelectedBudget !== undefined ? propSelectedBudget : localBudget;
  const setSelectedBudget = propSetSelectedBudget || setLocalBudget;

  const onSearch = () => {
    if (propOnSearch) {
      propOnSearch();
    } else if (onNavigate) {
      onNavigate(activeTab);
    }
  };
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isBudgetDropdownOpen, setIsBudgetDropdownOpen] = useState(false);

  // Dynamic headings based on selected tab
  const getHeroHeading = () => {
    switch (activeTab) {
      case 'rent':
        return `Properties for rent in ${selectedCity === 'All India' ? 'India' : selectedCity}`;
      case 'buy':
        return `Properties for sale in ${selectedCity === 'All India' ? 'India' : selectedCity}`;
      case 'commercial':
        return `Commercial spaces & offices in ${selectedCity === 'All India' ? 'India' : selectedCity}`;
      case 'pg':
        return `PG & Co-Living spaces in ${selectedCity === 'All India' ? 'India' : selectedCity}`;
      case 'plot':
        return `Plots & Land for sale in ${selectedCity === 'All India' ? 'India' : selectedCity}`;
      default:
        return `Properties in ${selectedCity === 'All India' ? 'India' : selectedCity}`;
    }
  };

  const getBudgets = () => {
    if (activeTab === 'rent' || activeTab === 'pg') {
      return [
        { label: 'All Budgets', value: 'all' },
        { label: 'Under ₹20,000 / mo', value: 'under-20k' },
        { label: '₹20,000 - ₹40,000 / mo', value: '20k-40k' },
        { label: '₹40,000 - ₹75,000 / mo', value: '40k-75k' },
        { label: '₹75,000 - ₹1.5 Lakh / mo', value: '75k-1.5l' },
        { label: 'Above ₹1.5 Lakh / mo', value: 'above-1.5l' }
      ];
    } else {
      return [
        { label: 'All Budgets', value: 'all' },
        { label: 'Under ₹50 Lakh', value: 'under-50l' },
        { label: '₹50 Lakh - ₹1 Crore', value: '50l-1cr' },
        { label: '₹1 Crore - ₹2.5 Crore', value: '1cr-2.5cr' },
        { label: '₹2.5 Crore - ₹5 Crore', value: '2.5cr-5cr' },
        { label: 'Above ₹5 Crore', value: 'above-5cr' }
      ];
    }
  };

  const popularShortcuts = [
    { name: 'Vaishali Nagar', city: 'Jaipur' },
    { name: 'Jagatpura', city: 'Jaipur' },
    { name: 'Malviya Nagar', city: 'Jaipur' },
    { name: 'Mansarovar', city: 'Jaipur' },
    { name: 'C-Scheme', city: 'Jaipur' },
    { name: 'Raja Park', city: 'Jaipur' },
    { name: 'Tonk Road', city: 'Jaipur' },
    { name: 'Ajmer Road', city: 'Jaipur' }
  ];

  return (
    <section className="bg-slate-100 border-b border-slate-200 py-6 sm:py-8 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Marketplace Title & Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
              {getHeroHeading()}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-600" /> Jaipur Real Estate Portal
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> JDA Approved & RERA
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:flex items-center gap-1 text-amber-700">
              <Tag className="w-3.5 h-3.5 text-amber-600" /> 0% Brokerage Direct Owners
            </span>
          </div>
        </div>

        {/* Compact Marketplace Search Container */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/90">
          
          {/* Category Tabs: BUY | RENT | COMMERCIAL | PG | PLOTS */}
          <div className="flex items-center gap-1 sm:gap-2 mb-4 pb-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
            {[
              { id: 'buy', label: 'BUY', count: '1,200+ Properties' },
              { id: 'rent', label: 'RENT', count: '850+ Flats & Houses' },
              { id: 'commercial', label: 'COMMERCIAL', count: '320+ Shops & Offices' },
              { id: 'pg', label: 'PG / CO-LIVING', count: '180+ Hostels' },
              { id: 'plot', label: 'PLOTS', count: '450+ Lands' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    const nextTab = tab.id as any;
                    setActiveTab(nextTab);
                    const targetView = nextTab === 'plot' ? 'plots' : nextTab;
                    if (onNavigate) {
                      onNavigate(targetView);
                    }
                    if (nextTab === 'rent' || nextTab === 'pg') {
                      if (selectedBudget.includes('cr') || selectedBudget.includes('50l')) {
                        setSelectedBudget('all');
                      }
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="hidden md:inline text-[10px] bg-slate-950/10 text-slate-950 px-1.5 py-0.5 rounded font-mono font-medium">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Bar Inputs Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
            
            {/* City / Locality Selector */}
            <div className="relative min-w-[160px]">
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{selectedCity}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50 text-left max-h-60 overflow-y-auto">
                  <button
                    onClick={() => { onSelectCity('All Jaipur'); setIsCityDropdownOpen(false); }}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                      selectedCity === 'All Jaipur' || selectedCity === 'Jaipur' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>🏰 All Jaipur</span>
                    {(selectedCity === 'All Jaipur' || selectedCity === 'Jaipur') && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                  {INDIAN_CITIES.map(c => (
                    <button
                      key={c.name}
                      onClick={() => { onSelectCity(c.name); setIsCityDropdownOpen(false); }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        selectedCity === c.name ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{c.icon} {c.name}</span>
                      {selectedCity === c.name && <Check className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Keyword / Locality Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'rent'
                    ? "Search locality in Jaipur (e.g. Vaishali Nagar, Jagatpura, Malviya Nagar)..."
                    : activeTab === 'pg'
                    ? "Search PG near SKIT, MNIT, Coaching hubs..."
                    : activeTab === 'commercial'
                    ? "Search office spaces, retail shops on Tonk Road, C-Scheme..."
                    : "Search locality, builder, project or area in Jaipur..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSearch();
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition"
              />
            </div>

            {/* Budget Selector */}
            <div className="relative min-w-[160px]">
              <button
                type="button"
                onClick={() => setIsBudgetDropdownOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2 truncate">
                  <Tag className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">
                    {getBudgets().find(b => b.value === selectedBudget)?.label || 'Budget'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>

              {isBudgetDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50 text-left">
                  {getBudgets().map(b => (
                    <button
                      key={b.value}
                      onClick={() => { setSelectedBudget(b.value); setIsBudgetDropdownOpen(false); }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                        selectedBudget === b.value ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{b.label}</span>
                      {selectedBudget === b.value && <Check className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={onSearch}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition transform active:scale-95 flex-shrink-0"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Search Properties</span>
            </button>
          </div>

          {/* BHK & Quick Options Sub-Bar */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-medium mr-1">BHK Filter:</span>
              {['all', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(bhk => (
                <button
                  key={bhk}
                  onClick={() => setSelectedBhk(bhk)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedBhk === bhk
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {bhk === 'all' ? 'All BHKs' : bhk}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <button
                onClick={() => {
                  onSelectCity('Jaipur');
                  if (onNavigate) onNavigate('rent');
                }}
                className="text-amber-700 hover:underline font-semibold"
              >
                0% Brokerage Rentals
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  onSelectCity('Jaipur');
                  if (onNavigate) onNavigate('plots');
                }}
                className="text-slate-700 hover:underline font-semibold"
              >
                JDA Approved Plots
              </button>
            </div>
          </div>
        </div>

        {/* Popular Locality Shortcuts */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <span className="font-semibold text-slate-500 mr-1">Top Localities:</span>
          {popularShortcuts.map((loc, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectCity(loc.city);
                setSearchQuery(loc.name);
                onSearch();
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 shadow-sm transition"
            >
              {loc.name}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
