import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attempts, examPackages, packageQuestions } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, and, or } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
    }

    const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, packageId)).limit(1);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket ujian tidak ditemukan' }, { status: 404 });
    }

    // Check if there is already an active in-progress or paused attempt for this user & package
    const [existing] = await db
      .select()
      .from(attempts)
      .where(
        and(
          eq(attempts.userId, user.userId),
          eq(attempts.packageId, packageId),
          or(eq(attempts.status, 'IN_PROGRESS'), eq(attempts.status, 'PAUSED'))
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json({
        attemptId: existing.id,
        startedAt: existing.startedAt,
        durationMinutes: pkg.durationMinutes,
        resumed: true,
      });
    }

    // Check that package has questions
    const pkgQs = await db.select().from(packageQuestions).where(eq(packageQuestions.packageId, packageId));
    if (pkgQs.length === 0) {
      return NextResponse.json({ error: 'Paket ujian belum memiliki butir soal' }, { status: 400 });
    }

    const newAttemptId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    await db.insert(attempts)
      .values({
        id: newAttemptId,
        userId: user.userId,
        packageId: pkg.id,
        startedAt: nowIso,
        status: 'IN_PROGRESS',
        scoreTotal: 0,
      });

    return NextResponse.json({
      attemptId: newAttemptId,
      startedAt: nowIso,
      durationMinutes: pkg.durationMinutes,
      resumed: false,
    });
  } catch (error: any) {
    console.error('Error starting exam:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
