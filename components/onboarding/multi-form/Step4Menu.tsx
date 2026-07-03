// components/onboarding/multi-form/Step4Menu.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import type { OnboardingFormData } from '@/types/restaurants';
import { useOnboarding } from '@/hooks/use-onboarding';

interface Step4MenuProps {
  data: Partial<OnboardingFormData>;
  onNext: (data: Partial<OnboardingFormData>) => void;
  onBack: () => void;
  isLoading?: boolean;
  restaurantId?: string;
}

export default function Step4Menu({ 
  data, 
  onNext, 
  onBack, 
  isLoading,
  restaurantId 
}: Step4MenuProps) {
  const { uploadImages, isUploading, uploadProgress } = useOnboarding(restaurantId);
  
  const [menuImages, setMenuImages] = useState<{
    menuCard: string;
    menuCardFile: File | null;
  }>({
    menuCard: data?.restaurantProfile?.images?.menuCard || '',
    menuCardFile: data?.restaurantProfile?.images?.menuCardFile || null,
  });

  const menuCardInputRef = useRef<HTMLInputElement>(null);

  const handleMenuCardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setMenuImages({
        menuCard: preview,
        menuCardFile: file,
      });
    }
    event.target.value = '';
  };

  const removeMenuCard = () => {
    setMenuImages({ menuCard: '', menuCardFile: null });
    if (menuCardInputRef.current) menuCardInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData: Partial<OnboardingFormData> = {
      restaurantProfile: {
        ...data?.restaurantProfile,
        //@ts-ignore
        images: {
          ...data?.restaurantProfile?.images,
          menuCard: menuImages.menuCard || '',
          menuCardFile: menuImages.menuCardFile || undefined,
        },
      },
    };

    // Upload menu card image if there's a file
    if (restaurantId && menuImages.menuCardFile) {
      try {
        const uploadedUrls = await uploadImages(restaurantId, {
          banner: menuImages.menuCardFile, // Upload as banner type
        });

        if (uploadedUrls.banner) {
          submitData.restaurantProfile!.images!.menuCard = uploadedUrls.banner;
          // Remove the file from the data
          delete submitData.restaurantProfile!.images!.menuCardFile;
        }
      } catch (error) {
        console.error('Menu card upload failed:', error);
        // Continue with submission even if upload fails
      }
    }

    onNext(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Menu Card</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload an image of your restaurant menu card
          </p>

          {/* Upload Progress Indicator */}
          {isUploading && (
            <div className="mb-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                <span className="text-sm font-medium">Uploading menu card... {Math.round(uploadProgress)}%</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Menu Card Upload */}
          <div>
            <Label className="text-sm font-medium">Menu Card Image *</Label>
            <div className="mt-2">
              {menuImages.menuCard ? (
                <div className="relative w-full max-w-md rounded-lg overflow-hidden border">
                  <Image
                    src={menuImages.menuCard}
                    alt="Menu card preview"
                    width={400}
                    height={300}
                    className="object-contain max-h-80 w-full"
                  />
                  <button
                    type="button"
                    onClick={removeMenuCard}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => !isUploading && menuCardInputRef.current?.click()}
                  className="w-full max-w-md h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Click to upload menu card</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG (max 5MB)</p>
                </div>
              )}
              <input
                ref={menuCardInputRef}
                type="file"
                accept="image/*"
                onChange={handleMenuCardUpload}
                className="hidden"
                disabled={isLoading || isUploading}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Upload a clear image of your restaurant menu. You can add individual menu items later.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-lg">ℹ️</div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Menu Management</p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                After your restaurant is approved, you'll be able to add individual menu items with 
                prices, descriptions, and dietary information from your restaurant dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          size="lg" 
          className="h-14 px-8 text-lg gap-2"
          onClick={onBack} 
          disabled={isLoading || isUploading}
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          className="h-14 px-8 text-lg gap-2"
          disabled={isLoading || isUploading || !menuImages.menuCard}
        >
          {isUploading ? 'Uploading...' : 'Review & Submit'} <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}