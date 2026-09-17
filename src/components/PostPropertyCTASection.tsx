import React from 'react';
import { PlusCircle, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Calculator } from 'lucide-react';

interface PostPropertyCTASectionProps {
  onOpenPostProperty: () => void;
  onOpenValuation: () => void;
}

export const PostPropertyCTASection: React.FC<PostPropertyCTASectionProps> = ({
  onOpenPostProperty,
  onOpenValuation
}) => {
  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-slate-950/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left info */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> 100% Free Owner & Seller Listing
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
              Post Your Property for FREE in India
            </h2>

            <p className="text-slate-900 text-sm sm:text-base font-medium mt-3 leading-relaxed">
              Connect directly with 10 Million+ genuine tenants and verified buyers. Zero brokerage, instant WhatsApp lead notifications, and verified property badge.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6 text-xs sm:text-sm font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> 0% Brokerage Commission
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> Instant Live within 2 Mins
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> Direct Verified Leads
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={onOpenPostProperty}
              className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>Post Property FREE</span>
            </button>

            <button
              onClick={onOpenValuation}
              className="px-6 py-3 bg-white/90 hover:bg-white text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Free Valuation Calculator</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
