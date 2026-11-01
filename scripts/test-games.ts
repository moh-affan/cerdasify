/**
 * Uji logika game edukasi (tanpa database): npm run test:games
 * - replay server menghasilkan skor yang sama dengan permainan klien
 * - generator Silang Angka selalu menghasilkan puzzle yang sah di semua set bawaan
 * - semua set bawaan lolos validasi & TTS Kata bisa disusun
 */
import assert from 'node:assert/strict';
import { GAME_SETS } from '../src/db/seed-data/games';
import { validateGameData } from '../src/lib/games/validate';
import { initialSprintState, replaySprint, sprintLogPlausible, sprintProblem, sprintStep, type SprintLogEntry } from '../src/lib/games/math-sprint';
import { buildMemoryBoard, replayMemory, type MemoryLogEntry } from '../src/lib/games/memory';
import { applyOp, checkCrossMath, COL_EQ, generateCrossMath, replayCrossMath, ROW_EQ, type CrossMathAnswer } from '../src/lib/games/crossmath';
import { checkCrossword, entryCells, gradeCrossword, publicCrossword } from '../src/lib/games/crossword';
import { buildVocabRound, gradeVocab, nextMastery, wordKey } from '../src/lib/games/vocab';
import type { CrossMathConfig, CrosswordItems, MathSprintConfig, MemoryConfig, VocabCard, VocabConfig } from '../src/lib/games/types';

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    throw err;
  }
}

const validated = GAME_SETS.map((s) => ({ s, ...validateGameData(s.engine, s.config, s.items ?? null) }));

test(`semua ${GAME_SETS.length} set bawaan lolos validasi, slug unik`, () => {
  assert.equal(new Set(GAME_SETS.map((s) => s.slug)).size, GAME_SETS.length);
  for (const v of validated) assert.ok(v.config, v.s.slug);
});

test('Kilat Hitung: replay server = permainan klien (semua set)', () => {
  for (const { s, config } of validated.filter((v) => v.s.engine === 'MATH_SPRINT')) {
    const cfg = config as MathSprintConfig;
    for (let seed = 1; seed <= 30; seed++) {
      let state = initialSprintState();
      let correct = 0;
      const log: SprintLogEntry[] = [];
      for (let i = 0; i < 25; i++) {
        const p = sprintProblem(seed, i, state.level, cfg);
        assert.ok(Number.isFinite(p.answer), `${s.slug}: jawaban tidak hingga`);
        assert.ok(Number.isInteger(p.answer), `${s.slug}: jawaban harus bulat (${p.text} = ${p.answer})`);
        if (!cfg.allowNegative && p.kind === 'NUM') assert.ok(p.answer >= 0, `${s.slug}: hasil negatif ${p.text}`);
        const ok = (seed + i) % 4 !== 0; // pola benar/salah campuran
        if (ok) correct++;
        log.push([ok ? p.answer : p.answer + 1, 1500]);
        state = sprintStep(state, ok);
      }
      const r = replaySprint(seed, cfg, log);
      assert.equal(r.correct, correct, s.slug);
      assert.equal(r.total, 25);
      assert.ok(sprintLogPlausible(cfg, log));
    }
  }
});

test('Kilat Hitung: log terlalu cepat / terlalu lama ditolak', () => {
  const cfg = validated.find((v) => v.s.slug === 'kilat-tambah-kurang-10')!.config as MathSprintConfig;
  assert.equal(sprintLogPlausible(cfg, Array.from({ length: 40 }, () => [1, 50] as SprintLogEntry)), false);
  assert.equal(sprintLogPlausible(cfg, Array.from({ length: 10 }, () => [1, 9000] as SprintLogEntry)), false);
});

test('Kartu Kembar: papan deterministik, permainan sempurna = ★★★, log curang ditolak', () => {
  for (const { s, config, items } of validated.filter((v) => v.s.engine === 'MEMORY_MATCH' && v.items !== null || v.s.engine === 'MEMORY_MATCH' && ['EXPR_RESULT', 'NUMBER_DOTS'].includes((v.config as MemoryConfig).pairMode))) {
    const cfg = config as MemoryConfig;
    for (let seed = 1; seed <= 20; seed++) {
      const board = buildMemoryBoard(seed, cfg, items);
      assert.deepEqual(buildMemoryBoard(seed, cfg, items), board, `${s.slug}: tidak deterministik`);
      assert.equal(board.length, cfg.pairs * 2, `${s.slug}: jumlah kartu`);
      assert.equal(new Set(board.filter((c) => c.side === 1).map((c) => c.label)).size, cfg.pairs, `${s.slug}: label sisi 2 ganda`);
      const perfect: MemoryLogEntry[] = [];
      for (let p = 0; p < cfg.pairs; p++) {
        const idx = board.map((c, i) => (c.pair === p ? i : -1)).filter((i) => i >= 0);
        perfect.push([idx[0], idx[1]]);
      }
      assert.equal(replayMemory(board, perfect)?.stars, 3);
      assert.equal(replayMemory(board, perfect.slice(1)), null, 'papan belum tuntas harus ditolak');
      assert.equal(replayMemory(board, [...perfect, perfect[0]]), null, 'kartu yang sudah cocok tidak boleh dibuka lagi');
    }
  }
});

test('Silang Angka: 300 puzzle per set selalu sah & dalam rentang', () => {
  for (const { s, config } of validated.filter((v) => v.s.engine === 'CROSSMATH')) {
    const cfg = config as CrossMathConfig;
    let plusOnly = 0;
    for (let seed = 1; seed <= 100; seed++) {
      for (let round = 0; round < cfg.rounds; round++) {
        const p = generateCrossMath(seed, round, cfg);
        const lo = cfg.allowNegative ? -cfg.max : 0;
        assert.ok(p.cells.every((v) => Number.isInteger(v) && v >= lo && v <= cfg.max), `${s.slug}: nilai di luar rentang ${p.cells}`);
        ROW_EQ.forEach((eq, r) => assert.equal(applyOp(p.cells[eq[0]], p.rowOps[r], p.cells[eq[1]]), p.cells[eq[2]]));
        COL_EQ.forEach((eq, c) => assert.equal(applyOp(p.cells[eq[0]], p.colOps[c], p.cells[eq[1]]), p.cells[eq[2]]));
        assert.equal(p.hidden.length, cfg.hidden, `${s.slug}: jumlah kotak kosong`);
        const answer: CrossMathAnswer = Object.fromEntries(p.hidden.map((i) => [String(i), p.cells[i]]));
        assert.ok(checkCrossMath(p, answer).ok);
        if ([...p.rowOps, ...p.colOps].every((o) => o === '+')) plusOnly++;
      }
    }
    const usesOther = cfg.ops.some((o) => o !== '+');
    if (usesOther) assert.ok(plusOnly < 100 * cfg.rounds * 0.5, `${s.slug}: terlalu sering hanya penjumlahan (${plusOnly})`);
    // Replay sesi: satu cek gagal di puzzle pertama
    const rounds = Array.from({ length: cfg.rounds }, (_, r) => {
      const p = generateCrossMath(7, r, cfg);
      const good = Object.fromEntries(p.hidden.map((i) => [String(i), p.cells[i]]));
      return { attempts: r === 0 ? [{ ...good, [String(p.hidden[0])]: p.cells[p.hidden[0]] + 1 }, good] : [good] };
    });
    const result = replayCrossMath(7, cfg, rounds);
    assert.ok(result && result.correct === cfg.rounds && result.stars === 2, `${s.slug}: replay`);
    assert.equal(replayCrossMath(7, cfg, rounds.slice(1)), null);
  }
});

test('TTS Kata: semua kata tersusun, grid ≤ 15×15, tanpa tabrakan huruf', () => {
  for (const { s, items, warnings } of validated.filter((v) => v.s.engine === 'CROSSWORD')) {
    const { layout, words } = items as CrosswordItems;
    assert.equal(warnings.length, 0, `${s.slug}: ${warnings.join('; ')}`);
    assert.equal(layout.entries.length, words.length);
    const grid = new Map<string, string>();
    for (const e of layout.entries) {
      entryCells(e).forEach(([r, c], i) => {
        assert.ok(r >= 0 && c >= 0 && r < layout.rows && c < layout.cols, `${s.slug}: di luar grid`);
        const k = `${r},${c}`;
        if (grid.has(k)) assert.equal(grid.get(k), e.answer[i], `${s.slug}: tabrakan di ${k}`);
        grid.set(k, e.answer[i]);
      });
    }
    const pub = publicCrossword(items as CrosswordItems);
    assert.ok(!JSON.stringify(pub).includes('"answer"'), 'versi publik tidak boleh memuat jawaban');
    const fill = Object.fromEntries(grid);
    assert.equal(checkCrossword(layout, fill).length, layout.entries.length);
    assert.equal(gradeCrossword(layout, fill, 0).stars, 3);
    console.log(`    ${s.slug}: ${layout.rows}×${layout.cols}, ${layout.entries.length} kata`);
  }
});

test('Kosakata: ronde berisi kata baru + jatuh tempo, pilihan unik, nilai & Leitner benar', () => {
  for (const { s, config, items } of validated.filter((v) => v.s.engine === 'VOCAB_PICTURE')) {
    const cfg = config as VocabConfig;
    const deck = items as VocabCard[];
    const today = '2026-11-01';
    const mastery = new Map(deck.slice(0, 5).map((c, i) => [wordKey(c.word), { box: i + 1, dueDate: i < 3 ? '2026-10-30' : '2026-11-20' }]));
    const round = buildVocabRound(42, deck, cfg, mastery, today);
    assert.deepEqual(buildVocabRound(42, deck, cfg, mastery, today), round, 'deterministik');
    assert.equal(round.length, Math.min(cfg.roundSize, deck.length));
    assert.equal(new Set(round.map((r) => r.idx)).size, round.length, `${s.slug}: kata ganda dalam ronde`);
    const dueIdx = [0, 1, 2];
    for (const d of dueIdx) if (round.length >= cfg.newPerRound + 3) assert.ok(round.some((r) => r.idx === d), `${s.slug}: kata jatuh tempo harus masuk`);
    for (const item of round) {
      assert.ok(cfg.modes.includes(item.mode), `${s.slug}: mode ${item.mode} tidak diizinkan`);
      if (item.options) {
        assert.ok(item.options.includes(item.idx));
        assert.equal(new Set(item.options.map((o) => deck[o].emoji)).size, item.options.length, `${s.slug}: emoji pilihan ganda`);
      }
      if (item.letters) assert.equal([...item.letters].sort().join(''), deck[item.idx].word.toLowerCase().split('').sort().join(''));
    }
    const answers = round.map((it) => (it.mode === 'LOOK_PICK' || it.mode === 'LISTEN_PICK' ? it.idx : ` ${deck[it.idx].word.toUpperCase()} `));
    const graded = gradeVocab(round, deck, answers);
    assert.equal(graded.correct, round.length);
    assert.equal(graded.stars, 3);
  }
  assert.deepEqual(nextMastery(undefined, true, '2026-11-01'), { box: 1, dueDate: '2026-11-02' });
  assert.deepEqual(nextMastery({ box: 3, dueDate: '2026-11-01' }, true, '2026-11-01'), { box: 4, dueDate: '2026-11-08' });
  assert.deepEqual(nextMastery({ box: 4, dueDate: '2026-11-01' }, false, '2026-11-01'), { box: 1, dueDate: '2026-11-02' });
});

console.log(`\n${passed} uji lolos.`);
