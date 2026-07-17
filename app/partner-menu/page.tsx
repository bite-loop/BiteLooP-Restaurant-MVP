// app/menu/page.tsx
'use client';

import { useState } from 'react';
import { useMenu } from '@/hooks/use-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  GripVertical,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { CategoryItem } from '@/components/menu/category-item';

export default function MenuPage() {
 /*  const {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
  } = useMenu(); */

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false)

  // Add this inside the component

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
    try {
      /* await addCategory('', newCategoryName.trim()); */
      setNewCategoryName('');
      toast.success('Category added!');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editingCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
     /*  await updateCategory('', categoryId, { name: editingCategoryName.trim() }); */
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
     /*  await deleteCategory('', categoryId); */
      toast.success('Category deleted!');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

 /*  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="New category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-64"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No categories yet</p>
            <Button variant="outline" onClick={() => document.querySelector('input')?.focus()}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isExpanded={expandedCategories.has(category.id)}
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
            />
          ))}
        </div>
      )}
    </div>
  ); */
}