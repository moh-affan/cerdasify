import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { ApiError, apiError } from '@/lib/api';
import { uploadToSupabaseStorage } from '@/lib/storage';
import fs from 'fs';
import path from 'path';

const MAX_BYTES = 5 * 1024 * 1024;

/** Tipe yang diizinkan beserta ekstensi & tanda tangan biner (magic bytes) di awal file. */
const ALLOWED: Record<string, { ext: string; matches: (b: Buffer) => boolean }> = {
  'image/jpeg': { ext: 'jpg', matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: 'png', matches: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  'image/webp': {
    ext: 'webp',
    matches: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP',
  },
};

// Unggah gambar stimulus soal/opsi/konten (Admin & Super Admin).
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData().catch(() => {
      throw new ApiError('Data unggahan tidak valid');
    });
    const file = formData.get('file');
    if (!(file instanceof File)) throw new ApiError('File gambar tidak ditemukan');

    const type = ALLOWED[file.type];
    if (!type) throw new ApiError('Format gambar harus JPEG, PNG, atau WebP');
    if (file.size > MAX_BYTES) throw new ApiError('Ukuran gambar maksimal 5MB');

    const buffer = Buffer.from(await file.arrayBuffer());
    // Jangan percaya Content-Type dari klien: cocokkan dengan isi file
    if (!type.matches(buffer)) throw new ApiError('Isi file tidak sesuai dengan format gambar');

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${type.ext}`;

    // 1. Supabase Storage (produksi / Vercel)
    const remoteUrl = await uploadToSupabaseStorage(buffer, filename, file.type);
    if (remoteUrl) return NextResponse.json({ success: true, url: remoteUrl });

    // 2. Cadangan: filesystem lokal (pengembangan)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    return apiError(error, 'Error uploading image');
  }
}
