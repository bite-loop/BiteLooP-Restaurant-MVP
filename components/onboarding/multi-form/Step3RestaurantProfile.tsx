// components/onboarding/multi-form/Step3RestaurantProfile.tsx
'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import type { OnboardingFormData } from '@/types/restaurants';

interface Step3RestaurantProfileProps {
  data: Partial<OnboardingFormData>;
  onNext: (data: Partial<OnboardingFormData>) => void;
  onBack: () => void;
  serviceType: string;
  isLoading?: boolean;
}

export default function Step3RestaurantProfile({ data, onNext, onBack, serviceType, isLoading }: Step3RestaurantProfileProps) {
  const [formData, setFormData] = useState({
    name: data?.restaurantProfile?.name || '',
    description: data?.restaurantProfile?.description || '',
    cuisine: data?.restaurantProfile?.cuisine?.join(', ') || '',
    street: data?.restaurantProfile?.address?.street || '',
    city: data?.restaurantProfile?.address?.city || '',
    state: data?.restaurantProfile?.address?.state || 'Ontario',
    zipCode: data?.restaurantProfile?.address?.zipCode || '',
    latitude: data?.restaurantProfile?.address?.latitude?.toString() ?? '',
    longitude: data?.restaurantProfile?.address?.longitude?.toString() ?? '',
    priceRange: data?.restaurantProfile?.priceRange || '$$',
    deliveryTime: data?.restaurantProfile?.deliveryTime || '',
    estimatedDeliveryTime: data?.restaurantProfile?.estimatedDeliveryTime || 30,
    minOrder: data?.restaurantProfile?.minOrder || 0,
    deliveryFee: data?.restaurantProfile?.deliveryFee || 0,
    serviceFee: data?.restaurantProfile?.serviceFee || 0,
    logo: data?.restaurantProfile?.images?.logo || '',
    logoFile: data?.restaurantProfile?.images?.logoFile || null,
    banner: data?.restaurantProfile?.images?.banner || '',
    bannerFile: data?.restaurantProfile?.images?.bannerFile || null,
    gallery: data?.restaurantProfile?.images?.gallery || [],
    galleryFiles: data?.restaurantProfile?.images?.galleryFiles || [],
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner' | 'gallery'
  ) => {
    const files = event.target.files;
    if (!files) return;

    if (type === 'logo' || type === 'banner') {
      const file = files[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setFormData({
          ...formData,
          [`${type}File`]: file,
          [`${type}`]: preview,
        });
      }
    } else if (type === 'gallery') {
      const newFiles = Array.from(files);
      const previews = newFiles.map((file) => URL.createObjectURL(file));
      setFormData({
        ...formData,
        galleryFiles: [...formData.galleryFiles, ...newFiles],
        gallery: [...formData.gallery, ...previews],
      });
    }
  };

  const removeImage = (type: 'logo' | 'banner' | 'gallery', index?: number) => {
    if (type === 'logo') {
      setFormData({ ...formData, logo: '', logoFile: null });
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else if (type === 'banner') {
      setFormData({ ...formData, banner: '', bannerFile: null });
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    } else if (type === 'gallery' && index !== undefined) {
      const newGallery = [...formData.gallery];
      const newGalleryFiles = [...formData.galleryFiles];
      newGallery.splice(index, 1);
      newGalleryFiles.splice(index, 1);
      setFormData({ ...formData, gallery: newGallery, galleryFiles: newGalleryFiles });
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      restaurantProfile: {
        name: formData.name,
        description: formData.description,
        cuisine: formData.cuisine.split(',').map(c => c.trim()),
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
        },
        priceRange: formData.priceRange as any,
        deliveryTime: formData.deliveryTime,
        estimatedDeliveryTime: formData.estimatedDeliveryTime,
        minOrder: formData.minOrder,
        deliveryFee: formData.deliveryFee,
        serviceFee: formData.serviceFee,
        operatingHours: data?.restaurantProfile?.operatingHours || {
          monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
          tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
          wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
          thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
          friday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
          sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' },
        },
        images: {
          logo: formData.logo,
          logoFile: formData.logoFile,
          banner: formData.banner,
          bannerFile: formData.bannerFile,
          gallery: formData.gallery,
          galleryFiles: formData.galleryFiles,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Name */}
        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Restaurant Name *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Maple Spice Kitchen"
            required
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Description *</Label>
          <Textarea
            className="mt-2 text-lg min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your restaurant..."
            required
            disabled={isLoading}
          />
        </div>

        {/* Cuisine */}
        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Cuisine Types</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.cuisine}
            onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            placeholder="Indian, Chinese, Italian (comma separated)"
            disabled={isLoading}
          />
        </div>

        {/* Images Section */}
        <div className="md:col-span-2">
          <Label className="text-base font-semibold mb-4 block">Restaurant Images</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium">Logo *</Label>
              <div className="mt-2">
                {formData.logo ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.logo}
                      alt="Logo preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('logo')}
                      className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload logo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (max 2MB)</p>
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <Label className="text-sm font-medium">Banner Image *</Label>
              <div className="mt-2">
                {formData.banner ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.banner}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('banner')}
                      className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => bannerInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload banner</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (max 5MB)</p>
                  </div>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Gallery Upload */}
          <div className="mt-4">
            <Label className="text-sm font-medium">Gallery Images (Optional)</Label>
            <div className="mt-2">
              <div className="grid grid-cols-3 gap-2">
                {formData.gallery.map((img, index) => (
                  <div key={index} className="relative h-24 rounded-lg overflow-hidden border">
                    <Image
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('gallery', index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {formData.gallery.length < 6 && (
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Add photo</p>
                  </div>
                )}
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'gallery')}
                className="hidden"
                disabled={isLoading || formData.gallery.length >= 6}
              />
              <p className="text-xs text-muted-foreground mt-2">Max 6 images</p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Street Address *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            placeholder="123 King Street West"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">City *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Toronto"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Postal Code *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            placeholder="M5H 1J9"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Province *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Ontario"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Price Range *</Label>
          <Select
            value={formData.priceRange}
            onValueChange={(value) => setFormData({ ...formData, priceRange: value as any })}
            disabled={isLoading}
          >
            <SelectTrigger className="mt-2 h-14 text-lg">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="$">$</SelectItem>
              <SelectItem value="$$">$$</SelectItem>
              <SelectItem value="$$$">$$$</SelectItem>
              <SelectItem value="$$$$">$$$$</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Operational Details */}
        <div>
          <Label className="text-base font-semibold">Delivery Time</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.deliveryTime}
            onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
            placeholder="25-35 min"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Min Order ($)</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="number"
            value={formData.minOrder}
            onChange={(e) => setFormData({ ...formData, minOrder: parseFloat(e.target.value) || 0 })}
            placeholder="15"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Delivery Fee ($)</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="number"
            step="0.01"
            value={formData.deliveryFee}
            onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
            placeholder="2.99"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Service Fee ($)</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="number"
            step="0.01"
            value={formData.serviceFee}
            onChange={(e) => setFormData({ ...formData, serviceFee: parseFloat(e.target.value) || 0 })}
            placeholder="1.99"
            disabled={isLoading}
          />
        </div>

        {/* Coordinates */}
        <div>
          <Label className="text-base font-semibold">Latitude</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="43.6532"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Longitude</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="-79.3832"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          size="lg" 
          className="h-14 px-8 text-lg gap-2"
          onClick={onBack} 
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          className="h-14 px-8 text-lg gap-2"
          disabled={isLoading}
        >
          Continue <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}