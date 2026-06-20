// app/partner-with-us/new/onboarding-form/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Check, ChevronRight, Building2, CreditCard, Store, Utensils, FileText, Sparkles } from 'lucide-react';

import Step1BusinessDetails from '@/components/onboarding/multi-form/Step1BusinessDetails';
import Step2BankDetails from '@/components/onboarding/multi-form/Step2BankDetails';
import Step3RestaurantProfile from '@/components/onboarding/multi-form/Step3RestaurantProfile';
import Step4Menu from '@/components/onboarding/multi-form/Step4Menu';
import Step5Review from '@/components/onboarding/multi-form/Step5Review';

const STEPS = [
  { 
    id: 1, 
    title: 'Restaurant Information', 
    subtitle: 'Name, location & contact details',
    icon: Building2,
    component: Step1BusinessDetails 
  },
  { 
    id: 2, 
    title: 'Bank Details', 
    subtitle: 'Payment & payout information',
    icon: CreditCard,
    component: Step2BankDetails 
  },
  { 
    id: 3, 
    title: 'Restaurant Profile', 
    subtitle: 'Branding & operational details',
    icon: Store,
    component: Step3RestaurantProfile 
  },
  { 
    id: 4, 
    title: 'Menu & Operational', 
    subtitle: 'Your offerings & availability',
    icon: Utensils,
    component: Step4Menu 
  },
  { 
    id: 5, 
    title: 'Review & Submit', 
    subtitle: 'Final confirmation',
    icon: FileText,
    component: Step5Review 
  },
];

export default function OnboardingFormPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const serviceType = searchParams.get('serviceType') || 'both';
  const resId = searchParams.get('resId');

  const {
    currentStep,
    formData,
    isLoading,
    isSubmitting,
    error,
    nextStep,
    prevStep,
    updateFormData,
    saveProgress,
    submitOnboarding,
  } = useOnboarding(resId || undefined);

  useEffect(() => {
    if (!resId) {
      toast.error('Restaurant ID is required');
      router.push('/partner-with-us');
    }
  }, [resId, router]);

  useEffect(() => {
    if (resId && currentStep > 1) {
      saveProgress(resId);
    }
  }, [currentStep, resId]);

  const handleNext = (stepData: any) => {
    updateFormData(stepData);
    nextStep();
  };

  const handleSubmit = async () => {
    if (!resId) return;
    try {
      await submitOnboarding(resId);
      toast.success('Onboarding submitted successfully!');
      router.push('/partner-with-us/new/success');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit');
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1]?.component;
  const currentStepData = STEPS[currentStep - 1];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
          <p className="text-lg font-medium text-muted-foreground">Loading your onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Side - Steps */}
          <div className="lg:w-1/3">
            <div className="sticky top-12">
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Complete your registration
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  {currentStepData?.subtitle || 'Tell us about your restaurant'}
                </p>
              </div>

              <div className="space-y-2">
                {STEPS.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/10' 
                          : isCompleted 
                            ? 'bg-primary/5 border border-primary/20' 
                            : 'border border-transparent hover:border-border/50'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                        ${isActive 
                          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                          : isCompleted 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`
                          font-semibold transition-colors
                          ${isActive ? 'text-foreground' : isCompleted ? 'text-foreground/70' : 'text-muted-foreground'}
                        `}>
                          {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {step.subtitle}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-5 h-5 text-primary animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Step <span className="font-semibold text-foreground">{currentStep}</span> of{' '}
                    <span className="font-semibold text-foreground">{STEPS.length}</span>
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden ml-2">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Content */}
          <div className="lg:w-2/3">
            <div className="bg-card rounded-2xl border shadow-xl p-8 lg:p-10">
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold">{currentStepData?.title}</h2>
                <p className="text-muted-foreground">{currentStepData?.subtitle}</p>
              </div>

              <CurrentStepComponent
                data={formData}
                serviceType={serviceType}
                onNext={handleNext}
                onBack={prevStep}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}