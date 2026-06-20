// components/onboarding/multi-form/Step2BankDetails.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { OnboardingFormData } from '@/types/restaurants';

interface Step2BankDetailsProps {
  data: Partial<OnboardingFormData>;
  onNext: (data: Partial<OnboardingFormData>) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function Step2BankDetails({ data, onNext, onBack, isLoading }: Step2BankDetailsProps) {
  const [formData, setFormData] = useState({
    accountHolderName: data?.bankDetails?.accountHolderName || '',
    bankName: data?.bankDetails?.bankName || '',
    accountNumber: data?.bankDetails?.accountNumber || '',
    accountType: data?.bankDetails?.accountType || 'business',
    transitNumber: data?.bankDetails?.transitNumber || '',
    institutionNumber: data?.bankDetails?.institutionNumber || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      bankDetails: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Account Holder Name *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.accountHolderName}
            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
            placeholder="John Doe"
            required
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Bank Name *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            placeholder="RBC Royal Bank"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Transit Number *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.transitNumber}
            onChange={(e) => setFormData({ ...formData, transitNumber: e.target.value })}
            placeholder="12345"
            maxLength={5}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Institution Number *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.institutionNumber}
            onChange={(e) => setFormData({ ...formData, institutionNumber: e.target.value })}
            placeholder="003"
            maxLength={3}
            required
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-base font-semibold">Account Number *</Label>
          <Input
            className="mt-2 h-14 text-lg"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            placeholder="1234567"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Account Type *</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => setFormData({ ...formData, accountType: value as any })}
            disabled={isLoading}
          >
            <SelectTrigger className="mt-2 h-14 text-lg">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chequing" className="text-base">Chequing</SelectItem>
              <SelectItem value="savings" className="text-base">Savings</SelectItem>
              <SelectItem value="business" className="text-base">Business</SelectItem>
            </SelectContent>
          </Select>
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