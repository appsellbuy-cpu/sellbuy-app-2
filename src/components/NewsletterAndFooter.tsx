import React, { useState } from 'react';
import { api } from '../services/api';
import { useProperties } from '../context/PropertyContext';
import { Building2, Mail, Send, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface NewsletterAndFooterProps {
  onNavigate?: (view: string) => void;
}

export const NewsletterAndFooter: React.FC<NewsletterAndFooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast, setCategory } = useProperties();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      showToast('Thank you for subscribing to NavikX Market Insights!');
      setEmail('');
    } catch (err) {
      console.error(err);
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0A192F] text-white">
      {/* 1. Newsletter Row */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-10">
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-gray-200 text-[#0A192F] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold tracking-widest text-[#9A7632] uppercase block mb-1">
                Stay Ahead of the Market
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A192F]">
                Subscribe to Our Exclusive Newsletter
              </h3>
              <p className="text-sm text-gray-600 mt-1.5 max-w-lg">
                Receive weekly curated listings, private off-market listings, and architectural trend analysis directly to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>You are subscribed to NavikX real estate digests.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#0A192F] placeholder:text-gray-400 focus:outline-none focus:border-[#0A192F]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#0A192F] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                    {loading ? 'Joining...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Col 1: Brand (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#0A192F]">
                <Building2 className="w-5 h-5 text-[#C5A059]" />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                NavikX <span className="font-sans font-light text-xs text-gray-400 uppercase tracking-widest block -mt-1 sm:inline sm:mt-0">Technologies</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              NavikX Technologies connects discerning homeowners and international investors with exceptional architectural properties, offering bespoke representation and full asset advisory.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#linkedin" title="LinkedIn" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-[#0A192F] flex items-center justify-center transition-colors text-xs text-gray-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#twitter" title="Twitter" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-[#0A192F] flex items-center justify-center transition-colors text-xs text-gray-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#facebook" title="Facebook" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-[#0A192F] flex items-center justify-center transition-colors text-xs text-gray-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#instagram" title="Instagram" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-[#0A192F] flex items-center justify-center transition-colors text-xs text-gray-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2-3 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate?.('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('properties')} className="hover:text-white transition-colors cursor-pointer">
                  Buy Properties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('rent')} className="hover:text-[#C5A059] transition-colors cursor-pointer font-semibold text-white">
                  Rent Residences
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('services')} className="hover:text-white transition-colors cursor-pointer">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('blog')} className="hover:text-white transition-colors cursor-pointer">
                  Editorial Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Client Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portfolios (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Featured Portfolios</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button 
                  onClick={() => onNavigate?.('rent')} 
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  Luxury Rentals &amp; Leases
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategory('house'); onNavigate?.('properties'); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  House (Villas &amp; Estates)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategory('apartment'); onNavigate?.('properties'); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Apartment (Penthouses &amp; Lofts)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategory('plot'); onNavigate?.('properties'); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Plot (Land &amp; Development)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategory('all'); onNavigate?.('properties'); }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Properties Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>750 Lexington Avenue, 24th Floor, Manhattan, New York, NY 10022</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:appsellbuy@gmail.com" className="hover:text-white">appsellbuy@gmail.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:+15550192834" className="hover:text-white">+1 (555) 019-2834</a>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} NavikX Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
