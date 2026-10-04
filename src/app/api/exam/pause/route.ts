import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attemptId, remainingSeconds } = await req.json();

    if (!attemptId) {
      return NextResponse.json({ error: 'attemptId is required' }, { status: 400 });
    }

    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);
    if (!attempt) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
    }

    if (attempt.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'PAUSED') {
      return NextResponse.json({ error: 'Sesi ujian sudah selesai' }, { status: 400 });
    }

    await db.update(attempts)
      .set({
        status: 'PAUSED',
        remainingSeconds: typeof remainingSeconds === 'number' ? Math.max(0, remainingSeconds) : attempt.remainingSeconds,
      })
      .where(eq(attempts.id, attemptId));

    return NextResponse.json({ success: true, status: 'PAUSED' });
  } catch (error: any) {
    console.error('Error pausing exam:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
