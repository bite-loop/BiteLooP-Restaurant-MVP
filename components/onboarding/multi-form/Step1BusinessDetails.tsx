// components/onboarding/multi-form/Step1BusinessDetails.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { OnboardingFormData } from '@/types/restaurants';

interface Step1BusinessDetailsProps {
  data: Partial<OnboardingFormData>;
  onNext: (data: Partial<OnboardingFormData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function Step1BusinessDetails({ data, onNext, onBack, isLoading }: Step1BusinessDetailsProps) {
   const [formData, setFormData] = useState({
    legalName: data?.businessDetails?.legalName ?? '',
    businessNumber: data?.businessDetails?.businessNumber ?? '',
    hstNumber: data?.businessDetails?.hstNumber ?? '',
    businessPhone: data?.businessDetails?.businessPhone ?? '',
    website: data?.businessDetails?.website ?? '',
    yearEstablished: data?.businessDetails?.yearEstablished?.toString() ?? '',
    numberOfLocations: data?.businessDetails?.numberOfLocations?.toString() ?? '',
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onNext({
      businessDetails: {
        legalName: formData.legalName,
        businessNumber: formData.businessNumber,
        hstNumber: formData.hstNumber,
        businessPhone: formData.businessPhone,
        website: formData.website || undefined,
        yearEstablished: formData.yearEstablished
          ? Number(formData.yearEstablished)
          : undefined,
        numberOfLocations: formData.numberOfLocations
          ? Number(formData.numberOfLocations)
          : undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Legal Business Name *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.legalName}
            onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
            placeholder="e.g., Maple Spice Kitchen Inc."
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Ontario Business Number *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.businessNumber}
            onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
            placeholder="123456789"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">HST/GST Number *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.hstNumber}
            onChange={(e) => setFormData({ ...formData, hstNumber: e.target.value })}
            placeholder="123456789RT0001"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Business Phone *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="tel"
            value={formData.businessPhone}
            onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
            placeholder="+1 416-555-0123"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Website (Optional)</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://myrestaurant.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Year Established (Optional)</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="number"
            value={formData.yearEstablished}
            onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
            placeholder="2010"
            min="1900"
            max={new Date().getFullYear()}
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Number of Locations (Optional)</Label>
          <Input
            className="mt-2 h-14 text-lg"
            type="number"
            value={formData.numberOfLocations}
            onChange={(e) => setFormData({ ...formData, numberOfLocations: e.target.value })}
            placeholder="1"
            min="1"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
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