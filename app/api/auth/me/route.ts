// app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "No session found",
        },
        { status: 401 }
      );
    }

    // Verify Firebase Session Cookie
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // check revoked
    );

    // Fetch restaurant profile
    const userDoc = await adminDb
      .collection("restaurants")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "User profile not found",
        },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: decodedToken.uid,
        email: decodedToken.email,
        ...userData,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
}