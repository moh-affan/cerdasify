'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, ExternalLink, Wand2, AlertTriangle } from 'lucide-react';
import { PHASES, PHASE_INFO, type Phase } from '@/lib/learning';
import { ENGINE_INFO, GAME_ENGINES, type GameEngine } from '@/lib/games/types';
import { cn, slugify } from '@/lib/utils';

export interface GameEditorInitial {
  slug: string;
  title: string;
  description: string;
  coverEmoji: string;
  engine: GameEngine;
  subjectId: string;
  phaseMin: Phase;
  phaseMax: Phase;
  orderIndex: number;
  isPublished: boolean;
  config: unknown;
  items: unknown;
}

const inputCls =
  'w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1';

const RULE_HELP = [
  'durationSec: lama permainan · waveSec: aturan berganti tiap sekian detik · pace: slow / normal / fast',
  'rules: { type: MULTIPLE, n, max } · { type: EVEN | ODD, max } · { type: EQUALS, target, ops: [+,-,×] } · { type: GREATER | LESS, than, max }',
  '{ type: CATEGORY, prompt, good: [label…], bad: [label…] } — label berupa emoji atau kata pendek; pastikan tidak ada label yang ambigu.',
];

/** Contoh konfigurasi per engine + penjelasan setiap kolom. */
const TEMPLATES: Record<GameEngine, { config: object; help: string[] }> = {
  MATH_SPRINT: {
    config: { mode: 'ARITH', durationSec: 60, ops: ['+', '-'], max: 10, maxCap: 20, stars: [5, 10, 15] },
    help: [
      'mode: ARITH (operasi hitung) · MAKE_TARGET (a + ? = target) · COMPARE (<, =, >) · TIU (persen/pecahan/desimal)',
      'ops: + - × ÷ ² √ · max/maxCap: batas hasil +/− di level 1 dan level 5',
      'factorMax/factorCap: batas faktor ×, ÷, ², √ · allowNegative: true untuk bilangan bulat negatif · target: untuk MAKE_TARGET',
      'stars: jumlah jawaban benar untuk ★, ★★, ★★★ (★★★ juga butuh akurasi ≥ 80%)',
    ],
  },
  MEMORY_MATCH: {
    config: { pairMode: 'WORD_EMOJI', pairs: 6, speak: true },
    help: [
      'pairMode: WORD_EMOJI / WORD_MEANING (isi daftar kata) · CUSTOM (isi pasangan bebas) · EXPR_RESULT / NUMBER_DOTS (tanpa daftar, dibuat otomatis)',
      'pairs: jumlah pasangan per permainan (3–12) · speak: ucapkan kata Inggris saat kartu dibuka',
      'EXPR_RESULT: tambahkan "ops" dan "max", mis. { "ops": ["×"], "max": 49 }',
    ],
  },
  CROSSMATH: {
    config: { rounds: 3, ops: ['+', '-'], max: 10, hidden: 3, bank: true },
    help: [
      'rounds: jumlah puzzle per sesi · ops: + - × ÷ · max: batas angka',
      'hidden: jumlah kotak kosong (1–6) · bank: true = pilih dari bank angka (anak), false = ketik dengan keypad',
      'allowNegative: true untuk bilangan negatif',
    ],
  },
  CROSSWORD: {
    config: { lang: 'id' },
    help: ['lang: id atau en · speak: true untuk mengucapkan kata Inggris yang sudah benar', 'Tata letak grid dihitung otomatis saat disimpan.'],
  },
  VOCAB_PICTURE: {
    config: { roundSize: 10, newPerRound: 4, modes: ['LOOK_PICK', 'LISTEN_PICK', 'SPELL'], options: 4, speak: true },
    help: [
      'roundSize: kata per ronde · newPerRound: maksimal kata baru per ronde',
      'modes: LOOK_PICK (lihat gambar → pilih kata) · LISTEN_PICK (dengar → pilih gambar) · SPELL (susun huruf) · TYPE (ketik kata)',
      'options: jumlah pilihan (2–6). Untuk SPELL/TYPE kata harus satu kata huruf a–z.',
    ],
  },
  BALLOON_POP: {
    config: { durationSec: 60, waveSec: 20, pace: 'normal', rules: [{ type: 'MULTIPLE', n: 3, max: 30 }, { type: 'EVEN', max: 20 }] },
    help: RULE_HELP,
  },
  CATCHER: {
    config: {
      durationSec: 60,
      waveSec: 20,
      pace: 'slow',
      rules: [{ type: 'CATEGORY', prompt: 'Tangkap hewan yang bisa terbang!', good: ['🐦', '🦋', '🐝'], bad: ['🐶', '🐢', '🐟'] }],
    },
    help: RULE_HELP,
  },
  LANE_RUNNER: {
    config: { gates: 30, hearts: 3, startInterval: 5000, minInterval: 3000, source: 'MATH', math: { mode: 'ARITH', ops: ['+', '-'], max: 10, maxCap: 20 } },
    help: [
      'gates: jumlah gerbang soal · hearts: nyawa · startInterval/minInterval: jarak antar-gerbang (ms), makin kecil makin cepat',
      'source MATH: isi "math" seperti Kilat Hitung (mode ARITH/MAKE_TARGET/TIU, ops, max, maxCap, factorMax, factorCap, allowNegative)',
      'source VOCAB: isi daftar kata di bawah + vocabMode EMOJI_TO_WORD (gambar → kata), WORD_TO_MEANING (kata → arti), LISTEN (dengar → gambar)',
    ],
  },
  TOWER_DEFENSE: {
    config: { waves: 5, hp: 5, boss: true, startLife: 14000, minLife: 9000, math: { mode: 'ARITH', ops: ['+', '-'], max: 20, maxCap: 50 } },
    help: [
      'waves: jumlah gelombang (robot per gelombang = 3 + nomor gelombang) · hp: nyawa benteng',
      'boss: robot bos bersoal cerita di akhir tiap gelombang · startLife/minLife: lama robot berjalan (ms)',
      'math: seperti Kilat Hitung (mode ARITH/MAKE_TARGET/TIU, ops, max, maxCap, factorMax, factorCap, allowNegative)',
    ],
  },
};

type ItemFormat = 'vocab' | 'pairs' | 'crossword' | null;

function itemFormat(engine: GameEngine, config: unknown): ItemFormat {
  const c = (config ?? {}) as Record<string, unknown>;
  if (engine === 'VOCAB_PICTURE') return 'vocab';
  if (engine === 'LANE_RUNNER') return c.source === 'VOCAB' ? 'vocab' : null;
  if (engine === 'CROSSWORD') return 'crossword';
  if (engine === 'MEMORY_MATCH' && c.source !== 'CONTENT_VOCAB') {
    if (c.pairMode === 'WORD_EMOJI' || c.pairMode === 'WORD_MEANING') return 'vocab';
    if (c.pairMode === 'CUSTOM') return 'pairs';
  }
  return null;
}

const FORMAT_HELP: Record<Exclude<ItemFormat, null>, string> = {
  vocab: 'Satu kata per baris: kata | arti | emoji — contoh: cat | kucing | 🐱',
  pairs: 'Satu pasangan per baris: sisi A | sisi B — contoh: Luas persegi | s × s',
  crossword: 'Satu kata per baris: JAWABAN | petunjuk | emoji (opsional) — contoh: PRIMA | Bilangan yang tepat memiliki dua faktor',
};

function itemsToText(items: unknown): string {
  const list = Array.isArray(items) ? items : items && typeof items === 'object' && 'words' in items ? (items as { words: unknown[] }).words : [];
  return (list as Record<string, string>[])
    .map((x) => {
      if ('word' in x) return [x.word, x.meaning, x.emoji].join(' | ');
      if ('answer' in x) return [x.answer, x.clue, x.emoji].filter(Boolean).join(' | ');
      if ('a' in x) return [x.a, x.b].join(' | ');
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

function textToItems(text: string, format: ItemFormat): unknown {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split('|').map((p) => p.trim()));
  if (format === 'vocab') return lines.map(([word = '', meaning = '', emoji = '']) => ({ word, meaning, emoji }));
  if (format === 'pairs') return lines.map(([a = '', b = '']) => ({ a, b }));
  if (format === 'crossword') return { words: lines.map(([answer = '', clue = '', emoji]) => ({ answer, clue, ...(emoji ? { emoji } : {}) })) };
  return null;
}

export default function GameEditorClient({
  setId,
  initial,
  subjects,
}: {
  setId: string | null;
  initial: GameEditorInitial;
  subjects: { id: string; name: string; icon: string | null }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [configText, setConfigText] = useState(() => JSON.stringify(initial.config ?? TEMPLATES[initial.engine].config, null, 2));
  const [itemsText, setItemsText] = useState(() => itemsToText(initial.items));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string; warnings?: string[] } | null>(null);

  const set = <K extends keyof GameEditorInitial>(key: K, value: GameEditorInitial[K]) => setForm((f) => ({ ...f, [key]: value }));

  let parsedConfig: unknown = null;
  let configError: string | null = null;
  try {
    parsedConfig = JSON.parse(configText);
  } catch {
    configError = 'Konfigurasi bukan JSON yang valid';
  }
  const format = itemFormat(form.engine, parsedConfig);

  const save = async () => {
    if (configError) {
      setStatus({ ok: false, msg: configError });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(setId ? `/api/admin/games/${setId}` : '/api/admin/games', {
        method: setId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, config: parsedConfig, items: format ? textToItems(itemsText, format) : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      setStatus({ ok: true, msg: 'Tersimpan. Jalankan npm run games:export agar perubahan masuk ke repo.', warnings: data.warnings });
      if (!setId) router.replace(`/admin/game/${data.id}`);
      else router.refresh();
    } catch (err) {
      setStatus({ ok: false, msg: err instanceof Error ? err.message : 'Gagal menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/game" className="p-2 rounded-xl text-slate-500 hover:bg-white" aria-label="Kembali">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-extrabold text-slate-900">{setId ? 'Edit Set Game' : 'Set Game Baru'}</h1>
        </div>
        <div className="flex items-center gap-2">
          {setId && (
            <Link
              href={`/bermain/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Coba main
            </Link>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan
          </button>
        </div>
      </div>

      {status && (
        <div className={cn('rounded-xl px-3 py-2 text-xs font-semibold', status.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700')}>
          {status.msg}
          {status.warnings?.map((w) => (
            <p key={w} className="mt-1 text-amber-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {w}
            </p>
          ))}
        </div>
      )}

      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Judul</label>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: setId || f.slug !== slugify(f.title) ? f.slug : slugify(title) }));
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Slug (URL /bermain/…)</label>
          <input className={cn(inputCls, 'font-mono')} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Deskripsi singkat</label>
          <input className={inputCls} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Jenis game</label>
          <select
            className={inputCls}
            value={form.engine}
            onChange={(e) => {
              const engine = e.target.value as GameEngine;
              set('engine', engine);
              if (!setId) setConfigText(JSON.stringify(TEMPLATES[engine].config, null, 2));
            }}
          >
            {GAME_ENGINES.map((e) => (
              <option key={e} value={e}>
                {ENGINE_INFO[e].emoji} {ENGINE_INFO[e].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Mata pelajaran</label>
          <select className={inputCls} value={form.subjectId} onChange={(e) => set('subjectId', e.target.value)}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Fase dari</label>
            <select className={inputCls} value={form.phaseMin} onChange={(e) => set('phaseMin', e.target.value as Phase)}>
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {PHASE_INFO[p].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>sampai</label>
            <select className={inputCls} value={form.phaseMax} onChange={(e) => set('phaseMax', e.target.value as Phase)}>
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {PHASE_INFO[p].label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelCls}>Emoji</label>
            <input className={cn(inputCls, 'text-center text-lg')} value={form.coverEmoji} onChange={(e) => set('coverEmoji', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Urutan</label>
            <input type="number" min={0} className={inputCls} value={form.orderIndex} onChange={(e) => set('orderIndex', Number(e.target.value))} />
          </div>
          <label className="flex flex-col justify-end pb-2 gap-1 text-xs font-semibold text-slate-700">
            <span className={labelCls}>Terbit</span>
            <input type="checkbox" className="w-5 h-5" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} />
          </label>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-800">Konfigurasi ({ENGINE_INFO[form.engine].label})</h2>
          <button
            type="button"
            onClick={() => setConfigText(JSON.stringify(TEMPLATES[form.engine].config, null, 2))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
          >
            <Wand2 className="w-3.5 h-3.5" /> Pakai templat
          </button>
        </div>
        <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc pl-4">
          {TEMPLATES[form.engine].help.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <textarea
          className={cn(inputCls, 'font-mono text-xs min-h-40', configError && 'border-rose-400')}
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          spellCheck={false}
        />
        {configError && <p className="text-xs text-rose-600">{configError}</p>}
      </section>

      {format ? (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2">
          <h2 className="text-sm font-bold text-slate-800">
            Isi ({itemsText.split('\n').filter((l) => l.trim()).length} baris)
          </h2>
          <p className="text-[11px] text-slate-500">{FORMAT_HELP[format]}</p>
          <p className="text-[11px] text-amber-700">
            Periksa ulang setiap kata, arti, emoji, dan petunjuk. Emoji harus jelas mewakili satu kata; hindari kata abstrak.
          </p>
          <textarea className={cn(inputCls, 'font-mono text-xs min-h-72')} value={itemsText} onChange={(e) => setItemsText(e.target.value)} spellCheck={false} />
        </section>
      ) : (
        <p className="text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 p-4">
          Jenis/mode ini tidak membutuhkan daftar isi — soal dibuat otomatis dari konfigurasi
          {(parsedConfig as { source?: string } | null)?.source === 'CONTENT_VOCAB' && ' (kartu diambil dari kosakata bacaan yang sedang dibuka)'}.
        </p>
      )}
    </div>
  );
}
