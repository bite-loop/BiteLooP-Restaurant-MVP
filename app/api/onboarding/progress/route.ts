import { adminDb } from "@/lib/firebase/admin";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams;
      const restaurantId = searchParams.get('restaurantId')
      if(!restaurantId) {
         return NextResponse.json(
            {error: 'Restaurant ID is required'},
            {status: 400}
         );
      }
      const doc = await adminDb.collection('restaurants').doc(restaurantId).get();
      if (!doc.exists) {
         return NextResponse.json(
            {error: "Restaurant not found"},
            {status: 404}
         )
      }

      const data = doc.data()
      return NextResponse.json({ 
        success: true,
        formData: data?.onboardingData || {},
        currentStep: data?.onboardingStep || 1,
        businessType: data?.businessType || 'both',
      })
      
    } catch (error: any) {
      console.error('Error fetching onboarding progress: ', error)
      return NextResponse.json(
      { error: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
    }
}


export async function PATCH(request:NextRequest) {
    try {
      const body = await request.json()
      const {restaurantId, formData, currentStep} = body
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

     // Update only onboarding-related fields
    const updateData: any = {
      onboardingData: formData || {},
      onboardingStep: currentStep || 1,
      updatedAt: new Date(),
    };

    // If businessType is in formData, update it
    if (formData?.businessType) {
      updateData.businessType = formData.businessType;
      updateData.serviceTypes = {
        delivery: formData.businessType === 'delivery_only' || formData.businessType === 'both',
        dineIn: formData.businessType === 'dine_only' || formData.businessType === 'both',
        takeaway: formData.businessType === 'delivery_only' || formData.businessType === 'both',
      };
    }

    await adminDb.collection('restaurants').doc(restaurantId).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Progress saved successfully',
    });

    } catch (error: any) {
       console.error('Error saving onboarding progress:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save progress' },
      { status: 500 }
    );
    }
}