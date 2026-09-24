import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Heart
} from 'lucide-react';
import { api } from '../services/api';
import { useProperties } from '../context/PropertyContext';

interface FooterProps {
  onNavigate?: (view: string, extra?: { listingType?: string; category?: string; city?: string }) => void;
  onOpenEMICalculator?: () => void;
  onOpenValuation?: () => void;
  onOpenPostProperty?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate: propOnNavigate,
  onOpenEMICalculator,
  onOpenValuation,
  onOpenPostProperty
}) => {
  const { showToast } = useProperties();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const onNavigate = (view: string, extra?: { listingType?: string; category?: string; city?: string }) => {
    if (propOnNavigate) {
      propOnNavigate(view, extra);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (extra?.city) {
      showToast(`Showing verified properties in ${extra.city}`);
    } else if (view === 'buy' || view === 'rent' || view === 'pg' || view === 'commercial') {
      showToast(`Switched to ${view.toUpperCase()} listings view`);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      showToast('Subscribed to NavikX Real Estate Newsletter!');
    } catch {
      setSubscribed(true);
      showToast('Subscribed to NavikX Real Estate Newsletter!');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Top Newsletter & Assistance Bar */}
      <div className="border-b border-slate-800/80 py-10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6">
              <h3 className="text-xl font-bold text-white font-serif">
                Subscribe to NavikX Indian Real Estate Radar
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Receive weekly property market insights, upcoming RERA projects, circle rate updates & exclusive zero-brokerage listings.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md lg:ml-auto">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
              {subscribed && (
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 lg:justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" /> You are subscribed! Check your inbox soon.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Multi-Column Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-white">NavikX India</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              India's premier real estate & property discovery platform. Connecting millions of buyers, tenants, and property owners with zero brokerage and verified listings across 50+ cities.
            </p>
            
            <div className="mt-4 space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>Toll-Free: 1800-120-4567 (Mon-Sat, 9AM-8PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>support@navikx.in | contact@navikx.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>BKC Cyber Towers, Bandra Kurla Complex, Mumbai, 400051</span>
              </div>
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              For Buyers
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('buy')} className="hover:text-amber-400 transition">
                  Properties for Sale
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('buy', { category: 'apartment' })} className="hover:text-amber-400 transition">
                  Flats & Apartments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('buy', { category: 'villa' })} className="hover:text-amber-400 transition">
                  Villas & Bungalows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plots')} className="hover:text-amber-400 transition">
                  Residential Plots
                </button>
              </li>
              <li>
                <button onClick={onOpenEMICalculator} className="hover:text-amber-400 transition text-amber-300 font-medium">
                  Home Loan EMI Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* For Tenants */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              For Tenants
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('rent')} className="hover:text-amber-400 transition">
                  Properties for Rent
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rent')} className="hover:text-amber-400 transition text-emerald-400 font-medium">
                  Zero Brokerage Rentals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pg')} className="hover:text-amber-400 transition">
                  PG & Co-Living Beds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rent')} className="hover:text-amber-400 transition">
                  Fully Furnished Flats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-amber-400 transition">
                  Shortlisted Properties
                </button>
              </li>
            </ul>
          </div>

          {/* For Sellers & Owners */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              For Sellers
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={onOpenPostProperty} className="hover:text-amber-400 transition text-amber-400 font-bold">
                  Post Property FREE ★
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seller-dashboard')} className="hover:text-amber-400 transition">
                  Seller Portal & Leads
                </button>
              </li>
              <li>
                <button onClick={onOpenValuation} className="hover:text-amber-400 transition">
                  Free Property Valuation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400 transition">
                  Rent Agreement Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news-guide')} className="hover:text-amber-400 transition">
                  Seller Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Popular Cities
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('home', { city: 'Mumbai' })} className="hover:text-amber-400 transition">
                  Mumbai Real Estate
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', { city: 'Bangalore' })} className="hover:text-amber-400 transition">
                  Bangalore Properties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', { city: 'Gurgaon' })} className="hover:text-amber-400 transition">
                  Gurgaon / Delhi NCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', { city: 'Hyderabad' })} className="hover:text-amber-400 transition">
                  Hyderabad Tech Corridor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', { city: 'Pune' })} className="hover:text-amber-400 transition">
                  Pune IT Real Estate
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Locality Quick Links Footer Cloud */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Popular Real Estate Searches in India:
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
            {[
              { label: 'Flats for rent in Mumbai', view: 'rent', city: 'Mumbai' },
              { label: 'Apartments in Bangalore', view: 'buy', city: 'Bangalore', category: 'apartment' },
              { label: 'Villas for sale in Hyderabad', view: 'buy', city: 'Hyderabad', category: 'villa' },
              { label: 'Zero brokerage in Gurgaon', view: 'rent', city: 'Gurgaon' },
              { label: 'PG near Whitefield Bangalore', view: 'pg', city: 'Bangalore' },
              { label: '2 BHK in Koramangala', view: 'rent', city: 'Bangalore' },
              { label: 'Commercial offices in BKC', view: 'commercial', city: 'Mumbai' },
              { label: 'Plots in Devanahalli', view: 'plots', city: 'Bangalore' },
              { label: 'Flats in Powai', view: 'buy', city: 'Mumbai' },
              { label: 'Luxury homes in Worli', view: 'buy', city: 'Mumbai' },
              { label: 'Independent houses in Noida Extension', view: 'buy', city: 'Gurgaon' },
              { label: 'PG in Hinjawadi Pune', view: 'pg', city: 'Pune' },
              { label: 'Flats for sale in South Delhi', view: 'buy', city: 'Gurgaon' }
            ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => onNavigate(item.view, { city: item.city, category: item.category })}
                className="hover:text-amber-400 text-left transition underline decoration-slate-800 hover:decoration-amber-400"
              >
                {item.label} {idx < 12 ? '•' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} NavikX Technologies India Pvt. Ltd. All rights reserved. RERA Registered Platform.
          </div>
          <div className="flex flex-wrap gap-4">
            <span onClick={() => showToast('NavikX Privacy Policy: 100% Secure & RERA Compliant')} className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span onClick={() => showToast('NavikX Terms of Service: Verified Brokerage-Free Direct Listings')} className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span onClick={() => showToast('RERA Disclaimer: All project details verified from state RERA authorities')} className="hover:text-slate-300 cursor-pointer">RERA Disclaimer</span>
            <span>•</span>
            <span onClick={() => onNavigate('home')} className="hover:text-slate-300 cursor-pointer">Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
