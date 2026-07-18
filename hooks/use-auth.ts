// hooks/useAuth.ts
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import type { Restaurant } from '@/types/restaurants';

interface UseAuthReturn {
  user: Restaurant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    fetchUser, 
    signUp, 
    signIn, 
    signInWithGoogle, 
    signOut,
    hasFetched
  } = useAuthStore();

  const fetchAttempted = useRef(false);

  useEffect(() => {
    // ✅ Only fetch if not already fetched and not currently loading
    // and we haven't attempted to fetch yet
    if (!hasFetched && !isLoading && !fetchAttempted.current) {
      fetchAttempted.current = true;
      console.log('📡 useAuth: Fetching user on mount');
      fetchUser();
    } else {
      console.log('📡 useAuth: Skipping fetch, hasFetched:', hasFetched, 'isLoading:', isLoading);
    }
  }, []); // ✅ Empty dependency array - only run once on mount

  return {
    user,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    fetchUser,
  };
};