// app/api/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Get the main menu document
    const menuRef = adminDb.collection('menus').doc(restaurantId);
    const menuDoc = await menuRef.get();

    if (!menuDoc.exists) {
      return NextResponse.json({
        restaurantId,
        categories: [],
        lastUpdated: null,
      });
    }

    const menuData = menuDoc.data();

    // Fetch all categories from the subcollection
    const categoriesSnapshot = await adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .orderBy('displayOrder')
      .get();

    const categories = [];

    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      
      // Fetch items for this category if you want to include them
      // Option 1: If you're storing items in the items array
      const items = categoryData.items || [];
      
      // Option 2: If you want to fetch from subcollection (uncomment this)
      // const itemsSnapshot = await adminDb
      //   .collection('menus')
      //   .doc(restaurantId)
      //   .collection('categories')
      //   .doc(categoryDoc.id)
      //   .collection('items')
      //   .orderBy('createdAt', 'desc')
      //   .get();
      // const items = itemsSnapshot.docs.map(doc => doc.data());

      categories.push({
        ...categoryData,
        items: items,
      });
    }

    return NextResponse.json({
      restaurantId,
      categories,
      lastUpdated: menuData?.lastUpdated || null,
    });
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

// POST - Create a new menu for a restaurant
export async function POST(request: NextRequest) {
  try {
    const { restaurantId } = await request.json();

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Check if menu already exists
    const menuRef = adminDb.collection('menus').doc(restaurantId);
    const menuDoc = await menuRef.get();

    if (menuDoc.exists) {
      return NextResponse.json(
        { error: 'Menu already exists for this restaurant' },
        { status: 409 }
      );
    }

    // Create new menu document
    await menuRef.set({
      restaurantId,
      lastUpdated: new Date(),
    });

    return NextResponse.json({
      restaurantId,
      categories: [],
      lastUpdated: new Date(),
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create menu' },
      { status: 500 }
    );
  }
}

// DELETE - Delete entire menu
export async function DELETE(request: NextRequest) {
  try {
    const { restaurantId } = await request.json();

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Delete all categories and their items
    const categoriesSnapshot = await adminDb
      .collection('menus')
      .doc(restaurantId)
      .collection('categories')
      .get();

    // Delete all categories and their subcollections
    const batch = adminDb.batch();
    
    for (const categoryDoc of categoriesSnapshot.docs) {
      // Delete all items in the category
      const itemsSnapshot = await adminDb
        .collection('menus')
        .doc(restaurantId)
        .collection('categories')
        .doc(categoryDoc.id)
        .collection('items')
        .get();

      for (const itemDoc of itemsSnapshot.docs) {
        batch.delete(itemDoc.ref);
      }

      batch.delete(categoryDoc.ref);
    }

    // Delete the main menu document
    const menuRef = adminDb.collection('menus').doc(restaurantId);
    batch.delete(menuRef);

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete menu' },
      { status: 500 }
    );
  }
}