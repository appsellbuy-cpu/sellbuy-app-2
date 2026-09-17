import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { X, Lock, Mail, User as UserIcon, Phone, CheckCircle2, Shield } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, register, isLoading } = useAuth();
  const { showToast } = useProperties();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'agent'>('user');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (activeTab === 'login') {
        await login(email, password);
        showToast('Welcome back! Successfully signed in.');
      } else {
        await register(name, email, password, role, phone);
        showToast('Account created successfully! Welcome to NavikX.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setErrorMessage(null);
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      await login(demoEmail, demoPass);
      showToast(`Signed in as ${demoEmail}`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Demo login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF9F7]/95 backdrop-blur-md px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#9A7632] uppercase block">
              NavikX Secure Access
            </span>
            <h2 className="text-xl font-serif font-bold text-[#0A192F]">
              {activeTab === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Tab switchers */}
          <div className="flex border-b border-gray-100 bg-[#FAF8F5] sticky top-0 z-10">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'login'
                ? 'bg-white text-[#0A192F] border-b-2 border-[#0A192F]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'register'
                ? 'bg-white text-[#0A192F] border-b-2 border-[#0A192F]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            New Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {activeTab === 'register' && (
              <>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Johnathan Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0A192F] focus:bg-white focus:outline-none focus:border-[#0A192F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Account Type
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0A192F] focus:bg-white focus:outline-none focus:border-[#0A192F]"
                    >
                      <option value="user">Buyer / Seller</option>
                      <option value="agent">Broker / Agent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+1 (555)..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-8 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0A192F] focus:bg-white focus:outline-none focus:border-[#0A192F]"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0A192F] focus:bg-white focus:outline-none focus:border-[#0A192F]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0A192F] focus:bg-white focus:outline-none focus:border-[#0A192F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
            >
              {isLoading ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick 1-Click Demo Logins for instant evaluation */}
          <div className="pt-4 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2 text-center">
              Quick 1-Click Test Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('appsellbuy@gmail.com', 'password123')}
                className="p-2 bg-[#FAF8F5] border border-gray-200 rounded-xl hover:border-[#C5A059] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-[#0A192F] truncate">Alexander Wright</div>
                <div className="text-[10px] text-gray-500">Demo Agent Profile</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('eleanor@navikx.com', 'password123')}
                className="p-2 bg-[#FAF8F5] border border-gray-200 rounded-xl hover:border-[#C5A059] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-[#0A192F] truncate">Eleanor Vance</div>
                <div className="text-[10px] text-gray-500">Demo Buyer Profile</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
);
};
