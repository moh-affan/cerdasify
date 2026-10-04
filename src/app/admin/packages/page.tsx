import React from 'react';
import { db } from '@/db';
import { examPackages, categories, packageQuestions, attempts } from '@/db/schema';
import { desc, asc } from 'drizzle-orm';
import PackagesListClient, { PackageItem, CategoryItem } from './PackagesListClient';

export default async function AdminPackagesPage() {
  const allPkgs = await db.select().from(examPackages).orderBy(desc(examPackages.createdAt));
  const allCats = await db.select().from(categories).orderBy(asc(categories.orderIndex));
  const catMap = new Map(allCats.map((c) => [c.id, c.name]));

  const allPkgQuestions = await db.select().from(packageQuestions);
  const pkgQuestionCountMap = new Map<string, number>();
  for (const pq of allPkgQuestions) {
    pkgQuestionCountMap.set(pq.packageId, (pkgQuestionCountMap.get(pq.packageId) || 0) + 1);
  }

  const allAttempts = await db.select().from(attempts);
  const pkgAttemptsMap = new Map<string, { total: number; completed: number; scoreSum: number; passCount: number }>();
  for (const att of allAttempts) {
    if (!pkgAttemptsMap.has(att.packageId)) {
      pkgAttemptsMap.set(att.packageId, { total: 0, completed: 0, scoreSum: 0, passCount: 0 });
    }
    const stat = pkgAttemptsMap.get(att.packageId)!;
    stat.total += 1;
    if (att.status === 'COMPLETED' || att.status === 'TIMED_OUT') {
      stat.completed += 1;
      stat.scoreSum += att.scoreTotal || 0;
      if (att.isPassed) stat.passCount += 1;
    }
  }

  const formattedPackages: PackageItem[] = allPkgs.map((pkg) => {
    const stats = pkgAttemptsMap.get(pkg.id) || { total: 0, completed: 0, scoreSum: 0, passCount: 0 };
    const avgScore = stats.completed > 0 ? Math.round(stats.scoreSum / stats.completed) : null;
    const passRate = stats.completed > 0 ? Math.round((stats.passCount / stats.completed) * 100) : null;

    return {
      id: pkg.id,
      title: pkg.title,
      slug: pkg.slug,
      categoryId: pkg.categoryId,
      categoryName: catMap.get(pkg.categoryId) || 'Umum',
      type: pkg.type as 'SIMULATION' | 'PRACTICE',
      durationMinutes: pkg.durationMinutes,
      shuffleQuestions: pkg.shuffleQuestions,
      shuffleOptions: pkg.shuffleOptions,
      passingGradeRules: pkg.passingGradeRules,
      isPublished: pkg.isPublished,
      createdAt: pkg.createdAt,
      questionCount: pkgQuestionCountMap.get(pkg.id) || 0,
      attemptCount: stats.total,
      completedCount: stats.completed,
      avgScore,
      passRate,
    };
  });

  const formattedCats: CategoryItem[] = allCats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <PackagesListClient
      initialPackages={formattedPackages}
      categories={formattedCats}
    />
  );
}
