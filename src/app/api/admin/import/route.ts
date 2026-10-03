import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { parseSpreadsheetBuffer, importQuestions, importUsers } from '@/lib/import-parser';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'questions'; // 'questions' | 'users'

    if (!file) {
      return NextResponse.json({ error: 'Berkas tidak ditemukan' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file melebihi batas 5MB' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const rows = parseSpreadsheetBuffer(buffer);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'File kosong atau format lembar kerja tidak valid' }, { status: 400 });
    }

    if (type === 'users') {
      const result = await importUsers(rows);
      return NextResponse.json(result);
    } else {
      const result = await importQuestions(rows);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message || 'Server error saat memproses impor' }, { status: 500 });
  }
}
