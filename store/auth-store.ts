// lib/stores/auth-store.ts
import { auth, googleProvider } from "@/lib/firebase/config";
import { Restaurant } from "@/types/restaurants";
import { signInWithPopup } from "firebase/auth";
import { create } from 'zustand'

interface AuthStore {
  user: Restaurant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboardingStatus: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
  hasFetched: boolean;
  checkOnboardingStatus: () => Promise<string | null>;
  redirectBasedOnStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasFetched: false,
  onboardingStatus: null,

  signUp: async (email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      set({ user: data.user, isAuthenticated: true, isLoading: false })

      // Check status after signup
      await get().checkOnboardingStatus();
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed')
    }
  },

  signIn: async (email, password) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      set({ user: data.user, isAuthenticated: true, isLoading: false })

      // Check status after signin
      await get().checkOnboardingStatus();
    } catch (error: any) {
      throw new Error(error.message || 'Sign in Failed')
    }
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      const res = await fetch('/api/auth/google', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include'
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      set({ user: data.user, isAuthenticated: true, isLoading: false })

      // Check status after Google signin
      await get().checkOnboardingStatus();
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed')
    }
  },

  signOut: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: "POST",
        credentials: 'include'
      })
      await auth.signOut()
      set({ user: null, isAuthenticated: false, isLoading: false, onboardingStatus: null, hasFetched: false })
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed')
    }
  },

  fetchUser: async () => {
    if (get().hasFetched) {
      set({ isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const userData = await res.json();
        console.log("Fetched user data:", userData);

        // Extract the actual user object from the nested structure if needed
        // The API might return { authenticated: true, user: {...} }
        let actualUser = userData;
        if (userData.authenticated && userData.user) {
          actualUser = userData.user;
        }

        // Ensure we have an id
        const userWithId = {
          ...actualUser,
          id: actualUser.id || actualUser.uid || null,
        };

        console.log("Processed user:", userWithId);

        set({
          user: userWithId,
          isAuthenticated: true,
          isLoading: false,
          hasFetched: true
        });

        // Check status after fetching user
        await get().checkOnboardingStatus();
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false, hasFetched: true });
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false, hasFetched: true });
    }
  },

  checkOnboardingStatus: async () => {
    console.log('🔍 checkOnboardingStatus called');
    
    // Get the current user
    const state = get();
    const user = state.user;
    
    console.log('Current user state:', user);
    
    // Try to get the user ID from various possible locations
    //@ts-ignore
    let userId = user?.id || user?.uid || null;
    
    // If user has a nested structure like { authenticated: true, user: {...} }
    if (user && typeof user === 'object' && 'user' in user && user.user) {
      const nestedUser = user.user as any;
      userId = nestedUser.id || nestedUser.uid || null;
    }
    
    console.log('Extracted userId:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found, setting onboardingStatus to null');
      set({ onboardingStatus: null });
      return null;
    }

    try {
      console.log(`📡 Fetching onboarding status for userId: ${userId}`);
      const response = await fetch(`/api/onboarding/status?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        console.log('✅ Onboarding status received:', data.onboardingStatus);
        set({ onboardingStatus: data.onboardingStatus });
        return data.onboardingStatus;
      }
      return null;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return null;
    }
  },

  redirectBasedOnStatus: async () => {
    const { user, onboardingStatus, isAuthenticated } = get();

    if (!isAuthenticated || !user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/partner-with-us/new';
      }
      return;
    }

    // Get fresh status if not available
    let status = onboardingStatus;
    if (!status) {
      status = await get().checkOnboardingStatus();
    }

    console.log('🔄 Redirect based on status:', status);

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;

      switch (status) {
        case 'approved':
          if (currentPath === '/partner-with-us/new/success' ||
            currentPath === '/partner-with-us/new/onboarding-form') {
            window.location.href = '/partner-with-us/new';
          }
          break;

        case 'pending_approval':
          if (currentPath !== '/partner-with-us/new/success' &&
            currentPath !== '/partner-with-us/new/onboarding-form') {
            window.location.href = `/partner-with-us/new/success?resId=${user.id}`;
          }
          break;

        case 'rejected':
          if (currentPath === '/partner-with-us/new/success') {
            window.location.href = '/partner-with-us/new/onboarding-form';
          }
          break;

        default:
          // pending or in_progress
          if (currentPath === '/partner-with-us/new/success') {
            window.location.href = '/partner-with-us/new/onboarding-form';
          }
          break;
      }
    }
  }
}));