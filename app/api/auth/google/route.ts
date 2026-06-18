// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Restaurant } from '@/types/restaurants';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify the Google ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email || '';
    const displayName = decodedToken.name || '';
    const photoURL = decodedToken.picture || '';

    // Check if restaurant exists in Firestore
    const userDoc = await adminDb.collection('restaurants').doc(uid).get();

    if (!userDoc.exists) {
      // Create new restaurant profile
      const restaurantProfile: Omit<Restaurant, 'id'> = {
        email: email,
        name: displayName,
        displayName: displayName,
        photoURL: photoURL,
        slug: displayName.toLowerCase().replace(/\s+/g, '-') || '',
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
          legalName: displayName || '',
          businessNumber: '',
          hstNumber: '',
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
          name: displayName || '',
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

      await adminDb.collection('restaurants').doc(uid).set(restaurantProfile);
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    // Get updated user data
    const updatedDoc = await adminDb.collection('restaurants').doc(uid).get();
    const userData = updatedDoc.data();

    const response = NextResponse.json({
      success: true,
      message: 'Google sign in successful',
      user: {
        id: uid,
        email: email,
        displayName: displayName,
        photoURL: photoURL,
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
    console.error('Google sign in error:', error);
    return NextResponse.json(
      { error: 'Google sign in failed' },
      { status: 401 }
    );
  }
}