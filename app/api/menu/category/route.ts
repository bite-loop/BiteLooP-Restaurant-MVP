// app/api/menu/category/route.ts
import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// POST create a new category as a subcollection document
export async function POST(request: NextRequest) {
    try {
        const { restaurantId, name, description } = await request.json();

        if (!restaurantId || !name) {
            return NextResponse.json(
                { error: "Restaurant ID and category name are required" },
                { status: 400 }
            );
        }

        const categoryId = `cat_${uuidv4()}`;
        
        // Create category document in subcollection
        const categoryRef = adminDb
            .collection('menus')
            .doc(restaurantId)
            .collection('categories')
            .doc(categoryId);

        const category = {
            id: categoryId,
            name,
            description: description || '',
            displayOrder: 0,
            items: [],
            itemCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await categoryRef.set(category);

        // Also update the main menu document to track categories
        const menuRef = adminDb.collection('menus').doc(restaurantId);
        const menuDoc = await menuRef.get();

        if (menuDoc.exists) {
            const menuData = menuDoc.data();
            // Update the categories array in the main document for backward compatibility
            await menuRef.update({
                categories: [...(menuData?.categories || []), category],
                lastUpdated: new Date(),
            });
        } else {
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
        );
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

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

        await categoryRef.update(updateData);

        // Also update in the main menu document's categories array
        const menuRef = adminDb.collection('menus').doc(restaurantId);
        const menuDoc = await menuRef.get();
        const menuData = menuDoc.data();

        if (menuData?.categories) {
            const updatedCategories = menuData.categories.map((cat: any) => {
                if (cat.id === categoryId) {
                    return { ...cat, ...updateData };
                }
                return cat;
            });

            await menuRef.update({
                categories: updatedCategories,
                lastUpdated: new Date(),
            });
        }

        const updatedCategory = await categoryRef.get();
        return NextResponse.json(updatedCategory.data());

    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: error.message || "Failed to update category" },
            { status: 500 }
        );
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

        // Delete the category document and all its items
        const categoryRef = adminDb
            .collection('menus')
            .doc(restaurantId)
            .collection('categories')
            .doc(categoryId);

        // Delete all items in the category's items subcollection
        const itemsSnapshot = await categoryRef.collection('items').get();
        const batch = adminDb.batch();
        itemsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Delete the category document
        await categoryRef.delete();

        // Remove from the main menu document's categories array
        const menuRef = adminDb.collection('menus').doc(restaurantId);
        const menuDoc = await menuRef.get();
        const menuData = menuDoc.data();

        if (menuData?.categories) {
            const updatedCategories = menuData.categories.filter(
                (cat: any) => cat.id !== categoryId
            );

            await menuRef.update({
                categories: updatedCategories,
                lastUpdated: new Date(),
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete category' },
            { status: 500 }
        );
    }
}

// GET - Fetch all categories or a single category
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const restaurantId = searchParams.get('restaurantId');
        const categoryId = searchParams.get('categoryId');

        if (!restaurantId) {
            return NextResponse.json(
                { error: 'Restaurant ID is required' },
                { status: 400 }
            );
        }

        if (categoryId) {
            // Get single category with its items
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

            const categoryData = categoryDoc.data();
            
            // Fetch items for this category
            const itemsSnapshot = await categoryRef
                .collection('items')
                .orderBy('createdAt', 'desc')
                .get();

            const items = itemsSnapshot.docs.map(doc => doc.data());
            
            return NextResponse.json({
                ...categoryData,
                items,
            });
        } else {
            // Get all categories with their items
            const categoriesSnapshot = await adminDb
                .collection('menus')
                .doc(restaurantId)
                .collection('categories')
                .orderBy('displayOrder')
                .get();

            const categoriesWithItems = await Promise.all(
                categoriesSnapshot.docs.map(async (doc) => {
                    const categoryData = doc.data();
                    const itemsSnapshot = await doc.ref
                        .collection('items')
                        .orderBy('createdAt', 'desc')
                        .get();
                    const items = itemsSnapshot.docs.map(itemDoc => itemDoc.data());
                    return {
                        ...categoryData,
                        items,
                    };
                })
            );

            return NextResponse.json(categoriesWithItems);
        }
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}