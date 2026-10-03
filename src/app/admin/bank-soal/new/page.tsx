'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MathEditorToolbar } from '@/components/admin/MathEditorToolbar';
import { MathRenderer } from '@/components/katex/MathRenderer';
import { ArrowLeft, Save, Loader2, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface OptionInput {
  label: string;
  contentMarkdown: string;
  isCorrect: boolean;
  scoreValue: number;
}

export default function NewQuestionPage() {
  const router = useRouter();
  const [topicsList, setTopicsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [questionType, setQuestionType] = useState<'SINGLE_CHOICE' | 'GRADED_SCALE'>('SINGLE_CHOICE');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'HOTS'>('MEDIUM');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [explanationMarkdown, setExplanationMarkdown] = useState('');

  const [options, setOptions] = useState<OptionInput[]>([
    { label: 'A', contentMarkdown: '', isCorrect: true, scoreValue: 4 },
    { label: 'B', contentMarkdown: '', isCorrect: false, scoreValue: 0 },
    { label: 'C', contentMarkdown: '', isCorrect: false, scoreValue: 0 },
    { label: 'D', contentMarkdown: '', isCorrect: false, scoreValue: 0 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeInputFocus, setActiveInputFocus] = useState<'content' | 'explanation' | number>('content');

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const formData = new FormData();
      formData.append('file', f);
      try {
        setIsUploadingImage(true);
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setImageUrl(data.url);
        } else {
          alert(data.error || 'Gagal mengunggah gambar');
        }
      } catch {
        alert('Gagal mengunggah gambar');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/admin/topics');
        const data = await res.json();
        if (data.topics && data.topics.length > 0) {
          setTopicsList(data.topics);
          setSelectedTopicId(data.topics[0].id);
        }
      } catch (e) {
        console.error('Failed to load topics', e);
      }
    }
    loadTopics();
  }, []);

  const handleInsertSnippet = (snippet: string) => {
    if (activeInputFocus === 'content') {
      setContentMarkdown((prev) => prev + snippet);
    } else if (activeInputFocus === 'explanation') {
      setExplanationMarkdown((prev) => prev + snippet);
    } else if (typeof activeInputFocus === 'number') {
      setOptions((prev) => {
        const copy = [...prev];
        copy[activeInputFocus].contentMarkdown += snippet;
        return copy;
      });
    }
  };

  const handleOptionChange = (idx: number, field: keyof OptionInput, value: any) => {
    setOptions((prev) => {
      const copy = [...prev];
      if (field === 'isCorrect' && questionType === 'SINGLE_CHOICE') {
        // Toggle only this one as correct
        copy.forEach((o, i) => {
          o.isCorrect = i === idx;
        });
      } else {
        (copy[idx] as any)[field] = value;
      }
      return copy;
    });
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId || !contentMarkdown.trim()) {
      alert('Topik dan teks pertanyaan wajib diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: selectedTopicId,
          type: questionType,
          difficulty,
          imageUrl: imageUrl.trim() || null,
          contentMarkdown,
          explanationMarkdown,
          options,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan soal');
      }

      router.push('/admin/bank-soal');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/bank-soal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Bank Soal</span>
        </Link>

        <h1 className="text-xl font-black text-slate-900">Tambah Butir Soal Baru</h1>
      </div>

      <form onSubmit={handleSaveQuestion} className="space-y-6">
        {/* Topic, Type, Difficulty Row */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Topik Materi</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
              required
            >
              {topicsList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Soal</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="SINGLE_CHOICE">Pilihan Ganda (Single Correct)</option>
              <option value="GRADED_SCALE">Skala Bertingkat (CPNS TKP 1-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Kesulitan</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="EASY">Mudah (EASY)</option>
              <option value="MEDIUM">Sedang (MEDIUM)</option>
              <option value="HARD">Sulit (HARD)</option>
              <option value="HOTS">HOTS</option>
            </select>
          </div>
        </div>

        {/* Math Quick Toolbar */}
        <MathEditorToolbar
          onInsert={handleInsertSnippet}
          previewContent={
            activeInputFocus === 'content'
              ? contentMarkdown
              : activeInputFocus === 'explanation'
              ? explanationMarkdown
              : typeof activeInputFocus === 'number'
              ? options[activeInputFocus]?.contentMarkdown
              : ''
          }
        />

        {/* Question Text Area */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">Teks Pertanyaan (Markdown & KaTeX)</label>
            <span className="text-[11px] text-slate-400">Gunakan $...$ untuk rumus sebaris atau $$...$$ untuk blok</span>
          </div>
          <textarea
            rows={4}
            value={contentMarkdown}
            onFocus={() => setActiveInputFocus('content')}
            onChange={(e) => setContentMarkdown(e.target.value)}
            placeholder="Ketik teks soal di sini. Contoh: Jika $2x + 5 = 15$, maka nilai dari $x$ adalah ..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 font-mono leading-relaxed"
            required
          />

          {/* Gambar Soal (Optional) */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer transition">
                <span>{isUploadingImage ? 'Mengunggah...' : '📁 Unggah Gambar Soal'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>

              <span className="text-[11px] text-slate-400">atau masukkan URL gambar:</span>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... atau /uploads/..."
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 w-56 focus:outline-hidden"
              />
            </div>

            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
              >
                Hapus Gambar
              </button>
            )}
          </div>

          {imageUrl && (
            <div className="mt-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              <img
                src={imageUrl}
                alt="Pratinjau Gambar Soal"
                className="max-h-40 rounded-xl border border-slate-200"
              />
            </div>
          )}
        </div>

        {/* Options Editor */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Opsi Pilihan Jawaban</h3>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div
                key={opt.label}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <span className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                  {opt.label}
                </span>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={opt.contentMarkdown}
                    onFocus={() => setActiveInputFocus(idx)}
                    onChange={(e) => handleOptionChange(idx, 'contentMarkdown', e.target.value)}
                    placeholder={`Isi opsi jawaban ${opt.label}...`}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                    required
                  />
                  {opt.contentMarkdown && (
                    <div className="text-xs text-slate-700 px-2 py-1 bg-white/60 rounded-md border border-slate-100">
                      <MathRenderer content={opt.contentMarkdown} />
                    </div>
                  )}
                </div>

                {questionType === 'SINGLE_CHOICE' ? (
                  <button
                    type="button"
                    onClick={() => handleOptionChange(idx, 'isCorrect', true)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                      opt.isCorrect
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{opt.isCorrect ? 'Kunci Benar' : 'Pilih Kunci'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-bold text-slate-500">Bobot Poin:</span>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={opt.scoreValue}
                      onChange={(e) => handleOptionChange(idx, 'scoreValue', parseInt(e.target.value, 10) || 1)}
                      className="w-14 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Editor */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-slate-700">Teks Pembahasan & Langkah Solusi</label>
          <textarea
            rows={3}
            value={explanationMarkdown}
            onFocus={() => setActiveInputFocus('explanation')}
            onChange={(e) => setExplanationMarkdown(e.target.value)}
            placeholder="Jelaskan langkah penyelesaian atau konsep rumus di sini..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 font-mono leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/bank-soal"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Soal</span>
          </button>
        </div>
      </form>
    </div>
  );
}
