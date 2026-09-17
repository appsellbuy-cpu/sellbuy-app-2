import React, { useState } from 'react';
import { Smartphone, Download, QrCode, CheckCircle2, Star, ShieldCheck, Bell, Sparkles, Send } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const AppDownloadSection: React.FC = () => {
  const { showToast } = useProperties();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sentLink, setSentLink] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setSentLink(true);
    showToast(`App download link sent to +91 ${phoneNumber}!`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Actions */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> India's Highest-Rated Real Estate App
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
              Find Your Dream Property on the <span className="text-amber-400">NavikX App</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">
              Experience seamless property hunting across India with instant owner chat notifications, virtual 3D tours, neighborhood insights, and zero brokerage rentals right on your phone.
            </p>

            {/* Perks list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-8">
              {[
                'Instant WhatsApp alerts when new properties match your budget',
                'Direct verified owner call & chat without exposing phone number',
                'Digital Rent Agreement with door-step Aadhaar biometric e-stamp',
                'Interactive locality maps, commute time & circle rate checker'
              ].map((perk, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* Send SMS download link input */}
            <form onSubmit={handleSendLink} className="max-w-md mb-8">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Get download link via SMS:
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Link</span>
                </button>
              </div>
              {sentLink && (
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SMS dispatched! Check your phone messages.
                </div>
              )}
            </form>

            {/* App Store Buttons & Rating */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
              <button 
                onClick={() => showToast('Opening Google Play Store...')}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <div className="text-2xl">📱</div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">GET IT ON</div>
                  <div className="text-xs font-bold text-white">Google Play</div>
                </div>
              </button>

              <button 
                onClick={() => showToast('Opening Apple App Store...')}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <div className="text-2xl">🍏</div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Download on the</div>
                  <div className="text-xs font-bold text-white">App Store</div>
                </div>
              </button>

              <div className="flex items-center gap-2 pl-2 text-xs">
                <div className="flex text-amber-400">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i} className="text-base">{s}</span>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-white">4.8 / 5.0</div>
                  <div className="text-[10px] text-slate-400">120K+ Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Mobile Mockup & QR Code */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Phone Frame */}
              <div className="relative mx-auto rounded-[38px] p-3 bg-slate-800 border-4 border-slate-700 shadow-2xl shadow-amber-500/10">
                <div className="rounded-[28px] overflow-hidden bg-slate-900 border border-slate-800 relative aspect-[9/18]">
                  {/* In-app mockup screen */}
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
                    alt="App Interface"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4 text-white">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                      <span>FOR RENT • 0% Brokerage</span>
                      <span>₹48,000/mo</span>
                    </div>
                    <div className="text-sm font-bold truncate">3 BHK Luxury Sea-Facing Flat</div>
                    <div className="text-[11px] text-slate-400">Worli Sea Face, Mumbai</div>

                    <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                      <div className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Landlord
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        Immediate Move-In • Semi-Furnished
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 py-2 bg-amber-500 text-slate-950 text-center font-bold text-xs rounded-lg">
                        Chat with Owner
                      </div>
                      <div className="px-3 py-2 bg-slate-800 text-white text-center font-bold text-xs rounded-lg border border-slate-700">
                        Tour
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating QR Card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-3 rounded-2xl shadow-xl border border-slate-200 hidden sm:flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                  <QrCode className="w-10 h-10" />
                </div>
                <div className="text-left pr-2">
                  <div className="text-xs font-bold text-slate-900">Scan to Install</div>
                  <div className="text-[10px] text-slate-500">Android & iOS App</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
