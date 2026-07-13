// hooks/use-restaurant-auth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

type StatusType = 'pending' | 'in_progress' | 'pending_approval' | 'approved' | 'rejected';

export function useRestaurantAuth(allowedStatuses?: StatusType[]) {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    onboardingStatus, 
    checkOnboardingStatus,
    hasFetched 
  } = useAuthStore();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [status, setStatus] = useState<StatusType | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) {
        return;
      }

      // Not authenticated
      if (!isAuthenticated || !user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Get status
      let currentStatus = onboardingStatus as StatusType;
      if (!currentStatus) {
        currentStatus = (await checkOnboardingStatus()) as StatusType;
      }
      setStatus(currentStatus);

      // Check if status is allowed
      if (allowedStatuses && !allowedStatuses.includes(currentStatus)) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [isLoading, isAuthenticated, user, onboardingStatus, checkOnboardingStatus, allowedStatuses]);

  const redirectTo = (path: string) => {
    router.push(path);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized,
    isChecking,
    status,
    redirectTo,
    checkOnboardingStatus,
  };
}