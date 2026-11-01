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
import type { CrossMathConfig, CrosswordItems, MathSprintConfig, MemoryConfig, Op, VocabCard, VocabConfig } from '../src/lib/games/types';
import { mulberry32 } from '../src/lib/games/rng';
import {
  balloonResult,
  buildDefenseSchedule,
  buildFallingSchedule,
  buildRunnerSchedule,
  basketAt,
  CATCH_RADIUS,
  catcherResult,
  defenseResult,
  replayBalloon,
  replayCatcher,
  replayDefense,
  replayRunner,
  ruleAt,
  rulePrompt,
  runnerResult,
  toSprintConfig,
  validMoveLog,
  wordProblem,
  type AnswerLog,
  type ArcadeRule,
  type DefenseConfig,
  type FallingConfig,
  type LaneLog,
  type MoveLog,
  type RunnerConfig,
  type TapLog,
} from '../src/lib/games/arcade';

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

// ─── Arcade ─────────────────────────────────────────────────────────────────

function ruleHolds(rule: ArcadeRule, label: string): boolean {
  if (rule.type === 'CATEGORY') return rule.good.includes(label);
  if (rule.type === 'EQUALS') {
    const m = label.match(/^(\d+) ([+−×]) (\d+)$/);
    assert.ok(m, `ekspresi tidak dikenal: ${label}`);
    const [a, op, b] = [Number(m![1]), m![2], Number(m![3])];
    return (op === '+' ? a + b : op === '−' ? a - b : a * b) === rule.target;
  }
  const n = Number(label);
  assert.ok(Number.isInteger(n), `label bukan bilangan: ${label}`);
  if (rule.type === 'MULTIPLE') return n % rule.n === 0;
  if (rule.type === 'EVEN') return n % 2 === 0;
  if (rule.type === 'ODD') return n % 2 === 1;
  if (rule.type === 'GREATER') return n > rule.than;
  if (rule.type === 'LESS') return n < rule.than;
  throw new Error('aturan tidak dikenal');
}

test('Balon & Tangkap: label sesuai aturan, jadwal dalam durasi, layar kosong saat aturan berganti', () => {
  for (const { s, config } of validated.filter((v) => v.s.engine === 'BALLOON_POP' || v.s.engine === 'CATCHER')) {
    const cfg = config as FallingConfig;
    for (let seed = 1; seed <= 40; seed++) {
      const sch = buildFallingSchedule(seed, cfg, s.engine === 'BALLOON_POP' ? 'balloon' : 'catcher');
      assert.deepEqual(buildFallingSchedule(seed, cfg, s.engine === 'BALLOON_POP' ? 'balloon' : 'catcher'), sch, 'deterministik');
      assert.ok(sch.items.length >= 15, `${s.slug}: terlalu sedikit benda (${sch.items.length})`);
      assert.ok(sch.items.some((i) => i.good) && sch.items.some((i) => !i.good));
      for (const item of sch.items) {
        assert.ok(item.t + item.life <= sch.durationMs, `${s.slug}: benda melewati durasi`);
        const rule = ruleAt(cfg, sch, item.t);
        assert.equal(ruleHolds(rule, item.label), item.good, `${s.slug}: "${item.label}" untuk ${rulePrompt(rule)} seharusnya ${item.good}`);
        // Benda harus hilang sebelum aturan berganti
        assert.equal(ruleAt(cfg, sch, item.t + item.life), rule, `${s.slug}: benda masih terlihat saat aturan berganti`);
      }
    }
  }
});

test('Balon Hitung: ketuk semua benar = ★★★; ketukan di luar waktu / ganda ditolak', () => {
  for (const { s, config } of validated.filter((v) => v.s.engine === 'BALLOON_POP')) {
    const sch = buildFallingSchedule(9, config as FallingConfig, 'balloon');
    const perfect: TapLog = sch.items.filter((i) => i.good).map((i) => [i.t + Math.round(i.life / 2), i.id] as [number, number]).sort((a, b) => a[0] - b[0]);
    const st = replayBalloon(sch, perfect)!;
    assert.equal(balloonResult(sch, st).stars, 3, s.slug);
    assert.ok(st.score > st.goodHits * 10, 'combo menambah skor');
    const g = sch.items.find((i) => i.good)!;
    assert.equal(replayBalloon(sch, [[g.t + g.life + 2000, g.id]]), null, 'di luar waktu tampil');
    assert.equal(replayBalloon(sch, [[g.t + 100, g.id], [g.t + 200, g.id]]), null, 'ketuk ganda');
    assert.equal(replayBalloon(sch, [[1000, 99999]]), null, 'balon tidak ada');
  }
});

test('Tangkap Benda: keranjang ideal = tanpa salah tangkap; menangkap 3 benda salah = selesai', () => {
  for (const { s, config } of validated.filter((v) => v.s.engine === 'CATCHER')) {
    for (let seed = 1; seed <= 30; seed++) {
    const sch = buildFallingSchedule(seed, config as FallingConfig, 'catcher');
    const byCatch = [...sch.items].sort((a, b) => a.t + a.life - (b.t + b.life));
    // Pemain ideal: geser ke benda benar, menghindar dari benda salah
    const goodMoves: MoveLog = [];
    let last = 0;
    for (const it of byCatch) {
      const catchAt = it.t + it.life;
      const at = Math.max(last, catchAt - 120);
      if (it.good) {
        goodMoves.push([at, it.x]);
        last = at;
      } else if (Math.abs(basketAt(goodMoves, catchAt) - it.x) <= CATCH_RADIUS) {
        goodMoves.push([at, it.x > 0.5 ? it.x - 0.4 : it.x + 0.4]);
        last = at;
      }
    }
    const st = replayCatcher(sch, goodMoves);
    const res = catcherResult(sch, st);
    assert.equal(st.badHits, 0, `${s.slug} seed ${seed}: benda salah tidak bisa dihindari`);
    assert.equal(res.correct, res.total, `${s.slug}: tangkapan ideal ${res.correct}/${res.total}`);
    assert.equal(res.stars, 3);
    assert.ok(validMoveLog(goodMoves));
    const badMoves: MoveLog = [];
    last = 0;
    for (const it of byCatch) {
      if (it.good) continue;
      const at = Math.max(last, it.t + it.life - 120);
      badMoves.push([at, it.x]);
      last = at;
    }
    const over = replayCatcher(sch, badMoves);
    assert.ok(over.overAt !== null && over.hearts === 0, `${s.slug}: game over`);
    assert.ok(catcherResult(sch, over).stars <= 1);
    }
    assert.equal(validMoveLog([[100, 0.5], [50, 0.4]]), false, 'waktu mundur ditolak');
  }
});

test('Lari Jawaban: opsi unik & satu kunci, lari sempurna = ★★★, salah 3× = selesai', () => {
  for (const { s, config, items } of validated.filter((v) => v.s.engine === 'LANE_RUNNER')) {
    const cfg = config as RunnerConfig;
    for (let seed = 1; seed <= 20; seed++) {
      const gates = buildRunnerSchedule(seed, cfg, (items as VocabCard[]) ?? null);
      assert.equal(gates.length, cfg.gates);
      for (const g of gates) {
        assert.equal(new Set(g.options).size, 3, `${s.slug}: opsi ganda ${g.options}`);
        if (cfg.source === 'MATH') {
          const p = sprintProblem(seed, g.i, Math.min(5, 1 + Math.floor((g.i * 5) / cfg.gates)), toSprintConfig(cfg.math!));
          assert.equal(g.options[g.correct], String(p.answer), `${s.slug}: kunci gerbang salah`);
          if (!cfg.math!.allowNegative) assert.ok(g.options.every((o) => Number(o) >= 0), `${s.slug}: opsi negatif`);
        }
        assert.ok(g.approach >= 1500 && g.approach < (g.i + 1 < gates.length ? gates[g.i + 1].T - g.T : Infinity), `${s.slug}: hanya satu gerbang terlihat`);
      }
      const perfect: LaneLog = gates.map((g) => [g.T - 300, g.correct] as [number, number]);
      const st = replayRunner(gates, cfg, perfect);
      assert.equal(runnerResult(gates, st).stars, 3);
      const wrong: LaneLog = gates.map((g) => [g.T - 300, (g.correct + 1) % 3] as [number, number]);
      const lost = replayRunner(gates, cfg, wrong);
      assert.equal(lost.overAt, gates[cfg.hearts - 1].T);
    }
  }
});

test('Jaga Benteng: jawaban bulat (termasuk soal cerita bos), jawab tepat waktu = ★★★, diam = benteng runtuh', () => {
  for (const { s, config } of validated.filter((v) => v.s.engine === 'TOWER_DEFENSE')) {
    const cfg = config as DefenseConfig;
    for (let seed = 1; seed <= 30; seed++) {
      const robots = buildDefenseSchedule(seed, cfg);
      assert.ok(robots.every((r) => Number.isInteger(r.answer)), `${s.slug}: jawaban tidak bulat`);
      if (!cfg.math.allowNegative) assert.ok(robots.every((r) => r.answer >= 0), `${s.slug}: jawaban negatif`);
      assert.equal(robots.filter((r) => r.boss).length, cfg.boss ? cfg.waves : 0);
      const answers: AnswerLog = [...robots].sort((a, b) => a.t - b.t).map((r) => [r.t + 400, r.answer] as [number, number]);
      const st = replayDefense(robots, cfg, answers);
      assert.equal(st.destroyed.size, robots.length, `${s.slug}: semua robot dihentikan`);
      assert.ok(st.doneAt !== null);
      assert.equal(defenseResult(robots, cfg, st).stars, 3);
      const idle = replayDefense(robots, cfg, []);
      assert.ok(idle.overAt !== null && idle.hp <= 0);
    }
  }
  for (let seed = 1; seed <= 300; seed++) {
    for (const math of [
      { mode: 'ARITH' as const, ops: ['+', '-', '×', '÷'] as Op[], max: 20, maxCap: 60 },
      { mode: 'TIU' as const, ops: ['×'] as Op[], max: 10, maxCap: 10 },
      { mode: 'ARITH' as const, ops: ['+'] as Op[], max: 10, maxCap: 30, allowNegative: true },
    ]) {
      const wp = wordProblem(mulberry32(seed), 1 + (seed % 5), math);
      assert.ok(Number.isInteger(wp.answer) && wp.answer >= (math.allowNegative ? -100 : 0), `soal cerita: ${wp.text} = ${wp.answer}`);
    }
  }
});

console.log(`\n${passed} uji lolos.`);
