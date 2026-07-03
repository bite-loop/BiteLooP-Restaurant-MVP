// components/TestUpload.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('restaurantId', 'test-123');
    formData.append('type', 'test');

    try {
      const res = await fetch('/api/onboarding/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      console.log('Upload result:', data);
      
      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto mt-10">
      <h3 className="font-bold text-lg mb-4">🧪 Test Cloudinary Upload</h3>
      
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
      />
      
      <Button 
        onClick={handleUpload} 
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
      </Button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          ❌ {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-600 font-medium mb-2">✅ Upload Successful!</p>
          <p className="text-sm text-gray-600 break-all">
            <strong>URL:</strong> {result.imageUrl}
          </p>
        </div>
      )}
    </div>
  );
}