import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Mail, 
  Building, 
  Sparkles, 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  Scale, 
  Compass, 
  Layers, 
  Clock, 
  Car,
  FileCheck,
  Camera,
  MessageSquare
} from 'lucide-react';
import { Property } from '../types';
import { formatIndianCurrency, formatRentPrice } from '../utils/formatters';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { PropertyCard } from './PropertyCard';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenBooking: (property: Property) => void;
  onOpenInquiry: (property: Property) => void;
  onOpenEMICalculator: () => void;
  onSelectProperty?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenBooking,
  onOpenInquiry,
  onOpenEMICalculator,
  onSelectProperty
}) => {
  const { isSaved, toggleFavorite, isInCompare, toggleCompare, showToast, properties, openDetail } = useProperties();
  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | '360'>('photos');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveMediaTab('photos');
    setActiveImageIndex(0);
  }, [property?.id]);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailsRef.current) {
      const scrollAmount = 240;
      thumbnailsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const similarProperties = useMemo(() => {
    if (!property || !properties || !Array.isArray(properties)) return [];

    const propCity = (property.city || property.location || '').trim().toLowerCase();
    const propCategory = (property.category || '').trim().toLowerCase();
    const propPrice = Number(property.price) || 0;

    // Filter properties sharing same city, same category, and similar price range (±20%)
    const exactMatches = properties.filter((p) => {
      if (p.id === property.id) return false;

      const pCity = (p.city || p.location || '').trim().toLowerCase();
      const pCategory = (p.category || '').trim().toLowerCase();
      
      const cityMatch = propCity && pCity ? (pCity === propCity || pCity.includes(propCity) || propCity.includes(pCity)) : true;
      const categoryMatch = propCategory && pCategory ? pCategory === propCategory : p.listingType === property.listingType;
      
      const minPrice = propPrice * 0.8;
      const maxPrice = propPrice * 1.2;
      const pPrice = Number(p.price) || 0;
      const priceMatch = propPrice > 0 ? (pPrice >= minPrice && pPrice <= maxPrice) : true;

      return cityMatch && categoryMatch && priceMatch;
    });

    if (exactMatches.length >= 3) {
      return exactMatches.slice(0, 3);
    }

    // Fallback 1: Relaxed price range (±40%) for same city & category
    const relaxedMatches = properties.filter((p) => {
      if (p.id === property.id || exactMatches.some((e) => e.id === p.id)) return false;

      const pCity = (p.city || p.location || '').trim().toLowerCase();
      const pCategory = (p.category || '').trim().toLowerCase();
      
      const cityMatch = propCity && pCity ? (pCity === propCity || pCity.includes(propCity) || propCity.includes(pCity)) : true;
      const categoryMatch = propCategory && pCategory ? pCategory === propCategory : p.listingType === property.listingType;
      
      const minPrice = propPrice * 0.6;
      const maxPrice = propPrice * 1.4;
      const pPrice = Number(p.price) || 0;
      const priceMatch = propPrice > 0 ? (pPrice >= minPrice && pPrice <= maxPrice) : true;

      return cityMatch && categoryMatch && priceMatch;
    });

    const combined = [...exactMatches, ...relaxedMatches];
    if (combined.length >= 3) {
      return combined.slice(0, 3);
    }

    // Fallback 2: Same city and same listing type
    const cityMatches = properties.filter((p) => {
      if (p.id === property.id || combined.some((c) => c.id === p.id)) return false;
      const pCity = (p.city || p.location || '').trim().toLowerCase();
      const cityMatch = propCity && pCity ? (pCity === propCity || pCity.includes(propCity) || propCity.includes(pCity)) : true;
      const listingMatch = p.listingType === property.listingType;
      return cityMatch && listingMatch;
    });

    return [...combined, ...cityMatches].slice(0, 3);
  }, [property, properties]);

  if (!property) return null;

  const saved = isSaved(property.id);
  const inCompare = isInCompare(property.id);

  const images = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#property-${property.id}`);
      showToast('Property link copied to clipboard!');
    }
  };

  const displayPrice = property.listingType === 'rent'
    ? (property.priceDisplay || formatRentPrice(property.price))
    : (property.priceDisplay || formatIndianCurrency(property.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden my-auto border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
              property.listingType === 'rent' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
            }`}>
              {property.listingType === 'rent' ? 'FOR RENT' : property.listingType === 'buy' ? 'FOR SALE' : property.listingType.toUpperCase()}
            </span>
            <span className="text-sm font-bold truncate text-slate-100">{property.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleCompare(property)}
              className={`p-2 rounded-full transition ${
                inCompare ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Compare"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleFavorite(property)}
              className={`p-2 rounded-full transition ${
                saved ? 'bg-rose-500 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-rose-400'
              }`}
              title="Save"
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={scrollRef} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          
          {/* Interactive Media Explorer with 360° Virtual Tour */}
          <div className="space-y-4">
            {/* Explorer Tabs - conditionally rendered when virtual tour exists */}
            {property.virtualTourUrl && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/60 p-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Immersive Media Explorer</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Explore high-fidelity standard photography or interact with 360° rooms</p>
                  </div>
                </div>
                
                <div className="flex bg-slate-200/70 p-1 rounded-xl self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('photos')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeMediaTab === 'photos'
                        ? 'bg-[#0A192F] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/30'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Camera Photos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('360')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeMediaTab === '360'
                        ? 'bg-[#9A7632] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/30'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span className="relative">
                      360° Virtual Tour
                      <span className="absolute -top-1.5 -right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {activeMediaTab === 'photos' ? (
              <div className="space-y-2">
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
                  <img
                    src={images[activeImageIndex] || property.image}
                    alt={property.title}
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-full h-full object-cover cursor-zoom-in group-hover:scale-[1.02] transition duration-500"
                  />

                  {/* Click to expand hover hint */}
                  <div 
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-zoom-in text-white text-xs font-bold gap-1.5 pointer-events-auto"
                  >
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                      🔍 View Full Screen Gallery
                    </span>
                  </div>

                  {/* Quality & Style Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center">
                    <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-extrabold border border-amber-500/40 flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{property.imageQuality || '4K Architectural Photography'} ({property.imageResolution || '3840x2160 UHD'})</span>
                    </div>

                    {property.architectureStyle && (
                      <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-100 text-xs font-semibold border border-slate-700/60 shadow-lg">
                        🏛️ Style: {property.architectureStyle}
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation arrows if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-sm transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-sm transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-semibold">
                    Photo {activeImageIndex + 1} of {images.length}
                  </div>
                </div>

                {/* Upgraded Scrollable Photo Carousel (Thumbnail Selector) */}
                {images.length > 1 && (
                  <div className="relative group/carousel px-1">
                    {/* Left Scroll Button */}
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('left')}
                      className="absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/90 hover:bg-slate-950 text-amber-400 border border-amber-500/30 shadow-lg backdrop-blur-xs opacity-0 group-hover/carousel:opacity-100 transition duration-200 cursor-pointer flex items-center justify-center"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Carousel Container */}
                    <div
                      ref={thumbnailsRef}
                      className="flex gap-2.5 overflow-x-auto pb-2 scroll-smooth select-none"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                            activeImageIndex === idx 
                              ? 'border-amber-500 scale-95 ring-4 ring-amber-500/20 shadow-md' 
                              : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`property thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Active Thumbnail Badge Overlay */}
                          {activeImageIndex === idx && (
                            <div className="absolute inset-0 bg-amber-500/15 flex items-center justify-center">
                              <span className="text-[8px] uppercase font-black tracking-wider text-slate-950 px-1.5 py-0.5 bg-amber-400 rounded shadow-xs">
                                Active
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('right')}
                      className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/90 hover:bg-slate-950 text-amber-400 border border-amber-500/30 shadow-lg backdrop-blur-xs opacity-0 group-hover/carousel:opacity-100 transition duration-200 cursor-pointer flex items-center justify-center"
                      title="Scroll Right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Immersive 360° Virtual Tour Viewport */
              <div className="space-y-3">
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
                  <iframe
                    src={property.virtualTourUrl}
                    title="Interactive 360° Virtual Tour"
                    allowFullScreen
                    allow="accelerometer; gyroscope; magnetometer; vr"
                    referrerPolicy="no-referrer"
                    className="w-full h-full border-0 rounded-2xl"
                  />
                  
                  {/* Absolute Interactive Hint bar */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-white/10 p-3 rounded-xl text-white text-[11px] sm:text-xs font-medium flex items-center justify-between gap-3 pointer-events-none">
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>💡 <strong>Touch / Click & Drag</strong> to rotate or click the hotspots to step into different rooms.</span>
                    </span>
                    <span className="hidden md:inline px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-500/30 uppercase tracking-wider">
                      VR Supported
                    </span>
                  </div>
                </div>

                {/* Back Link panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 px-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <div className="text-xs text-amber-900 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>360° Interactive scan loaded successfully.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('photos')}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Return to Photo Gallery</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & High-level Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left 2 Cols: Title, Location, Key Specs */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{property.locality ? `${property.locality}, ` : ''}{property.city || property.location}</span>
                  </div>
                  {property.zeroBrokerage && (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      0% Brokerage
                    </span>
                  )}
                  {property.reraApproved && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                      RERA Registered
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  {property.title}
                </h1>
              </div>

              {/* Specs Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Configuration</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {property.beds ? `${property.beds} BHK` : property.category}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Carpet Area</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {property.carpetArea ? `${property.carpetArea} sq.ft` : `${property.sqft} sq.ft`}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Furnishing</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {property.furnishing || 'Semi-Furnished'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Possession / Availability</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {property.possessionStatus || property.availableFrom || 'Ready to Move'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">About This Property</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Amenities & Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {property.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RERA and Legal specs if applicable */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Verified Property Certification</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div><strong>Society/Project:</strong> {property.society || 'Prime Residential Complex'}</div>
                  <div><strong>Facing:</strong> {property.facing || 'East Facing (Vastu Compliant)'}</div>
                  <div><strong>Floor:</strong> {property.floor || '5th of 18 Floors'}</div>
                  <div><strong>Parking:</strong> {property.parking || '1 Covered Reserved Car Parking'}</div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Pricing & Contact Actions Box */}
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800 space-y-4">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    {property.listingType === 'rent' ? 'Monthly Rental' : 'Total Price'}
                  </span>
                  <div className="text-3xl font-extrabold font-sans text-white mt-0.5">
                    {displayPrice}
                  </div>
                  {property.listingType === 'rent' && property.securityDeposit && (
                    <div className="text-xs text-slate-400 mt-1">
                      Security Deposit: <strong className="text-slate-200">{property.securityDeposit}</strong>
                    </div>
                  )}
                  {property.listingType !== 'rent' && property.pricePerSqFt && (
                    <div className="text-xs text-slate-400 mt-1">
                      Rate: <strong className="text-slate-200">{property.pricePerSqFt}</strong>
                    </div>
                  )}
                </div>

                {/* Home Loan EMI helper button if Sale */}
                {property.listingType !== 'rent' && (
                  <button
                    onClick={onOpenEMICalculator}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5" /> Est. EMI from ₹42,500/mo
                    </span>
                    <span className="text-[10px] underline">Calculate</span>
                  </button>
                )}

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      onOpenBooking(property);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Free Property Tour</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenInquiry(property);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Contact {property.postedBy || 'Owner'} Directly</span>
                  </button>
                </div>

                {/* Direct 'Ask Agent' Quick Chat Widget inside the details view */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <MessageSquare className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Direct Agent Chat Support</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask a question (e.g. Is price negotiable?)"
                      id="agent-quick-query-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const inputEl = document.getElementById('agent-quick-query-input') as HTMLInputElement;
                          if (inputEl && inputEl.value.trim()) {
                            onOpenInquiry(property);
                          }
                        }
                      }}
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onOpenInquiry(property);
                      }}
                      className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Submit your query directly to our real estate assistant for instant local support.
                  </p>
                </div>

                {/* Owner Card in Sidebar */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                    {property.ownerName ? property.ownerName.charAt(0) : 'O'}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">{property.ownerName || 'Verified Property Owner'}</div>
                    <div className="text-slate-400 text-[11px]">{property.postedBy || 'Direct Owner'} • Response in 15 mins</div>
                  </div>
                </div>
              </div>

              {/* Trust highlights */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5 text-slate-600">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>NavikX Safe Deal Protection</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  ✓ 100% verified address and ownership documents.<br />
                  ✓ No hidden charges or broker commissions.<br />
                  ✓ Free digital agreement assistance.
                </div>
              </div>
            </div>

          </div>

          {/* Similar Properties Grid Section */}
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    Similar Properties
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Listings in <strong className="text-slate-700">{property.city || property.location}</strong> under <strong className="text-slate-700">{property.category}</strong> with a similar price range (±20%)
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                {similarProperties.length} Recommendations
              </span>
            </div>

            {similarProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarProperties.map((simProp) => (
                  <PropertyCard
                    key={simProp.id}
                    property={simProp}
                    onOpenDetail={(p) => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      setActiveImageIndex(0);
                      if (onSelectProperty) {
                        onSelectProperty(p);
                      }
                      openDetail(p);
                    }}
                    onOpenBooking={onOpenBooking}
                    onOpenInquiry={onOpenInquiry}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">
                No similar properties found matching this city, category, and price range.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FULL-SCREEN LIGHTBOX OVERLAY */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-[9999] flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-in fade-in zoom-in-95 duration-200">
          
          {/* Lightbox Header */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Jaipur Ultra High-Res Architectural View</span>
              </h4>
              <p className="text-xs text-slate-300 font-medium truncate max-w-md sm:max-w-xl">
                {property.title} • {property.location}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white/10 text-slate-300 px-3 py-1 rounded-full font-bold">
                {activeImageIndex + 1} of {images.length}
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="Close high-res view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Picture with Side Nav */}
          <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center p-2 sm:p-6">
            
            {/* Prev Trigger */}
            {images.length > 1 && (
              <button
                onClick={() => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-0 sm:left-4 z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white backdrop-blur-md transition cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Picture */}
            <div className="relative max-h-[70vh] sm:max-h-[75vh] w-full h-full flex items-center justify-center rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 shadow-2xl">
              <img
                src={images[activeImageIndex]}
                alt="High-resolution architecture shot"
                className="max-h-[68vh] sm:max-h-[73vh] max-w-full object-contain select-none shadow-xl rounded-2xl cursor-zoom-out"
                onClick={() => setIsLightboxOpen(false)}
              />

              {/* Resolution Tag overlay */}
              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-black border border-amber-500/40 tracking-wider">
                📸 {property.imageQuality || '4K Architectural Photography'} ({property.imageResolution || '3840x2160 UHD'})
              </div>
            </div>

            {/* Next Trigger */}
            {images.length > 1 && (
              <button
                onClick={() => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-0 sm:right-4 z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white backdrop-blur-md transition cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Thumbnail Slider */}
          {images.length > 1 && (
            <div className="w-full max-w-3xl flex justify-center gap-2 pb-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/10' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
