// app/api/onboarding/upload/route.ts - Using REST API
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const restaurantId = formData.get('restaurantId') as string;
    const type = formData.get('type') as string || 'gallery';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Upload using REST API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: JSON.stringify({
          file: dataURI,
          upload_preset: uploadPreset,
          public_id: `${type}_${Date.now()}`,
          folder: `restaurants/${restaurantId}/${type}`,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary REST error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Upload failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: data.secure_url,
      publicId: data.public_id,
      type: type,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}