// app/api/menu/item/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

// POST - Add a new menu item
export async function POST(request: NextRequest) {
  try {
    const { restaurantId, categoryId, ...itemData } = await request.json();

    if (!restaurantId || !categoryId) {
      return NextResponse.json(
        { error: 'Restaurant ID and category ID are required' },
        { status: 400 }
      );
    }

    const itemId = `item_${uuidv4()}`;
    
    // Create the full item object with all fields
    const newItem = {
      id: itemId,
      name: itemData.name || '',
      description: itemData.description || '',
      price: itemData.price || 0,
      originalPrice: itemData.originalPrice || 0,
      discountPercentage: itemData.discountPercentage || 0,
      images: itemData.images || [],
      category: categoryId,
      isVegetarian: itemData.isVegetarian || false,
      isVegan: itemData.isVegan || false,
      isGlutenFree: itemData.isGlutenFree || false,
      containsAllergens: itemData.containsAllergens || [],
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : true,
      isPopular: itemData.isPopular || false,
      preparationTime: itemData.preparationTime || 15,
      customizationOptions: itemData.customizationOptions || [],
      nutritionalInfo: itemData.nutritionalInfo || {
        calories: 0,
        protein: '',
        carbs: '',
        fat: '',
      },
      costToMake: itemData.costToMake || 0,
      profitMargin: itemData.profitMargin || 0,
      hasLimitedStock: itemData.hasLimitedStock || false,
      stockQuantity: itemData.stockQuantity || 0,
      rating: 0,
      numberOfRatings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if category exists
    const categoryRef = adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .doc(categoryId);

    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Store item in subcollection
    const itemRef = categoryRef.collection('items').doc(itemId);
    await itemRef.set(newItem);

    // Also maintain the items array in the category document
    const categoryData = categoryDoc.data();
    await categoryRef.update({
      items: [...(categoryData?.items || []), newItem],
      updatedAt: new Date(),
      itemCount: (categoryData?.itemCount || 0) + 1,
    });

    // Update lastUpdated in main menu document
    const menuRef = adminDb.collection('menus').doc(restaurantId);
    await menuRef.update({
      lastUpdated: new Date(),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add item' },
      { status: 500 }
    );
  }
}

// GET - Fetch items from a category
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const restaurantId = searchParams.get('restaurantId');
    const categoryId = searchParams.get('categoryId');
    const itemId = searchParams.get('itemId');

    if (!restaurantId || !categoryId) {
      return NextResponse.json(
        { error: 'Restaurant ID and category ID are required' },
        { status: 400 }
      );
    }

    const categoryRef = adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .doc(categoryId);

    if (itemId) {
      const itemRef = categoryRef.collection('items').doc(itemId);
      const itemDoc = await itemRef.get();

      if (!itemDoc.exists) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(itemDoc.data());
    } else {
      const itemsSnapshot = await categoryRef
        .collection('items')
        .orderBy('createdAt', 'desc')
        .get();

      const items = itemsSnapshot.docs.map(doc => doc.data());
      return NextResponse.json(items);
    }
  } catch (error: any) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// PATCH - Update a menu item
export async function PATCH(request: NextRequest) {
  try {
    const { restaurantId, categoryId, itemId, ...data } = await request.json();

    if (!restaurantId || !categoryId || !itemId) {
      return NextResponse.json(
        { error: 'Restaurant ID, category ID, and item ID are required' },
        { status: 400 }
      );
    }

    const itemRef = adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .doc(categoryId)
      .collection('items')
      .doc(itemId);

    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Build update data with all possible fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.discountPercentage !== undefined) updateData.discountPercentage = data.discountPercentage;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.isVegetarian !== undefined) updateData.isVegetarian = data.isVegetarian;
    if (data.isVegan !== undefined) updateData.isVegan = data.isVegan;
    if (data.isGlutenFree !== undefined) updateData.isGlutenFree = data.isGlutenFree;
    if (data.containsAllergens !== undefined) updateData.containsAllergens = data.containsAllergens;
    if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
    if (data.isPopular !== undefined) updateData.isPopular = data.isPopular;
    if (data.preparationTime !== undefined) updateData.preparationTime = data.preparationTime;
    if (data.customizationOptions !== undefined) updateData.customizationOptions = data.customizationOptions;
    if (data.nutritionalInfo !== undefined) updateData.nutritionalInfo = data.nutritionalInfo;
    if (data.costToMake !== undefined) updateData.costToMake = data.costToMake;
    if (data.profitMargin !== undefined) updateData.profitMargin = data.profitMargin;
    if (data.hasLimitedStock !== undefined) updateData.hasLimitedStock = data.hasLimitedStock;
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;

    await itemRef.update(updateData);

    // Also update the items array in the category document
    const categoryRef = adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .doc(categoryId);

    const categoryDoc = await categoryRef.get();
    const categoryData = categoryDoc.data();

    if (categoryData?.items) {
      const updatedItems = categoryData.items.map((item: any) => {
        if (item.id === itemId) {
          return { ...item, ...updateData };
        }
        return item;
      });

      await categoryRef.update({
        items: updatedItems,
        updatedAt: new Date(),
      });
    }

    // Update lastUpdated in main menu document
    const menuRef = adminDb.collection('menus').doc(restaurantId);
    await menuRef.update({
      lastUpdated: new Date(),
    });

    const updatedItem = await itemRef.get();
    return NextResponse.json(updatedItem.data());
  } catch (error: any) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a menu item
export async function DELETE(request: NextRequest) {
  try {
    const { restaurantId, categoryId, itemId } = await request.json();

    if (!restaurantId || !categoryId || !itemId) {
      return NextResponse.json(
        { error: 'Restaurant ID, category ID, and item ID are required' },
        { status: 400 }
      );
    }

    // Delete from subcollection
    const itemRef = adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .doc(categoryId)
      .collection('items')
      .doc(itemId);

    await itemRef.delete();

    // Also remove from the items array in the category document
    const categoryRef = adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .doc(categoryId);

    const categoryDoc = await categoryRef.get();
    const categoryData = categoryDoc.data();

    if (categoryData?.items) {
      const updatedItems = categoryData.items.filter(
        (item: any) => item.id !== itemId
      );

      await categoryRef.update({
        items: updatedItems,
        updatedAt: new Date(),
        itemCount: Math.max((categoryData?.itemCount || 1) - 1, 0),
      });
    }

    // Update lastUpdated in main menu document
    const menuRef = adminDb.collection('menus').doc(restaurantId);
    await menuRef.update({
      lastUpdated: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}