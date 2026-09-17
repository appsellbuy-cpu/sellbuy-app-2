import React, { useState } from 'react';
import { 
  PlusCircle, 
  Building2, 
  Eye, 
  MessageSquare, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Phone,
  Mail,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types';
import { formatIndianCurrency, formatRentPrice } from '../utils/formatters';

interface SellerDashboardPageProps {
  onOpenPostProperty: () => void;
  onOpenValuation: () => void;
  onSelectProperty: (property: Property) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({
  onOpenPostProperty,
  onOpenValuation,
  onSelectProperty
}) => {
  const { properties, deleteProperty, showToast } = useProperties();
  const { user } = useAuth();

  // Listed properties (user's or default all for demo seller)
  const myListings = (properties || []).filter(p => p.ownerId === user?.id || p.ownerName === user?.name || user?.role === 'admin' || user?.role === 'seller');

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this property listing?')) {
      await deleteProperty(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seller Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
              <Sparkles className="w-4 h-4" /> Owner & Seller Command Center
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight">
              Seller & Landlord Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Manage your listed rental and sale properties, track inbound verified buyer inquiries, and optimize your listings for maximum visibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <button
              onClick={onOpenPostProperty}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post New Property (FREE)</span>
            </button>
            <button
              onClick={onOpenValuation}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Property Valuation
            </button>
          </div>
        </div>

        {/* Analytics KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-400">Total Active Listings</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-sans">{myListings.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Live on Search</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-400">Total Property Views</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-sans">4,820</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">+24% this week</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-400">Inbound Buyer/Tenant Leads</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-sans">42</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">Direct Phone/WhatsApp</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-400">Tour Requests Received</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-sans">18</div>
            <div className="text-[11px] text-slate-500 mt-1">Site visits scheduled</div>
          </div>
        </div>

        {/* My Listed Properties Table / Grid */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">My Listed Properties ({myListings.length})</h3>
            <span className="text-xs text-slate-500">Zero commission charged to owners</span>
          </div>

          {myListings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No properties listed yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Post your flat, villa, commercial shop, or plot for free in 2 minutes and start receiving direct inquiries.
              </p>
              <button
                onClick={onOpenPostProperty}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Post Property FREE
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myListings.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectProperty(p)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-white transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-20 h-20 rounded-xl object-cover border flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.listingType === 'rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.listingType}
                        </span>
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition truncate max-w-md">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        <span>{p.locality ? `${p.locality}, ` : ''}{p.city}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900">
                        {p.listingType === 'rent'
                          ? (p.priceDisplay || formatRentPrice(p.price))
                          : (p.priceDisplay || formatIndianCurrency(p.price))}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.carpetArea ? `${p.carpetArea} sq.ft` : `${p.sqft} sq.ft`}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
