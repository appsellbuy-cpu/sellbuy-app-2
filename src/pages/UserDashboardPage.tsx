import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  User as UserIcon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';

interface UserDashboardPageProps {
  onSelectProperty: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
  onOpenInquiry: (property: Property) => void;
  onOpenPostProperty: () => void;
  onNavigate?: (view: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onSelectProperty,
  onOpenBooking,
  onOpenInquiry,
  onOpenPostProperty,
  onNavigate
}) => {
  const { savedProperties, bookings, toggleFavorite, showToast } = useProperties();
  const { user, switchDemoRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'saved' | 'tours' | 'profile'>('saved');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl font-serif">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email} • {user?.phone}</p>
            </div>
          </div>

          {/* Role switcher for easy testing */}
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700 text-xs">
            <span className="text-slate-400 px-2 font-medium">Switch Role:</span>
            {(['user', 'seller', 'agent', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => {
                  switchDemoRole(role);
                  showToast(`Switched active demo profile to ${role.toUpperCase()}`);
                }}
                className={`px-3 py-1 rounded-xl uppercase text-[10px] font-bold transition ${
                  user?.role === role
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'saved'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Shortlisted Properties ({savedProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tours')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'tours'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Booked Viewing Tours ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4 text-sky-500" />
            <span>Account Profile</span>
          </button>
        </div>

        {/* Tab 1: Shortlisted Properties */}
        {activeTab === 'saved' && (
          <div>
            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Shortlisted Properties Yet</h3>
                <p className="text-xs text-slate-500">
                  Tap the heart icon on any property card to save your favorite rental or buy listings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={onSelectProperty}
                    onOpenBooking={onOpenBooking}
                    onOpenInquiry={onOpenInquiry}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Booked Viewing Tours */}
        {activeTab === 'tours' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Tours Scheduled</h3>
                <p className="text-xs text-slate-500">
                  Schedule free in-person site visits or live video tours directly with owners.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map(b => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {b.status}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          {b.tourType.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                        {b.propertyTitle}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{b.propertyLocation}</span>
                      </p>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-700">
                        <div><strong>Date:</strong> {b.preferredDate} at {b.preferredTime}</div>
                        <div><strong>Visitor:</strong> {b.userName} ({b.userPhone})</div>
                        {b.notes && <div><strong>Notes:</strong> {b.notes}</div>}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Ref #{b.id}</span>
                      <button
                        onClick={() => showToast('Tour reminder SMS dispatched!')}
                        className="text-amber-600 font-bold hover:underline"
                      >
                        Resend Reminder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Account Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">User Information & Preferences</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-slate-400 font-medium">Full Name</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{user?.name}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-slate-400 font-medium">Email Address</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{user?.email}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-slate-400 font-medium">Mobile Phone</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{user?.phone}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-slate-400 font-medium">Account Role</div>
                <div className="text-sm font-bold text-slate-900 mt-1 uppercase">{user?.role}</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified RERA Indian Citizen Profile</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Your profile is verified to directly schedule property viewings and create legally binding rent agreements.
              </p>
            </div>

            {onNavigate && (
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onNavigate('profile')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-amber-500" />
                  <span>Edit Full Profile & Security Settings</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
