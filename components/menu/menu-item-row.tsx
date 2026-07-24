// components/menu/menu-item-row.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Package,
  UtensilsCrossed,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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
  const [imageIndex, setImageIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name || '',
    description: item.description || '',
    price: item.price || 0,
    originalPrice: item.originalPrice || 0,
    discountPercentage: item.discountPercentage || 0,
    isVegetarian: item.isVegetarian || false,
    isVegan: item.isVegan || false,
    isGlutenFree: item.isGlutenFree || false,
    containsAllergens: item.containsAllergens || [],
    isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
    isPopular: item.isPopular || false,
    preparationTime: item.preparationTime || 15,
    customizationOptions: item.customizationOptions || [],
    nutritionalInfo: item.nutritionalInfo || {
      calories: 0,
      protein: '',
      carbs: '',
      fat: '',
    },
    costToMake: item.costToMake || 0,
    profitMargin: item.profitMargin || 0,
    hasLimitedStock: item.hasLimitedStock || false,
    stockQuantity: item.stockQuantity || 0,
  });

  const [newAllergen, setNewAllergen] = useState('');
  const [newCustomGroup, setNewCustomGroup] = useState({
    id: `cg_${Date.now()}`,
    name: '',
    type: 'single' as 'single' | 'multiple',
    required: false,
    options: [] as any[],
  });
  const [newOption, setNewOption] = useState({ name: '', additionalPrice: 0, isDefault: false });

  const addAllergen = () => {
    if (newAllergen.trim()) {
      setEditData(prev => ({
        ...prev,
        containsAllergens: [...prev.containsAllergens, newAllergen.trim()],
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (index: number) => {
    setEditData(prev => ({
      ...prev,
      //@ts-ignore
      containsAllergens: prev.containsAllergens.filter((_, i) => i !== index),
    }));
  };

  const addCustomizationGroup = () => {
    if (newCustomGroup.name.trim()) {
      setEditData(prev => ({
        ...prev,
        customizationOptions: [...prev.customizationOptions, { ...newCustomGroup, id: `cg_${Date.now()}` }],
      }));
      setNewCustomGroup({
        id: `cg_${Date.now()}`,
        name: '',
        type: 'single',
        required: false,
        options: [],
      });
    }
  };

  const addOptionToGroup = (groupIndex: number) => {
    if (newOption.name.trim()) {
      const updatedGroups = [...editData.customizationOptions];
      updatedGroups[groupIndex].options.push({
        id: `opt_${Date.now()}`,
        name: newOption.name,
        additionalPrice: newOption.additionalPrice,
        isDefault: newOption.isDefault,
      });
      setEditData(prev => ({ ...prev, customizationOptions: updatedGroups }));
      setNewOption({ name: '', additionalPrice: 0, isDefault: false });
    }
  };

  const removeOption = (groupIndex: number, optionIndex: number) => {
    const updatedGroups = [...editData.customizationOptions];
    updatedGroups[groupIndex].options.splice(optionIndex, 1);
    setEditData(prev => ({ ...prev, customizationOptions: updatedGroups }));
  };

  const removeCustomizationGroup = (index: number) => {
    setEditData(prev => ({
      ...prev,
      //@ts-ignore
      customizationOptions: prev.customizationOptions.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!editData.name.trim() || editData.price <= 0) {
      toast.error('Name and price are required');
      return;
    }

    let discountPercentage = editData.discountPercentage;
    if (editData.originalPrice > 0 && editData.price > 0) {
      discountPercentage = Math.round(((editData.originalPrice - editData.price) / editData.originalPrice) * 100);
    }

    await onUpdate(item.id, {
      ...editData,
      discountPercentage,
    });
  };

  const handleCancel = () => {
    setEditData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      originalPrice: item.originalPrice || 0,
      discountPercentage: item.discountPercentage || 0,
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      containsAllergens: item.containsAllergens || [],
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      isPopular: item.isPopular || false,
      preparationTime: item.preparationTime || 15,
      customizationOptions: item.customizationOptions || [],
      nutritionalInfo: item.nutritionalInfo || {
        calories: 0,
        protein: '',
        carbs: '',
        fat: '',
      },
      costToMake: item.costToMake || 0,
      profitMargin: item.profitMargin || 0,
      hasLimitedStock: item.hasLimitedStock || false,
      stockQuantity: item.stockQuantity || 0,
    });
    onCancelEdit();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(item.id);
      setShowDeleteDialog(false);
      toast.success(`"${item.name}" deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const nextImage = () => {
    if (item.images && item.images.length > 0) {
      setImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item.images && item.images.length > 0) {
      setImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  // If editing, show edit form
  if (isEditing) {
    return (
      <div className="p-4 bg-muted/20 rounded-xl border shadow-sm space-y-5 max-h-[600px] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Edit className="h-4 w-4 text-primary" />
            Edit Item
          </h4>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0 rounded-lg"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="h-10 text-sm rounded-lg"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Price <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                value={editData.price || ''}
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
                className="h-10 text-sm rounded-lg pl-7"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Original Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Original Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                value={editData.originalPrice || ''}
                onChange={(e) => setEditData({ ...editData, originalPrice: parseFloat(e.target.value) || 0 })}
                className="h-10 text-sm rounded-lg pl-7"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Discount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              <Input
                type="number"
                step="1"
                value={editData.discountPercentage || ''}
                onChange={(e) => setEditData({ ...editData, discountPercentage: parseFloat(e.target.value) || 0 })}
                className="h-10 text-sm rounded-lg pl-7"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Description</Label>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[80px] text-sm rounded-lg resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Dietary & Labels */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Dietary & Labels</Label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditData({ ...editData, isVegetarian: !editData.isVegetarian })}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                editData.isVegetarian
                  ? 'bg-green-500/10 text-green-600 border-green-500/30'
                  : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
              )}
            >
              <Sprout className="h-3.5 w-3.5" /> Vegetarian
            </button>
            <button
              type="button"
              onClick={() => setEditData({ ...editData, isVegan: !editData.isVegan })}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                editData.isVegan
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
              )}
            >
              <Leaf className="h-3.5 w-3.5" /> Vegan
            </button>
            <button
              type="button"
              onClick={() => setEditData({ ...editData, isGlutenFree: !editData.isGlutenFree })}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                editData.isGlutenFree
                  ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                  : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
              )}
            >
              <WheatOff className="h-3.5 w-3.5" /> Gluten Free
            </button>
            <button
              type="button"
              onClick={() => setEditData({ ...editData, isPopular: !editData.isPopular })}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                editData.isPopular
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                  : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
              )}
            >
              <Star className="h-3.5 w-3.5" /> Popular
            </button>
          </div>
        </div>

        {/* Allergens */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Allergens</Label>
          <div className="flex gap-1.5 flex-wrap">
            {editData.containsAllergens.map((allergen: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
              >
                {allergen}
                <button type="button" onClick={() => removeAllergen(index)} className="hover:text-destructive/80">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <div className="flex gap-1.5">
              <Input
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                placeholder="Add allergen"
                className="h-9 w-32 text-sm rounded-lg"
                onKeyDown={(e) => e.key === 'Enter' && addAllergen()}
                disabled={isLoading}
              />
              <Button size="sm" variant="secondary" onClick={addAllergen} className="h-9 px-3 rounded-lg">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Nutritional Info */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Nutritional Information</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Calories</Label>
              <Input
                type="number"
                value={editData.nutritionalInfo?.calories || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  nutritionalInfo: {
                    ...editData.nutritionalInfo,
                    calories: parseInt(e.target.value) || 0,
                  }
                })}
                className="h-9 text-sm rounded-lg"
                placeholder="kcal"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Protein</Label>
              <Input
                value={editData.nutritionalInfo?.protein || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  nutritionalInfo: {
                    ...editData.nutritionalInfo,
                    protein: e.target.value,
                  }
                })}
                className="h-9 text-sm rounded-lg"
                placeholder="e.g. 20g"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Carbs</Label>
              <Input
                value={editData.nutritionalInfo?.carbs || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  nutritionalInfo: {
                    ...editData.nutritionalInfo,
                    carbs: e.target.value,
                  }
                })}
                className="h-9 text-sm rounded-lg"
                placeholder="e.g. 35g"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Fat</Label>
              <Input
                value={editData.nutritionalInfo?.fat || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  nutritionalInfo: {
                    ...editData.nutritionalInfo,
                    fat: e.target.value,
                  }
                })}
                className="h-9 text-sm rounded-lg"
                placeholder="e.g. 12g"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Cost & Profit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Cost to Make</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                value={editData.costToMake || ''}
                onChange={(e) => setEditData({ ...editData, costToMake: parseFloat(e.target.value) || 0 })}
                className="h-9 text-sm rounded-lg pl-7"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Profit Margin</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              <Input
                type="number"
                step="0.01"
                value={editData.profitMargin || ''}
                onChange={(e) => setEditData({ ...editData, profitMargin: parseFloat(e.target.value) || 0 })}
                className="h-9 text-sm rounded-lg pl-7"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Stock & Availability */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Switch
              checked={editData.hasLimitedStock}
              onCheckedChange={(checked) => setEditData({ ...editData, hasLimitedStock: checked })}
              disabled={isLoading}
            />
            <span className="text-xs font-medium">Limited stock</span>
          </div>
          {editData.hasLimitedStock && (
            <div className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={editData.stockQuantity || ''}
                onChange={(e) => setEditData({ ...editData, stockQuantity: parseInt(e.target.value) || 0 })}
                className="h-9 w-20 text-sm rounded-lg"
                placeholder="Qty"
                disabled={isLoading}
              />
            </div>
          )}
          <div className="flex items-center gap-2.5 ml-auto">
            <Switch
              checked={editData.isAvailable}
              onCheckedChange={(checked) => setEditData({ ...editData, isAvailable: checked })}
              disabled={isLoading}
            />
            <span className="text-xs font-medium">Available</span>
          </div>
        </div>

        {/* Preparation Time */}
        <div className="flex items-center gap-3">
          <Label className="text-xs font-medium">Prep Time</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={editData.preparationTime}
              onChange={(e) => setEditData({ ...editData, preparationTime: parseInt(e.target.value) || 15 })}
              className="h-9 w-20 text-sm rounded-lg"
              min="1"
              disabled={isLoading}
            />
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Customization Options</Label>
          {editData.customizationOptions.map((group: any, gIndex: number) => (
            <div key={gIndex} className="p-3 bg-background rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{group.name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase">
                    {group.type}
                  </span>
                  {group.required && <span className="text-[10px] text-destructive font-medium">Required</span>}
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomizationGroup(gIndex)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {group.options.map((opt: any, oIndex: number) => (
                  <div key={oIndex} className="flex items-center justify-between text-sm py-1 px-2 hover:bg-secondary/50 rounded-md">
                    <span>{opt.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">+${opt.additionalPrice.toFixed(2)}</span>
                      {opt.isDefault && <span className="text-[10px] text-green-600 font-medium">Default</span>}
                      <button
                        type="button"
                        onClick={() => removeOption(gIndex, oIndex)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <Input
                  placeholder="Option name"
                  value={newOption.name}
                  onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                  className="h-8 text-sm flex-1 rounded-lg"
                  disabled={isLoading}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newOption.additionalPrice || ''}
                  onChange={(e) => setNewOption({ ...newOption, additionalPrice: parseFloat(e.target.value) || 0 })}
                  className="h-8 text-sm w-24 rounded-lg"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => addOptionToGroup(gIndex)}
                  className="h-8 px-3 rounded-lg"
                  disabled={isLoading}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex gap-1.5 flex-wrap">
            <Input
              placeholder="Group name (e.g. Size)"
              value={newCustomGroup.name}
              onChange={(e) => setNewCustomGroup({ ...newCustomGroup, name: e.target.value })}
              className="h-9 text-sm flex-1 min-w-[120px] rounded-lg"
              disabled={isLoading}
            />
            <select
              value={newCustomGroup.type}
              onChange={(e) => setNewCustomGroup({ ...newCustomGroup, type: e.target.value as 'single' | 'multiple' })}
              className="h-9 text-sm rounded-lg border bg-background px-3"
              disabled={isLoading}
            >
              <option value="single">Single</option>
              <option value="multiple">Multiple</option>
            </select>
            <label className="flex items-center gap-2 text-sm px-3 bg-secondary/30 rounded-lg">
              <input
                type="checkbox"
                checked={newCustomGroup.required}
                onChange={(e) => setNewCustomGroup({ ...newCustomGroup, required: e.target.checked })}
                disabled={isLoading}
                className="h-4 w-4"
              />
              Required
            </label>
            <Button
              size="sm"
              variant="secondary"
              onClick={addCustomizationGroup}
              className="h-9 px-3 rounded-lg"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" /> Add Group
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-9 rounded-lg text-sm px-4"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-9 rounded-lg text-sm px-6 gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <>
      <div className="py-3 px-3 group flex items-start gap-4 hover:bg-secondary/20 rounded-xl transition-all duration-200">
        {/* Image Carousel */}
        {item.images && item.images.length > 0 ? (
          <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-border/50 group/image">
            <Image 
              src={item.images[imageIndex]} 
              alt={item.name} 
              fill 
              className="object-cover"
            />
            
            {/* Image Counter */}
            {item.images.length > 1 && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                {imageIndex + 1}/{item.images.length}
              </div>
            )}

            {/* Navigation Arrows */}
            {item.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </>
            )}

            {/* Image indicator dots */}
            {item.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5">
                {item.images.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className={cn(
                      'h-1 w-1 rounded-full transition-all',
                      idx === imageIndex ? 'bg-white w-2' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-secondary/30 border-2 border-dashed border-border flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}

        {/* Item details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{item.name}</span>
            
            {/* Status Badge */}
            {!item.isAvailable && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Unavailable
              </span>
            )}
            
            {/* Dietary Icons */}
            {item.isVegetarian && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded-full">
                <Sprout className="h-2.5 w-2.5" /> Veg
              </span>
            )}
            {item.isVegan && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full">
                <Leaf className="h-2.5 w-2.5" /> Vegan
              </span>
            )}
            {item.isGlutenFree && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 px-1.5 py-0.5 rounded-full">
                <WheatOff className="h-2.5 w-2.5" /> GF
              </span>
            )}
            {item.isPopular && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-full">
                <Star className="h-2.5 w-2.5 fill-amber-500" /> Popular
              </span>
            )}
            {item.discountPercentage > 0 && (
              <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                -{item.discountPercentage}%
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
          )}

          {/* Price & Details */}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-base font-bold text-primary">{formatPrice(item.price)}</span>
            {item.originalPrice > 0 && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>
            )}
            
            {/* Details Tags */}
            {item.preparationTime && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 bg-secondary px-2 py-0.5 rounded-full">
                <Clock className="h-2.5 w-2.5" />
                {item.preparationTime}m
              </span>
            )}
            {item.hasLimitedStock && item.stockQuantity > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 bg-secondary px-2 py-0.5 rounded-full">
                <Package className="h-2.5 w-2.5" />
                {item.stockQuantity} left
              </span>
            )}
            {item.customizationOptions && item.customizationOptions.length > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 bg-secondary px-2 py-0.5 rounded-full">
                <UtensilsCrossed className="h-2.5 w-2.5" />
                Customizable
              </span>
            )}
            {item.containsAllergens && item.containsAllergens.length > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 bg-secondary px-2 py-0.5 rounded-full">
                <AlertCircle className="h-2.5 w-2.5" />
                {item.containsAllergens.length} allergens
              </span>
            )}
            
            {/* Nutritional Info */}
            {item.nutritionalInfo && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                {item.nutritionalInfo.calories > 0 && (
                  <span className="bg-secondary px-1.5 py-0.5 rounded-full">
                    {item.nutritionalInfo.calories} kcal
                  </span>
                )}
                {item.nutritionalInfo.protein && (
                  <span className="bg-secondary px-1.5 py-0.5 rounded-full">
                    P: {item.nutritionalInfo.protein}
                  </span>
                )}
                {item.nutritionalInfo.carbs && (
                  <span className="bg-secondary px-1.5 py-0.5 rounded-full">
                    C: {item.nutritionalInfo.carbs}
                  </span>
                )}
                {item.nutritionalInfo.fat && (
                  <span className="bg-secondary px-1.5 py-0.5 rounded-full">
                    F: {item.nutritionalInfo.fat}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Always Visible */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onStartEdit}
            className="h-8 px-2.5 rounded-lg text-xs gap-1 border-muted hover:border-primary hover:bg-primary/5"
            disabled={isLoading}
          >
            <Edit className="h-3.5 w-3.5" />
           
          </Button>
          <Button
            size="sm"
            variant={item.isAvailable ? "outline" : "default"}
            onClick={() => onToggleAvailability(item.id)}
            className={cn(
              'h-8 px-2.5 rounded-lg text-xs gap-1',
              item.isAvailable
                ? 'border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-500'
                : 'bg-muted-foreground/20 hover:bg-muted-foreground/30 text-foreground'
            )}
            disabled={isLoading}
          >
            {item.isAvailable ? (
              <>
                <Eye className="h-3.5 w-3.5" />
               
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Hidden
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => setShowDeleteDialog(true)}
            className="h-8 px-2.5 rounded-lg text-xs gap-1"
            disabled={isLoading}
          >
            <Trash2 className="h-3.5 w-3.5" />
           
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Delete Food Item
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{item.name}"?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3">
            <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete the item
                and remove it from your menu.
              </p>
            </div>

            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
              <div className="flex-1">
                <p className="text-xs font-medium">Item Name</p>
                <p className="text-sm font-semibold">{item.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">Price</p>
                <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              className="gap-2"
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleDelete}
              className="gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Item
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}