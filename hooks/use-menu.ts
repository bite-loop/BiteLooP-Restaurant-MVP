// hooks/use-menu.ts
import { useEffect, useState } from 'react';
import { useMenuStore } from '@/store/menu-store';
import { useAuthStore } from '@/store/auth-store';

export function useMenu() {
  const { user, isAuthenticated, onboardingStatus } = useAuthStore();
  const {
    categories,
    isLoading,
    error,
    fetchMenu,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
  } = useMenuStore();

  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  useEffect(() => {
    // Only fetch menu if user is authenticated and not in a rejected state
    // Also ensure we don't fetch for rejected users
    if (isAuthenticated && user?.id && onboardingStatus !== 'rejected') {
      console.log('📡 Fetching menu for user:', user.id);
      fetchMenu();
      setHasInitialFetch(true);
    } else if (isAuthenticated && onboardingStatus === 'rejected') {
      console.log('❌ Rejected user, not fetching menu');
    } else {
      console.log('⏳ Waiting for authentication or status');
    }
  }, [user?.id, isAuthenticated, onboardingStatus, fetchMenu]);

  return {
    categories,
    isLoading: isLoading && !hasInitialFetch, // Don't show loading if we haven't fetched yet
    error,
    fetchMenu,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
  };
}