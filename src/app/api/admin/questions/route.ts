import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiError, readJson } from '@/lib/api';
import { createQuestion, parseQuestionPayload } from '@/lib/question-admin';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const payload = await parseQuestionPayload(await readJson(req));
    const questionId = await createQuestion(payload);
    return NextResponse.json({ success: true, questionId });
  } catch (error) {
    return apiError(error, 'Error creating question');
  }
}
