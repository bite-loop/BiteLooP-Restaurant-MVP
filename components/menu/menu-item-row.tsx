// components/menu/menu-item-row.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  Sprout,
  Leaf,
  WheatOff,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MenuItemRowProps {
  item: any;
  categoryId: string;
  onUpdate: (itemId: string, data: any) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
  onToggleAvailability: (itemId: string) => Promise<void>;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  isLoading?: boolean;
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
  isLoading = false,
}: MenuItemRowProps) {
  const [editData, setEditData] = useState({
    name: item.name || '',
    description: item.description || '',
    price: item.price || 0,
    isVegetarian: item.isVegetarian || false,
    isVegan: item.isVegan || false,
    isGlutenFree: item.isGlutenFree || false,
    isPopular: item.isPopular || false,
    preparationTime: item.preparationTime || 15,
  });

  const handleSave = async () => {
    if (!editData.name.trim() || editData.price <= 0) {
      toast.error('Name and price are required');
      return;
    }
    await onUpdate(item.id, editData);
  };

  const handleCancel = () => {
    setEditData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      isPopular: item.isPopular || false,
      preparationTime: item.preparationTime || 15,
    });
    onCancelEdit();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // If editing, show edit form
  if (isEditing) {
    return (
      <div className="py-2 px-1">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Name *</Label>
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="h-7 text-xs rounded-md"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Price *</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                value={editData.price || ''}
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
                className="h-7 text-xs rounded-md pl-5"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="mt-2">
          <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Description</Label>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[50px] text-xs rounded-md resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <button
            type="button"
            onClick={() => setEditData({ ...editData, isVegetarian: !editData.isVegetarian })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
              editData.isVegetarian
                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
            disabled={isLoading}
          >
            <Sprout className="h-3 w-3" /> Veg
          </button>
          <button
            type="button"
            onClick={() => setEditData({ ...editData, isVegan: !editData.isVegan })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
              editData.isVegan
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
            disabled={isLoading}
          >
            <Leaf className="h-3 w-3" /> Vegan
          </button>
          <button
            type="button"
            onClick={() => setEditData({ ...editData, isGlutenFree: !editData.isGlutenFree })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
              editData.isGlutenFree
                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
            disabled={isLoading}
          >
            <WheatOff className="h-3 w-3" /> GF
          </button>
          <button
            type="button"
            onClick={() => setEditData({ ...editData, isPopular: !editData.isPopular })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border transition-all',
              editData.isPopular
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
            disabled={isLoading}
          >
            <Star className="h-3 w-3" /> Popular
          </button>
          <div className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <input
              type="number"
              value={editData.preparationTime}
              onChange={(e) => setEditData({ ...editData, preparationTime: parseInt(e.target.value) || 15 })}
              className="w-8 bg-transparent text-[10px] font-medium outline-none text-center"
              min="1"
              disabled={isLoading}
            />
            <span className="text-[10px] text-muted-foreground">min</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-6 rounded-md text-[10px] px-2"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-6 rounded-md text-[10px] px-2 gap-1"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : <><Check className="h-3 w-3" /> Save</>}
          </Button>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className={cn('py-2 px-1 group flex items-start gap-3')}>
      {/* Item details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium">{item.name}</span>
          {item.isVegetarian && <Sprout className="h-3 w-3 text-green-500" />}
          {item.isVegan && <Leaf className="h-3 w-3 text-emerald-500" />}
          {item.isGlutenFree && <WheatOff className="h-3 w-3 text-yellow-500" />}
          {item.isPopular && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
          {!item.isAvailable && (
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Unavailable</span>
          )}
        </div>
        {item.description && (
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-semibold">{formatPrice(item.price)}</span>
          {item.preparationTime && (
            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {item.preparationTime}min
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 group-hover:opacity-100 transition-opacity">
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
          variant="ghost"
          onClick={() => onToggleAvailability(item.id)}
          className={cn(
            'h-6 w-6 p-0 rounded-md',
            item.isAvailable
              ? 'text-green-500 hover:text-green-600'
              : 'text-muted-foreground hover:text-foreground'
          )}
          disabled={isLoading}
        >
          {item.isAvailable ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => onDelete(item.id)}
          className="h-6 w-6 p-0 rounded-md bg-amber-50"
          disabled={isLoading}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}