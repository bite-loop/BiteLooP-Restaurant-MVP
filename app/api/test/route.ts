// app/api/onboarding/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  console.log('🚀 Upload API called (SDK)');
  
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const restaurantId = formData.get('restaurantId') as string;
    const type = formData.get('type') as string || 'gallery';

    console.log('📦 Request data:', { 
      restaurantId, 
      type, 
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    });

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log('📤 Uploading to Cloudinary via SDK with upload preset...');

    // Upload using SDK with upload preset (unsigned)
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          upload_preset: uploadPreset, // Use upload preset for unsigned uploads
          folder: `restaurants/${restaurantId}/${type}`,
          public_id: `${type}_${Date.now()}`,
          transformation: [
            { quality: 'auto' },
            ...(type === 'logo' ? [{ width: 200, height: 200, crop: 'limit' }] : []),
            ...(type === 'banner' || type === 'menuCard' ? [{ width: 1200, height: 400, crop: 'limit' }] : []),
            ...(type === 'gallery' ? [{ width: 800, height: 600, crop: 'limit' }] : []),
          ],
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary SDK upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary SDK upload success');
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const result = uploadResult as any;

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      type: type,
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}