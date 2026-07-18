// lib/stores/menu-store.ts
import { create } from 'zustand';
import type { MenuCategory, MenuItem } from '@/types/restaurants';
import { useAuthStore } from './auth-store';

interface MenuStore {
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>; // No arguments - gets restaurantId from auth store
  addCategory: (name: string, description?: string) => Promise<MenuCategory>;
  updateCategory: (categoryId: string, data: Partial<MenuCategory>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  addItem: (categoryId: string, itemData: any) => Promise<any>; // Match the expected type
  updateItem: (categoryId: string, itemId: string, data: any) => Promise<void>;
  deleteItem: (categoryId: string, itemId: string) => Promise<void>;
  toggleItemAvailability: (categoryId: string, itemId: string) => Promise<void>;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) {
      set({ error: 'Restaurant ID not found', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/menu?restaurantId=${restaurantId}`);
      if (!res.ok) throw new Error('Failed to fetch menu');
      const data = await res.json();
      set({ categories: data.categories || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCategory: async (name, description) => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) throw new Error('Restaurant ID not found');

    try {
      const res = await fetch('/api/menu/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, name, description }),
      });
      if (!res.ok) throw new Error('Failed to add category');
      const category = await res.json();
      set((state) => ({ 
        categories: [...state.categories, category] 
      }));
      return category;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateCategory: async (categoryId, data) => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) throw new Error('Restaurant ID not found');

    try {
      const res = await fetch('/api/menu/category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, categoryId, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      const updated = await res.json();
      set((state) => ({
        categories: state.categories.map((c) => 
          c.id === categoryId ? { ...c, ...updated } : c
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) throw new Error('Restaurant ID not found');

    try {
      const res = await fetch('/api/menu/category', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, categoryId }),
      });
      if (!res.ok) throw new Error('Failed to delete category');
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  reorderCategories: async (categoryIds) => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) throw new Error('Restaurant ID not found');

    try {
      const res = await fetch('/api/menu/category/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, categoryIds }),
      });
      if (!res.ok) throw new Error('Failed to reorder categories');
      set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          displayOrder: categoryIds.indexOf(c.id) + 1,
        })).sort((a, b) => a.displayOrder - b.displayOrder),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  addItem: async (categoryId, itemData) => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) throw new Error('Restaurant ID not found');

    try {
      const res = await fetch('/api/menu/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, categoryId, ...itemData }),
      });
      if (!res.ok) throw new Error('Failed to add item');
      const item = await res.json();
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === categoryId
            ? { ...c, items: [...c.items, item] }
            : c
        ),
      }));
      return item;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateItem: async (categoryId, itemId, data) => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) throw new Error('Restaurant ID not found');

    try {
      const res = await fetch('/api/menu/item', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, categoryId, itemId, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update item');
      const updated = await res.json();
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, ...updated } : i) }
            : c
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteItem: async (categoryId, itemId) => {
    const user = useAuthStore.getState().user;
    const restaurantId = user?.id;
    
    if (!restaurantId) throw new Error('Restaurant ID not found');

    try {
      const res = await fetch('/api/menu/item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, categoryId, itemId }),
      });
      if (!res.ok) throw new Error('Failed to delete item');
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
            : c
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  toggleItemAvailability: async (categoryId, itemId) => {
    const category = get().categories.find(c => c.id === categoryId);
    const item = category?.items.find(i => i.id === itemId);
    if (!item) return;
    
    await get().updateItem(categoryId, itemId, {
      isAvailable: !item.isAvailable,
    });
  },
}));