// app/partner-with-us/new/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar/navbar';
import { RestaurantStatusChecker } from '@/components/sidebar/success-page/status-checker';
import { StatusSidebarTrigger } from '@/components/sidebar/success-page/sidebar-trigger';
import { useAuth } from '@/hooks/use-auth';

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('pending_approval');

  useEffect(() => {
    const resId = searchParams.get('resId') || user?.id;
    if (resId) {
      setRestaurantId(resId);
    }
  }, [searchParams, user]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === 'approved') {
      setTimeout(() => {
        router.push('/partner/dashboard');
      }, 2000);
    }
  };

  if (!restaurantId) {
    return (
      <>
        <Navbar />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center">
          {/* Success Icon */}
          <div className="mb-4 relative">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Application Submitted! 🎉
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            Your restaurant application is now under review.
          </p>

          {/* Status Checker - This shows the compact status card */}
          <div className="mb-4">
            <RestaurantStatusChecker 
              restaurantId={restaurantId}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* View Detailed Status Button - This opens the sidebar */}
          <div className="mb-4">
            <StatusSidebarTrigger 
              restaurantId={restaurantId}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* What Happens Next */}
          <div className="bg-card border rounded-xl p-4 text-left">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-primary" />
              What happens next?
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Review Process:</span> Our team will verify your restaurant details and menu.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Email Notification:</span> You'll receive a confirmation email once approved.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Get Started:</span> Log in to your partner dashboard to manage orders and menu.
                </span>
              </li>
            </ul>
          </div>

          {/* Help Text */}
          <p className="mt-4 text-xs text-muted-foreground">
            Questions?{' '}
            <a href="mailto:support@biteloop.com" className="text-primary hover:underline">
              support@biteloop.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}