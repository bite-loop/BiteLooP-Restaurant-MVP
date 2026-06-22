// app/api/test-cloudinary/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  console.log('🔍 Testing Cloudinary connection...');
  
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // Try to ping Cloudinary
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary ping successful:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connected!',
      result,
      config: {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
      }
    });
  } catch (error: any) {
    console.error('❌ Cloudinary error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code,
      config: {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
      }
    }, { status: 500 });
  }
}