import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { gameSets, subjects } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import GameEditorClient, { type GameEditorInitial } from './GameEditorClient';

const EMPTY: GameEditorInitial = {
  slug: '',
  title: '',
  description: '',
  coverEmoji: '🎮',
  engine: 'MEMORY_MATCH',
  subjectId: 'subj_english',
  phaseMin: 'A',
  phaseMax: 'B',
  orderIndex: 9999,
  isPublished: false,
  config: null,
  items: null,
};

export default async function AdminGameEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allSubjects = await db.select({ id: subjects.id, name: subjects.name, icon: subjects.icon }).from(subjects).orderBy(asc(subjects.orderIndex));

  if (id === 'baru') return <GameEditorClient setId={null} initial={EMPTY} subjects={allSubjects} />;

  const [row] = await db.select().from(gameSets).where(eq(gameSets.id, id)).limit(1);
  if (!row) notFound();

  return (
    <GameEditorClient
      setId={row.id}
      subjects={allSubjects}
      initial={{
        slug: row.slug,
        title: row.title,
        description: row.description ?? '',
        coverEmoji: row.coverEmoji ?? '',
        engine: row.engine,
        subjectId: row.subjectId,
        phaseMin: row.phaseMin,
        phaseMax: row.phaseMax,
        orderIndex: row.orderIndex,
        isPublished: row.isPublished,
        config: JSON.parse(row.configJson),
        items: row.itemsJson ? JSON.parse(row.itemsJson) : null,
      }}
    />
  );
}
