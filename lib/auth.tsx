"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface User {
  id: number;
  nama_lengkap?: string;
  nama?: string;
  username: string;
  role: 'admin' | 'peserta';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPeserta: boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Check if we're in the browser (client-side)
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('session_token');
      const userData = localStorage.getItem('user_data');
      const userRole = localStorage.getItem('user_role');

      if (token && userData && userRole) {
        const parsedUser = JSON.parse(userData);
        setUser({ ...parsedUser, role: userRole as 'admin' | 'peserta' });
        
        // Set cookies for middleware
        document.cookie = `session_token=${token}; path=/; max-age=86400`; // 24 hours
        document.cookie = `user_role=${userRole}; path=/; max-age=86400`;
      } else {
        setUser(null);
        // Clear cookies
        document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, userData: User, role: string) => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Save to localStorage
    localStorage.setItem('session_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_role', role);
    
    // Set cookies for middleware
    document.cookie = `session_token=${token}; path=/; max-age=86400`;
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    
    // Update state
    setUser({ ...userData, role: role as 'admin' | 'peserta' });
    
    // Redirect to appropriate dashboard
    const redirectPath = role === 'admin' ? '/dashboard-admin' : '/dashboard-peserta';
    router.push(redirectPath);
  };

  const logout = () => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Clear localStorage
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    
    // Clear cookies
    document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Update state
    setUser(null);
    
    // Redirect to home
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPeserta: user?.role === 'peserta',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: ('admin' | 'peserta')[] = ['admin', 'peserta']
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
        } else if (!allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on role
          const redirectPath = user.role === 'admin' ? '/dashboard-admin' : '/dashboard-peserta';
          router.push(redirectPath);
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!user || !allowedRoles.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
}
