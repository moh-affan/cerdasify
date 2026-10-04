import * as XLSX from 'xlsx';
import { db, client } from '@/db';
import { categories, topics, questions, questionOptions, users } from '@/db/schema';
import { slugify } from '@/lib/utils';
import bcrypt from 'bcryptjs';

export interface ImportError {
  row: number;
  field?: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  importedCount: number;
  errors: ImportError[];
}

export function parseSpreadsheetBuffer(buffer: Buffer): Record<string, any>[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
}

export async function importQuestions(rows: Record<string, any>[]): Promise<ImportResult> {
  const errors: ImportError[] = [];
  const validRows: any[] = [];

  const requiredFields = ['kategori', 'topik', 'tipe_soal', 'pertanyaan', 'opsi_a', 'opsi_b', 'kunci_jawaban'];

  for (let idx = 0; idx < rows.length; idx++) {
    const rowNum = idx + 2; // header is row 1
    const row = rows[idx];

    // Normalize keys to lowercase
    const normalized: Record<string, string> = {};
    for (const key of Object.keys(row)) {
      normalized[key.trim().toLowerCase()] = String(row[key] || '').trim();
    }

    // Check required fields
    let missingField: string | null = null;
    for (const req of requiredFields) {
      if (!normalized[req]) {
        missingField = req;
        break;
      }
    }

    if (missingField) {
      errors.push({
        row: rowNum,
        field: missingField,
        message: `Kolom wajib '${missingField}' tidak boleh kosong`,
      });
      continue;
    }

    const type = (normalized['tipe_soal'] || 'SINGLE').toUpperCase();
    if (!['SINGLE', 'SCALE', 'MULTI'].includes(type)) {
      errors.push({
        row: rowNum,
        field: 'tipe_soal',
        message: `Tipe soal '${type}' tidak valid. Harus SINGLE, SCALE, atau MULTI`,
      });
      continue;
    }

    const kunci = normalized['kunci_jawaban'].toUpperCase();
    if (type === 'SINGLE' && !['A', 'B', 'C', 'D', 'E'].includes(kunci)) {
      errors.push({
        row: rowNum,
        field: 'kunci_jawaban',
        message: `Kunci jawaban '${kunci}' tidak valid untuk tipe SINGLE. Harus A, B, C, D, atau E`,
      });
      continue;
    }

    if (type === 'SCALE') {
      const pairs = kunci.split(',');
      if (pairs.length < 2) {
        errors.push({
          row: rowNum,
          field: 'kunci_jawaban',
          message: `Format kunci skala tidak valid. Contoh format yang benar: A:5,B:4,C:3,D:2,E:1`,
        });
        continue;
      }
    }

    validRows.push({
      rowNum,
      kategori: normalized['kategori'],
      topik: normalized['topik'],
      type: type === 'SCALE' ? 'GRADED_SCALE' : type === 'MULTI' ? 'MULTI_CHOICE' : 'SINGLE_CHOICE',
      pertanyaan: normalized['pertanyaan'],
      opsi_a: normalized['opsi_a'],
      opsi_b: normalized['opsi_b'],
      opsi_c: normalized['opsi_c'] || '',
      opsi_d: normalized['opsi_d'] || '',
      opsi_e: normalized['opsi_e'] || '',
      kunci_jawaban: kunci,
      pembahasan: normalized['pembahasan'] || '',
      tingkat_kesulitan: (normalized['tingkat_kesulitan'] || 'MEDIUM').toUpperCase(),
    });
  }

  if (errors.length > 0 && validRows.length === 0) {
    return {
      success: false,
      totalRows: rows.length,
      importedCount: 0,
      errors,
    };
  }

  let importedCount = 0;
  await client.begin(async (sql) => {
    const categoryCache = new Map<string, string>();
    const topicCache = new Map<string, string>();

    const allExistingCats = await db.select().from(categories);
    for (const c of allExistingCats) {
      categoryCache.set(c.name.toLowerCase(), c.id);
    }

    const allExistingTopics = await db.select().from(topics);
    for (const t of allExistingTopics) {
      topicCache.set(`${t.categoryId}:::${t.name.toLowerCase()}`, t.id);
    }

    for (const r of validRows) {
      // 1. Category
      let catId = categoryCache.get(r.kategori.toLowerCase());
      if (!catId) {
        catId = `cat_${slugify(r.kategori)}_${Date.now()}`;
        await sql`
          INSERT INTO categories (id, name, slug, description)
          VALUES (${catId}, ${r.kategori}, ${slugify(r.kategori)}, ${`Kategori ${r.kategori}`})
          ON CONFLICT (id) DO NOTHING
        `;
        categoryCache.set(r.kategori.toLowerCase(), catId);
      }

      // 2. Topic
      const tKey = `${catId}:::${r.topik.toLowerCase()}`;
      let topicId = topicCache.get(tKey);
      if (!topicId) {
        topicId = `top_${slugify(r.topik)}_${Date.now()}`.slice(0, 40);
        await sql`
          INSERT INTO topics (id, category_id, name, slug)
          VALUES (${topicId}, ${catId}, ${r.topik}, ${slugify(r.topik)})
          ON CONFLICT (id) DO NOTHING
        `;
        topicCache.set(tKey, topicId);
      }

      // 3. Question
      const qId = `q_imp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const difficulty = ['EASY', 'MEDIUM', 'HARD', 'HOTS'].includes(r.tingkat_kesulitan) ? r.tingkat_kesulitan : 'MEDIUM';

      await sql`
        INSERT INTO questions (id, topic_id, type, content_markdown, explanation_markdown, difficulty)
        VALUES (${qId}, ${topicId}, ${r.type}, ${r.pertanyaan}, ${r.pembahasan}, ${difficulty})
      `;

      // 4. Options
      const optionsToInsert: { label: string; content: string }[] = [];
      if (r.opsi_a) optionsToInsert.push({ label: 'A', content: r.opsi_a });
      if (r.opsi_b) optionsToInsert.push({ label: 'B', content: r.opsi_b });
      if (r.opsi_c) optionsToInsert.push({ label: 'C', content: r.opsi_c });
      if (r.opsi_d) optionsToInsert.push({ label: 'D', content: r.opsi_d });
      if (r.opsi_e) optionsToInsert.push({ label: 'E', content: r.opsi_e });

      const scaleMap: Record<string, number> = {};
      if (r.type === 'GRADED_SCALE') {
        for (const pair of r.kunci_jawaban.split(',')) {
          const [lbl, val] = pair.split(':');
          if (lbl && val) scaleMap[lbl.trim().toUpperCase()] = parseInt(val.trim(), 10) || 0;
        }
      }

      for (let oIdx = 0; oIdx < optionsToInsert.length; oIdx++) {
        const opt = optionsToInsert[oIdx];
        const optId = `opt_${qId}_${oIdx}_${opt.label}`;
        const isCorrect = r.type === 'GRADED_SCALE' ? true : opt.label === r.kunci_jawaban;
        const scoreVal = r.type === 'GRADED_SCALE' ? scaleMap[opt.label] || 1 : isCorrect ? 4 : 0;

        await sql`
          INSERT INTO question_options (id, question_id, label, content_markdown, is_correct, score_value, order_index)
          VALUES (${optId}, ${qId}, ${opt.label}, ${opt.content}, ${Boolean(isCorrect)}, ${scoreVal}, ${oIdx})
        `;
      }

      importedCount++;
    }
  });

  return {
    success: importedCount > 0,
    totalRows: rows.length,
    importedCount,
    errors,
  };
}

export async function importUsers(rows: Record<string, any>[]): Promise<ImportResult> {
  const errors: ImportError[] = [];
  const validUsers: any[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const rowNum = idx + 2;
    const row = rows[idx];

    const normalized: Record<string, string> = {};
    for (const key of Object.keys(row)) {
      normalized[key.trim().toLowerCase()] = String(row[key] || '').trim();
    }

    const name = normalized['nama_lengkap'] || normalized['nama'];
    const username = normalized['username_atau_email'] || normalized['username'];
    const rawPass = normalized['password'] || 'Cerdasify123!';
    const roleRaw = (normalized['role'] || 'USER').toUpperCase();
    const role = ['SUPER_ADMIN', 'ADMIN', 'USER'].includes(roleRaw) ? roleRaw : 'USER';

    if (!name || !username) {
      errors.push({
        row: rowNum,
        message: 'Nama lengkap dan username tidak boleh kosong',
      });
      continue;
    }

    validUsers.push({
      rowNum,
      name,
      username,
      rawPass,
      role,
    });
  }

  let importedCount = 0;
  const existingUsers = await db.select().from(users);

  for (const u of validUsers) {
    const existing = existingUsers.find((x) => x.username.toLowerCase() === u.username.toLowerCase());
    if (existing) {
      errors.push({
        row: u.rowNum,
        message: `Username '${u.username}' sudah terdaftar`,
      });
      continue;
    }

    const passwordHash = await bcrypt.hash(u.rawPass, 10);
    const userId = `usr_imp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await client`
      INSERT INTO users (id, username, name, password_hash, role, is_active)
      VALUES (${userId}, ${u.username}, ${u.name}, ${passwordHash}, ${u.role}, true)
    `;

    importedCount++;
  }

  return {
    success: importedCount > 0,
    totalRows: rows.length,
    importedCount,
    errors,
  };
}
