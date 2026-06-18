import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { Restaurant } from "@/types/restaurants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
        try {
          const {email, password} = await request.json()
        if (!email || !password) {
            return NextResponse.json(
            { error: 'Email and password are required' },
            { status: 400 }
       );
       }

        if (password.length < 8) {
          return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
       }
     
       // create user record 
       const userRecord = await adminAuth.createUser({
          email,
          password
       })
      const restaurantProfile: Omit<Restaurant, 'id'> = {
      email: email, // Registration email
      name: '',
      slug: '',
      description: '',
      cuisine: [],
      rating: 0,
      totalRatings: 0,
      reviewCount: 0,
      deliveryTime: '',
      estimatedDeliveryTime: 30,
      minOrder: 0,
      deliveryFee: 0,
      serviceFee: 0,
      priceRange: '$$',
      featured: false,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      images: {
        cover: [],
        logo: '',
        gallery: [],
      },
      operatingHours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' },
      },
      isOpen: false,
      isActive: false,
      popularItems: [],
      tags: [],
      averageOrderValue: 0,
      onboardingStatus: 'pending',
      onboardingStep: 1,
      businessType: 'both',
      serviceTypes: {
        delivery: true,
        dineIn: true,
        takeaway: true,
      },
      businessDetails: {
        legalName: '',
        businessNumber: '',
        hstNumber: '',
        // businessEmail REMOVED - we use email field above
        businessPhone: '',
      },
      bankDetails: {
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        accountType: 'business',
        transitNumber: '',
        institutionNumber: '',
        isVerified: false,
      },
      contactPerson: {
        name: '',
        email: email, // Use registration email for contact person
        phone: '',
        position: 'owner',
      },
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
      payoutSettings: {
        autoPayoutEnabled: true,
        payoutFrequency: 'weekly',
        minimumPayoutAmount: 50,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await adminDb.collection('partner_restaurats').doc(userRecord.uid).set(restaurantProfile)
    // create session cookie
    const idToken = await adminAuth.createCustomToken(userRecord.uid);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: userRecord.uid,
        email: userRecord.email,
      },
    });

    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;


        } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}