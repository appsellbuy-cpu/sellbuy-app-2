import React from 'react';
import { Home, Users, Award, Clock, ShieldCheck, Tag, Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface StatsAndWhyChooseUsProps {
  onLearnMore?: () => void;
}

export const StatsAndWhyChooseUs: React.FC<StatsAndWhyChooseUsProps> = ({ onLearnMore }) => {
  return (
    <section className="py-12 lg:py-16 bg-[#FAF9F7] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Stats Bar Row */}
        <ScrollReveal className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-4 pt-4 first:pt-0 lg:pt-0 lg:px-4 first:pl-0">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-gray-100 flex items-center justify-center text-[#0A192F] shrink-0">
                <Home className="w-6 h-6 text-[#0A192F]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#0A192F]">3500+</div>
                <div className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">Properties Listed</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-gray-100 flex items-center justify-center text-[#0A192F] shrink-0">
                <Users className="w-6 h-6 text-[#0A192F]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#0A192F]">20K+</div>
                <div className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">Happy Clients</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-gray-100 flex items-center justify-center text-[#0A192F] shrink-0">
                <Award className="w-6 h-6 text-[#0A192F]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#0A192F]">150+</div>
                <div className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">Expert Agents</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-gray-100 flex items-center justify-center text-[#0A192F] shrink-0">
                <Clock className="w-6 h-6 text-[#0A192F]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#0A192F]">24/7</div>
                <div className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">Customer Support</div>
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* 2. Why Choose Us & Simple & Transparent Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Block: Heading & 4 Benefits Grid (7 cols) */}
          <ScrollReveal delay={100} className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#9A7632] uppercase block mb-1.5">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A192F] leading-tight">
                Real Estate Solutions That Put You First
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                We combine local market intelligence with sophisticated property management to make every transaction fluid, dependable, and financially advantageous.
              </p>
            </div>

            {/* 4 Feature Badges in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#FAF8F5] text-[#0A192F] shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0A192F]">Verified Listings</h4>
                  <p className="text-xs text-gray-500 mt-1">Every property is inspected and vetted for title accuracy.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#FAF8F5] text-[#0A192F] shrink-0">
                  <Tag className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0A192F]">Best Price Guarantee</h4>
                  <p className="text-xs text-gray-500 mt-1">Direct seller relations to ensure you acquire true fair value.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#FAF8F5] text-[#0A192F] shrink-0">
                  <Compass className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0A192F]">Expert Guidance</h4>
                  <p className="text-xs text-gray-500 mt-1">Dedicated senior brokers offering bespoke advisory.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#FAF8F5] text-[#0A192F] shrink-0">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0A192F]">Hassle-Free Process</h4>
                  <p className="text-xs text-gray-500 mt-1">We handle all escrow, title deeds, and legal formalities.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={onLearnMore}
                className="px-6 py-3 bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </ScrollReveal>

          {/* Right Block: "We Make Real Estate Simple & Transparent" with Luxury Photo (6 cols) */}
          <ScrollReveal delay={200} className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_6px_30px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#0A192F]">
                We Make Real Estate Simple & Transparent
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                Our bespoke advisory model guarantees clarity at every milestone of your acquisition.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-2 gap-3">
              {[
                'No hidden fees',
                'Transparent pricing',
                'Expert advice',
                'End-to-end support'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Architecture Interior Photo matching reference image */}
            <div className="relative rounded-2xl overflow-hidden h-56 sm:h-64 group">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Modern Interior Architecture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 text-white text-xs font-medium">
                Private Penthouse Lounge &bull; Manhattan
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
