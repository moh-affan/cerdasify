import * as XLSX from 'xlsx';
import crypto from 'crypto';
import { db, client } from '@/db';
import { categories, topics, users } from '@/db/schema';
import { slugify } from '@/lib/utils';
import bcrypt from 'bcryptjs';

export interface ImportError {
  row: number;
  field?: string;
  message: string;
}

export interface GeneratedCredential {
  row: number;
  username: string;
  password: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  importedCount: number;
  errors: ImportError[];
  /** Password acak untuk baris peserta yang kolom password-nya kosong (tampilkan sekali ke Super Admin) */
  generatedCredentials?: GeneratedCredential[];
}

export type SpreadsheetRow = Record<string, unknown>;

type QuestionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'GRADED_SCALE';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'HOTS';

interface ValidQuestionRow {
  rowNum: number;
  kategori: string;
  topik: string;
  type: QuestionType;
  pertanyaan: string;
  options: { label: string; content: string }[];
  correctLabels: Set<string>;
  scaleMap: Record<string, number>;
  pembahasan: string;
  difficulty: Difficulty;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'] as const;

/** Template resmi memakai istilah Indonesia; nilai bahasa Inggris tetap diterima. */
const DIFFICULTY_MAP: Record<string, Difficulty> = {
  EASY: 'EASY',
  MUDAH: 'EASY',
  MEDIUM: 'MEDIUM',
  SEDANG: 'MEDIUM',
  HARD: 'HARD',
  SULIT: 'HARD',
  SUKAR: 'HARD',
  HOTS: 'HOTS',
};

export function parseSpreadsheetBuffer(buffer: Buffer): SpreadsheetRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<SpreadsheetRow>(worksheet, { defval: '' });
}

/** Kunci header dibuat huruf kecil & nilai dijadikan string ter-trim. */
function normalizeRow(row: SpreadsheetRow): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const key of Object.keys(row)) {
    const value = row[key];
    normalized[key.trim().toLowerCase()] = value === null || value === undefined ? '' : String(value).trim();
  }
  return normalized;
}

const randomSuffix = () => crypto.randomBytes(4).toString('hex');

export async function importQuestions(rows: SpreadsheetRow[]): Promise<ImportResult> {
  const errors: ImportError[] = [];
  const validRows: ValidQuestionRow[] = [];

  const requiredFields = ['kategori', 'topik', 'tipe_soal', 'pertanyaan', 'opsi_a', 'opsi_b', 'kunci_jawaban'];

  for (let idx = 0; idx < rows.length; idx++) {
    const rowNum = idx + 2; // baris 1 = header
    const normalized = normalizeRow(rows[idx]);
    const fail = (field: string, message: string) => errors.push({ row: rowNum, field, message });

    const missingField = requiredFields.find((f) => !normalized[f]);
    if (missingField) {
      fail(missingField, `Kolom wajib '${missingField}' tidak boleh kosong`);
      continue;
    }

    const rawType = normalized['tipe_soal'].toUpperCase();
    if (!['SINGLE', 'SCALE', 'MULTI'].includes(rawType)) {
      fail('tipe_soal', `Tipe soal '${rawType}' tidak valid. Harus SINGLE, SCALE, atau MULTI`);
      continue;
    }
    const type: QuestionType = rawType === 'SCALE' ? 'GRADED_SCALE' : rawType === 'MULTI' ? 'MULTI_CHOICE' : 'SINGLE_CHOICE';

    const options = OPTION_LABELS.map((label) => ({ label, content: normalized[`opsi_${label.toLowerCase()}`] || '' })).filter(
      (o) => o.content
    );
    const optionLabels = new Set<string>(options.map((o) => o.label));
    const kunci = normalized['kunci_jawaban'].toUpperCase().replace(/\s+/g, '');

    const correctLabels = new Set<string>();
    const scaleMap: Record<string, number> = {};

    if (type === 'SINGLE_CHOICE') {
      if (!optionLabels.has(kunci)) {
        fail('kunci_jawaban', `Kunci '${kunci}' tidak valid: harus salah satu opsi yang terisi (${[...optionLabels].join(', ')})`);
        continue;
      }
      correctLabels.add(kunci);
    } else if (type === 'MULTI_CHOICE') {
      const keys = kunci.split(',').filter(Boolean);
      const invalid = keys.filter((k) => !optionLabels.has(k));
      if (keys.length === 0 || invalid.length > 0) {
        fail('kunci_jawaban', `Kunci MULTI harus daftar opsi yang terisi, contoh: A,C${invalid.length ? ` (tidak valid: ${invalid.join(', ')})` : ''}`);
        continue;
      }
      keys.forEach((k) => correctLabels.add(k));
    } else {
      // SCALE (TKP): setiap opsi wajib punya poin 1–5, contoh A:3,B:5,C:2,D:4,E:1
      let malformed = false;
      for (const pair of kunci.split(',').filter(Boolean)) {
        const match = pair.match(/^([A-E]):([1-5])$/);
        if (!match) {
          malformed = true;
          break;
        }
        scaleMap[match[1]] = Number(match[2]);
      }
      const missing = [...optionLabels].filter((l) => scaleMap[l] === undefined);
      const extra = Object.keys(scaleMap).filter((l) => !optionLabels.has(l));
      if (malformed || missing.length > 0 || extra.length > 0) {
        fail(
          'kunci_jawaban',
          `Format kunci skala tidak valid${missing.length ? `; opsi tanpa poin: ${missing.join(', ')}` : ''}${
            extra.length ? `; poin untuk opsi kosong: ${extra.join(', ')}` : ''
          }. Contoh: A:3,B:5,C:2,D:4,E:1 (poin 1–5)`
        );
        continue;
      }
    }

    const rawDifficulty = (normalized['tingkat_kesulitan'] || 'MEDIUM').toUpperCase();
    const difficulty = DIFFICULTY_MAP[rawDifficulty];
    if (!difficulty) {
      fail('tingkat_kesulitan', `Tingkat kesulitan '${rawDifficulty}' tidak valid. Gunakan MUDAH, SEDANG, SULIT, atau HOTS`);
      continue;
    }

    validRows.push({
      rowNum,
      kategori: normalized['kategori'],
      topik: normalized['topik'],
      type,
      pertanyaan: normalized['pertanyaan'],
      options,
      correctLabels,
      scaleMap,
      pembahasan: normalized['pembahasan'] || '',
      difficulty,
    });
  }

  if (validRows.length === 0) {
    return { success: false, totalRows: rows.length, importedCount: 0, errors };
  }

  // Semua baris valid ditulis dalam satu transaksi: gagal satu, batal semua.
  let importedCount = 0;
  await client.begin(async (sql) => {
    const categoryCache = new Map<string, string>();
    const topicCache = new Map<string, string>();

    for (const c of await db.select().from(categories)) {
      categoryCache.set(c.name.toLowerCase(), c.id);
      categoryCache.set(`slug:${c.slug}`, c.id);
    }
    for (const t of await db.select().from(topics)) {
      topicCache.set(`${t.categoryId}:::${t.name.toLowerCase()}`, t.id);
    }

    for (const r of validRows) {
      // 1. Kategori (dibuat otomatis bila belum ada; dicocokkan juga lewat slug agar tidak bentrok)
      const catSlug = slugify(r.kategori) || `kategori-${randomSuffix()}`;
      let catId = categoryCache.get(r.kategori.toLowerCase()) ?? categoryCache.get(`slug:${catSlug}`);
      if (!catId) {
        catId = `cat_${catSlug.slice(0, 30)}_${randomSuffix()}`;
        await sql`
          INSERT INTO categories (id, name, slug, description)
          VALUES (${catId}, ${r.kategori}, ${catSlug}, ${`Kategori ${r.kategori}`})
        `;
        categoryCache.set(r.kategori.toLowerCase(), catId);
        categoryCache.set(`slug:${catSlug}`, catId);
      }

      // 2. Topik
      const tKey = `${catId}:::${r.topik.toLowerCase()}`;
      let topicId = topicCache.get(tKey);
      if (!topicId) {
        topicId = `top_${slugify(r.topik).slice(0, 30)}_${randomSuffix()}`;
        await sql`
          INSERT INTO topics (id, category_id, name, slug)
          VALUES (${topicId}, ${catId}, ${r.topik}, ${slugify(r.topik)})
        `;
        topicCache.set(tKey, topicId);
      }

      // 3. Soal
      const qId = `q_imp_${Date.now()}_${randomSuffix()}`;
      await sql`
        INSERT INTO questions (id, topic_id, type, content_markdown, explanation_markdown, difficulty)
        VALUES (${qId}, ${topicId}, ${r.type}, ${r.pertanyaan}, ${r.pembahasan || null}, ${r.difficulty})
      `;

      // 4. Opsi
      for (const [oIdx, opt] of r.options.entries()) {
        const isScale = r.type === 'GRADED_SCALE';
        // soal berbobot: opsi berbobot tertinggi ditandai sebagai pilihan terbaik
        const isCorrect = isScale
          ? r.scaleMap[opt.label] === Math.max(...Object.values(r.scaleMap))
          : r.correctLabels.has(opt.label);
        const scoreVal = isScale ? r.scaleMap[opt.label] : isCorrect ? 4 : 0;
        await sql`
          INSERT INTO question_options (id, question_id, label, content_markdown, is_correct, score_value, order_index)
          VALUES (${`opt_${qId}_${opt.label}`}, ${qId}, ${opt.label}, ${opt.content}, ${isCorrect}, ${scoreVal}, ${oIdx})
        `;
      }

      importedCount++;
    }
  });

  return { success: importedCount > 0, totalRows: rows.length, importedCount, errors };
}

/** Password acak yang mudah dibacakan (tanpa karakter mirip seperti 0/O, 1/l). */
function generatePassword(): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(10);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

/**
 * Impor peserta. Hanya untuk Super Admin (dicek di route).
 * Role SUPER_ADMIN tidak dapat dibuat lewat impor massal.
 */
export async function importUsers(rows: SpreadsheetRow[]): Promise<ImportResult> {
  const errors: ImportError[] = [];
  const generatedCredentials: GeneratedCredential[] = [];
  const existing = new Set((await db.select({ username: users.username }).from(users)).map((u) => u.username.toLowerCase()));
  const seenInFile = new Set<string>();

  const validUsers: { rowNum: number; name: string; username: string; password: string; role: 'ADMIN' | 'USER' }[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const rowNum = idx + 2;
    const normalized = normalizeRow(rows[idx]);

    const name = normalized['nama_lengkap'] || normalized['nama'];
    const username = normalized['username_atau_email'] || normalized['username'];
    const roleRaw = (normalized['role'] || 'USER').toUpperCase();

    if (!name || !username) {
      errors.push({ row: rowNum, message: 'Nama lengkap dan username tidak boleh kosong' });
      continue;
    }
    if (roleRaw !== 'USER' && roleRaw !== 'ADMIN') {
      errors.push({ row: rowNum, field: 'role', message: `Role '${roleRaw}' tidak diizinkan lewat impor. Gunakan USER atau ADMIN` });
      continue;
    }
    const key = username.toLowerCase();
    if (existing.has(key)) {
      errors.push({ row: rowNum, field: 'username', message: `Username '${username}' sudah terdaftar` });
      continue;
    }
    if (seenInFile.has(key)) {
      errors.push({ row: rowNum, field: 'username', message: `Username '${username}' muncul lebih dari sekali di file` });
      continue;
    }

    let password = normalized['password'];
    if (password && password.length < 6) {
      errors.push({ row: rowNum, field: 'password', message: 'Password minimal 6 karakter' });
      continue;
    }
    if (!password) {
      password = generatePassword();
      generatedCredentials.push({ row: rowNum, username, password });
    }

    seenInFile.add(key);
    validUsers.push({ rowNum, name, username, password, role: roleRaw });
  }

  let importedCount = 0;
  const insertedRows = new Set<number>();
  for (const u of validUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    try {
      await db.insert(users).values({
        id: `usr_imp_${Date.now()}_${randomSuffix()}`,
        username: u.username,
        name: u.name,
        passwordHash,
        role: u.role,
        isActive: true,
      });
      importedCount++;
      insertedRows.add(u.rowNum);
    } catch (err) {
      console.error(`Import user row ${u.rowNum} failed:`, err);
      errors.push({ row: u.rowNum, message: 'Gagal menyimpan baris ini ke database' });
    }
  }

  return {
    success: importedCount > 0,
    totalRows: rows.length,
    importedCount,
    errors,
    generatedCredentials: generatedCredentials.filter((c) => insertedRows.has(c.row)),
  };
}
