import { NextResponse } from 'next/server';
import { db } from '@/db';
import { topics } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();
    const allTopics = await db.select().from(topics);
    return NextResponse.json({ topics: allTopics });
  } catch (error) {
    return apiError(error, 'Admin API error');
  }
}
