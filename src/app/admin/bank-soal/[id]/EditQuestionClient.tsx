'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MathEditorToolbar } from '@/components/admin/MathEditorToolbar';
import { MathRenderer } from '@/components/katex/MathRenderer';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  ImageIcon,
  AlertTriangle,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface OptionInput {
  id?: string;
  label: string;
  contentMarkdown: string;
  isCorrect: boolean;
  scoreValue: number;
}

interface QuestionData {
  id: string;
  topicId: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'GRADED_SCALE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'HOTS';
  contentMarkdown: string;
  imageUrl: string | null;
  explanationMarkdown: string | null;
}

interface EditQuestionClientProps {
  question: QuestionData;
  initialOptions: OptionInput[];
  topicsList: { id: string; name: string; categoryName?: string }[];
}

export default function EditQuestionClient({
  question,
  initialOptions,
  topicsList,
}: EditQuestionClientProps) {
  const router = useRouter();

  const [selectedTopicId, setSelectedTopicId] = useState(question.topicId);
  const [questionType, setQuestionType] = useState(question.type);
  const [difficulty, setDifficulty] = useState(question.difficulty);
  const [contentMarkdown, setContentMarkdown] = useState(question.contentMarkdown);
  const [explanationMarkdown, setExplanationMarkdown] = useState(question.explanationMarkdown || '');
  const [imageUrl, setImageUrl] = useState(question.imageUrl || '');

  const [options, setOptions] = useState<OptionInput[]>(
    initialOptions.length > 0
      ? initialOptions
      : [
          { label: 'A', contentMarkdown: '', isCorrect: true, scoreValue: 4 },
          { label: 'B', contentMarkdown: '', isCorrect: false, scoreValue: 0 },
          { label: 'C', contentMarkdown: '', isCorrect: false, scoreValue: 0 },
          { label: 'D', contentMarkdown: '', isCorrect: false, scoreValue: 0 },
        ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeInputFocus, setActiveInputFocus] = useState<'content' | 'explanation' | number>('content');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleInsertSnippet = (snippet: string) => {
    if (activeInputFocus === 'content') {
      setContentMarkdown((prev) => prev + snippet);
    } else if (activeInputFocus === 'explanation') {
      setExplanationMarkdown((prev) => prev + snippet);
    } else if (typeof activeInputFocus === 'number') {
      const focusIdx = activeInputFocus;
      setOptions((prev) =>
        prev.map((o, i) => (i === focusIdx ? { ...o, contentMarkdown: o.contentMarkdown + snippet } : o))
      );
    }
  };

  const handleOptionChange = <K extends keyof OptionInput>(idx: number, field: K, value: OptionInput[K]) => {
    setOptions((prev) =>
      field === 'isCorrect' && questionType === 'SINGLE_CHOICE'
        ? // Pilihan tunggal: hanya opsi ini yang benar
          prev.map((o, i) => ({ ...o, isCorrect: i === idx }))
        : prev.map((o, i) => (i === idx ? { ...o, [field]: value } : o))
    );
  };

  const handleAddOption = () => {
    const nextLabel = String.fromCharCode(65 + options.length);
    setOptions((prev) => [
      ...prev,
      { label: nextLabel, contentMarkdown: '', isCorrect: false, scoreValue: 0 },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) {
      alert('Minimal harus memiliki 2 pilihan jawaban');
      return;
    }
    setOptions((prev) => {
      const copy = prev.filter((_, i) => i !== idx);
      return copy.map((opt, i) => ({
        ...opt,
        label: String.fromCharCode(65 + i),
      }));
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
      const res = await fetch(`/api/admin/questions/${question.id}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Gagal menyimpan perubahan');
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        router.push('/admin/bank-soal');
        router.refresh();
      }, 1000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/questions/${question.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus soal');
      }

      router.push('/admin/bank-soal');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/bank-soal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Bank Soal</span>
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-xl font-bold">
            ID: {question.id}
          </span>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold transition"
            title="Hapus Soal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Edit Butir Soal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui teks pertanyaan, opsi jawaban, formula KaTeX, dan langkah pembahasan
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveQuestion} className="space-y-6">
        {/* Topic, Type, Difficulty Row */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Topik Materi</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
              required
            >
              {topicsList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.categoryName ? `${t.categoryName} — ` : ''}{t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Soal</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as typeof questionType)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
            >
              <option value="SINGLE_CHOICE">Pilihan Ganda (Single Correct)</option>
              <option value="MULTI_CHOICE">Pilihan Ganda Kompleks</option>
              <option value="GRADED_SCALE">Soal Berbobot (tiap opsi 1–5 poin, mis. TKP/SJT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Kesulitan</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
            >
              <option value="EASY">Mudah (EASY)</option>
              <option value="MEDIUM">Sedang (MEDIUM)</option>
              <option value="HARD">Sulit (HARD)</option>
              <option value="HOTS">Tingkat Tinggi (HOTS)</option>
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">Teks Pertanyaan (Markdown & KaTeX)</label>
            <span className="text-[11px] text-slate-400">Gunakan $...$ untuk rumus sebaris atau $$...$$ untuk blok</span>
          </div>

          <textarea
            rows={4}
            value={contentMarkdown}
            onFocus={() => setActiveInputFocus('content')}
            onChange={(e) => setContentMarkdown(e.target.value)}
            placeholder="Ketik teks soal di sini..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 font-mono leading-relaxed"
            required
          />

          {/* Live Preview of Question */}
          <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pratinjau Tampilan Pertanyaan
            </span>
            <div className="text-slate-900 text-sm leading-relaxed">
              <MathRenderer content={contentMarkdown || '*Teks soal belum diisi*'} />
            </div>
          </div>

          {/* Gambar Soal */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer transition">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>{isUploadingImage ? 'Mengunggah...' : 'Unggah / Ganti Gambar'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleUploadImage}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>

              <span className="text-[11px] text-slate-400">atau masukkan URL:</span>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/uploads/... atau https://..."
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 w-64 focus:outline-hidden"
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
              {/* eslint-disable-next-line @next/next/no-img-element -- gambar soal dari URL unggahan dinamis */}
              <img
                src={imageUrl}
                alt="Pratinjau Gambar Soal"
                className="max-h-48 rounded-xl border border-slate-200 object-contain"
              />
            </div>
          )}
        </div>

        {/* Options Editor */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Opsi Pilihan Jawaban</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {questionType === 'SINGLE_CHOICE'
                  ? 'Klik tombol "Pilih Kunci" untuk menentukan 1 jawaban yang benar'
                  : 'Atur bobot skor untuk setiap opsi'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Opsi</span>
            </button>
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition ${
                  opt.isCorrect
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                    opt.isCorrect
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {opt.label}
                </span>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={opt.contentMarkdown}
                    onFocus={() => setActiveInputFocus(idx)}
                    onChange={(e) => handleOptionChange(idx, 'contentMarkdown', e.target.value)}
                    placeholder={`Isi pilihan jawaban ${opt.label}...`}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                  {opt.contentMarkdown && (
                    <div className="text-xs text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-100 shadow-2xs">
                      <MathRenderer content={opt.contentMarkdown} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  {questionType === 'SINGLE_CHOICE' ? (
                    <button
                      type="button"
                      onClick={() => handleOptionChange(idx, 'isCorrect', true)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        opt.isCorrect
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{opt.isCorrect ? 'Kunci Benar' : 'Pilih Kunci'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">Poin:</span>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={opt.scoreValue}
                        onChange={(e) =>
                          handleOptionChange(idx, 'scoreValue', parseInt(e.target.value, 10) || 1)
                        }
                        className="w-14 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                      />
                    </div>
                  )}

                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                      title="Hapus opsi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Editor */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">Teks Pembahasan & Langkah Solusi</label>
            <span className="text-[11px] text-slate-400">Ditampilkan saat peserta meninjau hasil ujian</span>
          </div>

          <textarea
            rows={3}
            value={explanationMarkdown}
            onFocus={() => setActiveInputFocus('explanation')}
            onChange={(e) => setExplanationMarkdown(e.target.value)}
            placeholder="Jelaskan langkah penyelesaian atau konsep rumus di sini..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 font-mono leading-relaxed"
          />

          {explanationMarkdown && (
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                Pratinjau Tampilan Pembahasan
              </span>
              <div className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                <MathRenderer content={explanationMarkdown} />
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          <Link
            href="/admin/bank-soal"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Batal
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Hapus Soal Ini?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Soal dengan ID <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">{question.id}</code>{' '}
                akan dihapus permanen dari basis data beserta opsi jawaban dan relasi paketnya. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteQuestion}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Ya, Hapus Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
