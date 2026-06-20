// components/onboarding/multi-form/Step4Menu.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowRight, ArrowLeft, Utensils, Tag } from 'lucide-react';
import type { OnboardingFormData, MenuCategory, MenuItem } from '@/types/restaurants';

interface Step4MenuProps {
  data: Partial<OnboardingFormData>;
  onNext: (data: Partial<OnboardingFormData>) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function Step4Menu({ data, onNext, onBack, isLoading }: Step4MenuProps) {
  const [categories, setCategories] = useState<MenuCategory[]>(
    data?.menu?.categories || []
  );

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: `cat_${Date.now()}`,
        name: '',
        displayOrder: categories.length + 1,
        items: [],
      },
    ]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof MenuCategory, value: any) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const addItem = (categoryIndex: number) => {
    const updated = [...categories];
    updated[categoryIndex].items.push({
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      images: [],
      category: updated[categoryIndex].name,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      containsAllergens: [],
      isAvailable: true,
      isPopular: false,
      preparationTime: 15,
      customizationOptions: [],
      rating: 0,
      numberOfRatings: 0,
    });
    setCategories(updated);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const updated = [...categories];
    updated[categoryIndex].items = updated[categoryIndex].items.filter((_, i) => i !== itemIndex);
    setCategories(updated);
  };

  const updateItem = (categoryIndex: number, itemIndex: number, field: keyof MenuItem, value: any) => {
    const updated = [...categories];
    updated[categoryIndex].items[itemIndex] = {
      ...updated[categoryIndex].items[itemIndex],
      [field]: value,
    };
    setCategories(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      menu: { categories },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Add your menu categories and items</p>
        </div>
        <Button
          type="button"
          onClick={addCategory}
          disabled={isLoading}
          className="h-12 px-6 gap-2"
        >
          <Plus className="w-5 h-5" /> Add Category
        </Button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {categories.length === 0 && (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium">No categories yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Category" to start building your menu</p>
          </div>
        )}

        {categories.map((category, catIdx) => (
          <div key={category.id} className="border rounded-xl p-6 space-y-4 bg-card">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-base font-semibold">Category Name</Label>
                <Input
                  className="mt-1 h-12 text-lg"
                  placeholder="e.g., Appetizers"
                  value={category.name}
                  onChange={(e) => updateCategory(catIdx, 'name', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-12 w-12 mt-6"
                onClick={() => removeCategory(catIdx)}
                disabled={isLoading}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {category.items.map((item, itemIdx) => (
                <div key={item.id} className="border-l-4 border-primary/30 pl-4 space-y-3 bg-muted/10 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium">Item Name</Label>
                        <Input
                          className="mt-1 h-10"
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => updateItem(catIdx, itemIdx, 'name', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Price ($)</Label>
                        <Input
                          className="mt-1 h-10"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.price || ''}
                          onChange={(e) => updateItem(catIdx, itemIdx, 'price', parseFloat(e.target.value) || 0)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-10 w-10 mt-6"
                      onClick={() => removeItem(catIdx, itemIdx)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea
                      className="mt-1"
                      placeholder="Describe the item"
                      value={item.description}
                      onChange={(e) => updateItem(catIdx, itemIdx, 'description', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isVegetarian}
                        onChange={(e) => updateItem(catIdx, itemIdx, 'isVegetarian', e.target.checked)}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="text-green-600">🌱 Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isVegan}
                        onChange={(e) => updateItem(catIdx, itemIdx, 'isVegan', e.target.checked)}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="text-green-700">🌿 Vegan</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isGlutenFree}
                        onChange={(e) => updateItem(catIdx, itemIdx, 'isGlutenFree', e.target.checked)}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="text-yellow-600">🚫 Gluten Free</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isPopular}
                        onChange={(e) => updateItem(catIdx, itemIdx, 'isPopular', e.target.checked)}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="text-red-500">⭐ Popular</span>
                    </label>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full h-10 gap-2"
                onClick={() => addItem(catIdx)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" /> Add Item to "{category.name || 'Category'}"
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          size="lg" 
          className="h-14 px-8 text-lg gap-2"
          onClick={onBack} 
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          className="h-14 px-8 text-lg gap-2"
          disabled={isLoading || categories.length === 0}
        >
          Review & Submit <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}