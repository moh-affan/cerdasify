import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireSuperAdmin } from '@/lib/auth';
import { parseSpreadsheetBuffer, importQuestions, importUsers } from '@/lib/import-parser';
import { ApiError, apiError } from '@/lib/api';

const MAX_BYTES = 5 * 1024 * 1024;

// Impor massal soal (Admin) atau peserta (khusus Super Admin) dari CSV/XLSX.
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData().catch(() => {
      throw new ApiError('Data unggahan tidak valid');
    });
    const file = formData.get('file');
    const type = formData.get('type') === 'users' ? 'users' : 'questions';

    if (!(file instanceof File)) throw new ApiError('Berkas tidak ditemukan');
    if (file.size > MAX_BYTES) throw new ApiError('Ukuran file melebihi batas 5MB');
    if (!/\.(csv|xlsx)$/i.test(file.name)) throw new ApiError('Format berkas harus .csv atau .xlsx');

    // Manajemen pengguna (termasuk impor peserta) hanya untuk Super Admin
    if (type === 'users') await requireSuperAdmin();

    let rows;
    try {
      rows = parseSpreadsheetBuffer(Buffer.from(await file.arrayBuffer()));
    } catch {
      throw new ApiError('Berkas tidak dapat dibaca. Pastikan memakai template resmi.');
    }
    if (rows.length === 0) throw new ApiError('File kosong atau format lembar kerja tidak valid');

    const result = type === 'users' ? await importUsers(rows) : await importQuestions(rows);
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, 'Import error');
  }
}
