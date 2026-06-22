// hooks/use-onboarding.ts
import { useEffect } from 'react';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { OnboardingFormData } from '@/types/restaurants';

interface UseOnboardingReturn {
  currentStep: number;
  formData: Partial<OnboardingFormData>;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isUploading: boolean;
  uploadProgress: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  saveProgress: (restaurantId: string) => Promise<void>;
  loadProgress: (restaurantId: string) => Promise<void>;
  submitOnboarding: (restaurantId: string) => Promise<void>;
  uploadImages: (restaurantId: string, files: { logo?: File; banner?: File; gallery?: File[] }) => Promise<{
    logo?: string;
    banner?: string;
    gallery?: string[];
  }>;
  reset: () => void;
}

export const useOnboarding = (restaurantId?: string): UseOnboardingReturn => {
  const {
    currentStep,
    formData,
    isLoading,
    error,
    isSubmitting,
    isUploading,
    uploadProgress,
    setStep,
    nextStep,
    prevStep,
    updateFormData,
    saveProgress,
    loadProgress,
    submitOnboarding,
    uploadImages,
    reset,
  } = useOnboardingStore();

  // Load progress when restaurantId changes
  useEffect(() => {
    if (restaurantId) {
      loadProgress(restaurantId);
    }
  }, [restaurantId]);

  return {
    currentStep,
    formData,
    isLoading,
    error,
    isSubmitting,
    isUploading,
    uploadProgress,
    setStep,
    nextStep,
    prevStep,
    updateFormData,
    saveProgress,
    loadProgress,
    submitOnboarding,
    uploadImages,
    reset,
  };
};