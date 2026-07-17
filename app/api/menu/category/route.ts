import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
// POST create a new category 
export async function  POST(request:NextRequest) {
    try {
      const {restaurantId, name, description} = await request.json() 

      if (!restaurantId || !name) {
         return NextResponse.json(
            {error: "Restaurant ID and category name are required"},
            {status: 400}
         )
      }

      const categoryId = `cat_${uuidv4()}`
       const category = {
      id: categoryId,
      name,
      description: description || '',
      displayOrder: 0,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const menuRef = adminDb.collection('menus').doc(restaurantId);
    const menuDoc = await menuRef.get()
    const menuData = menuDoc.data();
    if (menuDoc.exists && menuData?.categories) {
      // Add to existing categories
      const categories = [...menuData.categories, category];
      await menuRef.update({
        categories,
        lastUpdated: new Date(),
      });
    } else {
      // Create new menu document
      await menuRef.set({
        restaurantId,
        categories: [category],
        lastUpdated: new Date(),
      });
    }
     return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create category' },
        { status: 500 }
      )
    }
}

// PATCH - Update a category
export async function PATCH(request: NextRequest) {
    try {
       const { restaurantId, categoryId, name, description, displayOrder } = await request.json();

      if (!restaurantId || !categoryId) {
       return NextResponse.json(
         { error: 'Restaurant ID and category ID are required' },
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
     const updatedCategories = menuData.categories.map((cat: any) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          name: name || cat.name,
          description: description !== undefined ? description : cat.description,
          displayOrder: displayOrder !== undefined ? displayOrder : cat.displayOrder,
          updatedAt: new Date(),
        };
      }
      return cat;
    });
    await menuRef.update({
      categories: updatedCategories,
      lastUpdated: new Date(),

    })
   const updatedCategory = updatedCategories.find((c: any) => c.id === categoryId);
    return NextResponse.json(updatedCategory);

    } catch (error: any) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        {error: error.message || "Failed to update category"},
        {status: 500}
      )
    }
}

// DELETE - Remove a category
export async function DELETE(request: NextRequest) {
  try {
    const { restaurantId, categoryId } = await request.json();

    if (!restaurantId || !categoryId) {
      return NextResponse.json(
        { error: 'Restaurant ID and category ID are required' },
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

    const updatedCategories = menuData.categories.filter(
      (cat: any) => cat.id !== categoryId
    );

    await menuRef.update({
      categories: updatedCategories,
      lastUpdated: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}