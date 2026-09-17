import React from 'react';
import { ArrowUpDown, ShieldCheck, Sparkles, Building2, Tag, CheckCircle2, SlidersHorizontal } from 'lucide-react';

interface PageTitleAreaProps {
  title?: string;
  subtitle?: string;
  totalCount?: number;
  locationName?: string;
  activeType?: 'rent' | 'buy' | 'commercial' | 'pg' | 'plot' | 'all';
  sortBy?: string;
  onSortChange?: (sortBy: string) => void;
  categoryTags?: string[];
  className?: string;
}

export const PageTitleArea: React.FC<PageTitleAreaProps> = ({
  title,
  subtitle,
  totalCount = 850,
  locationName = 'Jaipur',
  activeType = 'rent',
  sortBy = 'relevance',
  onSortChange,
  categoryTags = ['Zero Brokerage Available', 'JDA Approved Schemes', '100% Verified Owners', 'RERA Registered'],
  className = ''
}) => {

  const getDefaultTitle = () => {
    switch (activeType) {
      case 'rent':
        return `Flats for Rent: Houses, Apartments and Flats for rent in ${locationName}`;
      case 'buy':
        return `Flats & Houses for Sale: Apartments, Villas and Builder Floors for sale in ${locationName}`;
      case 'commercial':
        return `Commercial Properties for Rent & Sale in ${locationName}`;
      case 'pg':
        return `PG & Co-Living Hostels for Rent in ${locationName}`;
      case 'plot':
        return `JDA Approved Plots & Residential Land for Sale in ${locationName}`;
      default:
        return `Real Estate Properties for Sale & Rent in ${locationName}`;
    }
  };

  const getDefaultSubtitle = () => {
    switch (activeType) {
      case 'rent':
        return `Find verified residential flats, fully furnished apartments, and zero-brokerage houses for rent across top localities in ${locationName}.`;
      case 'buy':
        return `Explore RERA verified apartments, gated independent villas, and luxury builder floors with bank home loan approvals in ${locationName}.`;
      case 'commercial':
        return `Grade-A IT parks, retail shops on main roads, and furnished office spaces ready for business operations in ${locationName}.`;
      case 'pg':
        return `Student & corporate hostels with high-speed Wi-Fi, hygienic food, 24x7 security warden, and zero deposit options in ${locationName}.`;
      case 'plot':
        return `JDA Scheme Patta, 90A revenue converted plots, and gated township land on wide sector roads in ${locationName}.`;
      default:
        return `Discover verified properties with direct owner contacts, transparent pricing, and instant virtual tours in ${locationName}.`;
    }
  };

  const displayTitle = title || getDefaultTitle();
  const displaySubtitle = subtitle || getDefaultSubtitle();

  return (
    <div className={`bg-white border-b border-slate-200 py-5 sm:py-6 text-slate-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title & Total Count Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-serif tracking-tight leading-snug">
                {displayTitle}
              </h1>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {displaySubtitle}
            </p>
          </div>

          {/* Right Side Controls: Total Properties Badge & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto flex-shrink-0">
            
            {/* Total Properties Count Badge */}
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong className="text-amber-700 text-sm font-extrabold">{totalCount.toLocaleString('en-IN')}</strong> Available Properties
              </span>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="text-slate-400 font-normal hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange?.(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer text-xs"
              >
                <option value="relevance">Relevance / Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popularity">Popularity / Most Viewed</option>
              </select>
            </div>

          </div>
        </div>

        {/* Category Information & Highlights Row */}
        <div className="pt-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Information Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Key Highlights:</span>
            {categoryTags.map((tag, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px]"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Quick Help / Guarantee Note */}
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>100% Genuine Listings • Direct Owner Contact • Doorstep Agreements</span>
          </div>

        </div>

      </div>
    </div>
  );
};
