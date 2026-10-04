import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();
    const allCategories = await db.select().from(categories).orderBy(asc(categories.orderIndex));
    return NextResponse.json({ categories: allCategories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
