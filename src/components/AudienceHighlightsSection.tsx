import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Tag, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Percent, 
  FileCheck, 
  Sparkles, 
  Smartphone, 
  Users, 
  BadgeCheck 
} from 'lucide-react';

interface AudienceHighlightsSectionProps {
  onNavigate?: (view: string) => void;
  onOpenPostProperty?: () => void;
  onOpenEMICalculator?: () => void;
  onOpenValuation?: () => void;
}

export const AudienceHighlightsSection: React.FC<AudienceHighlightsSectionProps> = ({
  onNavigate,
  onOpenPostProperty,
  onOpenEMICalculator,
  onOpenValuation
}) => {
  const [activeAudience, setActiveAudience] = useState<'buyers' | 'tenants' | 'sellers'>('tenants');

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Tailored Experiences for Every Property Need
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Whether you are buying your dream home, moving into a rental apartment, or listing a property for sale.
          </p>

          {/* Segment Tabs */}
          <div className="mt-6 inline-flex p-1.5 bg-slate-100 rounded-2xl">
            {[
              { id: 'tenants', label: 'For Tenants' },
              { id: 'buyers', label: 'For Buyers' },
              { id: 'sellers', label: 'For Sellers & Owners' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAudience(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeAudience === tab.id
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content: For Tenants */}
        {activeAudience === 'tenants' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 animate-in fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Zero Brokerage Homes
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mb-4">
                Rent Verified Homes Directly from Genuine Owners
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Avoid hefty broker commissions. Connect directly with verified landlords across India and move into your next apartment with complete peace of mind.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Zero brokerage on 50,000+ rental properties',
                  'Verified photos, floor plans, and accurate carpet area specs',
                  'Instant digital rent agreements with doorstep e-stamping',
                  'Schedule video tours or in-person viewings on your schedule'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate?.('rent')}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
                >
                  Explore Rental Properties
                </button>
                <button
                  onClick={() => onNavigate?.('pg')}
                  className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs sm:text-sm border border-slate-200 transition"
                >
                  Find PG & Co-Living
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop"
                alt="Rental homes"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md text-white border border-slate-700/60">
                <div className="text-xs text-amber-400 font-semibold">Tenant Advantage</div>
                <div className="text-sm font-bold mt-0.5">Average savings of ₹45,000 in brokerage fees per move</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: For Buyers */}
        {activeAudience === 'buyers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 animate-in fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-4">
                <BadgeCheck className="w-3.5 h-3.5" /> RERA Approved & Ready to Move
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mb-4">
                Discover Verified Homes with Complete Legal Clarity
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                From top builder new launches to resale builder floors and independent luxury villas with end-to-end loan assistance.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  '100% RERA verified developer projects with construction milestones',
                  'Comprehensive 30-year title verification by empanelled legal experts',
                  'Pre-approved home loans from top banks (SBI, HDFC, ICICI) at 8.35%',
                  'Detailed price trends, locality reviews & circle rate insights'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate?.('buy')}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
                >
                  Explore Properties for Sale
                </button>
                <button
                  onClick={onOpenEMICalculator}
                  className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs sm:text-sm border border-slate-200 transition flex items-center gap-1.5"
                >
                  <Percent className="w-4 h-4 text-amber-500" />
                  <span>Check Loan Eligibility</span>
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
                alt="Buyer homes"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md text-white border border-slate-700/60">
                <div className="text-xs text-amber-400 font-semibold">Buyer Protection</div>
                <div className="text-sm font-bold mt-0.5">Over 1,200+ RERA registered projects listed in 2026</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: For Sellers */}
        {activeAudience === 'sellers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 animate-in fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> 100% Free Property Listing
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mb-4">
                Sell or Rent Out Your Property in Record Time
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Post your flat, villa, plot, or commercial shop for free and connect with genuine verified buyers and high-intent tenants directly.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Reach over 10 Million+ monthly active property seekers across India',
                  'Instant SMS & WhatsApp lead notifications directly from verified buyers',
                  'Free AI property valuation report to price your property competitively',
                  'Zero commission charged to owners for standard listings'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onOpenPostProperty}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
                >
                  Post Property for FREE
                </button>
                <button
                  onClick={onOpenValuation}
                  className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs sm:text-sm border border-slate-200 transition"
                >
                  Check Property Valuation
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"
                alt="Seller property"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md text-white border border-slate-700/60">
                <div className="text-xs text-amber-400 font-semibold">Seller Growth</div>
                <div className="text-sm font-bold mt-0.5">85% of properties receive their first verified lead within 48 hours</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
