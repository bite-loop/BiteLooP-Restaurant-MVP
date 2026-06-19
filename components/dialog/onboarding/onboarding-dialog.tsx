// components/dialog/onboarding/onboarding-dialog.tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Store, UtensilsCrossed, StoreIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const [businessType, setBusinessType] = useState<'delivery_only' | 'dine_only' | 'both'>('both');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  //@ts-ignore
  const userData = user?.user || user
  const handleContinue = async () => {
    if (!userData?.id) {
      toast.error('Please login first');
      return;
    }

    setIsLoading(true);
    try {
      // The user ID IS the restaurant ID
      const restaurantId = userData.id;

      console.log('Sending request with:', { restaurantId, businessType }); // Debug log

      // Update Firestore with the selected business type
      const response = await fetch('/api/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurantId,
          businessType: businessType,
          onboardingStep: 1,
        }),
      });

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update business type');
      }

      toast.success('Business type saved!');
      onOpenChange(false);
      
      // Redirect to onboarding form page with parameters
      const serviceType = businessType === 'delivery_only' ? 'delivery' : 
                         businessType === 'dine_only' ? 'dine' : 'both';
      
      router.push(`/partner-with-us/new/onboarding-form/?serviceType=${serviceType}&resId=${restaurantId}`);
    } catch (error: any) {
      console.error('Error updating business type:', error);
      toast.error(error.message || 'Failed to save business type. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    router.push('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-2xl font-bold">
            Choose Your Business Type
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select how you want to operate your restaurant on BiteLoop
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup 
            value={businessType} 
            onValueChange={(value) => setBusinessType(value as 'delivery_only' | 'dine_only' | 'both')}
            className="space-y-3"
          >
            {/* Delivery Only */}
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
              <RadioGroupItem value="delivery_only" id="delivery_only" />
              <Label htmlFor="delivery_only" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Delivery Only</p>
                    <p className="text-sm text-muted-foreground">Accept orders for delivery only</p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Dine Only */}
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
              <RadioGroupItem value="dine_only" id="dine_only" />
              <Label htmlFor="dine_only" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Dine Only</p>
                    <p className="text-sm text-muted-foreground">Accept in-restaurant dining only</p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Both */}
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <StoreIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Both</p>
                    <p className="text-sm text-muted-foreground">Offer both delivery and dine-in</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleContinue} 
            disabled={isLoading}
            className="w-full h-11"
          >
            {isLoading ? 'Saving...' : 'Continue to Onboarding'}
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="w-full h-11"
          >
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;