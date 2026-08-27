import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    // Authentication check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found' });
    }

    // File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'ไฟล์มีขนาดใหญ่เกิน 5MB' }, { status: 400 });
    }

    // MIME type validation
    const mimeType = file.type || '';
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ success: false, error: 'ประเภทไฟล์ไม่รองรับ (รองรับเฉพาะ JPG, PNG, GIF, WebP, PDF)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to Base64 string so we don't need to save to disk on Vercel
    const base64String = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({ success: true, url: base64String });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
