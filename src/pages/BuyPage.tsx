import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  CheckCircle2, 
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from '../components/PropertyCard';
import { PageTitleArea } from '../components/PageTitleArea';
import { Property } from '../types';
import { PropertyFilterSidebar, FilterState } from '../components/PropertyFilterSidebar';

interface BuyPageProps {
  onSelectProperty: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
  onOpenInquiry: (property: Property) => void;
  onOpenEMICalculator: () => void;
  onOpenPostProperty: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  location: 'All India',
  propertyTypes: [],
  bhk: [],
  maxPrice: 50000000,
  bathrooms: [],
  maxArea: 8000,
  furnishing: [],
  amenities: [],
  postedBy: [],
  availability: 'all',
  constructionStatus: [],
  propertyAge: [],
  facing: [],
  parking: [],
  reraApproved: false,
  zeroBrokerage: false,
  petFriendly: false
};

export const BuyPage: React.FC<BuyPageProps> = ({
  onSelectProperty,
  onOpenBooking,
  onOpenInquiry,
  onOpenEMICalculator,
  onOpenPostProperty
}) => {
  const { properties, selectedCity, setSelectedCity, showToast } = useProperties();

  // Search input & sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'newest'>('newest');

  // Unified Filter State
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    location: selectedCity || 'All India'
  });

  // Sync selectedCity context with side filters location
  useEffect(() => {
    if (selectedCity && selectedCity !== filters.location) {
      setFilters(prev => ({ ...prev, location: selectedCity }));
    }
  }, [selectedCity]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (newFilters.location !== selectedCity) {
      setSelectedCity(newFilters.location);
    }
  };

  const handleClearAll = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      location: selectedCity || 'All India'
    });
    setSearchTerm('');
    showToast('All filters cleared!');
  };

  // Memoized Buy Properties Matching Engine
  const buyProperties = useMemo(() => {
    return (properties || []).filter(p => {
      // 1. Core Listing Type
      if (p.listingType !== 'buy') return false;

      // 2. City Filter
      if (filters.location && filters.location !== 'All India') {
        if (!p.city || p.city.toLowerCase() !== filters.location.toLowerCase()) {
          return false;
        }
      }

      // 3. Search Bar Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLoc = (p.locality || p.location || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchDesc) return false;
      }

      // 4. Property Category (Types)
      if ((filters?.propertyTypes || []).length > 0) {
        if (!filters.propertyTypes.includes(p.category)) return false;
      }

      // 5. BHK Count
      if ((filters?.bhk || []).length > 0) {
        if (!filters.bhk.includes(p.beds.toString())) return false;
      }

      // 6. Max Budget
      if (p.price > (filters?.maxPrice || 50000000)) return false;

      // 7. Bathrooms
      if ((filters?.bathrooms || []).length > 0) {
        const hasMatch = filters.bathrooms.some(bVal => {
          if (bVal === '4+') return p.baths >= 4;
          return p.baths.toString() === bVal;
        });
        if (!hasMatch) return false;
      }

      // 8. Max Area (Sq.Ft.)
      if (p.sqft > (filters?.maxArea || 8000)) return false;

      // 9. Furnishing Conditions
      if ((filters?.furnishing || []).length > 0) {
        if (!p.furnishing || !filters.furnishing.includes(p.furnishing)) return false;
      }

      // 10. Required Amenities (Must match all selected ones)
      if ((filters?.amenities || []).length > 0) {
        if (!p.amenities) return false;
        const matchesAll = filters.amenities.every(required => 
          p.amenities?.some(has => has.toLowerCase() === required.toLowerCase())
        );
        if (!matchesAll) return false;
      }

      // 11. Posted By
      if ((filters?.postedBy || []).length > 0) {
        if (!p.postedBy || !filters.postedBy.includes(p.postedBy)) return false;
      }

      // 12. Construction possession status
      if ((filters?.constructionStatus || []).length > 0) {
        if (!p.possessionStatus || !filters.constructionStatus.includes(p.possessionStatus)) return false;
      }

      // 13. Property Age
      if ((filters?.propertyAge || []).length > 0) {
        if (!p.ageOfProperty || !filters.propertyAge.includes(p.ageOfProperty)) return false;
      }

      // 14. Vastu direction facing
      if ((filters?.facing || []).length > 0) {
        if (!p.facing || !filters.facing.includes(p.facing)) return false;
      }

      // 15. Parking configurations
      if ((filters?.parking || []).length > 0) {
        if (!p.parking || !filters.parking.includes(p.parking)) return false;
      }

      // 16. RERA Approved
      if (filters.reraApproved && !p.reraApproved) return false;

      // 17. Zero Brokerage
      if (filters.zeroBrokerage && !p.zeroBrokerage) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return b.id.localeCompare(a.id);
    });
  }, [properties, filters, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Area */}
        <div className="mb-8">
          <PageTitleArea
            title={`Properties for Sale: Independent Houses, Apartments and Plots in ${filters.location}`}
            subtitle={`Explore JDA approved and RERA registered luxury apartments, duplexes, and gated plots with home loan interest support and direct builder deals.`}
            totalCount={buyProperties.length}
            locationName={filters.location}
            activeType="buy"
            sortBy={sortBy}
            onSortChange={(val) => setSortBy(val as any)}
            categoryTags={['RERA Registered', 'JDA Approved Patta', 'Pre-Approved Home Loans', 'Direct Developer & Resale']}
          />
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR (20-25% Desktop Width) */}
          <div className="w-full lg:w-[24%] flex-shrink-0">
            <PropertyFilterSidebar 
              filters={filters}
              onChange={handleFiltersChange}
              onClearAll={handleClearAll}
              isRentMode={false}
            />
          </div>

          {/* RIGHT LISTING RESULTS (75-80% Desktop Width) */}
          <div className="flex-1 space-y-6">
            
            {/* Top Search & Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by builder, project name, locality, landmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-400 font-bold hidden sm:inline whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full md:w-44 px-3.5 py-3 rounded-2xl border border-slate-200 text-xs text-slate-700 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  <option value="newest">⏰ Newest Listings</option>
                  <option value="price_asc">📉 Rent/Price: Low to High</option>
                  <option value="price_desc">📈 Rent/Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results Title Count */}
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                Showing <span className="text-[#9A7632] font-black">{buyProperties.length}</span> verified buy listings
              </p>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-md uppercase">
                Instant Bank Loans Ready
              </span>
            </div>

            {/* Grid display */}
            {buyProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No properties matched your filters</h3>
                <p className="text-xs text-slate-500">
                  Try widening your price range, toggling other amenities, or selecting another nearby location.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-[#9A7632] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {buyProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={onSelectProperty}
                    onOpenBooking={onOpenBooking}
                    onOpenInquiry={onOpenInquiry}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
