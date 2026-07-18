// app/api/menu/item/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

// POST - Add a new menu item to a category subcollection
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
    const newItem = {
      id: itemId,
      ...itemData,
      category: categoryId,
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

    // Option 1: Store items as a subcollection of the category
    const itemRef = categoryRef.collection('items').doc(itemId);
    await itemRef.set(newItem);

    // Option 2: Also maintain the items array in the category document for easier querying
    // (Use this if you want to keep backward compatibility)
    const categoryData = categoryDoc.data();
    await categoryRef.update({
      items: [...(categoryData?.items || []), newItem],
      updatedAt: new Date(),
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
      // Get single item from subcollection
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
      // Get all items from subcollection
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

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await itemRef.update(updateData);

    // Also update the items array in the category document if you're maintaining it
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
          return { ...item, ...data, updatedAt: new Date() };
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

    // Also remove from the items array in the category document if you're maintaining it
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