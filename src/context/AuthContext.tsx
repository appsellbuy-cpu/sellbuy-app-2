import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { 
  supabaseAuth, 
  isSupabaseConfigured, 
  fetchUserActivityHistory, 
  recordUserActivity, 
  UserActivityRecord,
  fetchCurrentUserProfile,
  updateCurrentUserProfile
} from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseActive: boolean;
  activityHistory: UserActivityRecord[];
  refreshActivityHistory: () => Promise<void>;
  logActivity: (action: UserActivityRecord['action'], title: string, property?: any, details?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, phone?: string, city?: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  switchDemoRole: (role: 'user' | 'agent' | 'admin' | 'seller') => void;
  updateUserProfile: (updatedData: Partial<User>) => Promise<User>;
  updatePassword: (currentPass: string, newPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (isSupabaseConfigured()) return null;
    const saved = localStorage.getItem('navikx_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (isSupabaseConfigured()) return null;
    return localStorage.getItem('navikx_token');
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [activityHistory, setActivityHistory] = useState<UserActivityRecord[]>([]);

  const isSupabaseActive = isSupabaseConfigured();

  const refreshActivityHistory = useCallback(async () => {
    if (user?.id) {
      const history = await fetchUserActivityHistory(user.id);
      setActivityHistory(history);
    } else {
      setActivityHistory([]);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshActivityHistory();
  }, [refreshActivityHistory]);

  useEffect(() => {
    if (!isSupabaseActive) return;
    let mounted = true;
    const hydrate = async () => {
      try {
        const session = await supabaseAuth.getSession();
        if (!mounted) return;
        if (session?.user) {
          const profile = await fetchCurrentUserProfile();
          if (mounted) {
            setUser(profile);
            setToken(session.access_token);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Failed to hydrate Supabase session:', error);
        if (mounted) { setUser(null); setToken(null); }
      }
    };
    hydrate();
    const { data } = supabaseAuth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setToken(null);
        return;
      }
      try {
        const profile = await fetchCurrentUserProfile();
        if (mounted) {
          setUser(profile);
          setToken(session.access_token);
        }
      } catch (error) {
        console.error('Failed to load Supabase profile:', error);
      }
    });
    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, [isSupabaseActive]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('navikx_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('navikx_user');
    }
    if (token) {
      localStorage.setItem('navikx_token', token);
    } else {
      localStorage.removeItem('navikx_token');
    }
  }, [user, token]);

  const logActivity = async (action: UserActivityRecord['action'], title: string, property?: any, details?: string) => {
    if (user?.id) {
      await recordUserActivity(user.id, action, title, property, details);
      await refreshActivityHistory();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseActive) {
        const res = await supabaseAuth.signInWithPassword(email, password);
        if (res?.user && res?.session) {
          const supaUser = await fetchCurrentUserProfile();
          if (!supaUser) throw new Error('Supabase profile was not created for this account.');
          setUser(supaUser);
          setToken(res.session.access_token);
          await recordUserActivity(supaUser.id, 'login', 'Signed in successfully as ' + supaUser.email);
        }
      } else {
        const res = await api.login(email, password);
        setUser(res.user);
        setToken(res.token);
        await recordUserActivity(res.user.id, 'login', `Signed in successfully as ${res.user.email}`);
      }
      setIsAuthModalOpen(false);
      await refreshActivityHistory();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role?: string, phone?: string, city?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseActive) {
        const res = await supabaseAuth.signUp(email, password, { name, role, phone, city });
        if (res?.user && res?.session) {
          const supaUser = await fetchCurrentUserProfile();
          if (!supaUser) throw new Error('Supabase profile was not created for this account.');
          setUser(supaUser);
          setToken(res.session.access_token);
          await recordUserActivity(supaUser.id, 'login', 'Registered new account as ' + supaUser.name);
        }
      } else {
        const res = await api.register({ name, email, password, role, phone, city });
        setUser(res.user);
        setToken(res.token);
        await recordUserActivity(res.user.id, 'login', `Registered new account as ${res.user.name}`);
      }
      setIsAuthModalOpen(false);
      await refreshActivityHistory();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (isSupabaseActive) {
      supabaseAuth.signOut();
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('navikx_user');
    localStorage.removeItem('navikx_token');
    setActivityHistory([]);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchDemoRole = (role: 'user' | 'agent' | 'admin' | 'seller') => {
    if (isSupabaseActive) {
      console.warn('Demo role switching is disabled while Supabase authentication is active.');
      return;
    }
    let targetUser: User;
    if (role === 'admin') {
      targetUser = {
        id: 'user-admin',
        name: 'Pooja Hegde (Admin)',
        email: 'admin@navikx.in',
        role: 'admin',
        phone: '+91 99001 23456',
        city: 'Bangalore',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
      };
      setToken('token-user-admin');
    } else if (role === 'seller') {
      targetUser = {
        id: 'user-seller-1',
        name: 'Vikramaditya Singhania',
        email: 'vikram.singhania@gmail.com',
        role: 'seller',
        phone: '+91 98201 45678',
        city: 'Mumbai',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
      };
      setToken('token-user-seller-1');
    } else if (role === 'agent') {
      targetUser = {
        id: 'agent-1',
        name: 'Pooja Hegde (Verified Agent)',
        email: 'pooja.hegde@navikx.in',
        role: 'agent',
        phone: '+91 99001 23456',
        city: 'Bangalore',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
      };
      setToken('token-agent-1');
    } else {
      targetUser = {
        id: 'user-default',
        name: 'Alexander Wright',
        email: 'appsellbuy@gmail.com',
        role: 'user',
        phone: '+91 98201 45678',
        city: 'Mumbai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
      };
      setToken('token-user-default');
    }
    setUser(targetUser);
    recordUserActivity(targetUser.id, 'login', `Switched demo role to ${role}`);
  };

  const updateUserProfile = async (updatedData: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('No logged-in user to update');
    }
    const updatedUser = isSupabaseActive
      ? await updateCurrentUserProfile(updatedData)
      : { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('navikx_user', JSON.stringify(updatedUser));
    await recordUserActivity(user.id, 'login', 'Updated profile information');
    return updatedUser;
  };

  const updatePassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    if (!currentPass || !newPass) {
      throw new Error('Passwords cannot be empty');
    }
    if (isSupabaseActive) {
      await supabaseAuth.updatePassword(newPass);
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isSupabaseActive,
        activityHistory,
        refreshActivityHistory,
        logActivity,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        switchDemoRole,
        updateUserProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

