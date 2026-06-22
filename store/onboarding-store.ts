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
  isUploading: boolean;
  uploadProgress: number;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  saveProgress: (restaurantId: string) => Promise<void>;
  loadProgress: (restaurantId: string) => Promise<void>;
  submitOnboarding: (restaurantId: string) => Promise<void>;
  uploadImages: (restaurantId: string, files: { logo?: File | null; banner?: File | null; gallery?: File[] }) => Promise<{
    logo?: string;
    banner?: string;
    gallery?: string[];
  }>;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  formData: {
    restaurantProfile: {
      name: '',
      description: '',
      cuisine: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        latitude: 0,
        longitude: 0,
      },
      priceRange: '$$' as const,
      deliveryTime: '',
      estimatedDeliveryTime: 30,
      minOrder: 0,
      deliveryFee: 0,
      serviceFee: 0,
      operatingHours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' },
      },
      images: {
        logo: '',
        logoFile: null as File | null,  // Add this
        banner: '',
        bannerFile: null as File | null, // Add this
        gallery: [],
        galleryFiles: [] as File[],      // Add this
      },
    },
  },
  isLoading: false,
  error: null,
  isSubmitting: false,
  isUploading: false,
  uploadProgress: 0,
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

uploadImages: async (restaurantId, files) => {
  console.log('📸 uploadImages called:', { restaurantId, files });
  
  set({ isUploading: true, error: null, uploadProgress: 0 });
  
  const results: { logo?: string; banner?: string; gallery?: string[] } = {};
  
  // Count total files to upload
  const fileCount = Object.values(files).filter(Boolean).length;
  let uploaded = 0;

  try {
    const updateProgress = () => {
      uploaded++;
      set({ uploadProgress: (uploaded / fileCount) * 100 });
    };

    // Upload logo
    if (files.logo) {
      console.log('📤 Uploading logo...');
      const logoFormData = new FormData();
      logoFormData.append('image', files.logo);
      logoFormData.append('restaurantId', restaurantId);
      logoFormData.append('type', 'logo');
      
      const logoRes = await fetch('/api/onboarding/upload', {
        method: 'POST',
        body: logoFormData,
      });
      
      console.log('Logo response status:', logoRes.status);
      
      if (!logoRes.ok) {
        const errorText = await logoRes.text();
        console.error('Logo upload failed:', errorText);
        throw new Error(`Logo upload failed: ${logoRes.status}`);
      }
      
      const logoData = await logoRes.json();
      console.log('Logo upload success:', logoData);
      results.logo = logoData.imageUrl;
      updateProgress();
    }

    // Upload banner
    if (files.banner) {
      console.log('📤 Uploading banner...');
      const bannerFormData = new FormData();
      bannerFormData.append('image', files.banner);
      bannerFormData.append('restaurantId', restaurantId);
      bannerFormData.append('type', 'banner');
      
      const bannerRes = await fetch('/api/onboarding/upload', {
        method: 'POST',
        body: bannerFormData,
      });
      
      console.log('Banner response status:', bannerRes.status);
      
      if (!bannerRes.ok) {
        const errorText = await bannerRes.text();
        console.error('Banner upload failed:', errorText);
        throw new Error(`Banner upload failed: ${bannerRes.status}`);
      }
      
      const bannerData = await bannerRes.json();
      console.log('Banner upload success:', bannerData);
      results.banner = bannerData.imageUrl;
      updateProgress();
    }

    // Upload gallery
    if (files.gallery && files.gallery.length > 0) {
      console.log('📤 Uploading gallery images...');
      const galleryUrls: string[] = [];
      for (let i = 0; i < files.gallery.length; i++) {
        const file = files.gallery[i];
        const galleryFormData = new FormData();
        galleryFormData.append('image', file);
        galleryFormData.append('restaurantId', restaurantId);
        galleryFormData.append('type', 'gallery');
        
        const galleryRes = await fetch('/api/onboarding/upload', {
          method: 'POST',
          body: galleryFormData,
        });
        
        console.log(`Gallery ${i+1} response status:`, galleryRes.status);
        
        if (!galleryRes.ok) {
          const errorText = await galleryRes.text();
          console.error(`Gallery ${i+1} upload failed:`, errorText);
          throw new Error(`Gallery upload failed: ${galleryRes.status}`);
        }
        
        const galleryData = await galleryRes.json();
        console.log(`Gallery ${i+1} upload success:`, galleryData);
        galleryUrls.push(galleryData.imageUrl);
        updateProgress();
      }
      results.gallery = galleryUrls;
    }

    // Update formData with uploaded image URLs
    const currentFormData = get().formData;
    
    // Get existing images or create default
    const existingImages = currentFormData?.restaurantProfile?.images || {
      logo: '',
      logoFile: null,
      banner: '',
      bannerFile: null,
      gallery: [],
      galleryFiles: [],
    };

    // Build updated images with proper required fields
    const updatedImages = {
      logo: results.logo || existingImages.logo || '',
      logoFile: null,
      banner: results.banner || existingImages.banner || '',
      bannerFile: null,
      gallery: results.gallery || existingImages.gallery || [],
      galleryFiles: [],
    };

    // Update formData
    set({
      formData: {
        ...currentFormData,
        restaurantProfile: {
          name: currentFormData?.restaurantProfile?.name || '',
          description: currentFormData?.restaurantProfile?.description || '',
          cuisine: currentFormData?.restaurantProfile?.cuisine || [],
          address: currentFormData?.restaurantProfile?.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            latitude: 0,
            longitude: 0,
          },
          priceRange: currentFormData?.restaurantProfile?.priceRange || '$$',
          deliveryTime: currentFormData?.restaurantProfile?.deliveryTime || '',
          estimatedDeliveryTime: currentFormData?.restaurantProfile?.estimatedDeliveryTime || 30,
          minOrder: currentFormData?.restaurantProfile?.minOrder || 0,
          deliveryFee: currentFormData?.restaurantProfile?.deliveryFee || 0,
          serviceFee: currentFormData?.restaurantProfile?.serviceFee || 0,
          operatingHours: currentFormData?.restaurantProfile?.operatingHours || {
            monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
            tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
            wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
            thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
            friday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
            saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
            sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' },
          },
          images: updatedImages,
        },
      },
      uploadProgress: 100,
    });

    console.log('✅ All images uploaded successfully:', results);
    return results;
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    set({ error: error.message });
    throw error;
  } finally {
    set({ isUploading: false });
  }
},
  saveProgress: async (restaurantId) => {
    set({ isLoading: true, error: null });
    try {
      const { formData, currentStep } = get();
      
      // Create a clean copy without File objects for saving
      const cleanFormData = {
        ...formData,
        restaurantProfile: formData?.restaurantProfile ? {
          ...formData.restaurantProfile,
          images: {
            logo: formData.restaurantProfile.images?.logo || '',
            logoFile: null,
            banner: formData.restaurantProfile.images?.banner || '',
            bannerFile: null,
            gallery: formData.restaurantProfile.images?.gallery || [],
            galleryFiles: [],
          },
        } : undefined,
      };

      const response = await fetch('/api/onboarding/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          formData: cleanFormData,
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
      
      // Clean formData before submitting (remove temporary files)
      const cleanFormData = {
        ...formData,
        restaurantProfile: formData?.restaurantProfile ? {
          ...formData.restaurantProfile,
          images: {
            logo: formData.restaurantProfile.images?.logo || '',
            banner: formData.restaurantProfile.images?.banner || '',
            gallery: formData.restaurantProfile.images?.gallery || [],
          },
        } : undefined,
      };
      
      // Remove File objects from cleanData using delete (they exist but we want to remove them)
      if (cleanFormData?.restaurantProfile?.images) {
        delete (cleanFormData.restaurantProfile.images as any).logoFile;
        delete (cleanFormData.restaurantProfile.images as any).bannerFile;
        delete (cleanFormData.restaurantProfile.images as any).galleryFiles;
      }

      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          formData: cleanFormData,
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