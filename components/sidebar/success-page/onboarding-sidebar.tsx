// components/onboarding/restaurant-status-sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Building2,
  ChevronRight,
  ChevronLeft,
  FileCheck,
  UserCheck,
  Banknote,
  Image,
  Utensils,
  ShieldCheck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Star,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RestaurantStatusSidebarProps {
  restaurantId: string;
  isOpen?: boolean;
  onClose?: () => void;
  onStatusChange?: (status: string) => void;
}

type StatusType = 'pending' | 'in_progress' | 'pending_approval' | 'approved' | 'rejected';

interface OnboardingStep {
  id: number;
  label: string;
  description: string;
  icon: React.ElementType;
  isCompleted: boolean;
  isActive: boolean;
}

export function RestaurantStatusSidebar({ 
  restaurantId, 
  isOpen = false, 
  onClose,
  onStatusChange 
}: RestaurantStatusSidebarProps) {
  const [status, setStatus] = useState<StatusType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (restaurantId && isOpen) {
      checkStatus();
    }
  }, [restaurantId, isOpen]);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/onboarding/status?userId=${restaurantId}`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus(data.onboardingStatus);
        setCurrentStep(data.onboardingStep || 0);
        setRejectionReason(data.rejectionReason || null);
        setSubmittedAt(data.submittedAt || null);
        setRestaurantData(data.restaurantData || null);
        onStatusChange?.(data.onboardingStatus);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      toast.error('Failed to check application status');
    } finally {
      setIsLoading(false);
    }
  };

  const getOnboardingSteps = (): OnboardingStep[] => {
    const allSteps = [
      {
        id: 1,
        label: 'Business Details',
        description: 'Legal name, registration, contact information',
        icon: Building2,
      },
      {
        id: 2,
        label: 'Bank Details',
        description: 'Payout account and banking information',
        icon: Banknote,
      },
      {
        id: 3,
        label: 'Restaurant Profile',
        description: 'Branding, location, and operational details',
        icon: Image,
      },
      {
        id: 4,
        label: 'Menu Card',
        description: 'Upload your restaurant menu',
        icon: Utensils,
      },
      {
        id: 5,
        label: 'Review & Submit',
        description: 'Verify all information before submission',
        icon: FileCheck,
      },
    ];

    const maxStep = status === 'pending_approval' || status === 'approved' ? 5 : currentStep;
    
    return allSteps.map((step, index) => ({
      ...step,
      isCompleted: index + 1 <= maxStep,
      isActive: index + 1 === maxStep && status !== 'pending_approval' && status !== 'approved',
    }));
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'pending_approval':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          title: 'Waiting for Approval',
          description: 'Your application is being reviewed by our team.',
          badge: 'Pending Review',
          badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          progress: 100,
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          title: 'Application Approved',
          description: 'Your restaurant has been approved. You can now start accepting orders!',
          badge: 'Approved',
          badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          progress: 100,
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          title: 'Application Rejected',
          description: 'Your application was not approved. Please review the feedback below.',
          badge: 'Rejected',
          badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          progress: currentStep > 0 ? Math.round((currentStep / 5) * 100) : 0,
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          title: 'In Progress',
          description: 'Continue filling out your onboarding details.',
          badge: 'In Progress',
          badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          progress: currentStep > 0 ? Math.round((currentStep / 5) * 100) : 0,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;
  const steps = getOnboardingSteps();

  if (isLoading) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        )}
        <div className={cn(
          "fixed right-0 top-0 h-full w-[520px] bg-background border-l shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Loading status information...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Wider (520px) */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-[520px] bg-background border-l shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Onboarding Status</h2>
                <p className="text-sm text-muted-foreground">Track your application progress</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Status Card - Larger */}
          <Card className={`border rounded-xl p-6 mb-8 ${config.borderColor}`}>
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className={`p-3 ${config.bgColor} rounded-xl flex-shrink-0`}>
                  <StatusIcon className={`w-7 h-7 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{config.title}</h3>
                    <Badge className={`${config.badgeColor} px-3 py-1 text-xs font-medium`}>
                      {config.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {config.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Overall Progress</span>
                      <span className="font-medium">{config.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${config.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  {restaurantData && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {restaurantData.name && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">{restaurantData.name}</span>
                        </div>
                      )}
                      {restaurantData.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground truncate">{restaurantData.email}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-700 dark:text-red-400">Rejection Reason</p>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submittedAt && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Submitted: {new Date(submittedAt).toLocaleDateString()} at {new Date(submittedAt).toLocaleTimeString()}</span>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    {status === 'approved' && (
                      <Button 
                        className="h-11 px-6 gap-2 flex-1"
                        onClick={() => router.push('/partner/dashboard')}
                      >
                        <Building2 className="w-4 h-4" />
                        Go to Dashboard
                      </Button>
                    )}

                    {status === 'rejected' && (
                      <Button 
                        className="h-11 px-6 flex-1"
                        variant="outline"
                        onClick={() => router.push('/partner-with-us/new/onboarding-form')}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Retry Application
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Steps - More Detailed */}
          <div>
            <h4 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Onboarding Process
            </h4>
            <div className="space-y-5">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300",
                        step.isCompleted 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : step.isActive 
                            ? "border-primary text-primary bg-primary/5" 
                            : "border-muted text-muted-foreground bg-muted/20"
                      )}>
                        {step.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-10",
                          step.isCompleted ? "bg-primary" : "bg-muted"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "font-semibold",
                          step.isCompleted ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        {step.isCompleted && (
                          <Badge variant="outline" className="border-green-500 rounded-md text-green-500 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {step.isActive && (
                          <Badge variant="outline" className="border-primary text-primary text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-left text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <Separator className="my-8" />
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 text-base"
              onClick={() => router.push('/partner/support')}
            >
              <AlertCircle className="w-5 h-5" />
              Contact Support
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-12 text-base text-muted-foreground hover:text-foreground"
              onClick={() => router.push('/partner/faq')}
            >
              <FileCheck className="w-5 h-5" />
              View FAQ
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Add the missing import
import { ClipboardList } from 'lucide-react';