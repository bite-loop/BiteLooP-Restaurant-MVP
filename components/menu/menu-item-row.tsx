// components/menu/menu-item-row.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItemRowProps {
  item: any;
  categoryId: string;
  onUpdate: (restaurantId: string, categoryId: string, itemId: string, data: any) => Promise<void>;
  onDelete: (restaurantId: string, categoryId: string, itemId: string) => Promise<void>;
  onToggleAvailability: (restaurantId: string, categoryId: string, itemId: string) => Promise<void>;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export function MenuItemRow({
  item,
  categoryId,
  onUpdate,
  onDelete,
  onToggleAvailability,
  isEditing,
  onStartEdit,
  onCancelEdit,
}: MenuItemRowProps) {
  const [editData, setEditData] = useState({
    name: item.name,
    description: item.description || '',
    price: item.price,
    isVegetarian: item.isVegetarian || false,
    isVegan: item.isVegan || false,
    isGlutenFree: item.isGlutenFree || false,
    isPopular: item.isPopular || false,
    isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
    preparationTime: item.preparationTime || 15,
  });

  const handleSave = async () => {
    if (!editData.name.trim() || editData.price <= 0) {
      toast.error('Name and price are required');
      return;
    }
    try {
      await onUpdate('', categoryId, item.id, editData);
      toast.success('Item updated!');
      onCancelEdit();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-3 bg-muted/10">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Name *</Label>
            <Input
    
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Price *</Label>
            <Input
            
              type="number"
              step="0.01"
              value={editData.price || ''}
              onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Description</Label>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[40px] text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editData.isVegetarian}
              onChange={(e) => setEditData({ ...editData, isVegetarian: e.target.checked })}
            />
            Vegetarian
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editData.isVegan}
              onChange={(e) => setEditData({ ...editData, isVegan: e.target.checked })}
            />
            Vegan
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editData.isGlutenFree}
              onChange={(e) => setEditData({ ...editData, isGlutenFree: e.target.checked })}
            />
            Gluten Free
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editData.isPopular}
              onChange={(e) => setEditData({ ...editData, isPopular: e.target.checked })}
            />
            Popular
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editData.isAvailable}
              onChange={(e) => setEditData({ ...editData, isAvailable: e.target.checked })}
            />
            Available
          </label>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button size="sm" variant="outline" onClick={onCancelEdit}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className={`font-medium ${!item.isAvailable ? 'line-through text-muted-foreground' : ''}`}>
            {item.name}
          </span>
          <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
          {item.isPopular && (
            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded">
              Popular
            </span>
          )}
          {item.isVegetarian && (
            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded">
              Veg
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            ⏱ {item.preparationTime || 15}m
          </span>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Switch
          checked={item.isAvailable}
          onCheckedChange={() => onToggleAvailability('', categoryId, item.id)}
          className="mr-2"
        />
        <Button size="sm" variant="ghost" onClick={onStartEdit} className="h-7 w-7 p-0">
          <Edit className="h-3 w-3" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => {
            if (confirm('Delete this item?')) {
              onDelete('', categoryId, item.id);
            }
          }} 
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}