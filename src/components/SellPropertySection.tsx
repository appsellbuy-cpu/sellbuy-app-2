import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { ArrowRight, Sparkles, CheckCircle, Calculator } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const SellPropertySection: React.FC = () => {
  const { openSellModal, submitValuation } = useProperties();
  const [propertyType, setPropertyType] = useState('house');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [size, setSize] = useState('');
  const [valuationResult, setValuationResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleValuationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !name) return;
    setSubmitting(true);
    try {
      const res = await submitValuation({
        propertyType,
        location,
        name,
        email: contact.includes('@') ? contact : undefined,
        phone: !contact.includes('@') ? contact : undefined,
        propertySize: size
      });
      setValuationResult(res.estimate);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="sell-property" className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deep Navy Container matching reference */}
        <ScrollReveal className="bg-[#0A192F] rounded-3xl p-8 sm:p-12 lg:p-14 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(10,25,47,0.2)]">
          {/* Subtle architectural background texture pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left side (approx 6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#C5A059] uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Direct Owner Liquidity
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-white leading-tight">
                Looking to Sell <br className="hidden sm:inline" />Your Property?
              </h2>

              <p className="text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed font-normal">
                List your property with NavikX Technologies and reach thousands of pre-qualified international buyers. Benefit from complimentary professional photography and priority marketing.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={openSellModal}
                  className="px-7 py-3.5 bg-white text-[#0A192F] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  List Your Property <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C5A059]" /> 0% Listing Fee Promo
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C5A059]" /> Average 18 Days to Offer
                </div>
              </div>
            </div>

            {/* Right side: Quick Valuation Tool (approx 6 cols) */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-serif font-bold text-white">Instant Property Valuation</h3>
              </div>
              <p className="text-xs text-gray-300 mb-6">
                Receive an algorithmic market valuation based on recent comparative neighborhood sales.
              </p>

              {valuationResult ? (
                <div className="bg-white/15 rounded-xl p-6 text-center border border-white/20 animate-in fade-in">
                  <span className="text-xs text-gray-300 uppercase tracking-wider block">Estimated Market Value</span>
                  <div className="text-3xl font-bold font-sans text-[#C5A059] my-2">{valuationResult}</div>
                  <p className="text-xs text-gray-200">
                    A dedicated NavikX valuation specialist will review your property specs and send you the comprehensive 12-page appraisal dossier.
                  </p>
                  <button
                    onClick={() => setValuationResult(null)}
                    className="mt-4 px-4 py-2 bg-white/20 text-white text-xs font-semibold rounded-lg hover:bg-white/30"
                  >
                    Calculate Another Property
                  </button>
                </div>
              ) : (
                <form onSubmit={handleValuationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block mb-1">
                        Category
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="house" className="text-gray-900">Luxury House / Villa</option>
                        <option value="apartment" className="text-gray-900">Apartment / Penthouse</option>
                        <option value="plot" className="text-gray-900">Land / Plot</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block mb-1">
                        Location / Suburb
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bali, Tribeca NY"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block mb-1">
                        Approx Size (sqft)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 2500"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block mb-1">
                      Email or Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="alex@gmail.com or +1 (555)..."
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#C5A059] text-[#0A192F] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#d6b169] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                  >
                    {submitting ? 'Calculating Model...' : 'Get Free Valuation'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </ScrollReveal>

      </div>
    </section>
  );
};
