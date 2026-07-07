// components/onboarding/restaurant-status-checker.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Clock, XCircle, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface RestaurantStatusCheckerProps {
  restaurantId: string;
  onStatusChange?: (status: string) => void;
}

type StatusType = 'pending' | 'in_progress' | 'pending_approval' | 'approved' | 'rejected';

export function RestaurantStatusChecker({ restaurantId, onStatusChange }: RestaurantStatusCheckerProps) {
  const [status, setStatus] = useState<StatusType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (restaurantId) {
      checkStatus();
    }
  }, [restaurantId]);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/onboarding/status?userId=${restaurantId}`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus(data.onboardingStatus);
        setRejectionReason(data.rejectionReason || null);
        setSubmittedAt(data.submittedAt || null);
        onStatusChange?.(data.onboardingStatus);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      toast.error('Failed to check application status');
    } finally {
      setIsLoading(false);
    }
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
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          title: 'Approved! 🎉',
          description: 'Your restaurant has been approved. You can now start accepting orders!',
          badge: 'Approved',
          badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          title: 'Application Rejected',
          description: 'Your application was not approved. Please review the feedback and try again.',
          badge: 'Rejected',
          badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          title: 'Checking Status',
          description: 'Please wait while we check your application status.',
          badge: 'Checking',
          badgeColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  if (isLoading) {
    return (
      <Card className="border rounded-xl p-4">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Checking application status...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border rounded-xl p-4 ${config.borderColor}`}>
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          <div className={`p-1.5 ${config.bgColor} rounded-full flex-shrink-0`}>
            <StatusIcon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{config.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeColor}`}>
                {config.badge}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
            
            {rejectionReason && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  <strong>Reason:</strong> {rejectionReason}
                </p>
              </div>
            )}

            {submittedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Submitted: {new Date(submittedAt).toLocaleDateString()} at {new Date(submittedAt).toLocaleTimeString()}
              </p>
            )}

            {status === 'approved' && (
              <Button 
                className="mt-3 h-10 px-4 text-sm gap-2"
                onClick={() => router.push('/partner/dashboard')}
              >
                <Building2 className="w-4 h-4" />
                Go to Dashboard
              </Button>
            )}

            {status === 'rejected' && (
              <Button 
                className="mt-3 h-10 px-4 text-sm"
                variant="outline"
                onClick={() => router.push('/partner-with-us/new/onboarding-form')}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}