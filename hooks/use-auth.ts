// hooks/useAuth.ts
import { useEffect } from 'react';
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
    signOut 
  } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

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