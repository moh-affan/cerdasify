import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { uploadToSupabaseStorage } from '@/lib/storage';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File gambar tidak ditemukan' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File harus berupa gambar (PNG, JPG, WebP, SVG)' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran gambar maksimal 5MB' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.png';
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Try uploading to Supabase Storage first (ideal for Vercel / Cloud)
    const remoteUrl = await uploadToSupabaseStorage(buffer, filename, file.type);
    if (remoteUrl) {
      return NextResponse.json({ success: true, url: remoteUrl });
    }

    // 2. Fallback to local filesystem (for local dev)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
