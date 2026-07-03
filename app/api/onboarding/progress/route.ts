// app/api/onboarding/progress/route.ts
import { adminDb } from "@/lib/firebase/admin";
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

      // Build update data - map onboarding form data to restaurant schema
      const updateData: any = {
        onboardingData: formData || {},
        onboardingStep: currentStep || 1,
        updatedAt: new Date(),
      };

      // Map business details from formData to restaurant fields
      if (formData?.businessDetails) {
        updateData.businessDetails = formData.businessDetails;
      }

      // Map bank details
      if (formData?.bankDetails) {
        updateData.bankDetails = formData.bankDetails;
      }

      // Map restaurant profile to main restaurant fields
      if (formData?.restaurantProfile) {
        const profile = formData.restaurantProfile;
        
        // Map basic fields
        if (profile.name) updateData.name = profile.name;
        if (profile.description) updateData.description = profile.description;
        if (profile.cuisine) updateData.cuisine = profile.cuisine;
        if (profile.priceRange) updateData.priceRange = profile.priceRange;
        if (profile.deliveryTime) updateData.deliveryTime = profile.deliveryTime;
        if (profile.estimatedDeliveryTime) updateData.estimatedDeliveryTime = profile.estimatedDeliveryTime;
        if (profile.minOrder !== undefined) updateData.minOrder = profile.minOrder;
        if (profile.deliveryFee !== undefined) updateData.deliveryFee = profile.deliveryFee;
        if (profile.serviceFee !== undefined) updateData.serviceFee = profile.serviceFee;
        
        // Map address
        if (profile.address) {
          updateData.address = {
            street: profile.address.street || '',
            city: profile.address.city || '',
            state: profile.address.state || '',
            zipCode: profile.address.zipCode || '',
            coordinates: {
              latitude: profile.address.latitude || 0,
              longitude: profile.address.longitude || 0,
            },
          };
        }

        // Map images
        if (profile.images) {
          updateData.images = {
            logo: profile.images.logo || '',
            cover: profile.images.banner ? [profile.images.banner] : [],
            gallery: profile.images.gallery || [],
          };
        }

        // Map operating hours
        if (profile.operatingHours) {
          updateData.operatingHours = profile.operatingHours;
        }
      }

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