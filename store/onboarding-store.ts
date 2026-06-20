// lib/stores/onboardingStore.ts
import { create } from 'zustand';
import type { OnboardingFormData, MenuCategory } from '@/types/restaurants';

interface OnboardingStore {
  // State
  currentStep: number;
  formData: Partial<OnboardingFormData>;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  saveProgress: (restaurantId: string) => Promise<void>;
  loadProgress: (restaurantId: string) => Promise<void>;
  submitOnboarding: (restaurantId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  formData: {},
  isLoading: false,
  error: null,
  isSubmitting: false,
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, 6) 
  })),

  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) 
  })),

  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  saveProgress: async (restaurantId) => {
    set({ isLoading: true, error: null });
    try {
      const { formData, currentStep } = get();
      const response = await fetch('/api/onboarding/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          formData,
          currentStep,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadProgress: async (restaurantId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/onboarding/progress?restaurantId=${restaurantId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load progress');
      }

      const data = await response.json();
      set({
        formData: data.formData || {},
        currentStep: data.currentStep || 1,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  submitOnboarding: async (restaurantId) => {
    set({ isSubmitting: true, error: null });
    try {
      const { formData } = get();
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          formData,
          status: 'pending_approval',
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit onboarding');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  reset: () => set(initialState),
}));