// Validasi & penyimpanan konten Pustaka Belajar dari editor admin.

import { db } from '@/db';
import { ApiError } from '@/lib/api';
import { learningContents, contentVocab, contentGrammarNotes, contentQuizItems, subjects } from '@/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { COMIC_BACKGROUNDS, PHASES, phaseIndex, type ComicBackground, type ContentSegment, type Phase } from '@/lib/learning';

export const CONTENT_TYPES = ['DAILY_READING', 'STORY', 'ENCYCLOPEDIA', 'COMIC', 'SPEECH', 'LESSON'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export interface VocabInput {
  word: string;
  forms: string[];
  partOfSpeech: string;
  meaning: string;
  example: string;
  emoji: string;
}

export interface NoteInput {
  title: string;
  pattern: string;
  explanation: string;
  examples: string[];
}

export interface QuizInput {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ContentPayload {
  slug: string;
  title: string;
  titleTranslation: string;
  type: ContentType;
  subjectId: string;
  phaseMin: Phase;
  phaseMax: Phase;
  cefrLevel: string;
  theme: string;
  coverEmoji: string;
  coverImageUrl: string;
  readingMinutes: number;
  orderIndex: number;
  isPublished: boolean;
  bodyMarkdown: string;
  segments: ContentSegment[];
  vocab: VocabInput[];
  notes: NoteInput[];
  quiz: QuizInput[];
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const strArr = (v: unknown) => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);
const opt = (v: unknown) => str(v) || undefined;

function cleanSegment(raw: unknown, i: number): ContentSegment {
  const r = (raw ?? {}) as Record<string, unknown>;
  const seg: ContentSegment = {};
  if (r.panel && typeof r.panel === 'object') {
    const p = r.panel as Record<string, unknown>;
    const bg = str(p.bg);
    seg.panel = {
      scene: opt(p.scene),
      img: opt(p.img),
      caption: opt(p.caption),
      bg: (COMIC_BACKGROUNDS as readonly string[]).includes(bg) ? (bg as ComicBackground) : undefined,
      bubbles: (Array.isArray(p.bubbles) ? p.bubbles : [])
        .map((b) => {
          const bb = (b ?? {}) as Record<string, unknown>;
          return {
            who: str(bb.who),
            text: str(bb.text),
            side: bb.side === 'right' ? ('right' as const) : undefined,
            tone: bb.tone === 'think' || bb.tone === 'shout' ? (bb.tone as 'think' | 'shout') : undefined,
          };
        })
        .filter((b) => b.text),
    };
    if (!seg.panel.scene && !seg.panel.img && !seg.panel.caption && !seg.panel.bubbles?.length) {
      throw new ValidationError(`Segmen #${i + 1}: panel komik masih kosong`);
    }
  } else {
    for (const key of ['en', 'tx', 'ar', 'latin', 'id'] as const) {
      const v = opt(r[key]);
      if (v) seg[key] = v;
    }
    if (!seg.en && !seg.tx && !seg.ar) throw new ValidationError(`Segmen #${i + 1}: teks utama kosong`);
    if (Number.isInteger(r.n)) seg.n = r.n as number;
  }
  const h = opt(r.h);
  if (h) seg.h = h;
  if (r.break === true) seg.break = true;
  return seg;
}

/** Normalisasi & validasi body JSON dari editor. Melempar ValidationError bila tidak valid. */
export async function parseContentPayload(body: unknown, excludeId?: string): Promise<ContentPayload> {
  const b = (body ?? {}) as Record<string, unknown>;

  const title = str(b.title);
  if (!title) throw new ValidationError('Judul wajib diisi');

  const slug = str(b.slug).toLowerCase();
  if (!SLUG_RE.test(slug)) throw new ValidationError('Slug hanya boleh huruf kecil, angka, dan tanda hubung');

  const type = str(b.type) as ContentType;
  if (!CONTENT_TYPES.includes(type)) throw new ValidationError('Jenis konten tidak valid');

  const phaseMin = str(b.phaseMin) as Phase;
  const phaseMax = str(b.phaseMax) as Phase;
  if (!PHASES.includes(phaseMin) || !PHASES.includes(phaseMax)) throw new ValidationError('Fase tidak valid');
  if (phaseIndex(phaseMin) > phaseIndex(phaseMax)) throw new ValidationError('Fase minimum tidak boleh di atas fase maksimum');

  const subjectId = str(b.subjectId);
  const [subject] = await db.select({ id: subjects.id }).from(subjects).where(eq(subjects.id, subjectId)).limit(1);
  if (!subject) throw new ValidationError('Mata pelajaran tidak ditemukan');

  const [dupe] = await db
    .select({ id: learningContents.id })
    .from(learningContents)
    .where(excludeId ? and(eq(learningContents.slug, slug), ne(learningContents.id, excludeId)) : eq(learningContents.slug, slug))
    .limit(1);
  if (dupe) throw new ValidationError(`Slug "${slug}" sudah dipakai konten lain`);

  const segments = (Array.isArray(b.segments) ? b.segments : []).map(cleanSegment);
  const bodyMarkdown = typeof b.bodyMarkdown === 'string' ? b.bodyMarkdown.trim() : '';
  if (segments.length === 0 && !bodyMarkdown) throw new ValidationError('Isi konten (teks, panel, atau Markdown) masih kosong');

  const vocab: VocabInput[] = (Array.isArray(b.vocab) ? b.vocab : [])
    .map((v) => {
      const r = (v ?? {}) as Record<string, unknown>;
      return {
        word: str(r.word),
        forms: strArr(r.forms),
        partOfSpeech: str(r.partOfSpeech),
        meaning: str(r.meaning),
        example: str(r.example),
        emoji: str(r.emoji),
      };
    })
    .filter((v) => v.word || v.meaning);
  vocab.forEach((v, i) => {
    if (!v.word || !v.meaning) throw new ValidationError(`Kosakata #${i + 1}: kata dan arti wajib diisi`);
  });

  const notes: NoteInput[] = (Array.isArray(b.notes) ? b.notes : [])
    .map((n) => {
      const r = (n ?? {}) as Record<string, unknown>;
      return { title: str(r.title), pattern: str(r.pattern), explanation: str(r.explanation), examples: strArr(r.examples) };
    })
    .filter((n) => n.title || n.explanation);
  notes.forEach((n, i) => {
    if (!n.title || !n.explanation) throw new ValidationError(`Catatan #${i + 1}: judul dan penjelasan wajib diisi`);
  });

  const quiz: QuizInput[] = (Array.isArray(b.quiz) ? b.quiz : []).map((q, i) => {
    const r = (q ?? {}) as Record<string, unknown>;
    const options = strArr(r.options);
    const correctIndex = Number(r.correctIndex);
    if (!str(r.prompt)) throw new ValidationError(`Kuis #${i + 1}: pertanyaan wajib diisi`);
    if (options.length < 2) throw new ValidationError(`Kuis #${i + 1}: minimal 2 pilihan jawaban`);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      throw new ValidationError(`Kuis #${i + 1}: pilih kunci jawaban yang benar`);
    }
    return { prompt: str(r.prompt), options, correctIndex, explanation: str(r.explanation) };
  });

  const readingMinutes = Math.min(120, Math.max(1, Math.round(Number(b.readingMinutes) || 3)));
  const orderIndex = Number.isFinite(Number(b.orderIndex)) ? Math.round(Number(b.orderIndex)) : 0;

  return {
    slug,
    title,
    titleTranslation: str(b.titleTranslation),
    type,
    subjectId,
    phaseMin,
    phaseMax,
    cefrLevel: str(b.cefrLevel),
    theme: str(b.theme),
    coverEmoji: str(b.coverEmoji),
    coverImageUrl: str(b.coverImageUrl),
    readingMinutes,
    orderIndex,
    isPublished: b.isPublished !== false,
    bodyMarkdown,
    segments,
    vocab,
    notes,
    quiz,
  };
}

/** Simpan konten beserta kosakata, catatan, dan kuis dalam satu transaksi. */
export async function saveContent(contentId: string, p: ContentPayload, isNew: boolean) {
  const row = {
    slug: p.slug,
    subjectId: p.subjectId,
    type: p.type,
    phaseMin: p.phaseMin,
    phaseMax: p.phaseMax,
    cefrLevel: p.cefrLevel || null,
    theme: p.theme || null,
    title: p.title,
    titleTranslation: p.titleTranslation || null,
    summary: null,
    coverEmoji: p.coverEmoji || null,
    coverImageUrl: p.coverImageUrl || null,
    segmentsJson: p.segments.length ? JSON.stringify(p.segments) : null,
    bodyMarkdown: p.bodyMarkdown || null,
    readingMinutes: p.readingMinutes,
    orderIndex: p.orderIndex,
    isPublished: p.isPublished,
    editedAt: new Date().toISOString(),
  };

  await db.transaction(async (tx) => {
    if (isNew) {
      await tx.insert(learningContents).values({ id: contentId, ...row });
    } else {
      await tx.update(learningContents).set(row).where(eq(learningContents.id, contentId));
    }

    await tx.delete(contentVocab).where(eq(contentVocab.contentId, contentId));
    await tx.delete(contentGrammarNotes).where(eq(contentGrammarNotes.contentId, contentId));
    await tx.delete(contentQuizItems).where(eq(contentQuizItems.contentId, contentId));

    if (p.vocab.length) {
      await tx.insert(contentVocab).values(
        p.vocab.map((v, i) => ({
          id: `${contentId}_v${i}`,
          contentId,
          word: v.word,
          forms: v.forms.length ? JSON.stringify(v.forms) : null,
          partOfSpeech: v.partOfSpeech || null,
          meaning: v.meaning,
          example: v.example || null,
          emoji: v.emoji || null,
          orderIndex: i,
        }))
      );
    }
    if (p.notes.length) {
      await tx.insert(contentGrammarNotes).values(
        p.notes.map((n, i) => ({
          id: `${contentId}_g${i}`,
          contentId,
          title: n.title,
          pattern: n.pattern || null,
          explanation: n.explanation,
          examples: JSON.stringify(n.examples),
          orderIndex: i,
        }))
      );
    }
    if (p.quiz.length) {
      await tx.insert(contentQuizItems).values(
        p.quiz.map((q, i) => ({
          id: `${contentId}_q${i}`,
          contentId,
          prompt: q.prompt,
          options: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          explanation: q.explanation || null,
          orderIndex: i,
        }))
      );
    }
  });
}
