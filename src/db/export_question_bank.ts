/**
 * Ekspor bank soal dari database ke src/db/seed-data/question-bank/ (sumber kebenaran untuk `npm run seed`).
 *
 * Jalankan setelah mengubah soal/paket lewat panel admin agar perubahan ikut tersimpan di repo:
 *   npm run bank:export
 *
 * Format berkas sengaja stabil (urutan tetap, indentasi 2 spasi) agar perubahan mudah ditinjau lewat git diff.
 */
import fs from 'fs';
import path from 'path';
import { client } from './index';

export const BANK_DIR = path.join(__dirname, 'seed-data/question-bank');

export type BankOption = {
  id: string;
  label: string;
  content: string;
  imageUrl: string | null;
  isCorrect: boolean;
  scoreValue: number;
  order: number;
};
export type BankQuestion = {
  id: string;
  topicId: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'GRADED_SCALE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'HOTS';
  content: string;
  imageUrl: string | null;
  explanation: string | null;
  explanationImageUrl: string | null;
  options: BankOption[];
};
export type BankPackage = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  type: 'SIMULATION' | 'PRACTICE';
  durationMinutes: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  passingGradeRules: Record<string, number> | null;
  isPublished: boolean;
  /** id soal sesuai urutan tampil */
  questions: string[];
};
export type BankCategory = { id: string; name: string; slug: string; description: string | null; orderIndex: number };
export type BankTopic = { id: string; categoryId: string; name: string; slug: string };

const write = (file: string, data: unknown) => fs.writeFileSync(path.join(BANK_DIR, file), JSON.stringify(data, null, 2) + '\n');

async function main() {
  const [cats, tops, pkgs, pqs, qs, opts] = await Promise.all([
    client`SELECT id, name, slug, description, order_index FROM categories ORDER BY order_index, id`,
    client`SELECT id, category_id, name, slug FROM topics ORDER BY category_id, id`,
    client`SELECT * FROM exam_packages ORDER BY id`,
    client`SELECT package_id, question_id, order_index FROM package_questions ORDER BY package_id, order_index, question_id`,
    client`SELECT id, topic_id, type, difficulty, content_markdown, image_url, explanation_markdown, explanation_image_url FROM questions ORDER BY id`,
    client`SELECT id, question_id, label, content_markdown, image_url, is_correct, score_value, order_index FROM question_options ORDER BY question_id, order_index, label`,
  ]);

  const optsByQ = new Map<string, BankOption[]>();
  for (const o of opts) {
    const list = optsByQ.get(o.question_id) ?? [];
    list.push({ id: o.id, label: o.label, content: o.content_markdown, imageUrl: o.image_url, isCorrect: o.is_correct, scoreValue: o.score_value, order: o.order_index });
    optsByQ.set(o.question_id, list);
  }

  const packages: BankPackage[] = pkgs.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    type: p.type,
    durationMinutes: p.duration_minutes,
    shuffleQuestions: p.shuffle_questions,
    shuffleOptions: p.shuffle_options,
    passingGradeRules: p.passing_grade_rules ? JSON.parse(p.passing_grade_rules) : null,
    isPublished: p.is_published,
    questions: pqs.filter((r) => r.package_id === p.id).map((r) => r.question_id as string),
  }));

  // Setiap soal disimpan sekali, di berkas paket pertama yang memuatnya ("paket rumah").
  const home = new Map<string, string>();
  // Paket salinan (judul "(Salinan)") tidak dijadikan rumah selama soalnya ada di paket asli.
  const homeOrder = [...packages].sort((a, b) => Number(a.title.includes('(Salinan)')) - Number(b.title.includes('(Salinan)')) || a.id.localeCompare(b.id));
  for (const p of homeOrder) for (const q of p.questions) if (!home.has(q)) home.set(q, p.id);

  const byFile = new Map<string, BankQuestion[]>();
  for (const q of qs) {
    const file = home.get(q.id) ?? '_tanpa_paket';
    const list = byFile.get(file) ?? [];
    list.push({
      id: q.id,
      topicId: q.topic_id,
      type: q.type,
      difficulty: q.difficulty,
      content: q.content_markdown,
      imageUrl: q.image_url,
      explanation: q.explanation_markdown,
      explanationImageUrl: q.explanation_image_url,
      options: optsByQ.get(q.id) ?? [],
    });
    byFile.set(file, list);
  }

  fs.rmSync(path.join(BANK_DIR, 'questions'), { recursive: true, force: true });
  fs.mkdirSync(path.join(BANK_DIR, 'questions'), { recursive: true });
  write('categories.json', cats.map((c): BankCategory => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, orderIndex: c.order_index })));
  write('topics.json', tops.map((t): BankTopic => ({ id: t.id, categoryId: t.category_id, name: t.name, slug: t.slug })));
  write('packages.json', packages);
  for (const [file, list] of byFile) {
    // urutkan sesuai urutan tampil di paket rumah agar mudah dibaca
    const order = packages.find((p) => p.id === file)?.questions ?? [];
    list.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id) || a.id.localeCompare(b.id));
    write(`questions/${file}.json`, list);
  }
  console.log(`Diekspor: ${cats.length} kategori, ${tops.length} topik, ${packages.length} paket, ${qs.length} soal (${byFile.size} berkas)`);
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error('Ekspor gagal:', err instanceof Error ? err.message : err);
      process.exitCode = 1;
    })
    .finally(() => client.end());
}
