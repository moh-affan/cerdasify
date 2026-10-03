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

    const { attemptId } = await req.json();

    if (!attemptId) {
      return NextResponse.json({ error: 'attemptId is required' }, { status: 400 });
    }

    const attempt = db.select().from(attempts).where(eq(attempts.id, attemptId)).get();
    if (!attempt) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
    }

    if (attempt.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    db.update(attempts)
      .set({
        status: 'IN_PROGRESS',
      })
      .where(eq(attempts.id, attemptId))
      .run();

    return NextResponse.json({
      success: true,
      status: 'IN_PROGRESS',
      remainingSeconds: attempt.remainingSeconds,
    });
  } catch (error: any) {
    console.error('Error resuming exam:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
