// Validasi & penyimpanan set game dari panel admin.

import { db } from '@/db';
import { gameSets, subjects } from '@/db/schema';
import { ApiError } from '@/lib/api';
import { isPhase, phaseIndex, type Phase } from '@/lib/learning';
import { and, eq, ne } from 'drizzle-orm';
import { GameDataError, validateGameData } from './validate';
import { isGameEngine, type GameEngine } from './types';

export interface GameSetPayload {
  slug: string;
  engine: GameEngine;
  subjectId: string;
  phaseMin: Phase;
  phaseMax: Phase;
  title: string;
  description: string | null;
  coverEmoji: string | null;
  orderIndex: number;
  isPublished: boolean;
  configJson: string;
  itemsJson: string | null;
  warnings: string[];
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function parseGameSetPayload(body: unknown, excludeId?: string): Promise<GameSetPayload> {
  if (typeof body !== 'object' || body === null) throw new ApiError('Data tidak valid');
  const b = body as Record<string, unknown>;

  const slug = str(b.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) {
    throw new ApiError('Slug hanya boleh huruf kecil, angka, dan tanda hubung (maks. 80 karakter)');
  }
  const title = str(b.title);
  if (!title || title.length > 120) throw new ApiError('Judul wajib diisi (maks. 120 karakter)');
  if (!isGameEngine(b.engine)) throw new ApiError('Jenis game tidak valid');
  if (!isPhase(b.phaseMin) || !isPhase(b.phaseMax) || phaseIndex(b.phaseMin) > phaseIndex(b.phaseMax)) {
    throw new ApiError('Rentang fase tidak valid');
  }
  const subjectId = str(b.subjectId);
  const [subject] = await db.select({ id: subjects.id }).from(subjects).where(eq(subjects.id, subjectId)).limit(1);
  if (!subject) throw new ApiError('Mata pelajaran tidak ditemukan');

  const orderIndex = Number(b.orderIndex ?? 0);
  if (!Number.isInteger(orderIndex) || orderIndex < 0 || orderIndex > 100000) throw new ApiError('Urutan harus bilangan bulat ≥ 0');

  const [dup] = await db
    .select({ id: gameSets.id })
    .from(gameSets)
    .where(excludeId ? and(eq(gameSets.slug, slug), ne(gameSets.id, excludeId)) : eq(gameSets.slug, slug))
    .limit(1);
  if (dup) throw new ApiError(`Slug "${slug}" sudah dipakai set lain`);

  let validated;
  try {
    validated = validateGameData(b.engine, b.config, b.items ?? null);
  } catch (err) {
    if (err instanceof GameDataError) throw new ApiError(err.message);
    throw err;
  }

  return {
    slug,
    engine: b.engine,
    subjectId,
    phaseMin: b.phaseMin,
    phaseMax: b.phaseMax,
    title,
    description: str(b.description) || null,
    coverEmoji: str(b.coverEmoji) || null,
    orderIndex,
    isPublished: b.isPublished === true,
    configJson: JSON.stringify(validated.config),
    itemsJson: validated.items === null || validated.items === undefined ? null : JSON.stringify(validated.items),
    warnings: validated.warnings,
  };
}

export function toRow(p: GameSetPayload) {
  const { warnings: _w, ...row } = p;
  void _w;
  return { ...row, editedAt: new Date().toISOString() };
}
