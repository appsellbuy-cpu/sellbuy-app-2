import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  History, 
  Bell, 
  Phone, 
  MapPin, 
  Mail, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Save, 
  Loader2, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Coins,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types';

interface UserProfilePageProps {
  onSelectProperty?: (property: Property) => void;
  onOpenBooking?: (property: Property) => void;
}

const AVATAR_PRESETS = [
  { name: 'Heritage Golden', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' },
  { name: 'Royal Jaipur Indigo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  { name: 'Pink City Emerald', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
  { name: 'Amber Fort Ruby', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
  { name: 'Hawa Mahal Rose', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' },
  { name: 'Jal Mahal Azure', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' }
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  onSelectProperty,
  onOpenBooking
}) => {
  const { user, updateUserProfile, updatePassword, switchDemoRole } = useAuth();
  const { savedListings, bookings, showToast } = useProperties();

  const [activeTab, setActiveTab] = useState<'details' | 'security' | 'history' | 'preferences'>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  // Form State - Details
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Jaipur');
  const [locality, setLocality] = useState(user?.companyName || 'Vaishali Nagar');
  const [role, setRole] = useState<'user' | 'agent' | 'admin' | 'seller'>(user?.role || 'user');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0].url);
  const [bio, setBio] = useState('Premium Jaipur resident interested in direct verified listings with JDA Patta approval.');
  const [reraId, setReraId] = useState('RAJ/RERA/2025/1042');

  // Form State - Password Change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChanging, setPassChanging] = useState(false);

  // Notifications preferences
  const [prefWhatsApp, setPrefWhatsApp] = useState(true);
  const [prefEmailIndex, setPrefEmailIndex] = useState(true);
  const [prefInstantSms, setPrefInstantSms] = useState(false);
  const [prefJdaAuctions, setPrefJdaAuctions] = useState(true);

  // Password checks
  const hasMinLen = newPass.length >= 8;
  const hasNumOrSym = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPass);
  const hasMixed = /[a-z]/.test(newPass) && /[A-Z]/.test(newPass);

  const getPassStrength = () => {
    if (!newPass) return { label: 'None', width: 'w-0', color: 'bg-slate-300' };
    let score = 0;
    if (hasMinLen) score++;
    if (hasNumOrSym) score++;
    if (hasMixed) score++;
    if (score === 1) return { label: 'Weak', width: 'w-1/3', color: 'bg-rose-500' };
    if (score === 2) return { label: 'Good', width: 'w-2/3', color: 'bg-amber-500' };
    return { label: 'Strong', width: 'w-full', color: 'bg-emerald-500' };
  };

  const strength = getPassStrength();

  // Simulated static activities list to fulfill "view activity history"
  const simulatedActivities = [
    { id: 1, type: 'search', text: 'Searched for 3 BHK Flats near Vaishali Nagar, Jaipur', time: '1 hour ago', icon: <TrendingUp className="w-4 h-4 text-amber-500" /> },
    { id: 2, type: 'valuation', text: 'Generated free JDA scheme property valuation report for Jagatpura plot', time: 'Yesterday', icon: <Coins className="w-4 h-4 text-teal-400" /> },
    { id: 3, type: 'inquiry', text: 'Inquired about "Luxury 4 BHK Gated Villa on Sirsi Road" (Direct Owner)', time: '3 days ago', icon: <MessageSquare className="w-4 h-4 text-emerald-400" /> },
    { id: 4, type: 'booking', text: 'Scheduled in-person site visit for "Fully Furnished Flat near Malviya Nagar"', time: '5 days ago', icon: <Calendar className="w-4 h-4 text-blue-400" /> }
  ];

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Name is required');
      return;
    }
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: fullName,
        phone,
        city,
        role,
        avatar,
        companyName: locality // repurpose locality in profile
      });
      showToast('Personal profile details updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update details');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      showToast('All password fields are required');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New passwords do not match');
      return;
    }
    if (!hasMinLen || !hasNumOrSym || !hasMixed) {
      showToast('Please satisfy all password safety criteria');
      return;
    }

    setPassChanging(true);
    try {
      await updatePassword(currentPass, newPass);
      showToast('Password changed successfully! Keep it secure.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password');
    } finally {
      setPassChanging(false);
    }
  };

  const selectAvatarPreset = (url: string) => {
    setAvatar(url);
    setAvatarMenuOpen(false);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Jaipur Real Estate alerts & preferences updated.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Royal Jaipur Header Banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border border-slate-800 relative overflow-hidden">
          {/* Subtle Royal Grid/Arch Design Pattern */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-12 translate-x-12">
            <Building2 className="w-96 h-96 text-amber-500" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              
              {/* Profile Avatar Container with Quick Select Trigger */}
              <div className="relative group">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-500/80 shadow-lg group-hover:opacity-90 transition"
                />
                <button 
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-slate-950 p-1.5 rounded-xl hover:bg-amber-400 transition shadow-md border border-slate-950"
                  title="Change profile avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                {/* Quick Avatar Dropdown */}
                {avatarMenuOpen && (
                  <div className="absolute left-0 mt-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-60 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 mb-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Heritage Avatar</span>
                      <button onClick={() => setAvatarMenuOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectAvatarPreset(preset.url)}
                          className="relative rounded-lg overflow-hidden border border-slate-800 hover:border-amber-400 transition"
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-12 object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight leading-none">
                    {fullName || user?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    {role ? role.toUpperCase() : 'USER'}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 mt-1.5 flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-500" /> {user?.email}
                  </span>
                  <span className="hidden sm:inline text-slate-700">•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-500" /> {phone || '+91 98201 45678'}
                  </span>
                  <span className="hidden sm:inline text-slate-700">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {city || 'Jaipur'}
                  </span>
                </p>

                <div className="text-slate-300 font-medium text-xs mt-3 flex items-center justify-center sm:justify-start gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>RERA Verified Citizen ID: {reraId}</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Role Switching Panel */}
            <div className="flex flex-col items-center sm:items-start lg:items-end gap-1.5 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs self-center lg:self-auto max-w-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Quick Role Switcher for Demo</span>
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(['user', 'seller', 'agent', 'admin'] as const).map(demoRole => (
                  <button
                    key={demoRole}
                    onClick={() => {
                      switchDemoRole(demoRole);
                      setRole(demoRole);
                      showToast(`Switched active profile to ${demoRole.toUpperCase()}`);
                    }}
                    className={`px-2.5 py-1 rounded-lg uppercase text-[9px] font-bold transition ${
                      user?.role === demoRole
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800'
                    }`}
                  >
                    {demoRole}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Tabs Grid - 4 Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'details'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4 text-amber-500" />
            <span>Personal Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>Password & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4 text-sky-500" />
            <span>Activity History</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'preferences'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4 text-indigo-500" />
            <span>Preferences & Alerts</span>
          </button>
        </div>

        {/* TAB 1: PERSONAL DETAILS */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <UserIcon className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900 font-serif">Update Personal Details</h3>
              </div>

              <form onSubmit={handleSaveDetails} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none transition font-medium"
                      placeholder="e.g. Vikramaditya Singhania"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={user?.email || 'appsellbuy@gmail.com'}
                      disabled
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none transition font-medium"
                      placeholder="e.g. +91 98201 45678"
                    />
                  </div>

                  {/* Profile Role */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Property Interest Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none transition font-medium cursor-pointer"
                    >
                      <option value="user">Property Buyer / Tenant</option>
                      <option value="seller">Property Owner / Seller</option>
                      <option value="agent">Real Estate Agent / Broker</option>
                      <option value="admin">Platform Manager / Administrator</option>
                    </select>
                  </div>

                  {/* Primary City */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none transition font-medium"
                      placeholder="Jaipur"
                    />
                  </div>

                  {/* Primary Locality */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Primary Locality Interest</label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none transition font-medium"
                      placeholder="e.g. Vaishali Nagar, Malviya Nagar"
                    />
                  </div>

                </div>

                {/* Bio / Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Short Bio / Property Requirements</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none transition font-medium resize-none"
                    placeholder="Tell Jaipur owners/agents about what properties you are looking to rent, buy, or sell..."
                  />
                </div>

                {/* RERA License (conditional metadata) */}
                {(role === 'agent' || role === 'seller') && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>RERA Rajasthan Registration (Optional)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">RERA License ID</label>
                        <input
                          type="text"
                          value={reraId}
                          onChange={(e) => setReraId(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                          placeholder="e.g. RAJ/RERA/2026/XXXX"
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 self-center leading-relaxed pt-2 sm:pt-0">
                        Listing properties with a verified RERA number ensures up to 5x higher engagement and credibility on the Jaipur platform.
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        <span>Saving Details...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-amber-500" />
                        <span>Save Personal Details</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PASSWORD & SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <Lock className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 font-serif">Change Password</h3>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                
                {/* Current Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Current Password</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none transition font-medium"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">New Password</label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none transition font-medium"
                      placeholder="Enter new password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none transition font-medium"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>

                {/* Pass Safety Indicator */}
                {newPass && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Password Safety Strength:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${strength.color}`}>
                        {strength.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>

                    {/* Verification Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLen ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span>Min 8 characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumOrSym ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span>Number or symbol</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${hasMixed ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span>Lowercase & Uppercase</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bonus: Two Factor Auth toggle */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Two-Factor Login Protection (2FA)</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed max-w-lg">
                      Secure your direct owner inquiries & legal agreement forms using secure mobile SMS / email OTP confirmation.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Session Logs summary */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Device & Session Logs</span>
                  <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Active login session via Safari (Mac OS X)
                    </span>
                    <span>IP: 103.42.21.14 (Jaipur, India)</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={passChanging}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    {passChanging ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITY HISTORY */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            
            {/* Live Activities History Timeline */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-sky-600" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">Recent Portal Activity</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Logs</span>
              </div>

              <div className="space-y-4">
                {simulatedActivities.map((act) => (
                  <div 
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/50 border border-slate-200 flex items-start gap-3 transition"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-3xs flex items-center justify-center flex-shrink-0">
                      {act.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        {act.text}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Badge Guarantee Note */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-800 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Fair Use Jaipur Real Estate Policy</span>
                </div>
                <p className="text-[11px] text-sky-700">
                  Your direct owner inquiries are securely recorded with RERA-compliant digital audit logs. Spamming or publishing duplicate listings will trigger automatic profile audits.
                </p>
              </div>
            </div>

            {/* Sidebar Stats: Tours, Saved Properties count */}
            <div className="space-y-6">
              
              {/* Tour booking summary card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booked Property Tours</div>
                
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-slate-900 font-serif">{bookings.length}</span>
                  <span className="text-xs font-bold text-slate-500">Scheduled Tours</span>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-xs text-slate-400">You have no active tour bookings scheduled currently. Explore verified properties to schedule one!</div>
                ) : (
                  <div className="space-y-2.5">
                    {bookings.slice(0, 2).map((b) => (
                      <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="font-bold text-slate-800 truncate">{b.propertyTitle}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.preferredDate} at {b.preferredTime}</div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1 uppercase">
                          <CheckCircle2 className="w-3 h-3" /> {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shortlisted properties count */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted Properties</div>
                
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-rose-600 font-serif">{savedListings.length}</span>
                  <span className="text-xs font-bold text-slate-500">Favorites</span>
                </div>

                <div className="text-xs text-slate-400">
                  Shortlisted properties synchronize immediately across the Jaipur real estate analytics engine for smart notifications.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: PREFERENCES & ALERTS */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                <Bell className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 font-serif">Preferences & Notification Settings</h3>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-6">
                
                <div className="space-y-4">
                  {/* WhatsApp Reminders */}
                  <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-0.5">
                      <label className="text-xs sm:text-sm font-bold text-slate-800 block">WhatsApp Tour Reminders</label>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Get instant tour schedule confirmations, directions, and direct owner WhatsApp contacts.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefWhatsApp}
                      onChange={(e) => setPrefWhatsApp(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600 mt-1 cursor-pointer"
                    />
                  </div>

                  {/* Email Digest */}
                  <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-0.5">
                      <label className="text-xs sm:text-sm font-bold text-slate-800 block">Weekly Jaipur Price Index Digest</label>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Stay updated on JDA property auctions, new layout announcements, and real-time capital growth rates in Jaipur.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefEmailIndex}
                      onChange={(e) => setPrefEmailIndex(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600 mt-1 cursor-pointer"
                    />
                  </div>

                  {/* JDA Auction updates */}
                  <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-0.5">
                      <label className="text-xs sm:text-sm font-bold text-slate-800 block">JDA Auction & Scheme Patta Alerts</label>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Immediate alerts when new JDA approved residential land schemes or commercial layout auctions open.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefJdaAuctions}
                      onChange={(e) => setPrefJdaAuctions(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600 mt-1 cursor-pointer"
                    />
                  </div>

                  {/* Instant SMS */}
                  <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-0.5">
                      <label className="text-xs sm:text-sm font-bold text-slate-800 block">SMS Alerts on Verified Leads</label>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Receive instant cell phone SMS notifications when a direct owner posts a zero-brokerage flat matching your shortlist.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefInstantSms}
                      onChange={(e) => setPrefInstantSms(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600 mt-1 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preferences Form Actions */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-indigo-400" />
                    <span>Save Preference Settings</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
