import { auth, googleProvider } from "@/lib/firebase/config";
import { Restaurant } from "@/types/restaurants";
import { da } from "date-fns/locale";
import { signInWithPopup } from "firebase/auth";
import {create} from 'zustand'
interface AuthStore {
  user: Restaurant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
   hasFetched: boolean; 
  
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasFetched: false,

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
         } catch (error: any) {
            throw new Error(error.message || 'Google login failed')
         }
      },
       signOut: async () => {
         try {
           await fetch('/api/user/logout',{
             method: "POST",
             credentials: 'include'
           })
           await auth.signOut()
           set({user: null, isAuthenticated: false, isLoading: false})


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
      console.log("Fetched user data from API:", userData);
      
      // Ensure we're setting the user correctly
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false, 
        hasFetched: true 
      });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false, hasFetched: true });
    }
  } catch (error) {
    console.error('Fetch user error:', error);
    set({ user: null, isAuthenticated: false, isLoading: false, hasFetched: true });
  }
},
}))