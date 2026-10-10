import { notFound } from 'next/navigation';
import { db } from '@/db';
import { questions, questionOptions, topics, categories } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';
import EditQuestionClient from './EditQuestionClient';

interface EditQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  await requireAdmin();
  const { id } = await params;

  // 1. Fetch Question
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  if (!question) {
    notFound();
  }

  // 2. Fetch Options
  const options = await db
    .select()
    .from(questionOptions)
    .where(eq(questionOptions.questionId, id))
    .orderBy(asc(questionOptions.orderIndex));

  // 3. Fetch all topics and categories
  const allCategories = await db.select().from(categories);
  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  const allTopics = await db.select().from(topics).orderBy(asc(topics.name));
  const topicsList = allTopics.map((t) => ({
    id: t.id,
    name: t.name,
    categoryName: catMap.get(t.categoryId),
  }));

  return (
    <EditQuestionClient
      question={{
        id: question.id,
        topicId: question.topicId,
        type: question.type,
        difficulty: question.difficulty,
        contentMarkdown: question.contentMarkdown,
        imageUrl: question.imageUrl,
        explanationMarkdown: question.explanationMarkdown,
      }}
      initialOptions={options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        contentMarkdown: opt.contentMarkdown,
        isCorrect: Boolean(opt.isCorrect),
        scoreValue: opt.scoreValue,
      }))}
      topicsList={topicsList}
    />
  );
}
