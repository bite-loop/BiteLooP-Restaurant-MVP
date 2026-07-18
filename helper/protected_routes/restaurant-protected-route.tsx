// components/helper/protected_routes/restaurant-protected-route.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

interface RestaurantProtectedRouteProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/onboarding', '/partner-with-us/new'];
const SELF_PROTECTED_ROUTES = ['/partner-menu'];

export function RestaurantProtectedRoute({ children }: RestaurantProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    isLoading, 
    isAuthenticated, 
    redirectBasedOnStatus,
    fetchUser,
    hasFetched,
    user // Add user to check if it exists
  } = useAuthStore();
  
  const [isChecking, setIsChecking] = useState(true);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip if already checked
      if (initialCheckDone.current) {
        console.log('⏭️ Initial check already done, skipping');
        return;
      }

      console.log('🔐 RestaurantProtectedRoute checking auth...');
      console.log('📍 Current path:', pathname);
      console.log('🔑 isAuthenticated:', isAuthenticated);
      console.log('👤 user exists:', !!user);
      console.log('📊 hasFetched:', hasFetched);
      
      // Check public routes FIRST
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route)
      );
      
      if (isPublicRoute) {
        console.log(`📍 Public route (${pathname}), skipping all checks`);
        setIsChecking(false);
        initialCheckDone.current = true;
        return;
      }
      
      // Check self-protected routes
      const isSelfProtected = SELF_PROTECTED_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route)
      );
      
      if (isSelfProtected) {
        console.log(`📍 Route ${pathname} handles its own protection, skipping`);
        setIsChecking(false);
        initialCheckDone.current = true;
        return;
      }
      
      // Fetch user if not fetched yet OR if user is null (logged out)
      if (!hasFetched || !user) {
        console.log('📊 Fetching user...');
        await fetchUser();
        // After fetch, check if we're authenticated
        const authStore = useAuthStore.getState();
        if (!authStore.isAuthenticated) {
          console.log('🔴 Not authenticated after fetch, redirecting...');
          router.push('/partner-with-us/new');
          setIsChecking(false);
          initialCheckDone.current = true;
          return;
        }
      }

      // Check authentication after potential fetch
      const currentAuthState = useAuthStore.getState();
      if (!currentAuthState.isAuthenticated) {
        console.log('🔴 Not authenticated, redirecting to /partner-with-us/new');
        router.push('/partner-with-us/new');
        setIsChecking(false);
        initialCheckDone.current = true;
        return;
      }

      // If authenticated, check status
      if (currentAuthState.isAuthenticated && currentAuthState.user) {
        console.log('🟢 Authenticated, checking status...');
        await redirectBasedOnStatus();
      }

      setIsChecking(false);
      initialCheckDone.current = true;
    };

    checkAuth();
  }, [pathname, isAuthenticated, hasFetched, user, fetchUser, redirectBasedOnStatus, router]);

  // Show loading state
  /* if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  } */

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // If not authenticated and not on public route, return null (will redirect)
  const currentAuthState = useAuthStore.getState();
  if (!currentAuthState.isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}