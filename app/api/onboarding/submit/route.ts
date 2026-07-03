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

    // Build the complete restaurant data from formData
    const updateData: any = {
      // Onboarding status
      onboardingStatus: status || 'pending_approval',
      submittedAt: submittedAt || new Date().toISOString(),
      updatedAt: new Date(),
      onboardingStep: 5,
      isActive: false,

      // Business Type
      businessType: formData?.businessType || 'both',
      serviceTypes: formData?.serviceTypes || {
        delivery: true,
        dineIn: true,
        takeaway: true,
      },

      // Business Details
      businessDetails: formData?.businessDetails || {
        legalName: '',
        businessNumber: '',
        hstNumber: '',
        businessPhone: '',
      },

      // Bank Details
      bankDetails: formData?.bankDetails || {
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        accountType: 'business',
        transitNumber: '',
        institutionNumber: '',
        isVerified: false,
      },

      // Restaurant Profile - Flat fields
      name: formData?.restaurantProfile?.name || '',
      description: formData?.restaurantProfile?.description || '',
      cuisine: formData?.restaurantProfile?.cuisine || [],
      priceRange: formData?.restaurantProfile?.priceRange || '$$',
      deliveryTime: formData?.restaurantProfile?.deliveryTime || '',
      estimatedDeliveryTime: formData?.restaurantProfile?.estimatedDeliveryTime || 30,
      minOrder: formData?.restaurantProfile?.minOrder || 0,
      deliveryFee: formData?.restaurantProfile?.deliveryFee || 0,
      serviceFee: formData?.restaurantProfile?.serviceFee || 0,

      // Address
      address: formData?.restaurantProfile?.address ? {
        street: formData.restaurantProfile.address.street || '',
        city: formData.restaurantProfile.address.city || '',
        state: formData.restaurantProfile.address.state || '',
        zipCode: formData.restaurantProfile.address.zipCode || '',
        coordinates: {
          latitude: formData.restaurantProfile.address.latitude || 0,
          longitude: formData.restaurantProfile.address.longitude || 0,
        },
      } : {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: { latitude: 0, longitude: 0 },
      },

      // Images
      images: formData?.restaurantProfile?.images ? {
        logo: formData.restaurantProfile.images.logo || '',
        cover: formData.restaurantProfile.images.banner ? [formData.restaurantProfile.images.banner] : [],
        gallery: formData.restaurantProfile.images.gallery || [],
      } : {
        logo: '',
        cover: [],
        gallery: [],
      },

      // Operating Hours
      operatingHours: formData?.restaurantProfile?.operatingHours || {
        monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' },
      },

      // Menu
      menu: formData?.menu || { categories: [] },

      // Default values for required fields
      slug: formData?.restaurantProfile?.name?.toLowerCase().replace(/\s+/g, '-') || '',
      rating: 0,
      totalRatings: 0,
      reviewCount: 0,
      featured: false,
      isOpen: false,
      popularItems: [],
      tags: [],
      averageOrderValue: 0,

      // Contact Person
      contactPerson: {
        name: formData?.restaurantProfile?.name || '',
        email: formData?.businessDetails?.businessPhone || '',
        phone: '',
        position: 'owner',
      },

      // Settings
      settings: {
        autoAcceptOrders: true,
        maxOrderCapacity: 100,
        estimatedPrepTime: 20,
        isVegetarianOnly: false,
        hasGlutenFreeOptions: false,
        acceptsReservations: true,
        cancellationPolicy: 'flexible',
        paymentMethods: ['online', 'card'],
      },

      // Payout Settings
      payoutSettings: {
        autoPayoutEnabled: true,
        payoutFrequency: 'weekly',
        minimumPayoutAmount: 50,
      },

      // Store the complete onboarding data for reference
      onboardingData: formData,
    };

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