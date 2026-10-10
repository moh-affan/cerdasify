import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { contentGrammarNotes, contentQuizItems, contentVocab, learningContents, subjects } from '@/db/schema';
import { parseJsonArray, parseSegments } from '@/lib/learning';
import { asc, eq } from 'drizzle-orm';
import ContentEditorClient, { type EditorInitial } from './ContentEditorClient';

const EMPTY: EditorInitial = {
  slug: '',
  title: '',
  titleTranslation: '',
  type: 'STORY',
  subjectId: 'subj_indonesia',
  phaseMin: 'A',
  phaseMax: 'B',
  cefrLevel: '',
  theme: '',
  coverEmoji: '📖',
  coverImageUrl: '',
  readingMinutes: 3,
  orderIndex: 9999,
  isPublished: false,
  bodyMarkdown: '',
  segments: [],
  vocab: [],
  notes: [],
  quiz: [],
};

export default async function AdminContentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allSubjects = await db
    .select({ id: subjects.id, name: subjects.name, icon: subjects.icon })
    .from(subjects)
    .orderBy(asc(subjects.orderIndex));

  if (id === 'baru') {
    return <ContentEditorClient contentId={null} initial={EMPTY} subjects={allSubjects} />;
  }

  const [content] = await db.select().from(learningContents).where(eq(learningContents.id, id)).limit(1);
  if (!content) notFound();

  const [vocab, notes, quiz] = await Promise.all([
    db.select().from(contentVocab).where(eq(contentVocab.contentId, id)).orderBy(asc(contentVocab.orderIndex)),
    db.select().from(contentGrammarNotes).where(eq(contentGrammarNotes.contentId, id)).orderBy(asc(contentGrammarNotes.orderIndex)),
    db.select().from(contentQuizItems).where(eq(contentQuizItems.contentId, id)).orderBy(asc(contentQuizItems.orderIndex)),
  ]);

  const initial: EditorInitial = {
    slug: content.slug,
    title: content.title,
    titleTranslation: content.titleTranslation ?? '',
    type: content.type,
    subjectId: content.subjectId,
    phaseMin: content.phaseMin,
    phaseMax: content.phaseMax,
    cefrLevel: content.cefrLevel ?? '',
    theme: content.theme ?? '',
    coverEmoji: content.coverEmoji ?? '',
    coverImageUrl: content.coverImageUrl ?? '',
    readingMinutes: content.readingMinutes,
    orderIndex: content.orderIndex,
    isPublished: content.isPublished,
    bodyMarkdown: content.bodyMarkdown ?? '',
    segments: parseSegments(content.segmentsJson),
    vocab: vocab.map((v) => ({
      word: v.word,
      forms: parseJsonArray(v.forms),
      partOfSpeech: v.partOfSpeech ?? '',
      meaning: v.meaning,
      example: v.example ?? '',
      emoji: v.emoji ?? '',
    })),
    notes: notes.map((n) => ({
      title: n.title,
      pattern: n.pattern ?? '',
      explanation: n.explanation,
      examples: parseJsonArray(n.examples),
    })),
    quiz: quiz.map((q) => ({
      prompt: q.prompt,
      options: parseJsonArray(q.options),
      correctIndex: q.correctIndex,
      explanation: q.explanation ?? '',
    })),
  };

  return <ContentEditorClient contentId={id} initial={initial} subjects={allSubjects} />;
}
