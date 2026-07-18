// hooks/use-menu.ts
import { useEffect } from 'react';
import { useMenuStore } from '@/store/menu-store';
import { useAuthStore } from '@/store/auth-store';

export function useMenu() {
  const { user } = useAuthStore();
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

  useEffect(() => {
    fetchMenu();
  }, [user?.id]);

  return {
    categories,
    isLoading,
    error,
    fetchMenu,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addItem,          // ✅ (categoryId, itemData) => Promise
    updateItem,       // ✅ (categoryId, itemId, data) => Promise
    deleteItem,       // ✅ (categoryId, itemId) => Promise
    toggleItemAvailability, // ✅ (categoryId, itemId) => Promise
  };
}