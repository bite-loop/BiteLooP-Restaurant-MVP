// app/partner-with-us/new/success/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Clock, Mail, Building2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar/navbar';

export default function OnboardingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('🎉 Onboarding submitted successfully');
  }, []);

  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center">
          {/* Success Icon */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Onboarding Submitted! 🎉
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            Your restaurant application is now under review.
          </p>

          {/* Status Card */}
          <div className="bg-card border rounded-xl p-4 mb-4 text-left">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-yellow-500/10 rounded-full flex-shrink-0">
                <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold">Waiting for Approval</h3>
                <p className="text-sm text-muted-foreground">
                  Our team is reviewing your application. You'll receive an email once approved.
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    Pending Review
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-xs">Est. 24-48 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-card border rounded-xl p-4 mb-4 text-left">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              className="h-12 px-6 text-base gap-2"
              onClick={() => router.push('/partner/dashboard')}
            >
              <Building2 className="w-4 h-4" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-6 text-base gap-2"
              onClick={() => router.push('/')}
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Button>
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