// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';


export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user by email from Firebase Auth
    const userRecord = await adminAuth.getUserByEmail(email);

    // Verify password using Firebase REST API
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const verifyResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      const errorMessages: Record<string, string> = {
        'USER_NOT_FOUND': 'No account found with this email',
        'INVALID_PASSWORD': 'Invalid password',
        'INVALID_EMAIL': 'Invalid email format',
        'INVALID_LOGIN_CREDENTIALS': 'Invalid email or password',
      };
      
      return NextResponse.json(
        { error: errorMessages[verifyData.error?.message] || 'Login failed' },
        { status: 401 }
      );
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(verifyData.idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    // Get restaurant profile from Firestore
    const userDoc = await adminDb.collection('restaurants').doc(userRecord.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully',
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
    console.error('Signin error:', error);
    
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}