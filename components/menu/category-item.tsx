// components/menu/category-item.tsx
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Upload,
  Image as ImageIcon,
  Package,
  AlertCircle,
  DollarSign,
  Percent,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MenuItemRow } from './menu-item-row';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MENUGUIDE } from '@/public/image/image';

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

interface CustomizationOption {
  id: string;
  name: string;
  additionalPrice: number;
  isDefault?: boolean;
}

interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showImageInstructions, setShowImageInstructions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuthStore();
  const restaurantId = user?.id;

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    images: [] as string[],
    imageFiles: [] as File[],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    containsAllergens: [] as string[],
    isAvailable: true,
    isPopular: false,
    preparationTime: 15,
    customizationOptions: [] as CustomizationGroup[],
    nutritionalInfo: {
      calories: 0,
      protein: '',
      carbs: '',
      fat: '',
    },
    costToMake: 0,
    profitMargin: 0,
    hasLimitedStock: false,
    stockQuantity: 0,
  });

  const [newAllergen, setNewAllergen] = useState('');
  const [newCustomGroup, setNewCustomGroup] = useState<CustomizationGroup>({
    id: `cg_${Date.now()}`,
    name: '',
    type: 'single',
    required: false,
    options: [],
  });
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const [newOption, setNewOption] = useState({ name: '', additionalPrice: 0, isDefault: false });

  const handleImageUpload = async (files: FileList) => {
    if (!restaurantId) {
      toast.error('Restaurant ID not found');
      return;
    }

    setUploadingImages(true);
    const newFiles = Array.from(files);
    const imageUrls: string[] = [];
    const newImageFiles: File[] = [];

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('restaurantId', restaurantId);
        formData.append('type', 'menu-item');

        const response = await fetch('/api/onboarding/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        imageUrls.push(data.imageUrl);
        newImageFiles.push(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setNewItem(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
      imageFiles: [...prev.imageFiles, ...newImageFiles],
    }));
    setUploadingImages(false);
    if (imageUrls.length > 0) {
      toast.success(`${imageUrls.length} image(s) uploaded!`);
    }
  };

  const removeImage = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const addAllergen = () => {
    if (newAllergen.trim()) {
      setNewItem(prev => ({
        ...prev,
        containsAllergens: [...prev.containsAllergens, newAllergen.trim()],
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      containsAllergens: prev.containsAllergens.filter((_, i) => i !== index),
    }));
  };

  const addCustomizationGroup = () => {
    if (newCustomGroup.name.trim()) {
      setNewItem(prev => ({
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
      setEditingGroupIndex(null);
    }
  };

  const addOptionToGroup = (groupIndex: number) => {
    if (newOption.name.trim()) {
      const updatedGroups = [...newItem.customizationOptions];
      updatedGroups[groupIndex].options.push({
        id: `opt_${Date.now()}`,
        name: newOption.name,
        additionalPrice: newOption.additionalPrice,
        isDefault: newOption.isDefault,
      });
      setNewItem(prev => ({ ...prev, customizationOptions: updatedGroups }));
      setNewOption({ name: '', additionalPrice: 0, isDefault: false });
    }
  };

  const removeOption = (groupIndex: number, optionIndex: number) => {
    const updatedGroups = [...newItem.customizationOptions];
    updatedGroups[groupIndex].options.splice(optionIndex, 1);
    setNewItem(prev => ({ ...prev, customizationOptions: updatedGroups }));
  };

  const removeCustomizationGroup = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      customizationOptions: prev.customizationOptions.filter((_, i) => i !== index),
    }));
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || newItem.price <= 0) {
      toast.error('Item name and price are required');
      return;
    }

    setIsLoading(true);
    try {
      let discountPercentage = newItem.discountPercentage;
      if (newItem.originalPrice > 0 && newItem.price > 0) {
        discountPercentage = Math.round(((newItem.originalPrice - newItem.price) / newItem.originalPrice) * 100);
      }

      await onAddItem(category.id, {
        ...newItem,
        discountPercentage,
        imageFiles: undefined,
      });
      
      setNewItem({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        discountPercentage: 0,
        images: [],
        imageFiles: [],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        containsAllergens: [],
        isAvailable: true,
        isPopular: false,
        preparationTime: 15,
        customizationOptions: [],
        nutritionalInfo: {
          calories: 0,
          protein: '',
          carbs: '',
          fat: '',
        },
        costToMake: 0,
        profitMargin: 0,
        hasLimitedStock: false,
        stockQuantity: 0,
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
    } catch (error) {
      toast.error('Failed to toggle availability');
      console.error('Toggle availability error:', error);
    }
  };

  const itemCount = category.items?.length || 0;

  // Sample instruction image URL - replace with your actual image
  const instructionImageUrl = '/images/menu-item-guide.jpg';

  return (
    <>
      <Card className={cn('rounded-xl border shadow-sm transition-all duration-200 overflow-hidden', isExpanded && 'border-primary/30 shadow-md')}>
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-secondary/5 hover:bg-secondary/10 transition-colors">
            <button
              onClick={onToggle}
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all hover:bg-secondary',
                isExpanded && 'rotate-180'
              )}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
              {isEditing ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-8 text-sm max-w-[200px] rounded-lg"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 rounded-lg text-green-600 hover:bg-green-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate(category.id);
                    }}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelEdit();
                    }}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold">{category.name}</span>
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddItem(!showAddItem)}
                className={cn('h-8 rounded-lg text-xs font-medium gap-1.5 px-3', showAddItem && 'bg-secondary')}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onStartEdit}
                className="h-8 w-8 p-0 rounded-lg"
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
                    onDelete(category.id);
                  }
                }}
                className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="px-4 pb-4 pt-3 ">
              {/* Add Item Form - Full Version */}
              {showAddItem && (
                <div className="mb-4 px-4 py-4 rounded-xl bg-secondary/30 border shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Plus className="h-4 w-4" />
                      </span>
                      New Menu Item
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAddItem(false)}
                      className="h-8 w-8 p-0 rounded-lg"
                      disabled={isLoading || uploadingImages}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-5">
                      {/* Name & Price */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">
                            Item Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            placeholder="Enter item name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-10 text-sm rounded-lg"
                            disabled={isLoading || uploadingImages}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">
                            Price <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newItem.price || ''}
                              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                              className="h-10 text-sm rounded-lg pl-7"
                              disabled={isLoading || uploadingImages}
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
                              placeholder="0.00"
                              value={newItem.originalPrice || ''}
                              onChange={(e) => setNewItem({ ...newItem, originalPrice: parseFloat(e.target.value) || 0 })}
                              className="h-10 text-sm rounded-lg pl-7"
                              disabled={isLoading || uploadingImages}
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
                              placeholder="0"
                              value={newItem.discountPercentage || ''}
                              onChange={(e) => setNewItem({ ...newItem, discountPercentage: parseFloat(e.target.value) || 0 })}
                              className="h-10 text-sm rounded-lg pl-7"
                              disabled={isLoading || uploadingImages}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Description</Label>
                        <Textarea
                          placeholder="Brief description of the item"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="min-h-[90px] text-sm rounded-lg resize-none"
                          disabled={isLoading || uploadingImages}
                        />
                      </div>

                      {/* Allergens */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Allergens</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {newItem.containsAllergens.map((allergen: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
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
                              disabled={isLoading || uploadingImages}
                            />
                            <Button size="sm" variant="secondary" onClick={addAllergen} className="h-9 px-3 rounded-lg">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                      {/* Images with Instructions */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium">Images (Max 3)</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowImageInstructions(true)}
                            className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-primary"
                          >
                            <Info className="h-3.5 w-3.5" />
                            Guide
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {newItem.images.map((img: string, index: number) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 group">
                              <Image src={img} alt={`Item ${index + 1}`} fill className="object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-destructive/90 text-white rounded-full hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                                disabled={isLoading || uploadingImages}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {newItem.images.length < 3 && (
                            <div
                              onClick={() => !uploadingImages && fileInputRef.current?.click()}
                              className={cn(
                                'aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5',
                                uploadingImages && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              {uploadingImages ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                              ) : (
                                <>
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                  <span className="text-[10px] text-muted-foreground mt-1">Upload</span>
                                </>
                              )}
                            </div>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) handleImageUpload(e.target.files);
                              e.target.value = '';
                            }}
                            className="hidden"
                            disabled={isLoading || uploadingImages || newItem.images.length >= 3}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {newItem.images.length}/3 images • Max 5MB each
                        </p>
                      </div>

                      {/* Dietary Tags */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Dietary & Labels</Label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setNewItem({ ...newItem, isVegetarian: !newItem.isVegetarian })}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                              newItem.isVegetarian
                                ? 'bg-green-500/10 text-green-600 border-green-500/30'
                                : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
                            )}
                            disabled={isLoading || uploadingImages}
                          >
                            <Sprout className="h-3.5 w-3.5" /> Vegetarian
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewItem({ ...newItem, isVegan: !newItem.isVegan })}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                              newItem.isVegan
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
                            )}
                            disabled={isLoading || uploadingImages}
                          >
                            <Leaf className="h-3.5 w-3.5" /> Vegan
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewItem({ ...newItem, isGlutenFree: !newItem.isGlutenFree })}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                              newItem.isGlutenFree
                                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                                : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
                            )}
                            disabled={isLoading || uploadingImages}
                          >
                            <WheatOff className="h-3.5 w-3.5" /> Gluten Free
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewItem({ ...newItem, isPopular: !newItem.isPopular })}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                              newItem.isPopular
                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                                : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
                            )}
                            disabled={isLoading || uploadingImages}
                          >
                            <Star className="h-3.5 w-3.5" /> Popular
                          </button>
                          <div className="inline-flex items-center gap-2 rounded-lg border border-muted px-3 py-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <input
                              type="number"
                              value={newItem.preparationTime}
                              onChange={(e) => setNewItem({ ...newItem, preparationTime: parseInt(e.target.value) || 15 })}
                              className="w-10 bg-transparent text-sm font-medium outline-none text-center"
                              min="1"
                              disabled={isLoading || uploadingImages}
                            />
                            <span className="text-xs text-muted-foreground">min</span>
                          </div>
                        </div>
                      </div>

                      {/* Preparation Time & Stock */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5">
                          <Switch
                            checked={newItem.hasLimitedStock}
                            onCheckedChange={(checked) => setNewItem({ ...newItem, hasLimitedStock: checked })}
                            disabled={isLoading || uploadingImages}
                          />
                          <span className="text-xs font-medium">Limited stock</span>
                        </div>
                        {newItem.hasLimitedStock && (
                          <div className="flex items-center gap-1.5">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={newItem.stockQuantity || ''}
                              onChange={(e) => setNewItem({ ...newItem, stockQuantity: parseInt(e.target.value) || 0 })}
                              className="h-9 w-20 text-sm rounded-lg"
                              placeholder="Qty"
                              disabled={isLoading || uploadingImages}
                            />
                          </div>
                        )}
                      </div>

                      {/* Nutritional Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Calories</Label>
                          <Input
                            type="number"
                            value={newItem.nutritionalInfo?.calories || ''}
                            onChange={(e) => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                calories: parseInt(e.target.value) || 0,
                              }
                            })}
                            className="h-9 text-sm rounded-lg"
                            placeholder="kcal"
                            disabled={isLoading || uploadingImages}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Protein</Label>
                          <Input
                            value={newItem.nutritionalInfo?.protein || ''}
                            onChange={(e) => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                protein: e.target.value,
                              }
                            })}
                            className="h-9 text-sm rounded-lg"
                            placeholder="e.g. 20g"
                            disabled={isLoading || uploadingImages}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Carbs</Label>
                          <Input
                            value={newItem.nutritionalInfo?.carbs || ''}
                            onChange={(e) => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                carbs: e.target.value,
                              }
                            })}
                            className="h-9 text-sm rounded-lg"
                            placeholder="e.g. 35g"
                            disabled={isLoading || uploadingImages}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Fat</Label>
                          <Input
                            value={newItem.nutritionalInfo?.fat || ''}
                            onChange={(e) => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                fat: e.target.value,
                              }
                            })}
                            className="h-9 text-sm rounded-lg"
                            placeholder="e.g. 12g"
                            disabled={isLoading || uploadingImages}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Width Section - Cost & Profit */}
                  <div className="mt-6 grid grid-cols-2 gap-4 pt-5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Cost to Make</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={newItem.costToMake || ''}
                          onChange={(e) => setNewItem({ ...newItem, costToMake: parseFloat(e.target.value) || 0 })}
                          className="h-9 text-sm rounded-lg pl-7"
                          disabled={isLoading || uploadingImages}
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
                          value={newItem.profitMargin || ''}
                          onChange={(e) => setNewItem({ ...newItem, profitMargin: parseFloat(e.target.value) || 0 })}
                          className="h-9 text-sm rounded-lg pl-7"
                          disabled={isLoading || uploadingImages}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customization Options - Full Width */}
                  <div className="mt-4 space-y-3  pt-5">
                    <Label className="text-xs font-medium">Customization Options</Label>
                    {newItem.customizationOptions.map((group: CustomizationGroup, gIndex: number) => (
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
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            disabled={isLoading || uploadingImages}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {group.options.map((opt: CustomizationOption, oIndex: number) => (
                            <div key={oIndex} className="flex items-center justify-between text-sm py-1 px-2 hover:bg-secondary/50 rounded-md">
                              <span>{opt.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-xs">+${opt.additionalPrice.toFixed(2)}</span>
                                {opt.isDefault && <span className="text-[10px] text-green-600 font-medium">Default</span>}
                                <button
                                  type="button"
                                  onClick={() => removeOption(gIndex, oIndex)}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                  disabled={isLoading || uploadingImages}
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
                            disabled={isLoading || uploadingImages}
                          />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={newOption.additionalPrice || ''}
                            onChange={(e) => setNewOption({ ...newOption, additionalPrice: parseFloat(e.target.value) || 0 })}
                            className="h-8 text-sm w-24 rounded-lg"
                            disabled={isLoading || uploadingImages}
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => addOptionToGroup(gIndex)}
                            className="h-8 px-3 rounded-lg"
                            disabled={isLoading || uploadingImages}
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
                        disabled={isLoading || uploadingImages}
                      />
                      <select
                        value={newCustomGroup.type}
                        onChange={(e) => setNewCustomGroup({ ...newCustomGroup, type: e.target.value as 'single' | 'multiple' })}
                        className="h-9 text-sm rounded-lg border bg-background px-3"
                        disabled={isLoading || uploadingImages}
                      >
                        <option value="single">Single</option>
                        <option value="multiple">Multiple</option>
                      </select>
                      <label className="flex items-center gap-2 text-sm px-3 bg-secondary/30 rounded-lg">
                        <input
                          type="checkbox"
                          checked={newCustomGroup.required}
                          onChange={(e) => setNewCustomGroup({ ...newCustomGroup, required: e.target.checked })}
                          disabled={isLoading || uploadingImages}
                          className="h-4 w-4"
                        />
                        Required
                      </label>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={addCustomizationGroup}
                        className="h-9 px-3 rounded-lg"
                        disabled={isLoading || uploadingImages}
                      >
                        <Plus className="h-4 w-4" /> Add Group
                      </Button>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mt-5 flex items-center gap-3 pt-1  pt-4">
                    <Switch
                      checked={newItem.isAvailable}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, isAvailable: checked })}
                      disabled={isLoading || uploadingImages}
                    />
                    <span className="text-sm font-medium">Available</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 ">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAddItem(false)}
                      className="h-9 rounded-lg text-sm px-4"
                      disabled={isLoading || uploadingImages}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddItem}
                      className="h-9 rounded-lg text-sm px-6 gap-2"
                      disabled={isLoading || uploadingImages}
                    >
                      {isLoading || uploadingImages ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          {uploadingImages ? 'Uploading...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Item
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Items List or Grid */}
              <div className={cn(
                'divide-y divide-border',
                viewMode === 'grid' && 'grid grid-cols-2 gap-3 divide-y-0'
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
                    isLoading={isLoading}
                  />
                ))}
                {category.items?.length === 0 && !showAddItem && (
                  <div className="flex flex-col items-center justify-center py-10 col-span-2">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                      <Utensils className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No items in this category</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Click Add to create your first item</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Instructions Dialog */}
      <Dialog open={showImageInstructions} onOpenChange={setShowImageInstructions}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Menu Item Image Guide
            </DialogTitle>
            <DialogDescription>
              Follow these guidelines to upload the best quality images for your menu items.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-secondary/30 rounded-lg p-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 bg-background">
                {/* Replace this with your actual instruction image */}
              {/*   <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-primary/10">
                  <ImageIcon className="h-16 w-16 text-primary/30" />
                  <p className="text-sm text-muted-foreground mt-2">Sample menu item image</p>
                  <p className="text-xs text-muted-foreground/60">(Replace with your actual guide image)</p>
                </div> */}
                <Image 
                  src={MENUGUIDE.BurgerGuide} 
                  alt="Menu item image guide" 
                  fill 
                  className="object-cover"
                /> 
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Image Requirements:</h4>
              <ul className="text-xs text-muted-foreground px-2 space-y-1.5 list-disc list-inside">
                <li>Recommended dimensions: <span className="font-medium">1080 x 1080 pixels</span> (1:1 ratio)</li>
                <li>Minimum resolution: <span className="font-medium">500 x 500 pixels</span></li>
                <li>Maximum file size: <span className="font-medium">5MB per image</span></li>
                <li>Supported formats: <span className="font-medium">JPG, PNG, WEBP</span></li>
                <li>Use high-quality, well-lit images that accurately represent the dish</li>
                <li>Avoid blurry, pixelated, or overly processed images</li>
                <li>Show the item from a flattering angle with good composition</li>
                <li>Use a clean, neutral background that doesn't distract from the food</li>
              </ul>
            </div>

          </div>

          <div className="flex justify-end mt-2">
            <Button onClick={() => setShowImageInstructions(false)} className="gap-2">
              <Check className="h-4 w-4" />
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}