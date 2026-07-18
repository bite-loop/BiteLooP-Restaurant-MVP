// components/menu/category-item.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Utensils,
  Clock,
  Sprout,
  Leaf,
  WheatOff,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MenuItemRow } from './menu-item-row';

interface CategoryItemProps {
  category: any;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onAddItem: (categoryId: string, itemData: any) => Promise<any>;
  onUpdateItem: (categoryId: string, itemId: string, data: any) => Promise<void>;
  onDeleteItem: (categoryId: string, itemId: string) => Promise<void>;
  onToggleAvailability: (categoryId: string, itemId: string) => Promise<void>;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  editingName: string;
  setEditingName: (name: string) => void;
  viewMode?: 'list' | 'grid';
}

export function CategoryItem({
  category,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleAvailability,
  isEditing,
  onStartEdit,
  onCancelEdit,
  editingName,
  setEditingName,
  viewMode = 'list',
}: CategoryItemProps) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    isPopular: false,
    preparationTime: 15,
  });

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || newItem.price <= 0) {
      toast.error('Item name and price are required');
      return;
    }

    setIsLoading(true);
    try {
      await onAddItem(category.id, newItem);
      setNewItem({
        name: '',
        description: '',
        price: 0,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        isPopular: false,
        preparationTime: 15,
      });
      setShowAddItem(false);
      toast.success('Item added successfully!');
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Add item error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = async (itemId: string, data: any) => {
    setIsLoading(true);
    try {
      await onUpdateItem(category.id, itemId, data);
      setEditingItemId(null);
      toast.success('Item updated successfully!');
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Update item error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setIsLoading(true);
    try {
      await onDeleteItem(category.id, itemId);
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Delete item error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    try {
      await onToggleAvailability(category.id, itemId);
      // Toast is handled in the parent
    } catch (error) {
      toast.error('Failed to toggle availability');
      console.error('Toggle availability error:', error);
    }
  };

  const itemCount = category.items?.length || 0;

  return (
    <Card className={cn('rounded-lg border shadow-none transition-all duration-200', isExpanded && 'border-primary/30 shadow-sm')}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            onClick={onToggle}
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all hover:bg-secondary',
              isExpanded && 'rotate-180'
            )}
          >
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
            {isEditing ? (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="h-7 text-xs max-w-[200px] rounded-md"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 rounded-md text-green-600 hover:bg-green-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(category.id);
                  }}
                  disabled={isLoading}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelEdit();
                  }}
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{category.name}</span>
                <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddItem(!showAddItem)}
              className={cn('h-7 rounded-md text-[10px] font-medium gap-1', showAddItem && 'bg-secondary')}
              disabled={isLoading}
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onStartEdit}
              className="h-6 w-6 p-0 rounded-md"
              disabled={isLoading}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
                  onDelete(category.id);
                }
              }}
              className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-destructive"
              disabled={isLoading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-3 pb-3 border-t">
            {/* Add Item Form */}
            {showAddItem && (
              <div className="my-3 p-3 rounded-lg bg-secondary/30 border">
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary">
                    <Plus className="h-3 w-3" />
                  </span>
                  New item
                </h4>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Name *</Label>
                    <Input
                      placeholder="Item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="h-7 text-xs rounded-md"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Price *</Label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newItem.price || ''}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                        className="h-7 text-xs rounded-md pl-5"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Description</Label>
                  <Textarea
                    placeholder="Brief description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="min-h-[50px] text-xs rounded-md resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, isVegetarian: !newItem.isVegetarian })}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
                      newItem.isVegetarian
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : 'border text-muted-foreground hover:border-foreground/20'
                    )}
                  >
                    <Sprout className="h-3 w-3" /> Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, isVegan: !newItem.isVegan })}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
                      newItem.isVegan
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'border text-muted-foreground hover:border-foreground/20'
                    )}
                  >
                    <Leaf className="h-3 w-3" /> Vegan
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, isGlutenFree: !newItem.isGlutenFree })}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
                      newItem.isGlutenFree
                        ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                        : 'border text-muted-foreground hover:border-foreground/20'
                    )}
                  >
                    <WheatOff className="h-3 w-3" /> GF
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, isPopular: !newItem.isPopular })}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
                      newItem.isPopular
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        : 'border text-muted-foreground hover:border-foreground/20'
                    )}
                  >
                    <Star className="h-3 w-3" /> Popular
                  </button>
                  <div className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <input
                      type="number"
                      value={newItem.preparationTime}
                      onChange={(e) => setNewItem({ ...newItem, preparationTime: parseInt(e.target.value) || 15 })}
                      className="w-8 bg-transparent text-[10px] font-medium outline-none text-center"
                      min="1"
                    />
                    <span className="text-[10px] text-muted-foreground">min</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddItem(false)}
                    className="h-6 rounded-md text-[10px] px-2"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddItem}
                    className="h-6 rounded-md text-[10px] px-2 gap-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add item'}
                  </Button>
                </div>
              </div>
            )}

            {/* Items List or Grid */}
            <div className={cn(
              'divide-y divide-border mt-2',
              viewMode === 'grid' && 'grid grid-cols-2 gap-3 divide-y-0 mt-0'
            )}>
              {category.items?.map((item: any) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  categoryId={category.id}
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  onToggleAvailability={handleToggleAvailability}
                  isEditing={editingItemId === item.id}
                  onStartEdit={() => setEditingItemId(item.id)}
                  onCancelEdit={() => setEditingItemId(null)}
                 
                />
              ))}
              {category.items?.length === 0 && !showAddItem && (
                <div className="flex flex-col items-center justify-center py-6 col-span-2">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center mb-2">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">No items yet</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">Click Add to create one</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}