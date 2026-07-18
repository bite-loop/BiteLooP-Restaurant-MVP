// api/menu/category/route.ts
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
            items: [], // This will be managed in a separate subcollection
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await categoryRef.set(category);

        // Also update the main menu document to track lastUpdated
        const menuRef = adminDb.collection('menus').doc(restaurantId);
        await menuRef.set({
            restaurantId,
            lastUpdated: new Date(),
        }, { merge: true });

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

        // Update lastUpdated in main menu document
        const menuRef = adminDb.collection('menus').doc(restaurantId);
        await menuRef.update({
            lastUpdated: new Date(),
        });

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

        // Delete the category document
        const categoryRef = adminDb
            .collection('menus')
            .doc(restaurantId)
            .collection('categories')
            .doc(categoryId);

        await categoryRef.delete();

        // Update lastUpdated in main menu document
        const menuRef = adminDb.collection('menus').doc(restaurantId);
        await menuRef.update({
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
            // Get single category
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

            return NextResponse.json(categoryDoc.data());
        } else {
            // Get all categories
            const categoriesSnapshot = await adminDb
                .collection('menus')
                .doc(restaurantId)
                .collection('categories')
                .orderBy('displayOrder')
                .get();

            const categories = categoriesSnapshot.docs.map(doc => doc.data());
            return NextResponse.json(categories);
        }
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}