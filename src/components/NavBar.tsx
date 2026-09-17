import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  Smartphone, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  Heart, 
  Calendar, 
  MessageSquare, 
  Shield, 
  Sparkles,
  LogOut,
  Sliders,
  FileText,
  Calculator,
  Compass,
  CheckCircle2,
  Home,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { CitySelectorModal } from './CitySelectorModal';

interface NavBarProps {
  currentView?: string;
  onNavigate?: (view: string, extraParams?: { listingType?: string; category?: string; city?: string }) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onOpenPostProperty?: () => void;
  onOpenEMICalculator?: () => void;
  onOpenValuation?: () => void;
  onOpenRentAgreement?: () => void;
  onOpenAppModal?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  currentView = 'home',
  onNavigate: propOnNavigate,
  selectedCity: propSelectedCity,
  onSelectCity: propOnSelectCity,
  onOpenPostProperty,
  onOpenEMICalculator,
  onOpenValuation,
  onOpenRentAgreement,
  onOpenAppModal
}) => {
  const { user, isAuthenticated, logout, openAuthModal, switchDemoRole } = useAuth();
  const { savedListings, bookings, searchLocation, setSearchLocation } = useProperties();
  
  const selectedCity = propSelectedCity || searchLocation || 'All India';
  const handleSelectCity = (city: string) => {
    if (propOnSelectCity) propOnSelectCity(city);
    if (setSearchLocation) setSearchLocation(city);
  };

  const onNavigate = (view: string, extraParams?: { listingType?: string; category?: string; city?: string }) => {
    if (propOnNavigate) propOnNavigate(view, extraParams);
  };
  
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <>
      {/* Top Banner Notice (Subtle Luxury Indian Portal announcement) */}
      <div className="bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded text-[11px] border border-amber-500/30">
              <Sparkles className="w-3 h-3" /> Zero Brokerage
            </span>
            <span className="hidden sm:inline text-slate-400">
              Post unlimited properties for FREE • Reach 150,000+ verified tenants & buyers
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button 
              onClick={onOpenEMICalculator}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Calculator className="w-3 h-3 text-amber-500" /> Home Loan EMI Calculator
            </button>
            <span className="hidden md:inline text-slate-600">•</span>
            <button 
              onClick={onOpenValuation}
              className="hidden md:flex hover:text-amber-400 transition-colors items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Free Property Valuation
            </button>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="text-slate-300 font-medium">Toll Free: 1800-120-4567</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Brand Logo & Location Selector */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => onNavigate('home')} 
                className="flex items-center gap-2 text-left group focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1 font-serif leading-none">
                    Navik<span className="text-amber-400">X</span>
                  </div>
                  <div className="text-[9px] tracking-wider uppercase text-amber-400/90 font-sans font-semibold mt-0.5">
                    Jaipur Real Estate
                  </div>
                </div>
              </button>

              {/* All Jaipur / Location Picker Pill */}
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:border-amber-500/50"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="max-w-[110px] truncate">{selectedCity && selectedCity !== 'All India' ? selectedCity : 'All Jaipur'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Middle: Primary Navigation Links */}
            <nav ref={dropdownRef} className="hidden xl:flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-200">
              
              {/* For Buyers */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('buyers')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-slate-900 transition-colors font-semibold ${
                    activeDropdown === 'buyers' || currentView === 'buy' ? 'text-amber-400 bg-slate-900' : ''
                  }`}
                >
                  <span>For Buyers</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'buyers' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'buyers' && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      Properties for Sale in Jaipur
                    </div>
                    <button
                      onClick={() => { onNavigate('buy'); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>All Properties for Sale</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">1,200+</span>
                    </button>
                    <button
                      onClick={() => { onNavigate('buy', { category: 'apartment' }); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Flats & Apartments
                    </button>
                    <button
                      onClick={() => { onNavigate('buy', { category: 'villa' }); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Independent Villas & Houses
                    </button>
                    <button
                      onClick={() => { onNavigate('plots'); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      JDA Approved Plots / Land
                    </button>
                    <button
                      onClick={() => { onNavigate('commercial'); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Commercial Spaces & Shops
                    </button>
                    <div className="mt-1 pt-1 border-t border-slate-800">
                      <button
                        onClick={() => { onOpenEMICalculator(); setActiveDropdown(null); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-amber-400 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Calculator className="w-3.5 h-3.5" /> Calculate Home Loan EMI
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* For Tenants */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('tenants')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-slate-900 transition-colors font-semibold ${
                    activeDropdown === 'tenants' || currentView === 'rent' ? 'text-amber-400 bg-slate-900' : ''
                  }`}
                >
                  <span>For Tenants</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'tenants' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'tenants' && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      Rental Options in Jaipur
                    </div>
                    <button
                      onClick={() => { onNavigate('rent'); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Properties for Rent</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">0% Brokerage</span>
                    </button>
                    <button
                      onClick={() => { onNavigate('rent', { category: 'apartment' }); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Flats for Rent
                    </button>
                    <button
                      onClick={() => { onNavigate('rent', { category: 'house' }); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Independent Houses for Rent
                    </button>
                    <button
                      onClick={() => { onNavigate('pg'); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      PG / Co-Living (Hostels)
                    </button>
                    <div className="mt-1 pt-1 border-t border-slate-800">
                      <button
                        onClick={() => { onOpenRentAgreement(); setActiveDropdown(null); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-amber-400 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> Create Online Rent Agreement
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* For Sellers */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('sellers')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-slate-900 transition-colors font-semibold ${
                    activeDropdown === 'sellers' || currentView === 'seller-dashboard' ? 'text-amber-400 bg-slate-900' : ''
                  }`}
                >
                  <span>For Sellers</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'sellers' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'sellers' && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      Owner & Seller Hub
                    </div>
                    <button
                      onClick={() => { onOpenPostProperty(); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs font-bold text-amber-400 flex items-center justify-between"
                    >
                      <span>Post Property (FREE)</span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-extrabold">FREE</span>
                    </button>
                    <button
                      onClick={() => { onNavigate('seller-dashboard'); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Seller Dashboard & Leads
                    </button>
                    <button
                      onClick={() => { onOpenValuation(); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Free Property Valuation Report
                    </button>
                  </div>
                )}
              </div>

              {/* Services */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('services')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-slate-900 transition-colors font-semibold ${
                    activeDropdown === 'services' || currentView === 'services' ? 'text-amber-400 bg-slate-900' : ''
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'services' && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      Real Estate Services
                    </div>
                    <button
                      onClick={() => { onNavigate('services'); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs font-semibold"
                    >
                      All Real Estate Services
                    </button>
                    <button
                      onClick={() => { onOpenEMICalculator(); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs flex items-center justify-between"
                    >
                      <span>Home Loans (8.35% p.a.)</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded font-mono">EMI</span>
                    </button>
                    <button
                      onClick={() => { onOpenValuation(); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Property Valuation
                    </button>
                    <button
                      onClick={() => { onOpenRentAgreement(); setActiveDropdown(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 text-xs"
                    >
                      Rent Agreement & E-Stamp
                    </button>
                  </div>
                )}
              </div>

              {/* News & Guide */}
              <button
                onClick={() => { onNavigate('news-guide'); setActiveDropdown(null); }}
                className={`px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-slate-900 transition-all font-semibold ${
                  currentView === 'news-guide' ? 'text-amber-400 bg-slate-900' : 'text-slate-200'
                }`}
              >
                News & Guide
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Download App */}
              <button
                onClick={() => (onOpenAppModal ? onOpenAppModal() : onNavigate('app-download'))}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition"
                title="Download NavikX Mobile App"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Download App</span>
              </button>

              {/* Post Property (FREE) */}
              <button
                onClick={onOpenPostProperty}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-amber-500/20 transition transform active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Property</span>
                <span className="bg-slate-950 text-amber-300 text-[9px] font-extrabold uppercase px-1 py-0.2 rounded border border-amber-400/40">
                  FREE
                </span>
              </button>

              {/* Login */}
              {isAuthenticated && user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                    className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-900 border border-slate-800 transition"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                      alt={user.name}
                      className="w-7 h-7 rounded-md object-cover border border-amber-500/40"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in">
                      <div className="p-2 border-b border-slate-800">
                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                      </div>
                      <div className="py-1 text-xs">
                        <button
                          onClick={() => { onNavigate('dashboard'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-400" /> Saved Properties ({savedListings.length})
                        </button>
                        <button
                          onClick={() => { onNavigate('my-bookings'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                        >
                          <Calendar className="w-3.5 h-3.5 text-sky-400" /> Property Visits ({bookings.length})
                        </button>
                        <button
                          onClick={() => { onNavigate('seller-dashboard'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                        >
                          <Building2 className="w-3.5 h-3.5 text-amber-400" /> Seller Dashboard
                        </button>
                        <button
                          onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-indigo-400" /> My Profile
                        </button>
                      </div>
                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-950/40 text-rose-400 text-xs flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login</span>
                </button>
              )}

              {/* Menu (Hamburger Drawer) */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
      />

      {/* Mobile Slide-Over Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div className="w-full max-w-xs bg-slate-950 h-full p-6 text-white shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-lg text-white">NavikX India</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile City Selector */}
              <button
                onClick={() => { setIsCityModalOpen(true); setIsMobileDrawerOpen(false); }}
                className="mt-4 w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>City: <strong className="text-white">{selectedCity}</strong></span>
                </div>
                <span className="text-amber-400 text-xs">Change</span>
              </button>

              {/* Mobile Nav Links */}
              <div className="mt-6 space-y-1 text-sm font-medium">
                <button
                  onClick={() => { onNavigate('home'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <Home className="w-4 h-4 text-amber-400" /> Home
                </button>
                <button
                  onClick={() => { onNavigate('rent'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" /> Properties for Rent
                </button>
                <button
                  onClick={() => { onNavigate('buy'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <Building2 className="w-4 h-4 text-sky-400" /> Properties for Sale
                </button>
                <button
                  onClick={() => { onNavigate('commercial'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" /> Commercial & Shops
                </button>
                <button
                  onClick={() => { onNavigate('pg'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" /> PG & Co-Living
                </button>
                <button
                  onClick={() => { onNavigate('plots'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <Compass className="w-4 h-4 text-teal-400" /> Plots & Land
                </button>
                <button
                  onClick={() => { onNavigate('services'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <Sliders className="w-4 h-4 text-amber-400" /> Real Estate Services
                </button>
                <button
                  onClick={() => { onNavigate('news-guide'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2.5"
                >
                  <FileText className="w-4 h-4 text-amber-400" /> News & Guides
                </button>
              </div>

              {/* Tools */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => { onOpenEMICalculator(); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-slate-300 flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-amber-400" /> EMI Calculator
                </button>
                <button
                  onClick={() => { onOpenValuation(); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-slate-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Property Valuation
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => { onOpenPostProperty(); setIsMobileDrawerOpen(false); }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-center shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Post Property (FREE)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
