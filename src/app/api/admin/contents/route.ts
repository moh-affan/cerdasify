import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { parseContentPayload, saveContent } from '@/lib/content-admin';
import { apiError, readJson } from '@/lib/api';

// Membuat konten Pustaka Belajar baru (Admin & Super Admin).
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const payload = await parseContentPayload(await readJson(req));
    const contentId = `lc_${payload.slug}`;
    await saveContent(contentId, payload, true);
    return NextResponse.json({ success: true, id: contentId });
  } catch (error) {
    return apiError(error, 'Error creating content');
  }
}
