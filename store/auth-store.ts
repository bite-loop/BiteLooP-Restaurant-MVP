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
  _lastFetchAttempt: number;  
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasFetched: false,
  onboardingStatus: null,
  _lastFetchAttempt: 0,

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

      const userData = {
        ...data.user,
        id: data.user?.id || data.user?.uid || null,
      };

      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false,
        hasFetched: true 
      })

      await get().checkOnboardingStatus();
    } catch (error: any) {
      set({ isLoading: false });
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
      
      const userData = {
        ...data.user,
        id: data.user?.id || data.user?.uid || null,
      };

      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false,
        hasFetched: true 
      })

      await get().checkOnboardingStatus();
    } catch (error: any) {
      set({ isLoading: false });
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

      const userData = {
        ...data.user,
        id: data.user?.id || data.user?.uid || null,
      };

      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false,
        hasFetched: true 
      })

      await get().checkOnboardingStatus();
    } catch (error: any) {
      set({ isLoading: false });
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
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        onboardingStatus: null, 
        hasFetched: false // ✅ Reset this so we fetch again on next visit
      })
    } catch (error: any) {
      // Even if API fails, clear local state
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        onboardingStatus: null, 
        hasFetched: false 
      })
      throw new Error(error.message || 'Logout failed')
    }
  },

  fetchUser: async () => {
    const state = get();
    
    // ✅ If already fetched and we have a user, just return
    if (state.hasFetched && state.user) {
      console.log('✅ User already fetched, skipping');
      set({ isLoading: false });
      return;
    }

    // ✅ Prevent multiple simultaneous requests
    if (state.isLoading) {
      console.log('⏳ Already loading user, skipping');
      return;
    }

    // ✅ Prevent repeated calls within 5 seconds (cooldown)
    const now = Date.now();
    const timeSinceLastAttempt = now - state._lastFetchAttempt;
    if (timeSinceLastAttempt < 5000 && state.hasFetched) {
      console.log(`⏳ Skipping fetch, last attempt was ${timeSinceLastAttempt}ms ago`);
      return;
    }

    // Update last attempt time
    set({ _lastFetchAttempt: now });

    try {
      set({ isLoading: true });
      console.log('📡 Fetching user...');
      
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      console.log('📊 Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("📊 Fetched user data:", data);

        // ✅ Handle the response structure properly
        let actualUser = null;
        if (data.authenticated && data.user) {
          actualUser = data.user;
        } else if (data.user && !data.authenticated === false) {
          // If the API returns user directly
          actualUser = data.user;
        } else if (data.id || data.uid) {
          // If the API returns the user object directly
          actualUser = data;
        }

        if (actualUser) {
          const userWithId = {
            ...actualUser,
            id: actualUser.id || actualUser.uid || null,
          };

          console.log("✅ Processed user:", userWithId);

          set({
            user: userWithId,
            isAuthenticated: true,
            isLoading: false,
            hasFetched: true
          });

          const status = await get().checkOnboardingStatus();
          console.log('📊 Onboarding status after fetch:', status);
        } else {
          // No user found in response
          console.log('🔴 No user data in response');
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            hasFetched: true,
            onboardingStatus: null
          });
        }
      } else {
        // ✅ Handle non-200 responses (including 401 Unauthorized)
        console.log('🔴 API returned error status:', res.status);
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false, 
          hasFetched: true,
          onboardingStatus: null
        });
      }
    } catch (error) {
      console.error('❌ Fetch user error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        hasFetched: true,
        onboardingStatus: null
      });
    }
  },

  checkOnboardingStatus: async () => {
    console.log('🔍 checkOnboardingStatus called');
    
    const state = get();
    const user = state.user;
    
    console.log('Current user state:', user);
    //@ts-ignore
    let userId = user?.id || user?.uid || null;
    
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
    const { user, onboardingStatus, isAuthenticated, checkOnboardingStatus } = get();

    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    
    console.log('🔍 === redirectBasedOnStatus called ===');
    console.log('📍 Current path:', currentPath);
    console.log('👤 Is authenticated:', isAuthenticated);
    console.log('📊 Current onboardingStatus:', onboardingStatus);
    console.log('👤 User ID:', user?.id);

    // ✅ Check if user is actually authenticated
    if (!isAuthenticated || !user) {
      console.log('🔴 Not authenticated, redirecting to landing...');
      if (currentPath !== '/partner-with-us/new') {
        window.location.href = '/partner-with-us/new';
      }
      return;
    }

    // ✅ Handle /partner-menu route
    if (currentPath === '/partner-menu') {
      console.log('📍 On partner-menu - special handling');
      
      let status = onboardingStatus;
      if (!status) {
        console.log('📊 Fetching fresh status for partner-menu...');
        try {
          status = await checkOnboardingStatus();
          console.log('📊 Fresh status fetched:', status);
        } catch (error) {
          console.error('❌ Error fetching status:', error);
          return;
        }
      }
      
      if (status === 'rejected') {
        console.log('❌ Rejected user on partner-menu, redirecting to form');
        window.location.href = '/partner-with-us/new/onboarding-form';
      }
      // ✅ Stay on partner-menu for all other statuses
      return;
    }

    // ✅ Get fresh status for other routes
    let status = onboardingStatus;
    if (!status) {
      console.log('📊 Fetching fresh status for other routes...');
      try {
        status = await checkOnboardingStatus();
        console.log('📊 Fresh status fetched:', status);
      } catch (error) {
        console.error('❌ Error fetching status:', error);
        return;
      }
    }

    console.log('🔄 Final status for routing:', status);

    // ✅ Handle approved users
    if (status === 'approved') {
      console.log('✅ User is approved');
      
      const blockedRoutes = [
        '/partner-with-us/new/onboarding-form',
        '/partner-with-us/new/success'
      ];
      
      const isBlockedRoute = blockedRoutes.some(route => 
        currentPath === route || currentPath.startsWith(route)
      );
      
      if (isBlockedRoute) {
        console.log('🚫 Approved user blocked from onboarding route, redirecting to partner-menu');
        window.location.href = '/partner-menu';
      }
      return;
    }

    // ✅ Handle non-approved users
    const isOnboardingRoute = currentPath.includes('/partner-with-us/new');
    
    if (isOnboardingRoute) {
      console.log('📍 On onboarding route, applying status logic');
      
      switch (status) {
        case 'pending_approval':
          if (currentPath !== '/partner-with-us/new/success') {
            console.log('Redirecting to success page');
            window.location.href = `/partner-with-us/new/success?resId=${user.id}`;
          }
          break;

        case 'rejected':
          if (currentPath === '/partner-with-us/new/success') {
            console.log('Redirecting to onboarding form');
            window.location.href = '/partner-with-us/new/onboarding-form';
          }
          break;

        default:
          if (currentPath === '/partner-with-us/new/success') {
            console.log('Redirecting to onboarding form');
            window.location.href = '/partner-with-us/new/onboarding-form';
          }
          break;
      }
    } else {
      console.log('📍 Non-approved user on non-onboarding route, redirecting');
      
      switch (status) {
        case 'pending_approval':
          window.location.href = `/partner-with-us/new/success?resId=${user.id}`;
          break;
        case 'rejected':
          window.location.href = '/partner-with-us/new/onboarding-form';
          break;
        default:
          window.location.href = '/partner-with-us/new/onboarding-form';
          break;
      }
    }
  }
}));