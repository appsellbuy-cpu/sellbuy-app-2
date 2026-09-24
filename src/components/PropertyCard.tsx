import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  CheckCircle2, 
  Share2,
  MoreVertical,
  Scale,
  Calendar,
  Sparkles,
  Info,
  PhoneCall,
  Clock,
  ArrowUpRight,
  MessageSquare,
  Eye,
  Building2,
  Briefcase,
  Warehouse,
  Factory
} from 'lucide-react';
import { Property } from '../types';
import { formatIndianCurrency, formatRentPrice } from '../utils/formatters';
import { useProperties } from '../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
  onOpenDetail?: (property: Property) => void;
  onSelect?: (property: Property) => void;
  onOpenBooking?: (property: Property) => void;
  onOpenInquiry?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onOpenDetail,
  onSelect,
  onOpenBooking,
  onOpenInquiry
}) => {
  const { isSaved, toggleFavorite, isInCompare, toggleCompare, showToast } = useProperties();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const saved = isSaved(property.id);
  const inCompare = isInCompare(property.id);

  const handleCardClick = () => {
    if (onOpenDetail) onOpenDetail(property);
    else if (onSelect) onSelect(property);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(property);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#property-${property.id}`);
      showToast('Copied property link to clipboard!');
    }
    setShowOptionsMenu(false);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(property);
    setShowOptionsMenu(false);
  };

  const toggleOptionsMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptionsMenu(!showOptionsMenu);
  };

  // Price conversion
  const displayPrice = property.listingType === 'rent'
    ? (property.priceDisplay || formatRentPrice(property.price))
    : (property.priceDisplay || formatIndianCurrency(property.price));

  // Human readable posted time
  const postedDate = useMemo(() => {
    if (!property.createdAt) return '2 days ago';
    const date = new Date(property.createdAt);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [property.createdAt]);

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 transform hover:scale-[1.02] flex flex-col cursor-pointer relative"
    >
      {/* 1. Large property image with overlay gradients */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex-shrink-0 group/img">
        <img
          src={property.image}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Quick View Button Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-slate-950/30 backdrop-blur-[2px] z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xl transform translate-y-2 group-hover/img:translate-y-0 transition-all duration-300 flex items-center gap-2 text-xs"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Dynamic verified/sponsored/promoted badge overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center pointer-events-none z-10">
          <span className="px-2 py-0.5 rounded-md bg-slate-900/95 backdrop-blur-md text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/25 shadow-sm">
            {property.category.replace('_', ' ')}
          </span>
          <span className={`px-2 py-0.5 rounded-md backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wide shadow-sm ${
            property.listingType === 'rent' ? 'bg-indigo-600/95' : 'bg-amber-600/95 text-slate-950 font-extrabold'
          }`}>
            For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
          </span>
          {property.sponsored && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600/95 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-sm border border-rose-500/25 animate-pulse">
              <Sparkles className="w-3 h-3 text-rose-200" />
              <span>Sponsored</span>
            </span>
          )}
          {property.promoted && (
            <span className="px-2 py-0.5 rounded-md bg-blue-600/95 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-sm border border-blue-500/25">
              <span>Promoted</span>
            </span>
          )}
          {property.verified && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600/95 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-sm border border-emerald-500/25">
              <CheckCircle2 className="w-3 h-3 text-emerald-200" />
              <span>Verified</span>
            </span>
          )}
          {property.featured && !property.sponsored && !property.promoted && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/95 backdrop-blur-md text-slate-950 text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
              <span>Premium</span>
            </span>
          )}
        </div>

        {/* Action icons right panel (Favorite/heart + Options menu) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          {/* Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`w-7.5 h-7.5 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              saved 
                ? 'bg-rose-500 text-white' 
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>

          {/* Options Dots */}
          <button
            type="button"
            onClick={toggleOptionsMenu}
            className="w-7.5 h-7.5 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Options popup menu */}
        {showOptionsMenu && (
          <div className="absolute right-2 top-11 bg-slate-950 text-white rounded-xl border border-slate-800 p-1 shadow-xl z-30 min-w-[130px] animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={handleShare}
              className="w-full text-left px-2.5 py-1.5 text-[10px] font-bold hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-amber-400" />
              <span>Share Listing</span>
            </button>
            <button
              type="button"
              onClick={handleToggleCompare}
              className="w-full text-left px-2.5 py-1.5 text-[10px] font-bold hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3 h-3 text-amber-400" />
              <span>{inCompare ? 'Remove Compare' : 'Add Compare'}</span>
            </button>
          </div>
        )}

        {/* Rent/Sale pricing details and RERA badges at the bottom of the image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-300 block mb-0.5">
              {property.listingType === 'rent' ? 'Monthly Rent' : 'Sale Price'}
            </span>
            <div className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-md">
              {displayPrice}
            </div>
          </div>
          
          {property.reraApproved && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-amber-300 bg-black/65 border border-amber-500/20 rounded">
              RERA Approved
            </span>
          )}
        </div>

        {/* Floating Ask Agent Chat Bubble */}
        {onOpenInquiry && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenInquiry(property);
            }}
            title="Ask Agent about this listing"
            className="absolute bottom-11 right-2.5 w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 z-20 cursor-pointer border border-emerald-500/20 transition-all transform hover:scale-115 active:scale-95 group/bubble"
          >
            <MessageSquare className="w-4.5 h-4.5 fill-emerald-100/10 text-emerald-100 group-hover/bubble:rotate-12 transition-transform" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-slate-950/95 text-[9px] text-white font-extrabold rounded-md border border-slate-800 opacity-0 group-hover/bubble:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
              💬 Ask Agent
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 border-2 border-slate-900 rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 border-2 border-slate-900 rounded-full" />
          </button>
        )}
      </div>

      {/* 2. Compact information body with thin borders & minimal spacing */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
        
        {/* Core Attributes */}
        <div>
          {/* Location details */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="truncate font-semibold">
              {property.locality ? `${property.locality}, ` : ''}{property.city}
            </span>
          </div>

          {/* Property Title */}
          <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
            {property.title}
          </h4>

          {/* Compact Specs Row (BHK/Type, Baths/Cabins, Area, Furnishing) */}
          <div className="grid grid-cols-4 gap-1 py-1.5 my-2 border-y border-slate-100 text-[11px] text-slate-600 font-semibold">
            {property.category === 'office' || property.category === 'commercial' || property.category === 'factory' || property.category === 'godown' || property.category === 'warehouse' || (property.beds === 0 && property.sqft > 0) ? (
              <>
                <div className="flex items-center gap-1 truncate col-span-2 text-amber-800 font-bold">
                  {property.category === 'office' ? (
                    <Briefcase className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  ) : property.category === 'factory' ? (
                    <Factory className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  ) : property.category === 'godown' || property.category === 'warehouse' ? (
                    <Warehouse className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  )}
                  <span className="capitalize">{property.furnishing || property.category}</span>
                </div>
                
                <div className="flex items-center gap-1 truncate col-span-2 justify-end">
                  <Maximize className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{property.sqft} sq.ft</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 truncate">
                  <Bed className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{property.beds ? `${property.beds} BHK` : '1 BHK'}</span>
                </div>
                
                <div className="flex items-center gap-1 truncate">
                  <Bath className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{property.baths ? `${property.baths} Bath` : '1 Bath'}</span>
                </div>

                <div className="flex items-center gap-1 truncate col-span-2">
                  <Maximize className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{property.sqft} sq.ft</span>
                </div>
              </>
            )}
          </div>

          {/* Quick Furnishing & Possession badge tags */}
          <div className="flex flex-wrap gap-1 text-[10px] font-bold mb-1">
            {property.furnishing && (
              <span className={`px-2 py-0.5 rounded border ${
                property.furnishing.toLowerCase().includes('full') 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : property.furnishing.toLowerCase().includes('semi')
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                🛋️ {property.furnishing}
              </span>
            )}
            {property.possessionStatus && (
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/50">
                ⚡ {property.possessionStatus}
              </span>
            )}
            {property.zeroBrokerage && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                💰 0 Broker
              </span>
            )}
          </div>

          {/* Short Property Description Detail */}
          <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-slate-100/80">
            {property.description || 'Verified family property situated in high demand residential cluster with modern amenities.'}
          </p>
        </div>

        {/* Footer info showing Posted time & View Details */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
          {/* Posted Time & Date */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span>Posted: {postedDate}</span>
          </div>

          {/* View Details button */}
          <button
            type="button"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 text-[10px] font-black rounded-lg transition-all flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
