import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
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

  // Retrieve user session on mount and handle Google Sign-In redirect parsing
  useEffect(() => {
    const savedUser = localStorage.getItem('travel_uz_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('travel_uz_user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    // Google OAuth redirection parser
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      setIsLoading(true);
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((r) => {
            if (!r.ok) throw new Error('Failed to fetch userinfo');
            return r.json();
          })
          .then((googleUser) => {
            const mockUser: User = {
              id: googleUser.sub || Math.random().toString(36).substring(2, 11),
              name: googleUser.name || 'Google Traveler',
              email: googleUser.email || 'google.traveler@traveluz.com',
              avatar: googleUser.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=google`,
            };
            setUser(mockUser);
            localStorage.setItem('travel_uz_user', JSON.stringify(mockUser));
            // Redirect to dashboard target or home
            const redirectView = localStorage.getItem('auth_redirect_view') || 'home';
            localStorage.setItem('auth_redirect_view', redirectView);
            // Remove hash from URL
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          })
          .catch((err) => {
            console.error('Failed to authenticate with Google Access Token', err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, []);


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mock validation
    if (!email || !password) {
      setIsLoading(false);
      throw new Error('Please fill in all fields.');
    }

    // Return dummy user profile matching email
    const name = email.split('@')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Pick an avatar pattern
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      name: capitalizedName,
      email: email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    };

    setUser(mockUser);
    localStorage.setItem('travel_uz_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!name || !email || !password) {
      setIsLoading(false);
      throw new Error('Please fill in all fields.');
    }

    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    };

    setUser(mockUser);
    localStorage.setItem('travel_uz_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travel_uz_user');
  };

  const signInWithGoogle = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && clientId !== 'your_google_client_id') {
      const redirectUri = window.location.origin;
      const scope = 'email profile';
      const responseType = 'token';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
      window.location.href = authUrl;
      setIsLoading(true);
      await new Promise(() => {}); // Wait for redirect
    } else {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockUser: User = {
        id: 'google-' + Math.random().toString(36).substring(2, 11),
        name: 'Google Explorer',
        email: 'google.explorer@traveluz.com',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=google',
      };
      setUser(mockUser);
      localStorage.setItem('travel_uz_user', JSON.stringify(mockUser));
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser: User = {
      id: 'apple-' + Math.random().toString(36).substring(2, 11),
      name: 'Apple Voyager',
      email: 'apple.voyager@traveluz.com',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=apple',
    };
    setUser(mockUser);
    localStorage.setItem('travel_uz_user', JSON.stringify(mockUser));
    setIsLoading(false);
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
