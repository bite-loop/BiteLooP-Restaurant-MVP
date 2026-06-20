// components/onboarding/multi-form/Step5Review.tsx
'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Building2, CreditCard, Store, Utensils, FileText } from 'lucide-react';
import type { OnboardingFormData } from '@/types/restaurants';

interface Step5ReviewProps {
  data: Partial<OnboardingFormData>;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export default function Step5Review({ data, onSubmit, onBack, isLoading, isSubmitting }: Step5ReviewProps) {
  const [consent, setConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const canSubmit = consent && termsAccepted && !isSubmitting && !isLoading;

  const sections = [
    {
      icon: Building2,
      title: 'Business Details',
      items: [
        { label: 'Legal Name', value: data?.businessDetails?.legalName || 'Not set' },
        { label: 'Business Number', value: data?.businessDetails?.businessNumber || 'Not set' },
        { label: 'HST/GST', value: data?.businessDetails?.hstNumber || 'Not set' },
        { label: 'Phone', value: data?.businessDetails?.businessPhone || 'Not set' },
      ]
    },
    {
      icon: CreditCard,
      title: 'Bank Details',
      items: [
        { label: 'Account Holder', value: data?.bankDetails?.accountHolderName || 'Not set' },
        { label: 'Bank Name', value: data?.bankDetails?.bankName || 'Not set' },
        { label: 'Account Type', value: data?.bankDetails?.accountType || 'Not set' },
        { label: 'Transit Number', value: data?.bankDetails?.transitNumber || 'Not set' },
      ]
    },
    {
      icon: Store,
      title: 'Restaurant Profile',
      items: [
        { label: 'Restaurant Name', value: data?.restaurantProfile?.name || 'Not set' },
        { label: 'Address', value: data?.restaurantProfile?.address?.street || 'Not set' },
        { label: 'City', value: data?.restaurantProfile?.address?.city || 'Not set' },
        { label: 'Price Range', value: data?.restaurantProfile?.priceRange || 'Not set' },
      ]
    },
    {
      icon: Utensils,
      title: 'Menu',
      items: [
        { label: 'Categories', value: data?.menu?.categories?.length || 0 },
        { label: 'Total Items', value: data?.menu?.categories?.reduce((sum, cat) => sum + cat.items.length, 0) || 0 },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-primary" />
        <div>
          <h3 className="text-xl font-bold">Review Your Information</h3>
          <p className="text-muted-foreground">Please verify all details before submitting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, idx) => (
          <Card key={idx} className="border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">{section.title}</h4>
              </div>
              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="font-medium">Business Type:</span>
          <span className="text-muted-foreground">
            {data?.businessType === 'delivery_only' && 'Delivery Only'}
            {data?.businessType === 'dine_only' && 'Dine Only'}
            {data?.businessType === 'both' && 'Both'}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            disabled={isSubmitting || isLoading}
            className="mt-1"
          />
          <Label htmlFor="consent" className="text-base cursor-pointer leading-relaxed">
            I confirm that all information provided is accurate and complete to the best of my knowledge.
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            disabled={isSubmitting || isLoading}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-base cursor-pointer leading-relaxed">
            I agree to BiteLoop's Terms of Service, Privacy Policy, and Partner Agreement.
          </Label>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          size="lg" 
          className="h-14 px-8 text-lg gap-2"
          onClick={onBack} 
          disabled={isSubmitting || isLoading}
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!canSubmit}
          size="lg"
          className="h-14 px-10 text-lg gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              Submit for Review <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}