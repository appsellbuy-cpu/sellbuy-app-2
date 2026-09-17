import React from 'react';
import { CheckCircle2, Smartphone, Apple, Play } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const AppPromoSection: React.FC = () => {
  return (
    <section className="py-14 lg:py-20 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="bg-gradient-to-br from-[#F5F2EB] to-[#FAF8F5] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#ECE7DC] shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content (approx 6-7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-bold tracking-widest text-[#9A7632] uppercase block">
                SMART, SIMPLE, SECURE
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-[#0A192F] leading-[1.15]">
                Your Property Journey, <br className="hidden sm:inline" />
                Now in Your Pocket
              </h2>

              <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed">
                Experience seamless real estate browsing, instant booking for on-site tours, and direct communication with certified advisors wherever you are.
              </p>

              {/* Checklist */}
              <div className="space-y-3.5 pt-2">
                {[
                  'Search properties on the go with augmented geolocation',
                  'Book site visits in seconds with live agent synchronization',
                  'Get expert recommendations tailored to your investment portfolio',
                  'Manage everything in one app with digital contracts & key handovers'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* App Store / Google Play Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="#app-store"
                  onClick={(e) => { e.preventDefault(); alert('NavikX Mobile App is available on iOS App Store.'); }}
                  className="flex items-center gap-3 px-5 py-2.5 bg-[#0A192F] text-white rounded-xl hover:bg-[#152a4a] transition-all shadow-sm group cursor-pointer"
                >
                  <Apple className="w-6 h-6 text-white group-hover:text-[#C5A059] transition-colors" />
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-gray-300">Download on the</div>
                    <div className="text-xs font-bold leading-none mt-0.5">App Store</div>
                  </div>
                </a>

                <a
                  href="#google-play"
                  onClick={(e) => { e.preventDefault(); alert('NavikX Mobile App is available on Google Play.'); }}
                  className="flex items-center gap-3 px-5 py-2.5 bg-[#0A192F] text-white rounded-xl hover:bg-[#152a4a] transition-all shadow-sm group cursor-pointer"
                >
                  <Play className="w-5 h-5 text-[#C5A059] fill-current" />
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-gray-300">GET IT ON</div>
                    <div className="text-xs font-bold leading-none mt-0.5">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Phone Mockup Display matching reference (approx 5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
                
                {/* Clean Smartphone Frame */}
                <div className="relative bg-[#0A192F] p-3.5 rounded-[44px] shadow-2xl border-4 border-[#1E293B]">
                  {/* Dynamic Island / Speaker */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />

                  {/* Phone Screen Mockup */}
                  <div className="bg-white rounded-[32px] overflow-hidden p-4 pt-10 text-[#0A192F] select-none">
                    
                    {/* App Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Welcome back</span>
                        <span className="text-xs font-bold text-[#0A192F]">Hello, Alex</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-gray-200 flex items-center justify-center text-xs font-bold text-[#0A192F]">
                        AW
                      </div>
                    </div>

                    {/* App Mini Search */}
                    <div className="bg-gray-50 rounded-xl p-2.5 mb-3 flex items-center gap-2 border border-gray-100 text-xs text-gray-400">
                      <span>Find Your Dream Home...</span>
                    </div>

                    {/* Quick Category Icons */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-gray-600 mb-4">
                      <div className="p-2 rounded-lg bg-[#FAF8F5] font-semibold text-[#0A192F]">Buy</div>
                      <div className="p-2 rounded-lg bg-gray-50">Rent</div>
                      <div className="p-2 rounded-lg bg-gray-50">Saved</div>
                      <div className="p-2 rounded-lg bg-gray-50">Alerts</div>
                    </div>

                    {/* Mini Featured Listing Card */}
                    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
                        alt="App Listing Preview"
                        className="w-full h-28 object-cover"
                      />
                      <div className="p-2.5 bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0A192F]">Seaside Villa</span>
                          <span className="text-xs font-bold text-[#C5A059]">$1.25M</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Bali, Indonesia &bull; 4 Beds</span>
                      </div>
                    </div>

                    {/* App Bottom Nav */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-around text-[10px] text-gray-400 font-medium">
                      <span className="text-[#0A192F] font-bold">Explore</span>
                      <span>Bookings</span>
                      <span>Favorites</span>
                      <span>Profile</span>
                    </div>

                  </div>
                </div>

                {/* Subtle Floating Decorative Tag */}
                <div className="absolute -bottom-4 -left-6 bg-white py-2 px-3.5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#0A192F]">Instant Viewing Sync</span>
                </div>

              </div>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
