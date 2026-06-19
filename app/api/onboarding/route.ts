// app/api/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, businessType, onboardingStep } = body;

    console.log('Received request body:', body); // Debug log

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Verify the restaurant exists
    const restaurantDoc = await adminDb.collection('restaurants').doc(restaurantId).get();
    
    if (!restaurantDoc.exists) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Update the restaurant document
    const updateData: any = {
      businessType: businessType || 'both',
      onboardingStep: onboardingStep || 1,
      updatedAt: new Date(),
    };

    // If businessType is set, update serviceTypes accordingly
    if (businessType) {
      updateData.serviceTypes = {
        delivery: businessType === 'delivery_only' || businessType === 'both',
        dineIn: businessType === 'dine_only' || businessType === 'both',
        takeaway: businessType === 'delivery_only' || businessType === 'both',
      };
    }

    await adminDb.collection('restaurants').doc(restaurantId).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Business type updated successfully',
      data: {
        businessType,
        onboardingStep: onboardingStep || 1,
      },
    });
  } catch (error: any) {
    console.error('Error updating business type:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update business type' },
      { status: 500 }
    );
  }
}