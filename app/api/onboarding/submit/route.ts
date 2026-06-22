// app/api/onboarding/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, formData, status, submittedAt } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Verify restaurant exists
    const doc = await adminDb.collection('restaurants').doc(restaurantId).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Merge all form data into restaurant document
    const updateData: any = {
      ...formData,
      onboardingStatus: status || 'pending_approval',
      submittedAt: submittedAt || new Date().toISOString(),
      updatedAt: new Date(),
      onboardingStep: 5, // Mark as completed
      isActive: false, // Not active until approved
    };

    // If businessType is present, update serviceTypes
    if (formData?.businessType) {
      updateData.businessType = formData.businessType;
      updateData.serviceTypes = {
        delivery: formData.businessType === 'delivery_only' || formData.businessType === 'both',
        dineIn: formData.businessType === 'dine_only' || formData.businessType === 'both',
        takeaway: formData.businessType === 'delivery_only' || formData.businessType === 'both',
      };
    }

    // Update restaurant with all onboarding data
    await adminDb.collection('restaurants').doc(restaurantId).update(updateData);

    // Optional: Create a notification for admin
    await adminDb.collection('notifications').add({
      type: 'onboarding_submitted',
      restaurantId: restaurantId,
      restaurantName: formData?.restaurantProfile?.name || 'New Restaurant',
      status: 'pending',
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding submitted successfully',
      data: {
        restaurantId,
        status: 'pending_approval',
        submittedAt: updateData.submittedAt,
      },
    });
  } catch (error: any) {
    console.error('Error submitting onboarding:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit onboarding' },
      { status: 500 }
    );
  }
}