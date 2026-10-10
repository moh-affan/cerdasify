'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ImagePlus,
  ClipboardPaste,
} from 'lucide-react';
import { MathEditorToolbar } from '@/components/admin/MathEditorToolbar';
import ComicPanelView from '@/components/learn/ComicPanelView';
import {
  COMIC_BACKGROUNDS,
  CONTENT_TYPE_LABEL,
  PHASES,
  PHASE_INFO,
  type ComicBubble,
  type ComicPanel,
  type ContentSegment,
  type Phase,
} from '@/lib/learning';
import type { ContentPayload, NoteInput, QuizInput, VocabInput } from '@/lib/content-admin';
import { cn, slugify } from '@/lib/utils';

type SegKind = 'en' | 'tx' | 'ar' | 'panel';

interface EditSegment extends ContentSegment {
  kind: SegKind;
}

export type EditorInitial = Omit<ContentPayload, 'segments'> & { segments: ContentSegment[] };

const KIND_LABEL: Record<SegKind, string> = {
  en: 'Kalimat Inggris + terjemahan',
  tx: 'Teks Indonesia',
  ar: 'Teks Arab + latin + arti',
  panel: 'Panel komik',
};

const DEFAULT_KIND: Record<string, SegKind> = {
  DAILY_READING: 'en',
  STORY: 'tx',
  ENCYCLOPEDIA: 'tx',
  COMIC: 'panel',
  SPEECH: 'tx',
  LESSON: 'tx',
};

const NOTES_LABEL: Record<string, string> = {
  DAILY_READING: 'Pola Kalimat / Analisis Grammar',
  STORY: 'Pesan Moral',
  COMIC: 'Pesan Moral',
  ENCYCLOPEDIA: 'Tahukah Kamu?',
  SPEECH: 'Tips Berpidato',
  LESSON: 'Catatan Penting',
};

const inputCls =
  'w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1';

const toEdit = (s: ContentSegment): EditSegment => ({
  ...s,
  kind: s.panel ? 'panel' : s.ar ? 'ar' : s.en ? 'en' : 'tx',
});

/** Hanya simpan field yang relevan dengan jenis segmen. */
function fromEdit(s: EditSegment): ContentSegment {
  const base: ContentSegment = {};
  if (s.h) base.h = s.h;
  if (s.break) base.break = true;
  if (s.kind === 'panel') return { ...base, panel: s.panel ?? {} };
  if (s.kind === 'en') return { ...base, en: s.en, id: s.id };
  if (s.kind === 'ar') return { ...base, ar: s.ar, latin: s.latin, id: s.id, ...(s.n ? { n: s.n } : {}) };
  return { ...base, tx: s.tx };
}

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal mengunggah gambar');
  return data.url;
}

function ImageField({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL gambar atau unggah →" className={inputCls} />
        <label className="shrink-0 inline-flex items-center gap-1.5 px-3 rounded-xl bg-slate-800 text-white text-xs font-semibold cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          Unggah
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                onChange(await uploadImage(file));
              } catch (err) {
                alert(err instanceof Error ? err.message : 'Gagal mengunggah');
              } finally {
                setUploading(false);
                e.target.value = '';
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}

function Section({ title, hint, children, actions }: { title: string; hint?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function RowTools({ onUp, onDown, onDelete }: { onUp: () => void; onDown: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <button type="button" onClick={onUp} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400" aria-label="Naik">
        <ChevronUp className="w-4 h-4" />
      </button>
      <button type="button" onClick={onDown} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400" aria-label="Turun">
        <ChevronDown className="w-4 h-4" />
      </button>
      <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600" aria-label="Hapus">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function PanelEditor({ panel, index, onChange }: { panel: ComicPanel; index: number; onChange: (p: ComicPanel) => void }) {
  const bubbles = panel.bubbles ?? [];
  const setBubble = (i: number, b: Partial<ComicBubble>) =>
    onChange({ ...panel, bubbles: bubbles.map((x, j) => (j === i ? { ...x, ...b } : x)) });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div>
          <span className={labelCls}>Narasi (caption)</span>
          <input value={panel.caption ?? ''} onChange={(e) => onChange({ ...panel, caption: e.target.value })} className={inputCls} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <span className={labelCls}>Adegan emoji</span>
            <input value={panel.scene ?? ''} onChange={(e) => onChange({ ...panel, scene: e.target.value })} placeholder="👦📖🦖" className={inputCls} />
          </div>
          <div>
            <span className={labelCls}>Latar</span>
            <select value={panel.bg ?? 'plain'} onChange={(e) => onChange({ ...panel, bg: e.target.value as ComicPanel['bg'] })} className={inputCls}>
              {COMIC_BACKGROUNDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ImageField label="Gambar panel (opsional, menggantikan emoji)" value={panel.img ?? ''} onChange={(img) => onChange({ ...panel, img })} />
        <div className="space-y-2">
          <span className={labelCls}>Balon dialog</span>
          {bubbles.map((b, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-center bg-slate-50 rounded-xl p-2">
              <input value={b.who} onChange={(e) => setBubble(i, { who: e.target.value })} placeholder="Tokoh" className={cn(inputCls, 'w-24 bg-white')} />
              <input value={b.text} onChange={(e) => setBubble(i, { text: e.target.value })} placeholder="Ucapan" className={cn(inputCls, 'flex-1 min-w-[10rem] bg-white')} />
              <select value={b.side ?? 'left'} onChange={(e) => setBubble(i, { side: e.target.value === 'right' ? 'right' : undefined })} className={cn(inputCls, 'w-24 bg-white')}>
                <option value="left">Kiri</option>
                <option value="right">Kanan</option>
              </select>
              <select
                value={b.tone ?? 'say'}
                onChange={(e) => setBubble(i, { tone: e.target.value === 'say' ? undefined : (e.target.value as ComicBubble['tone']) })}
                className={cn(inputCls, 'w-28 bg-white')}
              >
                <option value="say">Bicara</option>
                <option value="think">Berpikir</option>
                <option value="shout">Berteriak</option>
              </select>
              <button
                type="button"
                onClick={() => onChange({ ...panel, bubbles: bubbles.filter((_, j) => j !== i) })}
                className="p-1.5 text-slate-400 hover:text-rose-600"
                aria-label="Hapus balon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...panel, bubbles: [...bubbles, { who: '', text: '' }] })}
            className="text-xs font-semibold text-indigo-700 inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah balon
          </button>
        </div>
      </div>
      <div>
        <span className={labelCls}>Pratinjau</span>
        <ComicPanelView panel={panel} index={index} />
      </div>
    </div>
  );
}

export default function ContentEditorClient({
  contentId,
  initial,
  subjects,
}: {
  contentId: string | null;
  initial: EditorInitial;
  subjects: { id: string; name: string; icon: string | null }[];
}) {
  const router = useRouter();
  const [meta, setMeta] = useState(() => ({
    slug: initial.slug,
    title: initial.title,
    titleTranslation: initial.titleTranslation,
    type: initial.type,
    subjectId: initial.subjectId,
    phaseMin: initial.phaseMin,
    phaseMax: initial.phaseMax,
    cefrLevel: initial.cefrLevel,
    theme: initial.theme,
    coverEmoji: initial.coverEmoji,
    coverImageUrl: initial.coverImageUrl,
    readingMinutes: initial.readingMinutes,
    orderIndex: initial.orderIndex,
    isPublished: initial.isPublished,
  }));
  const [slugTouched, setSlugTouched] = useState(Boolean(contentId));
  const [bodyMarkdown, setBodyMarkdown] = useState(initial.bodyMarkdown);
  const [segments, setSegments] = useState<EditSegment[]>(() => initial.segments.map(toEdit));
  const [vocab, setVocab] = useState<VocabInput[]>(initial.vocab);
  const [notes, setNotes] = useState<NoteInput[]>(initial.notes);
  const [quiz, setQuiz] = useState<QuizInput[]>(initial.quiz);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pasteKind, setPasteKind] = useState<SegKind>(DEFAULT_KIND[initial.type] ?? 'tx');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof typeof meta>(key: K, value: (typeof meta)[K]) => setMeta((m) => ({ ...m, [key]: value }));
  const setSeg = (i: number, patch: Partial<EditSegment>) => setSegments((arr) => arr.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const defaultKind = DEFAULT_KIND[meta.type] ?? 'tx';

  const addSegment = (kind: SegKind) =>
    setSegments((arr) => [...arr, kind === 'panel' ? { kind, panel: { bg: 'plain', bubbles: [] } } : { kind }]);

  /** Tempel banyak baris sekaligus. Baris kosong = paragraf baru; pemisah kolom "||". */
  const applyPaste = () => {
    const out: EditSegment[] = [];
    let newPara = false;
    for (const raw of pasteText.split('\n')) {
      const line = raw.trim();
      if (!line) {
        newPara = out.length > 0;
        continue;
      }
      const cols = line.split('||').map((c) => c.trim());
      const seg: EditSegment =
        pasteKind === 'en'
          ? { kind: 'en', en: cols[0], id: cols[1] }
          : pasteKind === 'ar'
            ? { kind: 'ar', ar: cols[0], latin: cols[1], id: cols[2] }
            : pasteKind === 'panel'
              ? { kind: 'panel', panel: { caption: cols[0], bg: 'plain', bubbles: [] } }
              : { kind: 'tx', tx: cols[0] };
      if (newPara) seg.break = true;
      newPara = false;
      out.push(seg);
    }
    setSegments((arr) => [...arr, ...out]);
    setPasteText('');
    setPasteOpen(false);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = { ...meta, bodyMarkdown, segments: segments.map(fromEdit), vocab, notes, quiz };
      const res = await fetch(contentId ? `/api/admin/contents/${contentId}` : '/api/admin/contents', {
        method: contentId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      setMessage({ ok: true, text: 'Tersimpan ✓' });
      if (!contentId) router.replace(`/admin/konten/${data.id}`);
      else router.refresh();
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : 'Gagal menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-5 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/admin/konten" className="p-2 rounded-xl hover:bg-white text-slate-500" aria-label="Kembali">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-extrabold text-slate-900">{contentId ? 'Edit Konten' : 'Konten Baru'}</h1>
        </div>
        {contentId && (
          <Link
            href={`/belajar/${meta.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700"
          >
            <ExternalLink className="w-4 h-4" /> Lihat di Pustaka
          </Link>
        )}
      </div>

      {/* Info dasar */}
      <Section title="Informasi Konten">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <span className={labelCls}>Judul</span>
            <input
              value={meta.title}
              onChange={(e) => {
                set('title', e.target.value);
                if (!slugTouched) set('slug', slugify(e.target.value));
              }}
              className={inputCls}
            />
          </div>
          <div>
            <span className={labelCls}>Subjudul / terjemahan judul</span>
            <input value={meta.titleTranslation} onChange={(e) => set('titleTranslation', e.target.value)} className={inputCls} />
          </div>
          <div>
            <span className={labelCls}>Slug (alamat URL)</span>
            <input
              value={meta.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', e.target.value.toLowerCase());
              }}
              className={cn(inputCls, 'font-mono')}
            />
          </div>
          <div>
            <span className={labelCls}>Jenis</span>
            <select value={meta.type} onChange={(e) => set('type', e.target.value as typeof meta.type)} className={inputCls}>
              {Object.entries(CONTENT_TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelCls}>Mata pelajaran</span>
            <select value={meta.subjectId} onChange={(e) => set('subjectId', e.target.value)} className={inputCls}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className={labelCls}>Fase dari</span>
              <select value={meta.phaseMin} onChange={(e) => set('phaseMin', e.target.value as Phase)} className={inputCls}>
                {PHASES.map((p) => (
                  <option key={p} value={p}>
                    {p} · {PHASE_INFO[p].grades}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className={labelCls}>sampai</span>
              <select value={meta.phaseMax} onChange={(e) => set('phaseMax', e.target.value as Phase)} className={inputCls}>
                {PHASES.map((p) => (
                  <option key={p} value={p}>
                    {p} · {PHASE_INFO[p].grades}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className={labelCls}>Level CEFR</span>
              <select value={meta.cefrLevel} onChange={(e) => set('cefrLevel', e.target.value)} className={inputCls}>
                <option value="">—</option>
                {['PRE_A1', 'A1', 'A2', 'B1', 'B2', 'C1'].map((c) => (
                  <option key={c} value={c}>
                    {c.replace('_', '-')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className={labelCls}>Durasi (menit)</span>
              <input
                type="number"
                min={1}
                value={meta.readingMinutes}
                onChange={(e) => set('readingMinutes', Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <span className={labelCls}>Tema / kelompok</span>
            <input value={meta.theme} onChange={(e) => set('theme', e.target.value)} placeholder="mis. Doa Harian, Animals" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className={labelCls}>Emoji sampul</span>
              <input value={meta.coverEmoji} onChange={(e) => set('coverEmoji', e.target.value)} className={inputCls} />
            </div>
            <div>
              <span className={labelCls}>Urutan</span>
              <input type="number" value={meta.orderIndex} onChange={(e) => set('orderIndex', Number(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <ImageField label="Gambar sampul (opsional)" value={meta.coverImageUrl} onChange={(url) => set('coverImageUrl', url)} />
          </div>
          <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={meta.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4" />
            Terbitkan (tampil di Pustaka Belajar)
          </label>
        </div>
      </Section>

      {/* Markdown */}
      <Section
        title="Pengantar / Materi (Markdown + rumus)"
        hint="Untuk materi pelajaran, pengantar doa, dll. Mendukung **tebal**, *miring*, > kutipan, dan rumus $...$ / $$...$$."
      >
        <MathEditorToolbar onInsert={(snippet) => setBodyMarkdown((b) => b + snippet)} previewContent={bodyMarkdown} showPreview />
        <textarea value={bodyMarkdown} onChange={(e) => setBodyMarkdown(e.target.value)} rows={10} className={cn(inputCls, 'font-mono text-xs')} />
      </Section>

      {/* Segmen */}
      <Section
        title={`Teks Bacaan / Panel (${segments.length})`}
        hint="Kalimat per kalimat agar bisa dibacakan, diterjemahkan, dan disorot. Centang “Paragraf baru” untuk memulai paragraf."
        actions={
          <button
            type="button"
            onClick={() => setPasteOpen(!pasteOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
          >
            <ClipboardPaste className="w-4 h-4" /> Tempel banyak baris
          </button>
        }
      >
        {pasteOpen && (
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 space-y-2">
            <select value={pasteKind} onChange={(e) => setPasteKind(e.target.value as SegKind)} className={cn(inputCls, 'bg-white')}>
              {Object.entries(KIND_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-600">
              Satu baris = satu kalimat. Baris kosong = paragraf baru. Pisahkan kolom dengan <code>||</code>, misalnya{' '}
              <code>I have a cat. || Aku punya kucing.</code> atau <code>arab || latin || arti</code>.
            </p>
            <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} rows={6} className={cn(inputCls, 'bg-white font-mono text-xs')} />
            <button type="button" onClick={applyPaste} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
              Tambahkan ke daftar
            </button>
          </div>
        )}

        <div className="space-y-3">
          {segments.map((seg, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black text-slate-400 w-6">#{i + 1}</span>
                <select
                  value={seg.kind}
                  onChange={(e) => {
                    const kind = e.target.value as SegKind;
                    setSeg(i, kind === 'panel' && !seg.panel ? { kind, panel: { bg: 'plain', bubbles: [] } } : { kind });
                  }}
                  className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {Object.entries(KIND_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <input
                  value={seg.h ?? ''}
                  onChange={(e) => setSeg(i, { h: e.target.value })}
                  placeholder="Judul bagian (opsional)"
                  className="flex-1 min-w-[8rem] py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <label className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <input type="checkbox" checked={!!seg.break} onChange={(e) => setSeg(i, { break: e.target.checked })} />
                  Paragraf baru
                </label>
                <RowTools
                  onUp={() => setSegments((a) => move(a, i, -1))}
                  onDown={() => setSegments((a) => move(a, i, 1))}
                  onDelete={() => setSegments((a) => a.filter((_, j) => j !== i))}
                />
              </div>

              {seg.kind === 'en' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={seg.en ?? ''} onChange={(e) => setSeg(i, { en: e.target.value })} placeholder="English sentence" className={inputCls} />
                  <input value={seg.id ?? ''} onChange={(e) => setSeg(i, { id: e.target.value })} placeholder="Terjemahan" className={inputCls} />
                </div>
              )}
              {seg.kind === 'tx' && (
                <textarea value={seg.tx ?? ''} onChange={(e) => setSeg(i, { tx: e.target.value })} rows={2} className={inputCls} />
              )}
              {seg.kind === 'ar' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={seg.n ?? ''}
                      onChange={(e) => setSeg(i, { n: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="No. ayat"
                      className={cn(inputCls, 'w-24')}
                    />
                    <input
                      dir="rtl"
                      lang="ar"
                      value={seg.ar ?? ''}
                      onChange={(e) => setSeg(i, { ar: e.target.value })}
                      placeholder="النص العربي"
                      className={cn(inputCls, 'text-xl font-arabic')}
                    />
                  </div>
                  <input value={seg.latin ?? ''} onChange={(e) => setSeg(i, { latin: e.target.value })} placeholder="Latin" className={inputCls} />
                  <input value={seg.id ?? ''} onChange={(e) => setSeg(i, { id: e.target.value })} placeholder="Arti" className={inputCls} />
                </div>
              )}
              {seg.kind === 'panel' && (
                <PanelEditor
                  panel={seg.panel ?? {}}
                  index={segments.slice(0, i).filter((x) => x.kind === 'panel').length}
                  onChange={(panel) => setSeg(i, { panel })}
                />
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addSegment(defaultKind)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-indigo-400"
        >
          <Plus className="w-4 h-4" /> Tambah {KIND_LABEL[defaultKind].toLowerCase()}
        </button>
      </Section>

      {/* Kosakata */}
      <Section title={`Kosakata (${vocab.length})`} hint="Kata yang muncul di teks akan disorot dan bisa diketuk. Isi “bentuk lain” dipisah koma (mis. cats, ran).">
        <div className="space-y-2">
          {vocab.map((v, i) => {
            const upd = (patch: Partial<VocabInput>) => setVocab((a) => a.map((x, j) => (j === i ? { ...x, ...patch } : x)));
            return (
              <div key={i} className="flex flex-wrap gap-2 items-center bg-slate-50 rounded-xl p-2">
                <input value={v.emoji} onChange={(e) => upd({ emoji: e.target.value })} placeholder="🙂" className={cn(inputCls, 'w-14 bg-white text-center')} />
                <input value={v.word} onChange={(e) => upd({ word: e.target.value })} placeholder="Kata" className={cn(inputCls, 'w-32 bg-white')} />
                <input value={v.meaning} onChange={(e) => upd({ meaning: e.target.value })} placeholder="Arti / penjelasan" className={cn(inputCls, 'flex-1 min-w-[10rem] bg-white')} />
                <input value={v.partOfSpeech} onChange={(e) => upd({ partOfSpeech: e.target.value })} placeholder="noun/verb" className={cn(inputCls, 'w-24 bg-white')} />
                <input
                  value={v.forms.join(', ')}
                  onChange={(e) => upd({ forms: e.target.value.split(',').map((f) => f.trim()).filter(Boolean) })}
                  placeholder="Bentuk lain"
                  className={cn(inputCls, 'w-32 bg-white')}
                />
                <input value={v.example} onChange={(e) => upd({ example: e.target.value })} placeholder="Contoh kalimat" className={cn(inputCls, 'flex-1 min-w-[10rem] bg-white')} />
                <RowTools
                  onUp={() => setVocab((a) => move(a, i, -1))}
                  onDown={() => setVocab((a) => move(a, i, 1))}
                  onDelete={() => setVocab((a) => a.filter((_, j) => j !== i))}
                />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setVocab((a) => [...a, { word: '', forms: [], partOfSpeech: '', meaning: '', example: '', emoji: '' }])}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-indigo-400"
        >
          <Plus className="w-4 h-4" /> Tambah kosakata
        </button>
      </Section>

      {/* Catatan */}
      <Section title={`${NOTES_LABEL[meta.type] ?? 'Catatan'} (${notes.length})`} hint="Contoh ditulis satu per baris.">
        <div className="space-y-3">
          {notes.map((n, i) => {
            const upd = (patch: Partial<NoteInput>) => setNotes((a) => a.map((x, j) => (j === i ? { ...x, ...patch } : x)));
            return (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={n.title} onChange={(e) => upd({ title: e.target.value })} placeholder="Judul" className={inputCls} />
                  <RowTools
                    onUp={() => setNotes((a) => move(a, i, -1))}
                    onDown={() => setNotes((a) => move(a, i, 1))}
                    onDelete={() => setNotes((a) => a.filter((_, j) => j !== i))}
                  />
                </div>
                <input value={n.pattern} onChange={(e) => upd({ pattern: e.target.value })} placeholder="Pola / rumus (opsional)" className={cn(inputCls, 'font-mono')} />
                <textarea value={n.explanation} onChange={(e) => upd({ explanation: e.target.value })} rows={2} placeholder="Penjelasan" className={inputCls} />
                <textarea
                  value={n.examples.join('\n')}
                  onChange={(e) => upd({ examples: e.target.value.split('\n') })}
                  rows={2}
                  placeholder="Contoh (satu per baris)"
                  className={inputCls}
                />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setNotes((a) => [...a, { title: '', pattern: '', explanation: '', examples: [] }])}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-indigo-400"
        >
          <Plus className="w-4 h-4" /> Tambah catatan
        </button>
      </Section>

      {/* Kuis */}
      <Section title={`Kuis Pemahaman (${quiz.length})`} hint="Pilih lingkaran di samping opsi yang benar. Kunci jawaban tidak dikirim ke browser peserta.">
        <div className="space-y-3">
          {quiz.map((q, i) => {
            const upd = (patch: Partial<QuizInput>) => setQuiz((a) => a.map((x, j) => (j === i ? { ...x, ...patch } : x)));
            return (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <span className="text-xs font-black text-slate-400 pt-2.5">{i + 1}.</span>
                  <input value={q.prompt} onChange={(e) => upd({ prompt: e.target.value })} placeholder="Pertanyaan" className={inputCls} />
                  <RowTools
                    onUp={() => setQuiz((a) => move(a, i, -1))}
                    onDown={() => setQuiz((a) => move(a, i, 1))}
                    onDelete={() => setQuiz((a) => a.filter((_, j) => j !== i))}
                  />
                </div>
                {q.options.map((o, oi) => (
                  <div key={oi} className="flex items-center gap-2 pl-5">
                    <input type="radio" name={`correct-${i}`} checked={q.correctIndex === oi} onChange={() => upd({ correctIndex: oi })} className="w-4 h-4" />
                    <input
                      value={o}
                      onChange={(e) => upd({ options: q.options.map((x, k) => (k === oi ? e.target.value : x)) })}
                      placeholder={`Pilihan ${String.fromCharCode(65 + oi)}`}
                      className={cn(inputCls, q.correctIndex === oi && 'border-emerald-400 bg-emerald-50')}
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          upd({
                            options: q.options.filter((_, k) => k !== oi),
                            correctIndex: q.correctIndex === oi ? 0 : q.correctIndex > oi ? q.correctIndex - 1 : q.correctIndex,
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                        aria-label="Hapus pilihan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="pl-5 flex flex-col gap-2">
                  {q.options.length < 5 && (
                    <button type="button" onClick={() => upd({ options: [...q.options, ''] })} className="self-start text-xs font-semibold text-indigo-700">
                      + Tambah pilihan
                    </button>
                  )}
                  <input value={q.explanation} onChange={(e) => upd({ explanation: e.target.value })} placeholder="Penjelasan jawaban (opsional)" className={inputCls} />
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setQuiz((a) => [...a, { prompt: '', options: ['', '', ''], correctIndex: 0, explanation: '' }])}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-indigo-400"
        >
          <Plus className="w-4 h-4" /> Tambah soal
        </button>
      </Section>

      {/* Bar simpan */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 z-30 bg-white/95 backdrop-blur border-t border-slate-200 p-3">
        <div className="max-w-5xl mx-auto flex items-center justify-end gap-3">
          {message && <span className={cn('text-sm font-semibold', message.ok ? 'text-emerald-700' : 'text-rose-600')}>{message.text}</span>}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
