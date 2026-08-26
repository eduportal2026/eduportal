import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to Base64 string so we don't need to save to disk on Vercel
    const mimeType = file.type || 'image/jpeg';
    const base64String = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Return the Base64 URL directly
    return NextResponse.json({ success: true, url: base64String });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' });
  }
}
