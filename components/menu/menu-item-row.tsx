// components/menu/menu-item-row.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Check, X, Clock, Leaf, Sprout, WheatOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MenuItemRowProps {
  item: any;
  categoryId: string;
  onUpdate: (categoryId: string, itemId: string, data: any) => Promise<void>;
  onDelete: (categoryId: string, itemId: string) => Promise<void>;
  onToggleAvailability: (categoryId: string, itemId: string) => Promise<void>;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

function AttributeBadge({
  icon,
  label,
  variant = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'green' | 'emerald' | 'amber';
}) {
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium', variants[variant])}>
      {icon}
      {label}
    </span>
  );
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
      await onUpdate(categoryId, item.id, editData);
      toast.success('Item updated!');
      onCancelEdit();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  if (isEditing) {
    return (
      <div className="p-3 bg-secondary/30 rounded-lg border">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Name</Label>
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="h-7 text-xs rounded-md"
              placeholder="Item name"
            />
          </div>
          <div>
            <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Price</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                value={editData.price || ''}
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
                className="h-7 text-xs rounded-md pl-5"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="mb-2">
          <Label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Description</Label>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[50px] text-xs rounded-md resize-none"
            placeholder="Brief description"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <button
            onClick={() => setEditData({ ...editData, isVegetarian: !editData.isVegetarian })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all border',
              editData.isVegetarian
                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
          >
            <Sprout className="h-3 w-3" />
            Veg
          </button>
          <button
            onClick={() => setEditData({ ...editData, isVegan: !editData.isVegan })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all border',
              editData.isVegan
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
          >
            <Leaf className="h-3 w-3" />
            Vegan
          </button>
          <button
            onClick={() => setEditData({ ...editData, isGlutenFree: !editData.isGlutenFree })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all border',
              editData.isGlutenFree
                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
          >
            <WheatOff className="h-3 w-3" />
            GF
          </button>
          <button
            onClick={() => setEditData({ ...editData, isPopular: !editData.isPopular })}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all border',
              editData.isPopular
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                : 'border text-muted-foreground hover:border-foreground/20'
            )}
          >
            <Star className="h-3 w-3" />
            Popular
          </button>

          <div className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <input
              type="number"
              value={editData.preparationTime}
              onChange={(e) => setEditData({ ...editData, preparationTime: parseInt(e.target.value) || 15 })}
              className="w-8 bg-transparent text-[10px] font-medium outline-none text-center"
              min="1"
            />
            <span className="text-[10px] text-muted-foreground">min</span>
          </div>

          <label className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 cursor-pointer">
            <span className="text-[10px] font-medium text-muted-foreground">Available</span>
            <Switch
              checked={editData.isAvailable}
              onCheckedChange={(checked) => setEditData({ ...editData, isAvailable: checked })}
              className="scale-[0.65]"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-1.5 pt-2 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEdit}
            className="h-6 rounded-md text-[10px] px-2"
          >
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-6 rounded-md text-[10px] px-2 gap-1"
          >
            <Check className="h-3 w-3" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors hover:bg-secondary/50',
        !item.isAvailable && 'opacity-50'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className={cn('text-xs font-medium', !item.isAvailable && 'line-through')}>
            {item.name}
          </span>
          <span className="text-xs font-semibold tabular-nums">${item.price.toFixed(2)}</span>

          {item.isPopular && <AttributeBadge icon={<Star className="h-2.5 w-2.5" />} label="Popular" variant="amber" />}
          {item.isVegetarian && <AttributeBadge icon={<Sprout className="h-2.5 w-2.5" />} label="Veg" variant="green" />}
          {item.isVegan && <AttributeBadge icon={<Leaf className="h-2.5 w-2.5" />} label="Vegan" variant="emerald" />}
          {item.isGlutenFree && <AttributeBadge icon={<WheatOff className="h-2.5 w-2.5" />} label="GF" variant="default" />}

          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {item.preparationTime || 15}m
          </span>
        </div>
        {item.description && (
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Switch
          checked={item.isAvailable}
          onCheckedChange={() => onToggleAvailability(categoryId, item.id)}
          className="scale-[0.65] mr-0.5"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={onStartEdit}
          className="h-6 w-6 p-0 rounded-md"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (confirm('Delete this item?')) {
              onDelete(categoryId, item.id);
            }
          }}
          className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}