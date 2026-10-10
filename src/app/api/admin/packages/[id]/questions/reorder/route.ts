import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/db';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/api';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { orderedQuestionIds } = body;

    if (!Array.isArray(orderedQuestionIds) || orderedQuestionIds.length === 0) {
      return NextResponse.json({ error: 'Daftar orderedQuestionIds wajib berupa array' }, { status: 400 });
    }

    await client.begin(async (sql) => {
      for (let i = 0; i < orderedQuestionIds.length; i++) {
        const qid = orderedQuestionIds[i];
        await sql`
          UPDATE package_questions
          SET order_index = ${i}
          WHERE package_id = ${id} AND question_id = ${qid}
        `;
      }
    });

    return NextResponse.json({ success: true, message: 'Urutan butir soal berhasil disimpan' });
  } catch (error) {
    return apiError(error, 'Error reordering questions');
  }
}
