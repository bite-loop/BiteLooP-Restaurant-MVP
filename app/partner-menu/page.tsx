// app/menu/page.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useMenu } from '@/hooks/use-menu';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  AlertCircle,
  LayoutGrid,
  List,
  Sparkles,
  Search,
  Loader2,
  UtensilsCrossed,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { CategoryItem } from '@/components/menu/category-item';
import { Navbar } from '@/components/navbar/navbar';
import { cn } from '@/lib/utils';

export default function MenuPage() {
  const router = useRouter();
  const { 
    isAuthenticated, 
    isLoading: authLoading, 
    onboardingStatus, 
    checkOnboardingStatus,
    user 
  } = useAuthStore();
  
  // All hooks must be called BEFORE any conditional returns
  const {
    categories,
    isLoading: menuLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
  } = useMenu();

  // All useState hooks must be called in the same order every time
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);

  // Check access on page load - useEffect is fine to call conditionally
  useEffect(() => {
    const checkAccess = async () => {
      console.log('📄 Menu Page - Checking access');
      console.log('Auth loading:', authLoading);
      console.log('Is authenticated:', isAuthenticated);
      console.log('Onboarding status:', onboardingStatus);
      
      if (authLoading) {
        console.log('⏳ Auth is loading, waiting...');
        return;
      }
      
      if (!isAuthenticated) {
        console.log('🔴 Not authenticated, redirecting to /partner-with-us/new');
        router.push('/partner-with-us/new');
        return;
      }

      // Get status if not available
      let status = onboardingStatus;
      if (!status) {
        console.log('📊 No status cached, fetching...');
        status = await checkOnboardingStatus();
        console.log('📊 Status fetched:', status);
      }

      // If status is still null, allow access but log warning
      if (!status) {
        console.warn('⚠️ Status is null, allowing access but check your API');
        setIsCheckingAccess(false);
        return;
      }

      // Only redirect if rejected
      if (status === 'rejected') {
        console.log('❌ Rejected user, redirecting to form');
        router.push('/partner-with-us/new/onboarding-form');
      } else {
        console.log('✅ Access granted to menu page (status:', status, ')');
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, authLoading, onboardingStatus, checkOnboardingStatus, router]);

  // ALL useMemo hooks must be called in the same order
  const totalItems = useMemo(() => {
    return categories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  }, [categories]);

  const availableItems = useMemo(() => {
    return categories.reduce(
      (acc, cat) => acc + (cat.items?.filter((i: any) => i.isAvailable)?.length || 0),
      0
    );
  }, [categories]);

  const visibleCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = categories;

    if (q) {
      result = categories
        .map((category) => {
          const categoryMatches = category.name.toLowerCase().includes(q);
          const matchingItems = (category.items || []).filter((item: any) =>
            item.name.toLowerCase().includes(q)
          );
          if (categoryMatches) return category;
          if (matchingItems.length > 0) return { ...category, items: matchingItems };
          return null;
        })
        .filter(Boolean) as typeof categories;
    }

    if (filterAvailable) {
      result = result
        .map((category) => ({
          ...category,
          items: (category.items || []).filter((item: any) => item.isAvailable),
        }))
        .filter((category) => category.items.length > 0);
    }

    return result;
  }, [categories, searchQuery, filterAvailable]);

  const isFiltering = useMemo(() => {
    return searchQuery.trim().length > 0 || filterAvailable;
  }, [searchQuery, filterAvailable]);

  // All event handlers can be defined before conditional returns
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    setIsSubmittingCategory(true);
    try {
      await addCategory(newCategoryName.trim(), newCategoryDescription.trim());
      setNewCategoryName('');
      setNewCategoryDescription('');
      setIsAddCategoryOpen(false);
      toast.success('Category added!');
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editingCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      await updateCategory(categoryId, { name: editingCategoryName.trim() });
      setEditingCategory(null);
      setEditingCategoryName('');
      toast.success('Category updated!');
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category and all its items?')) return;
    try {
      await deleteCategory(categoryId);
      toast.success('Category deleted!');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  // Conditional returns come AFTER all hooks
  // Show loading while checking access or auth is loading
  if (authLoading || isCheckingAccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-[3px] border-border" />
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Loading your menu…</p>
          </div>
        </div>
      </>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Don't render menu for rejected users (they'll be redirected)
  if (onboardingStatus === 'rejected') {
    return null;
  }

  if (menuLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-[3px] border-border" />
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Loading your menu…</p>
          </div>
        </div>
      </>
    );
  }

  // Main render - all hooks have been called
  return (
    <>
      <Navbar />
      <div className="">
        {/* Header */}
        <div className="">
          <div className="max-w-3xl mx-auto px-6 pt-6 pb-4">
            {/* Top Row - Title and Actions */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UtensilsCrossed className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">Menu</h1>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {categories.length} categories · {totalItems} items
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsAddCategoryOpen(true)}
                size="sm"
                className="h-7 rounded-lg gap-1.5 text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                New category
              </Button>
            </div>

            {/* Bottom Row - Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-[200px]">
                <Input
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-7 pr-2 text-xs rounded-md"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterAvailable(!filterAvailable)}
                className={cn(
                  'h-7 rounded-md gap-1 text-xs font-medium',
                  filterAvailable && 'bg-secondary'
                )}
              >
                <SlidersHorizontal className="h-3 w-3" />
                Available
              </Button>

              <div className="flex rounded-md border p-0.5 ml-auto">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex items-center justify-center h-6 w-6 rounded-sm transition-all',
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <List className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex items-center justify-center h-6 w-6 rounded-sm transition-all',
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutGrid className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          {error && (
            <div className="mb-4 px-3 py-2 bg-destructive/5 border border-destructive/15 text-destructive rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}

          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No categories yet</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Create your first category to get started
              </p>
              <Button
                onClick={() => setIsAddCategoryOpen(true)}
                size="sm"
                className="gap-1.5 rounded-lg h-8 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Create category
              </Button>
            </div>
          ) : isFiltering && visibleCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-xs font-semibold mb-1">No matches found</h3>
              <p className="text-[11px] text-muted-foreground">Try adjusting your search</p>
            </div>
          ) : (
            <div className={cn(
              'space-y-2',
              viewMode === 'grid' && 'grid grid-cols-1 lg:grid-cols-2 gap-2 space-y-0'
            )}>
              {visibleCategories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isExpanded={isFiltering || expandedCategories.has(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                  onUpdate={handleUpdateCategory}
                  onDelete={handleDeleteCategory}
                  onAddItem={addItem}
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                  onToggleAvailability={toggleItemAvailability}
                  isEditing={editingCategory === category.id}
                  onStartEdit={() => {
                    setEditingCategory(category.id);
                    setEditingCategoryName(category.name);
                  }}
                  onCancelEdit={() => {
                    setEditingCategory(null);
                    setEditingCategoryName('');
                  }}
                  editingName={editingCategoryName}
                  setEditingName={setEditingCategoryName}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Category Dialog */}
        <Dialog
          open={isAddCategoryOpen}
          onOpenChange={(open) => {
            setIsAddCategoryOpen(open);
            if (!open) {
              setNewCategoryName('');
              setNewCategoryDescription('');
            }
          }}
        >
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">New category</DialogTitle>
              <DialogDescription className="text-xs">
                Add a category to organize your menu items
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-3'>
              <div>
                <Label htmlFor="new-category-name" className="text-[11px] font-medium text-muted-foreground">
                  Category name *
                </Label>
                <Input
                  id="new-category-name"
                  autoFocus
                  placeholder="e.g., Starters, Mains"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSubmittingCategory) handleAddCategory();
                  }}
                  className="h-10 mt-1 text-xs rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="new-category-description" className="text-[11px] font-medium text-muted-foreground">
                  Description (optional)
                </Label>
                <Input
                  id="new-category-description"
                  placeholder="e.g., Appetizers and small plates"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSubmittingCategory) handleAddCategory();
                  }}
                  className="h-10 mt-1 text-xs rounded-lg"
                />
              </div>
            </div>

            <DialogFooter className="gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddCategoryOpen(false)}
                className="h-7 rounded-lg text-xs px-3"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCategory}
                disabled={isSubmittingCategory || !newCategoryName.trim()}
                size="sm"
                className="h-7 rounded-lg text-xs px-3 gap-1"
              >
                {isSubmittingCategory ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}