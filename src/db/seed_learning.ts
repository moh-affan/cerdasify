// Seeder Pustaka Belajar: mata pelajaran, Daily English Reading, doa & surat pendek, cerita pendek,
// ensiklopedia, komik, pidato, serta materi Matematika, IPA, dan Bahasa Indonesia.
// Idempoten: konten di-upsert berdasarkan id, kosakata/catatan/kuis diganti ulang.
// Konten yang sudah diedit lewat panel admin (edited_at terisi) dilewati kecuali --force.
// Progres baca pengguna (reading_progress) tidak tersentuh.

import { db, client } from './index';
import { runMigrations } from './migrate';
import { subjects, learningContents, contentVocab, contentGrammarNotes, contentQuizItems } from './schema';
import { eq } from 'drizzle-orm';
import type {
  SeedArticle,
  SeedComic,
  SeedGrammar,
  SeedLesson,
  SeedQuiz,
  SeedReading,
  SeedSpeech,
} from './seed-data/learning/types';
import type { ContentSegment, Phase } from '../lib/learning';
import { englishPhaseA } from './seed-data/learning/english-phase-a';
import { englishPhaseD } from './seed-data/learning/english-phase-d';
import { doaHarian, suratPendek } from './seed-data/learning/islam';
import { ceritaPendek } from './seed-data/learning/cerita-pendek';
import { ensiklopedia } from './seed-data/learning/ensiklopedia';
import { matematikaFaseA } from './seed-data/learning/matematika-fase-a';
import { englishPhaseB } from './seed-data/learning/english-phase-b';
import { ipaFaseAB } from './seed-data/learning/ipa-fase-ab';
import { bahasaIndonesiaFaseAB } from './seed-data/learning/bahasa-indonesia-fase-ab';
import { pidato } from './seed-data/learning/pidato';
import { komik } from './seed-data/learning/komik';

// `npm run seed:learning -- --force` menimpa juga konten yang sudah diedit lewat panel admin.
const FORCE = process.argv.includes('--force');

const SUBJECTS = [
  { id: 'subj_english', name: 'Bahasa Inggris', slug: 'bahasa-inggris', icon: '🇬🇧', orderIndex: 1 },
  { id: 'subj_indonesia', name: 'Bahasa Indonesia', slug: 'bahasa-indonesia', icon: '🇮🇩', orderIndex: 2 },
  { id: 'subj_math', name: 'Matematika', slug: 'matematika', icon: '🔢', orderIndex: 3 },
  { id: 'subj_science', name: 'IPA', slug: 'ipa', icon: '🔬', orderIndex: 4 },
  { id: 'subj_islam', name: 'Pendidikan Agama Islam', slug: 'pendidikan-agama-islam', icon: '🕌', orderIndex: 5 },
  { id: 'subj_general', name: 'Pengetahuan Umum', slug: 'pengetahuan-umum', icon: '🌏', orderIndex: 6 },
];

type ContentType = (typeof learningContents.$inferInsert)['type'];

interface SetMeta {
  subjectId: string;
  type: ContentType;
  phaseMin: Phase;
  phaseMax: Phase;
  orderBase: number;
  cefrLevel?: string;
}

interface VocabRow {
  word: string;
  meaning: string;
  emoji?: string;
  partOfSpeech?: string;
  forms?: string[];
  example?: string;
}

/** Bentuk seragam satu konten sebelum ditulis ke database. */
interface Entry {
  slug: string;
  theme: string;
  emoji: string;
  title: string;
  titleTranslation?: string;
  minutes: number;
  coverImageUrl?: string;
  /** Override fase per konten (mis. pidato) */
  phaseMin?: Phase;
  phaseMax?: Phase;
  bodyMarkdown?: string;
  segments: ContentSegment[];
  vocab: VocabRow[];
  notes: SeedGrammar[];
  quiz: SeedQuiz[];
}

const fromReading = (r: SeedReading): Entry => ({
  slug: r.slug,
  theme: r.theme,
  emoji: r.emoji,
  title: r.title,
  titleTranslation: r.titleId,
  minutes: r.minutes,
  segments: r.sentences.map(([en, id, newParagraph]) => (newParagraph ? { en, id, break: true } : { en, id })),
  vocab: r.vocab.map(([word, meaning, emoji, partOfSpeech, forms, example]) => ({
    word,
    meaning,
    emoji,
    partOfSpeech,
    forms,
    example,
  })),
  notes: r.grammar,
  quiz: r.quiz,
});

const fromLesson = (l: SeedLesson): Entry => ({
  slug: l.slug,
  theme: l.theme,
  emoji: l.emoji,
  title: l.title,
  titleTranslation: l.titleId,
  minutes: l.minutes,
  bodyMarkdown: l.intro,
  segments: (l.lines ?? []).map(([ar, latin, id, n]) => (n !== undefined ? { ar, latin, id, n } : { ar, latin, id })),
  vocab: [],
  notes: l.notes ?? [],
  quiz: l.quiz,
});

const fromArticle = (a: SeedArticle): Entry => ({
  slug: a.slug,
  theme: a.theme,
  emoji: a.emoji,
  title: a.title,
  minutes: a.minutes,
  segments: a.paragraphs.flatMap((sentences, p) =>
    sentences.map((tx, i) => (p > 0 && i === 0 ? { tx, break: true } : { tx }))
  ),
  vocab: (a.vocab ?? []).map(([word, meaning, emoji, forms]) => ({ word, meaning, emoji, forms })),
  notes: a.notes ?? [],
  quiz: a.quiz,
});

const fromSpeech = (sp: SeedSpeech): Entry => ({
  slug: sp.slug,
  theme: sp.theme,
  emoji: sp.emoji,
  title: sp.title,
  titleTranslation: sp.titleId,
  minutes: sp.minutes,
  phaseMin: sp.phaseMin,
  phaseMax: sp.phaseMax,
  segments: sp.sections.flatMap(([h, sentences]) =>
    sentences.map((line, i): ContentSegment => {
      const [first, translation] = line.split(' || ');
      const base: ContentSegment = sp.lang === 'en' ? { en: first, id: translation } : { tx: first };
      return i === 0 ? { ...base, h } : base;
    })
  ),
  vocab: [],
  notes: sp.notes ?? [],
  quiz: sp.quiz,
});

const fromComic = (c: SeedComic): Entry => ({
  slug: c.slug,
  theme: c.theme,
  emoji: c.emoji,
  title: c.title,
  minutes: c.minutes,
  coverImageUrl: c.cover,
  segments: c.panels.map((panel) => ({ panel })),
  vocab: [],
  notes: c.notes ?? [],
  quiz: c.quiz,
});

const CONTENT_SETS: { meta: SetMeta; entries: Entry[] }[] = [
  {
    meta: { subjectId: 'subj_english', type: 'DAILY_READING', phaseMin: 'A', phaseMax: 'B', cefrLevel: 'PRE_A1', orderBase: 1000 },
    entries: englishPhaseA.map(fromReading),
  },
  {
    meta: { subjectId: 'subj_english', type: 'DAILY_READING', phaseMin: 'D', phaseMax: 'D', cefrLevel: 'A2', orderBase: 4000 },
    entries: englishPhaseD.map(fromReading),
  },
  {
    meta: { subjectId: 'subj_english', type: 'DAILY_READING', phaseMin: 'B', phaseMax: 'B', cefrLevel: 'A1', orderBase: 2000 },
    entries: englishPhaseB.map(fromReading),
  },
  {
    meta: { subjectId: 'subj_indonesia', type: 'STORY', phaseMin: 'A', phaseMax: 'B', orderBase: 5000 },
    entries: ceritaPendek.map(fromArticle),
  },
  {
    meta: { subjectId: 'subj_general', type: 'ENCYCLOPEDIA', phaseMin: 'A', phaseMax: 'C', orderBase: 5500 },
    entries: ensiklopedia.map(fromArticle),
  },
  {
    meta: { subjectId: 'subj_islam', type: 'LESSON', phaseMin: 'A', phaseMax: 'L', orderBase: 6000 },
    entries: doaHarian.map(fromLesson),
  },
  {
    meta: { subjectId: 'subj_islam', type: 'LESSON', phaseMin: 'A', phaseMax: 'L', orderBase: 7000 },
    entries: suratPendek.map(fromLesson),
  },
  {
    meta: { subjectId: 'subj_math', type: 'LESSON', phaseMin: 'A', phaseMax: 'A', orderBase: 8000 },
    entries: matematikaFaseA.map(fromLesson),
  },
  {
    meta: { subjectId: 'subj_science', type: 'LESSON', phaseMin: 'A', phaseMax: 'B', orderBase: 8500 },
    entries: ipaFaseAB.map(fromLesson),
  },
  {
    meta: { subjectId: 'subj_indonesia', type: 'LESSON', phaseMin: 'A', phaseMax: 'B', orderBase: 9000 },
    entries: bahasaIndonesiaFaseAB.map(fromLesson),
  },
  {
    meta: { subjectId: 'subj_indonesia', type: 'SPEECH', phaseMin: 'A', phaseMax: 'D', orderBase: 9500 },
    entries: pidato.map(fromSpeech),
  },
  {
    meta: { subjectId: 'subj_indonesia', type: 'COMIC', phaseMin: 'A', phaseMax: 'B', orderBase: 5800 },
    entries: komik.map(fromComic),
  },
];

/** Acak opsi kuis secara deterministik (stabil antar-seed) agar posisi jawaban benar tersebar. */
function shuffleOptions(options: string[], correctIndex: number, seedKey: string) {
  let h = 2166136261;
  for (const ch of seedKey) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { options: order.map((i) => options[i]), correctIndex: order.indexOf(correctIndex) };
}

function validate(entry: Entry) {
  const problems: string[] = [];
  if (entry.segments.length === 0 && !entry.bodyMarkdown) problems.push('tanpa teks');
  entry.quiz.forEach(([prompt, options, correct], i) => {
    if (correct < 0 || correct >= options.length) problems.push(`kuis #${i + 1} kunci di luar rentang`);
    if (!prompt.trim()) problems.push(`kuis #${i + 1} tanpa pertanyaan`);
  });
  if (problems.length) throw new Error(`Konten "${entry.slug}" tidak valid: ${problems.join(', ')}`);
}

/** @returns false bila dilewati karena sudah diedit admin */
async function upsertEntry(entry: Entry, meta: SetMeta, orderIndex: number): Promise<boolean> {
  validate(entry);
  const contentId = `lc_${entry.slug}`;

  if (!FORCE) {
    const [existing] = await db
      .select({ editedAt: learningContents.editedAt })
      .from(learningContents)
      .where(eq(learningContents.id, contentId))
      .limit(1);
    if (existing?.editedAt) return false;
  }

  const row = {
    id: contentId,
    slug: entry.slug,
    subjectId: meta.subjectId,
    type: meta.type,
    phaseMin: entry.phaseMin ?? meta.phaseMin,
    phaseMax: entry.phaseMax ?? meta.phaseMax,
    cefrLevel: meta.cefrLevel ?? null,
    theme: entry.theme,
    title: entry.title,
    titleTranslation: entry.titleTranslation ?? null,
    coverEmoji: entry.emoji,
    coverImageUrl: entry.coverImageUrl ?? null,
    editedAt: null,
    bodyMarkdown: entry.bodyMarkdown ?? null,
    segmentsJson: entry.segments.length ? JSON.stringify(entry.segments) : null,
    readingMinutes: entry.minutes,
    orderIndex,
    isPublished: true,
  };

  await db.transaction(async (tx) => {
    await tx.insert(learningContents).values(row).onConflictDoUpdate({ target: learningContents.id, set: row });

    await tx.delete(contentVocab).where(eq(contentVocab.contentId, contentId));
    await tx.delete(contentGrammarNotes).where(eq(contentGrammarNotes.contentId, contentId));
    await tx.delete(contentQuizItems).where(eq(contentQuizItems.contentId, contentId));

    if (entry.vocab.length) {
      await tx.insert(contentVocab).values(
        entry.vocab.map((v, i) => ({
          id: `${contentId}_v${i}`,
          contentId,
          word: v.word,
          meaning: v.meaning,
          emoji: v.emoji ?? null,
          partOfSpeech: v.partOfSpeech ?? null,
          forms: v.forms?.length ? JSON.stringify(v.forms) : null,
          example: v.example ?? null,
          orderIndex: i,
        }))
      );
    }
    if (entry.notes.length) {
      await tx.insert(contentGrammarNotes).values(
        entry.notes.map((g, i) => ({
          id: `${contentId}_g${i}`,
          contentId,
          title: g.title,
          pattern: g.pattern ?? null,
          explanation: g.explanation,
          examples: JSON.stringify(g.examples),
          orderIndex: i,
        }))
      );
    }
    if (entry.quiz.length) {
      await tx.insert(contentQuizItems).values(
        entry.quiz.map(([prompt, rawOptions, rawCorrect, explanation], i) => {
          const { options, correctIndex } = shuffleOptions(rawOptions, rawCorrect, `${entry.slug}#${i}`);
          return {
            id: `${contentId}_q${i}`,
            contentId,
            prompt,
            options: JSON.stringify(options),
            correctIndex,
            explanation: explanation ?? null,
            orderIndex: i,
          };
        })
      );
    }
  });
  return true;
}

export async function seedLearning() {
  console.log('--- Seeding Pustaka Belajar ---');
  await runMigrations();

  for (const s of SUBJECTS) {
    await db
      .insert(subjects)
      .values(s)
      .onConflictDoUpdate({ target: subjects.id, set: { name: s.name, slug: s.slug, icon: s.icon, orderIndex: s.orderIndex } });
  }
  console.log(`Subjects: ${SUBJECTS.length}`);

  const skipped: string[] = [];
  for (const { meta, entries } of CONTENT_SETS) {
    for (const [idx, entry] of entries.entries()) {
      if (!(await upsertEntry(entry, meta, meta.orderBase + idx))) skipped.push(entry.slug);
    }
    console.log(`${meta.type} (${meta.subjectId}, Fase ${meta.phaseMin}–${meta.phaseMax}): ${entries.length}`);
  }
  if (skipped.length) {
    console.log(`Dilewati karena sudah diedit di panel admin (pakai --force untuk menimpa): ${skipped.join(', ')}`);
  }
}

if (require.main === module) {
  seedLearning()
    .then(async () => {
      await client.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seeding Pustaka Belajar gagal:', err);
      await client.end();
      process.exit(1);
    });
}
