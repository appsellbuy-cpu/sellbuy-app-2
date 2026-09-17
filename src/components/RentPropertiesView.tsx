import React, { useState, useRef, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Property, PropertySortOption } from '../types';
import { 
  Key, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ArrowUpDown, 
  ChevronDown, 
  Check, 
  Heart, 
  Scale, 
  Search, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  X, 
  RotateCcw,
  SlidersHorizontal,
  Home,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const RENT_SORT_OPTIONS: { value: PropertySortOption; label: string; desc: string }[] = [
  { value: 'featured', label: 'Curated & Featured', desc: 'Hand-picked luxury residences' },
  { value: 'price-asc', label: 'Monthly Rent: Low to High', desc: 'Ascending monthly rate' },
  { value: 'price-desc', label: 'Monthly Rent: High to Low', desc: 'Descending monthly rate' },
  { value: 'newest', label: 'Newest Leases', desc: 'Recently added listings' },
  { value: 'beds-desc', label: 'Bedrooms: High to Low', desc: 'Most bedrooms first' },
  { value: 'sqft-desc', label: 'Floor Space: Large to Small', desc: 'Maximum interior sqft' },
];

const PRICE_PRESETS = [
  { id: 'all', label: 'All Rates' },
  { id: 'under-3.5k', label: 'Under $3,500/mo' },
  { id: '3.5k-7k', label: '$3,500 – $7,000/mo' },
  { id: '7k-12k', label: '$7,000 – $12,000/mo' },
  { id: 'above-12k', label: '$12,000+/mo' },
];

const BED_OPTIONS = [
  { id: 'all', label: 'All Beds' },
  { id: '1', label: '1 Bed' },
  { id: '2', label: '2 Beds' },
  { id: '3', label: '3 Beds' },
  { id: '4+', label: '4+ Beds' },
];

export const RentPropertiesView: React.FC = () => {
  const {
    rentalProperties,
    rentPriceRange,
    setRentPriceRange,
    rentFurnishedFilter,
    setRentFurnishedFilter,
    rentPetFriendlyOnly,
    setRentPetFriendlyOnly,
    rentBedsFilter,
    setRentBedsFilter,
    rentSearchLocation,
    setRentSearchLocation,
    rentSortBy,
    setRentSortBy,
    resetRentFilters,
    isRentFiltered,
    openDetail,
    isSaved,
    toggleFavorite,
    isInCompare,
    toggleCompare,
    openCompareModal,
    compareList
  } = useProperties();

  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel = RENT_SORT_OPTIONS.find(o => o.value === rentSortBy)?.label || 'Curated & Featured';

  return (
    <div id="rent-view" className="py-8 sm:py-12 bg-[#FAF9F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Banner */}
        <ScrollReveal className="relative bg-[#0A192F] text-white rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl border border-[#152a4a]">
          {/* Subtle architectural background art */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-full object-cover object-center mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
              <Key className="w-3.5 h-3.5" />
              <span>Executive &amp; Residential Leasing</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Curated Rental Residences
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mt-3 font-light leading-relaxed">
              Explore vetted luxury apartments, furnished urban penthouses, and private estates available for long-term and executive lease worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Verified Landlords &amp; Leases</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>Immediate &amp; Scheduled Move-In</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Concierge &amp; Turnkey Furnished</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Rental Filter Bar */}
        <ScrollReveal delay={100} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200/80 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="rent-search-input"
                value={rentSearchLocation}
                onChange={(e) => setRentSearchLocation(e.target.value)}
                placeholder="Search city, neighborhood, or keywords (e.g. Manhattan, Bali)..."
                className="w-full pl-10 pr-8 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0A192F] placeholder:text-gray-400 focus:outline-none focus:border-[#0A192F] transition-all"
              />
              {rentSearchLocation && (
                <button
                  type="button"
                  onClick={() => setRentSearchLocation('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Furnished Status Filter */}
            <div className="md:col-span-4 flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                id="rent-furnished-all"
                onClick={() => setRentFurnishedFilter('all')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  rentFurnishedFilter === 'all'
                    ? 'bg-white text-[#0A192F] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                id="rent-furnished-only"
                onClick={() => setRentFurnishedFilter('furnished')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  rentFurnishedFilter === 'furnished'
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Furnished
              </button>
              <button
                type="button"
                id="rent-unfurnished-only"
                onClick={() => setRentFurnishedFilter('unfurnished')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  rentFurnishedFilter === 'unfurnished'
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unfurnished
              </button>
            </div>

            {/* Pet Friendly Toggle Button */}
            <div className="md:col-span-3 flex items-center gap-2">
              <button
                type="button"
                id="rent-pet-friendly-toggle"
                onClick={() => setRentPetFriendlyOnly(prev => !prev)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  rentPetFriendlyOnly
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400/20'
                    : 'bg-[#FAF8F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">🐾</span>
                <span>Pet Friendly</span>
                {rentPetFriendlyOnly && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* Quick Price Ranges & Bedrooms Pills Bar */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Monthly Price Preset Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1">
                Monthly Rate:
              </span>
              {PRICE_PRESETS.map(preset => {
                const isActive = rentPriceRange === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`rent-price-pill-${preset.id}`}
                    type="button"
                    onClick={() => setRentPriceRange(preset.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0A192F] text-white font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Bedrooms selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1">
                Bedrooms:
              </span>
              <div className="inline-flex bg-[#FAF8F5] p-0.5 rounded-lg border border-gray-200">
                {BED_OPTIONS.map(bedOpt => {
                  const isActive = rentBedsFilter === bedOpt.id;
                  return (
                    <button
                      key={bedOpt.id}
                      id={`rent-bed-pill-${bedOpt.id}`}
                      type="button"
                      onClick={() => setRentBedsFilter(bedOpt.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#0A192F] shadow-xs'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {bedOpt.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* Results Bar & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-serif font-bold text-[#0A192F]">
              {rentalProperties.length} {rentalProperties.length === 1 ? 'Rental Residence' : 'Rental Residences Available'}
            </span>
            {isRentFiltered && (
              <span className="text-xs text-gray-500 font-normal">
                (filtered from total portfolio)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={openCompareModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#C5A059]/40 text-[#9A7632] hover:bg-[#F3EFE8] transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Compare ({compareList.length})</span>
              </button>
            )}

            {/* Sorting Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                id="rent-sort-dropdown-button"
                onClick={() => setIsSortOpen(prev => !prev)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer shadow-2xs ${
                  rentSortBy !== 'featured'
                    ? 'bg-[#0A192F] text-white border-[#0A192F]'
                    : 'bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 border-gray-200/80'
                }`}
              >
                <ArrowUpDown className={`w-3.5 h-3.5 ${rentSortBy !== 'featured' ? 'text-[#C5A059]' : 'text-gray-500'}`} />
                <span>{currentSortLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div 
                  id="rent-sort-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-30 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2 border-b border-gray-100 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Sort Rentals By
                    </span>
                    {rentSortBy !== 'featured' && (
                      <button
                        onClick={() => {
                          setRentSortBy('featured');
                          setIsSortOpen(false);
                        }}
                        className="text-[10px] font-semibold text-[#C5A059] hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {RENT_SORT_OPTIONS.map((opt) => {
                      const isSelected = rentSortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          id={`rent-sort-option-${opt.value}`}
                          type="button"
                          onClick={() => {
                            setRentSortBy(opt.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF8F5] text-[#0A192F] font-bold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div>
                            <div>{opt.label}</div>
                            <div className="text-[10px] text-gray-400 font-normal">{opt.desc}</div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#C5A059] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {isRentFiltered && (
          <div className="mb-6 p-3 bg-[#FAF8F5] rounded-2xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                Active Filters:
              </span>

              {rentSearchLocation && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 shadow-2xs">
                  Keyword: "{rentSearchLocation}"
                  <button onClick={() => setRentSearchLocation('')} className="hover:text-red-500 ml-1 font-bold">&times;</button>
                </span>
              )}

              {rentPriceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 shadow-2xs">
                  Rate: {PRICE_PRESETS.find(p => p.id === rentPriceRange)?.label}
                  <button onClick={() => setRentPriceRange('all')} className="hover:text-red-500 ml-1 font-bold">&times;</button>
                </span>
              )}

              {rentFurnishedFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 shadow-2xs capitalize">
                  {rentFurnishedFilter}
                  <button onClick={() => setRentFurnishedFilter('all')} className="hover:text-red-500 ml-1 font-bold">&times;</button>
                </span>
              )}

              {rentPetFriendlyOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  🐾 Pet Friendly Only
                  <button onClick={() => setRentPetFriendlyOnly(false)} className="hover:text-red-500 ml-1 font-bold">&times;</button>
                </span>
              )}

              {rentBedsFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 shadow-2xs">
                  {BED_OPTIONS.find(b => b.id === rentBedsFilter)?.label}
                  <button onClick={() => setRentBedsFilter('all')} className="hover:text-red-500 ml-1 font-bold">&times;</button>
                </span>
              )}

              {rentSortBy !== 'featured' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#0A192F] text-white shadow-2xs">
                  <ArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                  Sort: {currentSortLabel}
                  <button onClick={() => setRentSortBy('featured')} className="hover:text-[#C5A059] ml-1 font-bold">&times;</button>
                </span>
              )}
            </div>

            <button
              onClick={resetRentFilters}
              className="text-xs font-bold text-[#C5A059] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all filters
            </button>
          </div>
        )}

        {/* Rental Properties Grid */}
        {rentalProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
              <Key className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0A192F] mb-2">
              No Rental Residences Match Your Criteria
            </h3>
            <p className="text-xs text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find active rental listings matching your selected price range, furnishing status, or location filters.
            </p>
            <button
              type="button"
              onClick={resetRentFilters}
              className="px-6 py-2.5 bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#152a4a] transition-all cursor-pointer shadow-sm"
            >
              Reset Filters &amp; View All Rentals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rentalProperties.map((property, index) => {
              const saved = isSaved(property.id);
              const inCompare = isInCompare(property.id);

              return (
                <ScrollReveal
                  key={property.id}
                  delay={index * 80}
                  className="h-full"
                >
                  <div
                    id={`rent-card-${property.id}`}
                    onClick={() => openDetail(property)}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
                  >
                    {/* Image Header with Rental Badges */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Top Left Tags: Lease & Furnished */}
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 z-10">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#0A192F]/90 backdrop-blur-md text-white rounded-lg shadow-sm flex items-center gap-1">
                          <Key className="w-3 h-3 text-[#C5A059]" />
                          For Rent
                        </span>
                        {property.furnished && (
                          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider bg-white/95 backdrop-blur-md text-[#0A192F] rounded-lg shadow-sm">
                            Furnished
                          </span>
                        )}
                        {property.petFriendly && (
                          <span className="px-2 py-1 text-[10px] font-bold bg-emerald-700/90 text-white rounded-lg shadow-sm flex items-center gap-1">
                            🐾 Pets OK
                          </span>
                        )}
                      </div>

                      {/* Top Right Actions */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
                        <button
                          type="button"
                          id={`rent-compare-btn-${property.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(property);
                          }}
                          className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm cursor-pointer ${
                            inCompare
                              ? 'bg-[#C5A059] text-[#0A192F]'
                              : 'bg-white/90 text-gray-700 hover:text-[#0A192F] hover:bg-white'
                          }`}
                          title={inCompare ? "Remove from comparison" : "Compare"}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          id={`rent-fav-btn-${property.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property);
                          }}
                          className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm cursor-pointer ${
                            saved
                              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                              : 'bg-white/90 text-gray-700 hover:text-rose-500 hover:bg-white'
                          }`}
                          title={saved ? "Remove from Saved" : "Save Listing"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Image Sub-strip (Available date) */}
                      {property.availableDate && (
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-white font-medium drop-shadow-md">
                          <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            Move-In: {property.availableDate}
                          </span>
                          {property.leaseDuration && (
                            <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                              {property.leaseDuration}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Location */}
                        <div className="flex items-center text-xs text-gray-500 mb-1.5 font-medium">
                          <MapPin size={13} className="mr-1 text-[#C5A059] shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-serif font-bold text-[#0A192F] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                          {property.title}
                        </h3>

                        {/* Description snippet */}
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed font-light">
                          {property.description}
                        </p>

                        {/* Price & Deposit Display */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-bold text-[#0A192F] font-sans">
                              ${property.price.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-gray-500 ml-1">
                              / month
                            </span>
                          </div>

                          {property.deposit && (
                            <span className="text-[11px] text-gray-400 font-medium">
                              Deposit: ${property.deposit.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Specs and Book Viewing Action Row */}
                      <div className="space-y-3 pt-2">
                        {/* Specs */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#FAF8F5] rounded-xl text-center text-xs text-gray-600">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-gray-400">Beds</span>
                            <span className="font-bold text-[#0A192F] flex items-center gap-1 mt-0.5">
                              <Bed className="w-3.5 h-3.5 text-[#C5A059]" /> {property.beds}
                            </span>
                          </div>
                          <div className="flex flex-col items-center border-x border-gray-200">
                            <span className="text-[10px] uppercase text-gray-400">Baths</span>
                            <span className="font-bold text-[#0A192F] flex items-center gap-1 mt-0.5">
                              <Bath className="w-3.5 h-3.5 text-[#C5A059]" /> {property.baths}
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-gray-400">Space</span>
                            <span className="font-bold text-[#0A192F] flex items-center gap-1 mt-0.5">
                              <Square className="w-3.5 h-3.5 text-[#C5A059]" /> {property.sqft.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Button: Book Viewing / Apply */}
                        <button
                          type="button"
                          id={`rent-book-btn-${property.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetail(property);
                          }}
                          className="w-full py-2.5 px-4 bg-[#0A192F] hover:bg-[#152a4a] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:bg-[#C5A059] group-hover:text-[#0A192F]"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Viewing &amp; Lease Details</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
