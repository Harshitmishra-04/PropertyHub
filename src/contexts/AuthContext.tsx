import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscribeLocalDb } from '@/lib/localDb';
import { apiGet, apiPost } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'seller';
  provider?: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const token = localStorage.getItem("ph:token");
        if (token) {
          const me = await apiGet<User>("/auth/me");
          setUser(me);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
    const unsub = subscribeLocalDb(() => {});
    return unsub;
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Input validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const result = await apiPost<{ token: string; user: User }>("/auth/login", { email, password });
      localStorage.setItem("ph:token", result.token);
      setUser(result.user);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Input validation
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' };
      }

      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      if (name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' };
      }

      const result = await apiPost<{ token: string; user: User }>("/auth/signup", { email, password, name });
      localStorage.setItem("ph:token", result.token);
      setUser(result.user);
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred. Please try again.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: "Google login is not available in local-only mode." };
  };

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem("ph:token");
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
