import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Building2,
  Flame,
  Percent,
  Megaphone,
  ArrowUpRight
} from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { useProperties } from '../context/PropertyContext';

const FILTER_TABS = [
  { id: 'all', label: 'All Featured' },
  { id: 'buy', label: 'For Sale' },
  { id: 'rent', label: 'For Rent' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'pg', label: 'PG / Co-Living' }
] as const;

type FilterTab = (typeof FILTER_TABS)[number]['id'];

interface FeaturedPropertiesSectionProps {
  properties?: Property[];
  onOpenDetail?: (property: Property) => void;
  onOpenBooking?: (property: Property) => void;
  onOpenInquiry?: (property: Property) => void;
  onNavigate?: (
    view: string,
    extra?: { listingType?: string; category?: string }
  ) => void;
  onOpenPostProperty?: () => void;
  onOpenEMICalculator?: () => void;
}

export const FeaturedPropertiesSection: React.FC<
  FeaturedPropertiesSectionProps
> = ({
  properties: propProperties,
  onOpenDetail,
  onOpenBooking,
  onOpenInquiry,
  onNavigate,
  onOpenPostProperty,
  onOpenEMICalculator
}) => {
  const { properties: contextProperties } = useProperties();
  const properties = propProperties ?? contextProperties ?? [];

const [activeTab, setActiveTab] = useState<FilterTab>('all');

// Recalculate from the current dataset whenever React renders.
  // Filter before applying the homepage display limit.
  const filtered = properties.filter((property) => {
    const listingType = (property.listingType ?? '').trim().toLowerCase();
    const category = (property.category ?? '').trim().toLowerCase();

switch (activeTab) {
      case 'all':
        // Preserve the original behavior: include the entire dataset.
        return true;

case 'buy':
        return listingType === 'buy' || listingType === 'sale';

case 'rent':
        return listingType === 'rent';

case 'commercial':
        return (
          listingType === 'commercial' ||
          category === 'office' ||
          category === 'shop'
        );

case 'pg':
        return listingType === 'pg' || category === 'pg';

default:
        return false;
    }
  });

const activeTabLabel =
    FILTER_TABS.find((tab) => tab.id === activeTab)?.label ?? 'All Featured';

// Preserve the existing limit of 15 matching properties.
  const displayList = filtered.slice(0, 15);

// Insert promotional cards after the third and seventh properties.
  const gridItems: (
    | { type: 'property'; id: string; data: Property }
    | { type: 'ad'; id: string; adType: 'loan' | 'sell' }
  )[] = [];

displayList.forEach((item, index) => {
    gridItems.push({
      type: 'property',
      id: item.id,
      data: item
    });

if (index === 2) {
      gridItems.push({
        type: 'ad',
        id: 'ad-loan-promo',
        adType: 'loan'
      });
    }

if (index === 6) {
      gridItems.push({
        type: 'ad',
        id: 'ad-sell-promo',
        adType: 'sell'
      });
    }
  });

return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Handpicked Collection
            </div>

<h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Featured & Premium Listings Across India
            </h2>

<p className="text-sm text-slate-600 mt-1 max-w-2xl">
              RERA-approved luxury apartments, builder floors, zero-brokerage rentals, and grade-A commercial projects.
            </p>
          </div>

<button
            type="button"
            onClick={() => onNavigate?.(activeTab === 'all' ? 'buy' : activeTab)}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition group self-start md:self-auto"
          >
            <span>Explore All Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

{/* Filter Pills */}
        <div
          role="group"
          aria-label="Filter featured properties by category"
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                activeTab === tab.id
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm hover:bg-amber-600 hover:border-amber-600'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

{/* Announce result changes without moving keyboard focus. */}
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {activeTabLabel}: {filtered.length} matching{' '}
          {filtered.length === 1 ? 'property' : 'properties'}. Showing{' '}
          {displayList.length}.
        </p>

{/* Empty State */}
        {displayList.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <Building2
              aria-hidden="true"
              className="mx-auto mb-4 h-10 w-10 text-slate-400"
            />

<h3 className="text-lg font-bold text-slate-900">
              No properties found
            </h3>

<p className="mt-2 text-sm text-slate-600">
              {activeTab === 'all'
                ? 'There are no properties available at the moment.'
                : `There are currently no properties matching "${activeTabLabel}". Try another category.`}
            </p>

{activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Show All Featured
              </button>
            )}
          </div>
        )}

{/* Grid featuring Properties & Intersperse Ads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridItems.map((item) => {
            if (item.type === 'property') {
              return (
                <PropertyCard
                  key={item.id}
                  property={item.data}
                  onOpenDetail={onOpenDetail}
                  onOpenBooking={onOpenBooking}
                  onOpenInquiry={onOpenInquiry}
                />
              );
            } else {
              // Custom styled ad/promo cards
              if (item.adType === 'loan') {
                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between border border-slate-800 shadow-lg relative overflow-hidden group min-h-[360px]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />

<div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Percent className="w-3 h-3" /> Home Loan Partner
                      </div>

<h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        Instant Home Loan Pre-Approval @ 8.40% p.a.
                      </h3>

<p className="text-xs text-slate-300 leading-relaxed">
                        Calculate exact EMIs and check eligibility across SBI, HDFC, ICICI, and Axis. Enjoy zero processing fee and express digital approval.
                      </p>

<div className="mt-4 space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Pre-approved in 15 Minutes</span>
                        </div>

<div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Zero Processing Charges</span>
                        </div>
                      </div>
                    </div>

<button
                      type="button"
                      onClick={onOpenEMICalculator}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl transition cursor-pointer shadow-md"
                    >
                      <span>Check Loan Eligibility</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 text-slate-800 flex flex-col justify-between border-2 border-dashed border-amber-500/20 shadow-xs relative overflow-hidden group min-h-[360px]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />

<div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Megaphone className="w-3 h-3 text-amber-400" /> Seller Service
                      </div>

<h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                        Selling or Renting Out? Post Free Property Listing!
                      </h3>

<p className="text-xs text-slate-600 leading-relaxed">
                        List your residential flat, villa, commercial office, or PG for free. Reach millions of local Indian buyers with zero brokerage and instant AI assistance.
                      </p>

<div className="mt-4 space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Get Direct Tenant/Buyer Leads</span>
                        </div>

<div className="flex items-center gap-2 text-[10px] text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Free AI Title & Description Writer</span>
                        </div>
                      </div>
                    </div>

<button
                      type="button"
                      onClick={onOpenPostProperty}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-[#9A7632] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-sm"
                    >
                      <span>Post Listing Free</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    </section>
  );
};
