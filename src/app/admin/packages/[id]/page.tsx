import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { examPackages, categories, packageQuestions, questions, questionOptions, topics, attempts, users } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import PackageDetailClient from './PackageDetailClient';

export default async function AdminPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [pkg] = await db.select().from(examPackages).where(eq(examPackages.id, id)).limit(1);
  if (!pkg) {
    notFound();
  }

  const allCategories = await db.select().from(categories).orderBy(asc(categories.orderIndex));
  const allTopics = await db.select().from(topics).orderBy(asc(topics.name));

  // Get assigned questions in order
  const assignedRows = await db
    .select({
      packageId: packageQuestions.packageId,
      questionId: packageQuestions.questionId,
      orderIndex: packageQuestions.orderIndex,
      question: questions,
      topic: topics,
    })
    .from(packageQuestions)
    .innerJoin(questions, eq(packageQuestions.questionId, questions.id))
    .leftJoin(topics, eq(questions.topicId, topics.id))
    .where(eq(packageQuestions.packageId, id))
    .orderBy(asc(packageQuestions.orderIndex));

  const questionIds = assignedRows.map((r) => r.questionId);
  type OptionRow = typeof questionOptions.$inferSelect;
  let allOptions: OptionRow[] = [];
  if (questionIds.length > 0) {
    allOptions = await db
      .select()
      .from(questionOptions)
      .orderBy(asc(questionOptions.orderIndex));
  }

  const optionsByQId = new Map<string, OptionRow[]>();
  for (const opt of allOptions) {
    if (!optionsByQId.has(opt.questionId)) {
      optionsByQId.set(opt.questionId, []);
    }
    optionsByQId.get(opt.questionId)!.push(opt);
  }

  const questionsList = assignedRows.map((r) => ({
    id: r.question.id,
    contentMarkdown: r.question.contentMarkdown,
    imageUrl: r.question.imageUrl,
    difficulty: r.question.difficulty,
    type: r.question.type,
    explanationMarkdown: r.question.explanationMarkdown,
    topicId: r.question.topicId,
    topicName: r.topic?.name || 'Umum',
    orderIndex: r.orderIndex,
    options: optionsByQId.get(r.questionId) || [],
  }));

  // Get attempts
  const pkgAttempts = await db
    .select({
      id: attempts.id,
      userId: attempts.userId,
      userName: users.name,
      userUsername: users.username,
      startedAt: attempts.startedAt,
      finishedAt: attempts.finishedAt,
      scoreTotal: attempts.scoreTotal,
      isPassed: attempts.isPassed,
      status: attempts.status,
      remainingSeconds: attempts.remainingSeconds,
    })
    .from(attempts)
    .leftJoin(users, eq(attempts.userId, users.id))
    .where(eq(attempts.packageId, id))
    .orderBy(desc(attempts.startedAt));

  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  return (
    <PackageDetailClient
      packageData={{
        ...pkg,
        categoryName: catMap.get(pkg.categoryId) || 'Umum',
      }}
      initialQuestions={questionsList}
      categories={allCategories}
      topics={allTopics}
      attempts={pkgAttempts}
    />
  );
}
