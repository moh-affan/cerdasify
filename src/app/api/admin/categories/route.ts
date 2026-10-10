import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { asc } from 'drizzle-orm';
import { apiError } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();
    const allCategories = await db.select().from(categories).orderBy(asc(categories.orderIndex));
    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    return apiError(error, 'Admin API error');
  }
}
