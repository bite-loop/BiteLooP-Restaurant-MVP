// components/helper/protected_routes/restaurant-protected-route.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

interface RestaurantProtectedRouteProps {
  children: React.ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/partner-with-us/new'];

export function RestaurantProtectedRoute({ children }: RestaurantProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    isLoading, 
    isAuthenticated, 
    redirectBasedOnStatus,
    fetchUser,
    hasFetched
  } = useAuthStore();
  
  const [isChecking, setIsChecking] = useState(true);
  const checkDoneRef = useRef(false);

  useEffect(() => {
    // Skip if already checked
    if (checkDoneRef.current) return;

    const checkAuth = async () => {
      // Fetch user if not fetched
      if (!hasFetched) {
        await fetchUser();
      }

      // Check if current path is public
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));

      // If not authenticated and not on public route, redirect to auth page
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/partner-with-us/new');
        setIsChecking(false);
        checkDoneRef.current = true;
        return;
      }

      // If authenticated, check onboarding status and redirect
      if (isAuthenticated) {
        await redirectBasedOnStatus();
      }

      setIsChecking(false);
      checkDoneRef.current = true;
    };

    checkAuth();
  }, [pathname, isAuthenticated, hasFetched, fetchUser, redirectBasedOnStatus, router]);

  // Show loading state
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and on protected route, show nothing (will redirect)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}