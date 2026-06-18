// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Restaurant } from '@/types/restaurants';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    // Create restaurant profile in Firestore
    const restaurantProfile: Omit<Restaurant, 'id'> = {
      email: email,
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
        businessPhone: '',
        numberOfLocations: 0,
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: ''
        }
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
        email: email,
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

    await adminDb.collection('restaurants').doc(userRecord.uid).set(restaurantProfile);

    // Get ID token for the user (needed for session cookie)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const tokenResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          returnSecureToken: true 
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error('Failed to get ID token');
    }

    // Create session cookie using the ID token
    const sessionCookie = await adminAuth.createSessionCookie(tokenData.idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    // Get the user data
    const userDoc = await adminDb.collection('restaurants').doc(userRecord.uid).get();
    const userData = userDoc.data();

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        ...userData,
      },
    });

    // Set session cookie
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