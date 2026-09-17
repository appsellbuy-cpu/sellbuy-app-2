import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  Search, 
  MapPin, 
  CheckCircle2, 
  SlidersHorizontal, 
  X,
  Building2
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from '../components/PropertyCard';
import { PageTitleArea } from '../components/PageTitleArea';
import { Property } from '../types';
import { PropertyFilterSidebar, FilterState } from '../components/PropertyFilterSidebar';

interface RentPageProps {
  onSelectProperty: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
  onOpenInquiry: (property: Property) => void;
  onOpenPostProperty: () => void;
  onOpenRentAgreement: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  location: 'All India',
  propertyTypes: [],
  bhk: [],
  maxPrice: 150000, // 1.5 Lakh max rent limit
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

export const RentPage: React.FC<RentPageProps> = ({
  onSelectProperty,
  onOpenBooking,
  onOpenInquiry,
  onOpenPostProperty,
  onOpenRentAgreement
}) => {
  const { properties, selectedCity, setSelectedCity, showToast } = useProperties();

  // Search input & sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'newest'>('newest');

  // Lease durations or preferred tenants (Specific to Renting)
  const [preferredTenant, setPreferredTenant] = useState<string>('all');

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
    setPreferredTenant('all');
    showToast('All filters cleared!');
  };

  // Memoized Rent Properties Matching Engine
  const rentalProperties = useMemo(() => {
    return (properties || []).filter(p => {
      // 1. Must be rent or PG listing types
      if (p.listingType !== 'rent' && p.listingType !== 'pg') return false;

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
      if (filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(p.category)) return false;
      }

      // 5. BHK Count
      if (filters.bhk.length > 0) {
        if (!filters.bhk.includes(p.beds.toString())) return false;
      }

      // 6. Max Monthly Rent Price
      if (p.price > filters.maxPrice) return false;

      // 7. Bathrooms
      if (filters.bathrooms.length > 0) {
        const hasMatch = filters.bathrooms.some(bVal => {
          if (bVal === '4+') return p.baths >= 4;
          return p.baths.toString() === bVal;
        });
        if (!hasMatch) return false;
      }

      // 8. Max Area (Sq.Ft.)
      if (p.sqft > filters.maxArea) return false;

      // 9. Furnishing Conditions
      if (filters.furnishing.length > 0) {
        if (!p.furnishing || !filters.furnishing.includes(p.furnishing)) return false;
      }

      // 10. Required Amenities
      if (filters.amenities.length > 0) {
        if (!p.amenities) return false;
        const matchesAll = filters.amenities.every(required => 
          p.amenities?.some(has => has.toLowerCase() === required.toLowerCase())
        );
        if (!matchesAll) return false;
      }

      // 11. Posted By
      if (filters.postedBy.length > 0) {
        if (!p.postedBy || !filters.postedBy.includes(p.postedBy)) return false;
      }

      // 12. Construction possession status
      if (filters.constructionStatus.length > 0) {
        if (!p.possessionStatus || !filters.constructionStatus.includes(p.possessionStatus)) return false;
      }

      // 13. Property Age
      if (filters.propertyAge.length > 0) {
        if (!p.ageOfProperty || !filters.propertyAge.includes(p.ageOfProperty)) return false;
      }

      // 14. Vastu direction facing
      if (filters.facing.length > 0) {
        if (!p.facing || !filters.facing.includes(p.facing)) return false;
      }

      // 15. Parking configurations
      if (filters.parking.length > 0) {
        if (!p.parking || !filters.parking.includes(p.parking)) return false;
      }

      // 16. RERA Approved
      if (filters.reraApproved && !p.reraApproved) return false;

      // 17. Zero Brokerage
      if (filters.zeroBrokerage && !p.zeroBrokerage) return false;

      // 18. Pet Friendly
      if (filters.petFriendly && !p.petFriendly) return false;

      // 19. Preferred Tenant preference (Rent specific)
      if (preferredTenant !== 'all' && p.preferredTenant) {
        const pPref = p.preferredTenant.toLowerCase();
        const target = preferredTenant.toLowerCase();
        if (target !== 'any' && !pPref.includes(target) && !pPref.includes('any')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return b.id.localeCompare(a.id);
    });
  }, [properties, filters, searchTerm, preferredTenant, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Area */}
        <div className="mb-8">
          <PageTitleArea
            title={`Flats for Rent: Houses, Apartments and Flats in ${filters.location}`}
            subtitle={`Explore verified rental properties in ${filters.location} with 0% brokerage direct owner listings and digital rent agreement assistance.`}
            totalCount={rentalProperties.length}
            locationName={filters.location}
            activeType="rent"
            sortBy={sortBy}
            onSortChange={(val) => setSortBy(val as any)}
            categoryTags={['0% Brokerage Available', 'Furnished & Semi-Furnished', 'Family & Bachelors Allowed', 'Doorstep Rent Agreements']}
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
              isRentMode={true}
            />

            {/* Rent specific supplementary dropdown */}
            <div className="mt-4 bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">Tenant Type Preference</label>
              <select
                value={preferredTenant}
                onChange={(e) => setPreferredTenant(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#C5A059]"
              >
                <option value="all">👥 Any Tenant Type</option>
                <option value="Family">👨‍👩‍👧 Family Only</option>
                <option value="Bachelors">🎓 Bachelors Allowed</option>
                <option value="Company">🏢 Corporate / Company</option>
              </select>
            </div>
          </div>

          {/* RIGHT LISTING RESULTS (75-80% Desktop Width) */}
          <div className="flex-1 space-y-6">
            
            {/* Top Search & Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by locality, society, landmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#EDF1F7] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
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
                Showing <span className="text-[#9A7632] font-black">{rentalProperties.length}</span> verified rental listings
              </p>
              <button
                onClick={onOpenRentAgreement}
                className="text-[10px] text-amber-900 font-black bg-amber-400/20 border border-amber-400/30 px-3 py-1.5 rounded-xl hover:bg-amber-400/30 transition uppercase"
              >
                📜 Online Rent Agreement
              </button>
            </div>

            {/* Grid display */}
            {rentalProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
                <Home className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No rentals matched your filters</h3>
                <p className="text-xs text-slate-500">
                  Try widening your monthly budget slider, adjusting furnishing status, or clearing the selected city filters.
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
                {rentalProperties.map(property => (
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
