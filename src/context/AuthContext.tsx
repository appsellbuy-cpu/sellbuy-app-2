import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
    const saved = localStorage.getItem('navikx_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return {
      id: 'user-default',
      name: 'Alexander Wright',
      email: 'appsellbuy@gmail.com',
      role: 'seller',
      phone: '+91 98201 45678',
      city: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('navikx_token') || 'token-user-default';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role?: string, phone?: string, city?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password, role, phone, city });
      setUser(res.user);
      setToken(res.token);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('navikx_user');
    localStorage.removeItem('navikx_token');
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchDemoRole = (role: 'user' | 'agent' | 'admin' | 'seller') => {
    if (role === 'admin') {
      setUser({
        id: 'user-admin',
        name: 'Pooja Hegde (Admin)',
        email: 'admin@navikx.in',
        role: 'admin',
        phone: '+91 99001 23456',
        city: 'Bangalore',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
      });
      setToken('token-user-admin');
    } else if (role === 'seller') {
      setUser({
        id: 'user-seller-1',
        name: 'Vikramaditya Singhania',
        email: 'vikram.singhania@gmail.com',
        role: 'seller',
        phone: '+91 98201 45678',
        city: 'Mumbai',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
      });
      setToken('token-user-seller-1');
    } else if (role === 'agent') {
      setUser({
        id: 'agent-1',
        name: 'Pooja Hegde (Verified Agent)',
        email: 'pooja.hegde@navikx.in',
        role: 'agent',
        phone: '+91 99001 23456',
        city: 'Bangalore',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
      });
      setToken('token-agent-1');
    } else {
      setUser({
        id: 'user-default',
        name: 'Alexander Wright',
        email: 'appsellbuy@gmail.com',
        role: 'user',
        phone: '+91 98201 45678',
        city: 'Mumbai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
      });
      setToken('token-user-default');
    }
  };

  const updateUserProfile = async (updatedData: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('No logged-in user to update');
    }
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('navikx_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const updatePassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    if (!currentPass || !newPass) {
      throw new Error('Passwords cannot be empty');
    }
    // Simulate API delay
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
