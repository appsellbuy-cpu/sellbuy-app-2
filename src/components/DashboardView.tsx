import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { Property, ViewingBooking, AgentInquiry, SavedListing } from '../types';
import { api } from '../services/api';
import { formatIndianCurrency, formatRentPrice } from '../utils/formatters';
import { fetchInquiriesFromSupabase, subscribeToInquiriesRealtime } from '../lib/supabase';
import { Building2, Plus, Edit2, Trash2, Calendar, Clock, MapPin, Eye, Shield, CheckCircle, AlertCircle, MessageSquare, Send, Heart, Bed, Bath, Square } from 'lucide-react';

interface DashboardViewProps {
  onBackToHome: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onBackToHome }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { 
    properties, 
    bookings, 
    deleteProperty, 
    openEditModal, 
    openDetail, 
    openSellModal,
    cancelBooking,
    savedListings,
    removeSavedListing,
    toggleFavorite,
    isSaved
  } = useProperties();

  const [activeTab, setActiveTab] = useState<'listings' | 'saved' | 'bookings' | 'inquiries'>('listings');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<AgentInquiry[]>([]);

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const supaInquiries = await fetchInquiriesFromSupabase(user?.id, user?.email, user?.role);
        if (supaInquiries && supaInquiries.length > 0) {
          setInquiries(supaInquiries as any);
          return;
        }
        const list = await api.getAgentInquiries();
        const safeList = Array.isArray(list) ? list : [];
        if (user?.role === 'agent' || user?.role === 'admin') {
          setInquiries(safeList);
        } else if (user?.email) {
          const userEmailLower = user.email.toLowerCase();
          setInquiries(safeList.filter(i => (i.userEmail || '').toLowerCase() === userEmailLower));
        } else {
          setInquiries(safeList);
        }
      } catch (err) {
        console.error('Failed to load inquiries', err);
      }
    };
    loadInquiries();

    const sub = subscribeToInquiriesRealtime((newInquiry) => {
      if (user?.role === 'admin' || user?.role === 'agent' || newInquiry.senderEmail === user?.email) {
        setInquiries(prev => {
          if (prev.some(i => i.id === newInquiry.id)) return prev;
          return [newInquiry as any, ...prev];
        });
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-gray-200 flex items-center justify-center mx-auto mb-4 text-[#0A192F]">
          <Shield className="w-8 h-8 text-[#C5A059]" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#0A192F] mb-2">Member Dashboard Access</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Please sign in or create an account to view your listed properties, track scheduled viewings, and manage acquisitions.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all shadow-md"
        >
          Sign In to Dashboard
        </button>
      </div>
    );
  }

  // Filter listings by current user (strictly owned by logged-in user or all if admin)
  const myListings = (properties || []).filter(p => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return p.ownerId === user.id || (user.email && (p as any).ownerEmail === user.email);
  });

  const handleDelete = async (id: string) => {
    const target = properties.find(p => p.id === id);
    if (target && user && user.role !== 'admin' && target.ownerId && target.ownerId !== user.id) {
      alert('You can only delete properties that belong to your account.');
      return;
    }
    await deleteProperty(id);
    setDeleteConfirmId(null);
  };

  const handleEdit = (prop: Property) => {
    if (user && user.role !== 'admin' && prop.ownerId && prop.ownerId !== user.id) {
      alert('You can only edit properties that belong to your account.');
      return;
    }
    openEditModal(prop);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Summary Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A059]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-serif font-bold text-[#0A192F]">{user?.name}</h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#F3EFE8] text-[#9A7632] rounded-full">
                    {user?.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email} &bull; {user?.phone || 'Verified Account'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openSellModal}
                className="px-5 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                Add New Property
              </button>
              <button
                onClick={onBackToHome}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-all"
              >
                Back to Website
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="p-4 rounded-xl bg-[#FAF8F5]">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Properties Listed</span>
              <div className="text-2xl font-bold font-serif text-[#0A192F] mt-1">{myListings.length}</div>
            </div>
            <div 
              onClick={() => setActiveTab('saved')}
              className="p-4 rounded-xl bg-[#FAF8F5] hover:bg-rose-50/50 cursor-pointer transition-colors group"
            >
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>Saved Listings</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
              </span>
              <div className="text-2xl font-bold font-serif text-rose-600 mt-1">{savedListings.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5]">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Viewing Requests</span>
              <div className="text-2xl font-bold font-serif text-[#0A192F] mt-1">{bookings.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5]">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Agent Inquiries</span>
              <div className="text-2xl font-bold font-serif text-[#9A7632] mt-1">{inquiries.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Database Status</span>
              <div className="text-2xl font-bold font-serif text-emerald-700 mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Synced
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 sm:gap-6 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === 'listings' ? 'text-[#0A192F]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            My Listed Properties ({myListings.length})
            {activeTab === 'listings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A192F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved' ? 'text-rose-600' : 'text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'saved' ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            <span>Saved Listings ({savedListings.length})</span>
            {activeTab === 'saved' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings' ? 'text-[#0A192F]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Scheduled Viewings ({bookings.length})
            {activeTab === 'bookings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A192F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === 'inquiries' ? 'text-[#0A192F]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Agent Inquiries ({inquiries.length})
            {activeTab === 'inquiries' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A192F]" />
            )}
          </button>
        </div>

        {/* Tab 1: Listings */}
        {activeTab === 'listings' && (
          <div>
            {myListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-serif font-bold text-[#0A192F]">No Properties Listed Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6">
                  List your house, apartment, or development plot to reach serious buyers and investors immediately.
                </p>
                <button
                  onClick={openSellModal}
                  className="px-6 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a]"
                >
                  List First Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((prop: Property) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-gray-100">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#0A192F] rounded-md shadow-sm">
                          {prop.category}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white rounded-md shadow-sm">
                          Active
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-baseline justify-between mb-1">
                          <h3 className="text-base font-serif font-bold text-[#0A192F] truncate">{prop.title}</h3>
                          <span className="text-base font-bold font-sans text-amber-800">
                            {prop.priceDisplay || (prop.listingType === 'rent' ? formatRentPrice(prop.price) : formatIndianCurrency(prop.price))}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {prop.location}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                          {prop.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-4 bg-[#FAF9F7] border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => openDetail(prop)}
                        className="text-xs font-semibold text-gray-600 hover:text-[#0A192F] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(prop)}
                          className="p-2 text-gray-600 hover:text-[#0A192F] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit2 className="w-4 h-4 text-[#C5A059]" />
                        </button>

                        {deleteConfirmId === prop.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(prop.id)}
                              className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 text-gray-500 text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(prop.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Saved Listings */}
        {activeTab === 'saved' && (
          <div>
            {savedListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3 text-rose-500">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#0A192F]">No Saved Properties Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                  Save your favorite properties by clicking the heart icon on any property card or detail view to curate your custom shortlist here.
                </p>
                <button
                  onClick={onBackToHome}
                  className="px-6 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all shadow-sm cursor-pointer"
                >
                  Explore Featured Properties
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-500">
                    Showing <strong className="text-[#0A192F]">{savedListings.length}</strong> saved {savedListings.length === 1 ? 'property' : 'properties'} in your collection
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedListings.map((savedItem: SavedListing) => {
                    const prop = savedItem.property;
                    if (!prop) return null;
                    return (
                      <div
                        key={savedItem.id || savedItem.propertyId}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => openDetail(prop)}>
                            <img
                              src={prop.image}
                              alt={prop.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#0A192F]/85 backdrop-blur-md text-white rounded-md shadow-sm">
                                {prop.category}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSavedListing(prop.id);
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-md bg-white/90 text-rose-600 hover:bg-rose-50 hover:scale-110 shadow-sm transition-all cursor-pointer"
                              title="Remove from Saved Listings"
                            >
                              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                            </button>
                          </div>

                          <div className="p-5">
                            <div className="flex items-baseline justify-between mb-1">
                              <h3 
                                onClick={() => openDetail(prop)}
                                className="text-base font-serif font-bold text-[#0A192F] truncate hover:text-[#C5A059] cursor-pointer transition-colors"
                              >
                                {prop.title}
                              </h3>
                              <span className="text-base font-bold font-sans text-[#0A192F] ml-2 shrink-0">${prop.price.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> <span className="truncate">{prop.location}</span>
                            </p>
                            
                            {/* Specs */}
                            <div className="flex items-center gap-3 text-xs text-gray-600 border-t border-gray-100 pt-3 mt-3">
                              {prop.category === 'plot' ? (
                                <span className="flex items-center gap-1"><Square size={13} className="text-gray-400" /> {prop.sqft.toLocaleString()} sqft</span>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1"><Bed size={13} className="text-gray-400" /> {prop.beds}b</span>
                                  <span className="flex items-center gap-1"><Bath size={13} className="text-gray-400" /> {prop.baths}ba</span>
                                  <span className="flex items-center gap-1"><Square size={13} className="text-gray-400" /> {prop.sqft.toLocaleString()} sqft</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="p-4 bg-[#FAF9F7] border-t border-gray-100 flex items-center justify-between">
                          <button
                            onClick={() => openDetail(prop)}
                            className="text-xs font-semibold text-[#0A192F] hover:text-[#C5A059] flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#C5A059]" /> View Details
                          </button>

                          <button
                            onClick={() => removeSavedListing(prop.id)}
                            className="text-xs font-semibold text-gray-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-serif font-bold text-[#0A192F]">No Scheduled Viewings</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6">
                  When you or clients book a viewing on any property, the appointments appear here with date and status tracking.
                </p>
                <button
                  onClick={onBackToHome}
                  className="px-6 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a]"
                >
                  Browse Portfolio
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: ViewingBooking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.propertyImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300'}
                        alt={booking.propertyTitle}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7632] block">
                          Inspection Appointment &bull; Ref #{booking.id.slice(-6)}
                        </span>
                        <h4 className="text-base font-serif font-bold text-[#0A192F]">{booking.propertyTitle}</h4>
                        <p className="text-xs text-gray-500">{booking.propertyLocation}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-600">
                          <span className="flex items-center gap-1 font-semibold text-[#0A192F]">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> {booking.preferredDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" /> {booking.preferredTime}
                          </span>
                          <span>Client: {booking.userName} ({booking.userEmail})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase rounded-full">
                        Confirmed
                      </span>
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Agent Inquiries */}
        {activeTab === 'inquiries' && (
          <div>
            {inquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-serif font-bold text-[#0A192F]">No Agent Inquiries Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6">
                  Inquiries sent directly to top specialists in the &ldquo;Meet Our Top Agents&rdquo; section will appear here with timestamps and reply statuses.
                </p>
                <button
                  onClick={onBackToHome}
                  className="px-5 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all"
                >
                  Explore Top Agents
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-gray-200 flex items-center justify-center text-[#9A7632] shrink-0">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3EFE8] text-[#9A7632] px-2 py-0.5 rounded">
                            {inq.inquiryType || 'Inquiry'}
                          </span>
                          <span className="text-xs font-serif font-bold text-[#0A192F]">
                            Direct to: {inq.agentName}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            &bull; Ref #{inq.id.slice(-6)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-700 font-medium mt-2 bg-[#FAF9F7] p-3 rounded-xl border border-gray-100">
                          &ldquo;{inq.message}&rdquo;
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                          <span>Sender: <strong className="text-[#0A192F]">{inq.userName}</strong> ({inq.userEmail})</span>
                          {inq.userPhone && <span>&bull; Tel: {inq.userPhone}</span>}
                          <span>&bull; Sent: {new Date(inq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Dispatched
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
