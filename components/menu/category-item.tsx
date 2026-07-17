// components/menu/category-item.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  ChevronDown, 
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { MenuItemRow } from './menu-item-row';

interface CategoryItemProps {
  category: any;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onAddItem: (restaurantId: string, categoryId: string, itemData: any) => Promise<any>;
  onUpdateItem: (restaurantId: string, categoryId: string, itemId: string, data: any) => Promise<void>;
  onDeleteItem: (restaurantId: string, categoryId: string, itemId: string) => Promise<void>;
  onToggleAvailability: (restaurantId: string, categoryId: string, itemId: string) => Promise<void>;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  editingName: string;
  setEditingName: (name: string) => void;
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

  const handleAddItem = async () => {
    if (!newItem.name.trim() || newItem.price <= 0) {
      toast.error('Item name and price are required');
      return;
    }
    try {
      await onAddItem('', category.id, newItem);
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
      toast.success('Item added!');
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  return (
    <Card className="border border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="max-w-xs h-8"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={() => onUpdate(category.id)}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <span className="font-semibold flex-1">{category.name}</span>
          )}

          <span className="text-sm text-muted-foreground">
            {category.items?.length || 0} items
          </span>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAddItem(!showAddItem)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="ghost" onClick={onStartEdit} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="ghost" onClick={() => onDelete(category.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Add Item Form */}
            {showAddItem && (
              <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
                <h4 className="font-medium text-sm">Add New Item</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Name *</Label>
                    <Input
                     
                      placeholder="Item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Price *</Label>
                    <Input
                     
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    placeholder="Item description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="min-h-[60px]"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newItem.isVegetarian}
                      onChange={(e) => setNewItem({ ...newItem, isVegetarian: e.target.checked })}
                    />
                    Vegetarian
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newItem.isVegan}
                      onChange={(e) => setNewItem({ ...newItem, isVegan: e.target.checked })}
                    />
                    Vegan
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newItem.isGlutenFree}
                      onChange={(e) => setNewItem({ ...newItem, isGlutenFree: e.target.checked })}
                    />
                    Gluten Free
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newItem.isPopular}
                      onChange={(e) => setNewItem({ ...newItem, isPopular: e.target.checked })}
                    />
                    Popular
                  </label>
                </div>
                <div>
                  <Label className="text-xs">Prep Time (minutes)</Label>
                  <Input
                  
                    type="number"
                    value={newItem.preparationTime}
                    onChange={(e) => setNewItem({ ...newItem, preparationTime: parseInt(e.target.value) || 15 })}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => setShowAddItem(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddItem}>
                    Add Item
                  </Button>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-2">
              {category.items?.map((item: any) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  categoryId={category.id}
                  onUpdate={onUpdateItem}
                  onDelete={onDeleteItem}
                  onToggleAvailability={onToggleAvailability}
                  isEditing={editingItemId === item.id}
                  onStartEdit={() => setEditingItemId(item.id)}
                  onCancelEdit={() => setEditingItemId(null)}
                />
              ))}
              {category.items?.length === 0 && !showAddItem && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No items in this category. Click the + button to add one.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}