import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams;
      const userId = searchParams.get('userId')

      if (!userId) {
         return NextResponse.json(
            {error: "User ID is required"},
            {status: 400}
         );
      }
      const doc = await adminDb.collection('restaurants').doc(userId).get();
      if (!doc.exists) {
         return NextResponse.json({
            onboardingStatus: 'pending',
            onboardingStep: 0,
         })
      }

      const data = doc.data()
     return NextResponse.json({
      onboardingStatus: data?.onboardingStatus || 'pending',
      onboardingStep: data?.onboardingStep || 0,
      rejectionReason: data?.rejectionReason || null,
      submittedAt: data?.submittedAt || null,
    });

    } catch (error: any) {
      console.error('Error fetching restaurant status:', error);
      return NextResponse.json(
       { error: error.message || 'Failed to fetch status' },
       { status: 500 }
    );
    }
}