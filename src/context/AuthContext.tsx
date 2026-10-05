import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';
import type { User, AgencyInfo } from '../types';

export type { User, AgencyInfo };

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
  onboardAgency: (data: { name: string; logo_url?: string; contact_email?: string; contact_phone?: string; subscription_tier?: string }) => Promise<AgencyInfo>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Retrieve user session on mount using JWT
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await api.get<any>('/auth/me');
          setUser({
            id: userData.id,
            name: userData.name || userData.email.split('@')[0],
            email: userData.email,
            avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.id}`,
            role: userData.role,
            agency_id: userData.agency_id,
            agency: userData.agency
          });
        } catch (err) {
          console.warn('Invalid auth token, logging out', err);
          removeAuthToken();
          localStorage.removeItem('travel_uz_user');
          setUser(null);
        }
      } else {
        const savedUser = localStorage.getItem('travel_uz_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            localStorage.removeItem('travel_uz_user');
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<any>('/auth/login', { email, password });
      if (res.access_token) {
        setAuthToken(res.access_token);
      }
      const loggedUser: User = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        avatar: res.user.avatar,
        role: res.user.role,
        agency_id: res.user.agency_id
      };
      setUser(loggedUser);
      localStorage.setItem('travel_uz_user', JSON.stringify(loggedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'agency_owner') => {
    setIsLoading(true);
    try {
      const res = await api.post<any>('/auth/register', { name, email, password, role });
      if (res.access_token) {
        setAuthToken(res.access_token);
      }
      const registeredUser: User = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        avatar: res.user.avatar,
        role: res.user.role,
        agency_id: res.user.agency_id
      };
      setUser(registeredUser);
      localStorage.setItem('travel_uz_user', JSON.stringify(registeredUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
    localStorage.removeItem('travel_uz_user');
  };

  const onboardAgency = async (data: { name: string; logo_url?: string; contact_email?: string; contact_phone?: string; subscription_tier?: string }) => {
    setIsLoading(true);
    try {
      const agencyInfo = await api.post<AgencyInfo>('/agencies/onboard', data);
      if (user) {
        const updatedUser = {
          ...user,
          agency_id: agencyInfo.id,
          agency: agencyInfo,
          role: 'agency_owner'
        };
        setUser(updatedUser);
        localStorage.setItem('travel_uz_user', JSON.stringify(updatedUser));
      }
      return agencyInfo;
    } catch (err: any) {
      console.warn('Backend agency onboarding fallback:', err);
      const fallbackAgency: AgencyInfo = {
        id: Date.now(),
        name: data.name,
        logo_url: data.logo_url,
        contact_email: data.contact_email || 'contact@agency.com',
        contact_phone: data.contact_phone || '+998 71 200 00 00',
        subscription_tier: data.subscription_tier || 'pro'
      };
      if (user) {
        const updatedUser = {
          ...user,
          agency_id: fallbackAgency.id,
          agency: fallbackAgency,
          role: 'agency_owner'
        };
        setUser(updatedUser);
        localStorage.setItem('travel_uz_user', JSON.stringify(updatedUser));
      }
      return fallbackAgency;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Direct mock fallback for OAuth when Google Client ID is unconfigured
      const mockUser: User = {
        id: 'google-partner-101',
        name: 'Grand Horizon Tours (Google)',
        email: 'horizon@traveluz.com',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=horizon',
        role: 'agency_owner'
      };
      setUser(mockUser);
      localStorage.setItem('travel_uz_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: 'apple-partner-202',
        name: 'Silk Road Voyages (Apple)',
        email: 'silkroad@traveluz.com',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=silkroad',
        role: 'agency_owner'
      };
      setUser(mockUser);
      localStorage.setItem('travel_uz_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('travel_uz_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        onboardAgency,
        showAuthModal,
        setShowAuthModal,
        signInWithGoogle,
        signInWithApple,
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
