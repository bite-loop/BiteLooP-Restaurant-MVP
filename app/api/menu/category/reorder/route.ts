// app/api/menu/category/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function PATCH(request: NextRequest) {
  try {
    const { restaurantId, categoryIds } = await request.json();

    if (!restaurantId || !categoryIds || !Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: 'Restaurant ID and category IDs array are required' },
        { status: 400 }
      );
    }

    const menuRef = adminDb.collection('menus').doc(restaurantId);
    const menuDoc = await menuRef.get();
    const menuData = menuDoc.data();

    if (!menuDoc.exists || !menuData?.categories) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    const updatedCategories = menuData.categories.map((cat: any) => ({
      ...cat,
      displayOrder: categoryIds.indexOf(cat.id) + 1,
      updatedAt: new Date(),
    }));

    await menuRef.update({
      categories: updatedCategories,
      lastUpdated: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error reordering categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reorder categories' },
      { status: 500 }
    );
  }
}