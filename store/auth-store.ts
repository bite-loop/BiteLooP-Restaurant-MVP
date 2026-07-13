import { auth, googleProvider } from "@/lib/firebase/config";
import { Restaurant } from "@/types/restaurants";
import { da } from "date-fns/locale";
import { signInWithPopup } from "firebase/auth";
import {create} from 'zustand'

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
  redirectBasedOnStatus: () => Promise<void>; // Add this
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasFetched: false,
    onboardingStatus: null,
    
    signUp: async (email, password) => {
         try {
           const res = await fetch('/api/auth/signup',{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password}),
            credentials: 'include'
           })
           const data = await res.json()
           if(!res.ok) throw new Error(data.error)
            
           set({user: data.user, isAuthenticated: true, isLoading: false})
           
           // Check status after signup
           await get().checkOnboardingStatus();
         } catch (error:any) {
           throw new Error(error.message || 'Signup failed')
         }
    },
    
    signIn: async (email, password) => {
        try {
          const res = await fetch('/api/auth/signin',{
             method: "POST",
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({email, password}),
             credentials: 'include'
          })
          const data = await res.json()
          if(!res.ok) throw new Error(data.error)
          set({ user: data.user, isAuthenticated: true, isLoading: false})
          
          // Check status after signin
          await get().checkOnboardingStatus();
        } catch (error: any) {
          throw new Error(error.message || 'Sign in Failed')
        }
    },
    
    signInWithGoogle: async() => {
         try {
           const result = await signInWithPopup(auth, googleProvider)
           const idToken = await result.user.getIdToken()
            
           const res = await fetch('/api/auth/google', {
             method: "POST",
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({idToken}),
             credentials: 'include'
           })

           const data = await res.json()
           if (!res.ok) throw new Error(data.error)

           set({user: data.user, isAuthenticated: true, isLoading: false})
           
           // Check status after Google signin
           await get().checkOnboardingStatus();
         } catch (error: any) {
            throw new Error(error.message || 'Google login failed')
         }
    },
    
    signOut: async () => {
         try {
           await fetch('/api/auth/logout',{
             method: "POST",
             credentials: 'include'
           })
           await auth.signOut()
           set({user: null, isAuthenticated: false, isLoading: false, onboardingStatus: null})


         } catch (error:any) {
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
          
          const userWithId = {
            ...userData,
            id: userData.id || userData.uid || null,
          };
          
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
      const {user} = get()
      if (!user?.id) {
        set({ onboardingStatus: null });
        return null;
      }
      try {
        const response = await fetch(`/api/onboarding/status?userId=${user.id}`);
        const data = await response.json();
        
        if (response.ok) {
          set({ onboardingStatus: data.onboardingStatus });
          return data.onboardingStatus;
        }
        return null;
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        return null;
      }
    },

    // Add this new method
    redirectBasedOnStatus: async () => {
      const { user, onboardingStatus, isAuthenticated } = get();
      
      if (!isAuthenticated || !user) {
        // Redirect to login if not authenticated
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }

      // Get fresh status if not available
      let status = onboardingStatus;
      if (!status) {
        status = await get().checkOnboardingStatus();
      }

      // Redirect based on status
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        
        switch (status) {
          case 'approved':
            // Already approved - go to menu
            if (currentPath === '/partner-with-us/new/success' || 
                currentPath === '/partner-with-us/new/onboarding-form') {
              window.location.href = '/menu';
            }
            break;
            
          case 'pending_approval':
            // Waiting for approval - go to success page
            if (currentPath !== '/partner-with-us/new/success' && 
                currentPath !== '/partner-with-us/new/onboarding-form') {
              window.location.href = `/partner-with-us/new/success?resId=${user.id}`;
            }
            break;
            
          case 'rejected':
            // Rejected - allow re-submission
            if (currentPath === '/partner-with-us/new/success') {
              window.location.href = '/partner-with-us/new/onboarding-form';
            }
            break;
            
          default:
            // pending or in_progress - stay on onboarding
            if (currentPath === '/partner-with-us/new/success') {
              window.location.href = '/partner-with-us/new/onboarding-form';
            }
            break;
        }
      }
    }
})) 