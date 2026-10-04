'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  ArrowLeft,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Play,
  ExternalLink,
  Search,
  Trash2,
  Copy,
  Edit3,
  Layers,
  Users,
  Check,
  Loader2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Zap,
  BarChart3,
  Settings,
} from 'lucide-react';
import { MathRenderer } from '@/components/katex/MathRenderer';
import { formatDate } from '@/lib/utils';

interface QuestionOption {
  id: string;
  label: string;
  contentMarkdown: string;
  isCorrect: boolean;
  scoreValue: number;
}

interface QuestionItem {
  id: string;
  contentMarkdown: string;
  imageUrl: string | null;
  difficulty: string;
  type: string;
  explanationMarkdown: string | null;
  topicId: string;
  topicName: string;
  orderIndex: number;
  options: QuestionOption[];
}

interface AttemptItem {
  id: string;
  userId: string;
  userName: string | null;
  userUsername: string | null;
  startedAt: string;
  finishedAt: string | null;
  scoreTotal: number;
  isPassed: boolean;
  status: string;
  remainingSeconds: number | null;
}

interface PackageDetailClientProps {
  packageData: {
    id: string;
    title: string;
    slug: string;
    categoryId: string;
    categoryName: string;
    type: string;
    durationMinutes: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    passingGradeRules: string | null;
    isPublished: boolean;
    createdAt: string;
  };
  initialQuestions: QuestionItem[];
  categories: { id: string; name: string; slug: string }[];
  topics: { id: string; name: string; categoryId: string }[];
  attempts: AttemptItem[];
}

export default function PackageDetailClient({
  packageData: initialPkg,
  initialQuestions,
  categories,
  topics,
  attempts,
}: PackageDetailClientProps) {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'questions' | 'settings' | 'analytics'>('questions');

  // Package State
  const [pkg, setPkg] = useState(initialPkg);
  const [questionsList, setQuestionsList] = useState<QuestionItem[]>(initialQuestions);
  const [isPublishToggling, setIsPublishToggling] = useState(false);
  const [isDeletingPackage, setIsDeletingPackage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Settings Form State
  const [title, setTitle] = useState(pkg.title);
  const [slug, setSlug] = useState(pkg.slug);
  const [categoryId, setCategoryId] = useState(pkg.categoryId);
  const [type, setType] = useState(pkg.type);
  const [durationMinutes, setDurationMinutes] = useState(pkg.durationMinutes);
  const [shuffleQuestions, setShuffleQuestions] = useState(pkg.shuffleQuestions);
  const [shuffleOptions, setShuffleOptions] = useState(pkg.shuffleOptions);
  const [isPublished, setIsPublished] = useState(pkg.isPublished);

  // Scoring Rules State
  const parseInitialRules = () => {
    try {
      if (pkg.passingGradeRules) return JSON.parse(pkg.passingGradeRules);
    } catch {}
    return { correctScore: 4, wrongScore: -1, emptyScore: 0, passingScore: 70 };
  };
  const [rules, setRules] = useState<Record<string, number>>(parseInitialRules());
  const [presetRule, setPresetRule] = useState<'olimpiade' | 'utbk' | 'cpns' | 'custom'>('olimpiade');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState('');

  // Questions Management & Reorder State
  const [isReordering, setIsReordering] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState(false);
  const [removingQuestionId, setRemovingQuestionId] = useState<string | null>(null);

  // Modal: Add Questions from Bank
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalTopic, setModalTopic] = useState('');
  const [modalDifficulty, setModalDifficulty] = useState('');
  const [modalHideAssigned, setModalHideAssigned] = useState(true);
  const [modalPage, setModalPage] = useState(1);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const [modalQuestions, setModalQuestions] = useState<Array<{
    id: string;
    topicName: string;
    contentMarkdown: string;
    isAlreadyInPackage: boolean;
  }>>([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [selectedAddIds, setSelectedAddIds] = useState<Set<string>>(new Set());
  const [isAddingQuestions, setIsAddingQuestions] = useState(false);

  // Modal: Bulk Add by Topic
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedBulkTopicId, setSelectedBulkTopicId] = useState(topics[0]?.id || '');
  const [isAddingBulkTopic, setIsAddingBulkTopic] = useState(false);

  // Filter within Package Questions List
  const [packageSearch, setPackageSearch] = useState('');
  const [packageTopicFilter, setPackageTopicFilter] = useState('');

  // Toggle Publish
  const handleTogglePublish = async () => {
    try {
      setIsPublishToggling(true);
      const res = await fetch(`/api/admin/packages/${pkg.id}/toggle-publish`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setPkg((prev) => ({ ...prev, isPublished: data.isPublished }));
        setIsPublished(data.isPublished);
      }
    } catch {
      alert('Gagal mengubah status publikasi');
    } finally {
      setIsPublishToggling(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async () => {
    try {
      setIsDeletingPackage(true);
      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/packages');
      } else {
        alert(data.error || 'Gagal menghapus paket');
      }
    } catch {
      alert('Gagal menghapus paket');
    } finally {
      setIsDeletingPackage(false);
    }
  };

  // Clone Package
  const handleClonePackage = async () => {
    if (!confirm('Duplikasi paket ini beserta seluruh butir soalnya?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}/clone`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/admin/packages/${data.newPackageId}`);
      } else {
        alert(data.error || 'Gagal menduplikasi paket');
      }
    } catch {
      alert('Gagal menduplikasi paket');
    }
  };

  // Reorder Question (Move Up or Down)
  const handleMoveQuestion = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questionsList.length) return;

    const updated = [...questionsList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Update orderIndex
    const reindexed = updated.map((q, idx) => ({ ...q, orderIndex: idx }));
    setQuestionsList(reindexed);

    // Save order in background
    try {
      setIsReordering(true);
      const orderedIds = reindexed.map((q) => q.id);
      await fetch(`/api/admin/packages/${pkg.id}/questions/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedQuestionIds: orderedIds }),
      });
      setReorderSuccess(true);
      setTimeout(() => setReorderSuccess(false), 2000);
    } catch {
      console.error('Failed to save question reorder');
    } finally {
      setIsReordering(false);
    }
  };

  // Remove Question from Package
  const handleRemoveQuestion = async (questionId: string) => {
    if (!confirm('Lepaskan butir soal ini dari paket ujian? (Soal asli di Bank Soal tidak akan terhapus)')) return;
    try {
      setRemovingQuestionId(questionId);
      const res = await fetch(`/api/admin/packages/${pkg.id}/questions?questionId=${questionId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setQuestionsList((prev) => {
          const filtered = prev.filter((q) => q.id !== questionId);
          return filtered.map((q, idx) => ({ ...q, orderIndex: idx }));
        });
      } else {
        alert(data.error || 'Gagal menghapus soal dari paket');
      }
    } catch {
      alert('Gagal menghapus soal dari paket');
    } finally {
      setRemovingQuestionId(null);
    }
  };

  // Load Available Questions for Modal with async debounce
  useEffect(() => {
    if (!isAddModalOpen) return;
    let ignore = false;

    const timer = setTimeout(() => {
      setIsLoadingAvailable(true);
      const params = new URLSearchParams({
        page: modalPage.toString(),
        limit: '15',
        hideAssigned: modalHideAssigned ? 'true' : 'false',
      });
      if (modalSearch) params.set('q', modalSearch);
      if (modalCategory) params.set('categoryId', modalCategory);
      if (modalTopic) params.set('topicId', modalTopic);
      if (modalDifficulty) params.set('difficulty', modalDifficulty);

      fetch(`/api/admin/packages/${pkg.id}/available-questions?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (!ignore && data.questions) {
            setModalQuestions(data.questions);
            setModalTotalPages(data.totalPages || 1);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => {
          if (!ignore) setIsLoadingAvailable(false);
        });
    }, 0);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [isAddModalOpen, modalPage, modalCategory, modalTopic, modalDifficulty, modalHideAssigned, modalSearch, pkg.id]);

  // Handle Search in Modal with Enter or button
  const handleModalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalPage(1);
  };

  // Toggle selection in Modal
  const toggleSelectQuestion = (qid: string) => {
    setSelectedAddIds((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  };

  // Select all on current page
  const handleSelectAllOnPage = () => {
    const unassignedOnPage = modalQuestions.filter((q) => !q.isAlreadyInPackage).map((q) => q.id);
    setSelectedAddIds((prev) => {
      const next = new Set(prev);
      const allSelected = unassignedOnPage.every((id) => next.has(id));
      if (allSelected) {
        unassignedOnPage.forEach((id) => next.delete(id));
      } else {
        unassignedOnPage.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Add Selected Questions to Package
  const handleAddSelectedQuestions = async () => {
    if (selectedAddIds.size === 0) return;
    try {
      setIsAddingQuestions(true);
      const res = await fetch(`/api/admin/packages/${pkg.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIds: Array.from(selectedAddIds) }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh page data
        setIsAddModalOpen(false);
        setSelectedAddIds(new Set());
        router.refresh();
      } else {
        alert(data.error || 'Gagal menambahkan butir soal');
      }
    } catch {
      alert('Gagal menambahkan butir soal ke paket');
    } finally {
      setIsAddingQuestions(false);
    }
  };

  // Bulk Add by Topic
  const handleBulkAddTopic = async () => {
    if (!selectedBulkTopicId) return;
    try {
      setIsAddingBulkTopic(true);
      const res = await fetch(`/api/admin/packages/${pkg.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: selectedBulkTopicId }),
      });
      const data = await res.json();
      if (data.success) {
        setIsTopicModalOpen(false);
        router.refresh();
      } else {
        alert(data.error || 'Gagal menambahkan soal per topik');
      }
    } catch {
      alert('Gagal menambahkan soal per topik');
    } finally {
      setIsAddingBulkTopic(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      setSettingsSuccessMessage('');

      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          categoryId,
          type,
          durationMinutes,
          shuffleQuestions,
          shuffleOptions,
          isPublished,
          passingGradeRules: rules,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPkg((prev) => ({
          ...prev,
          title,
          slug,
          categoryId,
          type,
          durationMinutes,
          shuffleQuestions,
          shuffleOptions,
          isPublished,
          passingGradeRules: JSON.stringify(rules),
        }));
        setSettingsSuccessMessage('Pengaturan paket berhasil disimpan');
        setTimeout(() => setSettingsSuccessMessage(''), 3000);
      } else {
        alert(data.error || 'Gagal menyimpan pengaturan');
      }
    } catch {
      alert('Gagal menyimpan pengaturan paket');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Change Rules Preset
  const handleRulesPreset = (preset: 'olimpiade' | 'utbk' | 'cpns' | 'custom') => {
    setPresetRule(preset);
    if (preset === 'olimpiade') {
      setRules({ correctScore: 4, wrongScore: -1, emptyScore: 0, passingScore: 70 });
    } else if (preset === 'utbk') {
      setRules({ correctScore: 4, wrongScore: 0, emptyScore: 0, passingScore: 60 });
    } else if (preset === 'cpns') {
      setRules({ twkPassingGrade: 65, tiuPassingGrade: 80, tkpPassingGrade: 166 });
    }
  };

  // Filtered Questions in Package List
  const filteredPackageQuestions = questionsList.filter((q) => {
    if (packageTopicFilter && q.topicId !== packageTopicFilter) return false;
    if (packageSearch) {
      const s = packageSearch.toLowerCase();
      const matchContent = q.contentMarkdown.toLowerCase().includes(s);
      const matchTopic = q.topicName.toLowerCase().includes(s);
      if (!matchContent && !matchTopic) return false;
    }
    return true;
  });

  // Analytics Metrics
  const totalAttempts = attempts.length;
  const completedAttempts = attempts.filter((a) => a.status === 'COMPLETED' || a.status === 'TIMED_OUT');
  const completedCount = completedAttempts.length;
  const scores = completedAttempts.map((a) => a.scoreTotal || 0);
  const avgScore = completedCount > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / completedCount) : null;
  const highestScore = scores.length > 0 ? Math.max(...scores) : null;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : null;
  const passCount = completedAttempts.filter((a) => a.isPassed).length;
  const passRate = completedCount > 0 ? Math.round((passCount / completedCount) * 100) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Paket Ujian</span>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {pkg.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 uppercase">
              {pkg.categoryName}
            </span>
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                pkg.type === 'PRACTICE'
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              {pkg.type === 'PRACTICE' ? 'Latihan' : 'Simulasi'}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400">
            slug: {pkg.slug} • Durasi: {pkg.durationMinutes} Menit • {questionsList.length} Butir Soal
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Published Toggle */}
          <button
            onClick={handleTogglePublish}
            disabled={isPublishToggling}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              pkg.isPublished
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
            title="Klik untuk mengubah status publikasi"
          >
            {isPublishToggling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : pkg.isPublished ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Terbit (Aktif)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Draf (Non-aktif)</span>
              </>
            )}
          </button>

          {/* Test Exam */}
          <Link
            href={`/exam/${pkg.id}`}
            target="_blank"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            title="Uji Coba Tampilan Ujian sebagai Peserta"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>Uji Coba Ujian</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Clone */}
          <button
            onClick={handleClonePackage}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs"
            title="Duplikasi Paket Ini"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition cursor-pointer shadow-xs"
            title="Hapus Paket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 bg-white px-4 pt-3 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'questions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Butir Soal Paket</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-bold">
            {questionsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan & Penilaian</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analitik & Peserta</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
            {attempts.length}
          </span>
        </button>
      </div>

      {/* TAB 1: BUTIR SOAL PAKET */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setSelectedAddIds(new Set());
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Soal dari Bank Soal</span>
              </button>

              <button
                onClick={() => setIsTopicModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 border border-purple-200 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Tambah Massal per Topik</span>
              </button>

              {reorderSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Urutan soal tersimpan
                </span>
              )}
            </div>

            {/* Quick in-package search & topic filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari soal di paket..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white rounded-xl text-xs font-medium border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <select
                value={packageTopicFilter}
                onChange={(e) => setPackageTopicFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-hidden"
              >
                <option value="">Semua Topik</option>
                {Array.from(new Set(questionsList.map((q) => q.topicId))).map((topId) => {
                  const top = topics.find((t) => t.id === topId);
                  return (
                    <option key={topId} value={topId}>
                      {top?.name || topId}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Warning if 0 questions */}
          {questionsList.length === 0 && (
            <div className="bg-amber-50 rounded-3xl border border-amber-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Paket ujian ini belum memiliki butir soal!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Peserta tidak akan dapat mengerjakan ujian ini sampai Anda menambahkan minimal 1 butir soal. Anda dapat memilih butir soal satu per satu atau menambahkan seluruh soal dari suatu topik sekaligus.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Pilih Soal dari Bank</span>
                </button>
                <button
                  onClick={() => setIsTopicModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Zap className="w-4 h-4" />
                  <span>Impor Massal per Topik</span>
                </button>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-3">
            {filteredPackageQuestions.map((q) => {
              const originalIndex = questionsList.findIndex((item) => item.id === q.id);
              const isRemoving = removingQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition space-y-3"
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {originalIndex + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                        {q.topicName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          q.difficulty === 'EASY'
                            ? 'bg-emerald-50 text-emerald-700'
                            : q.difficulty === 'MEDIUM'
                            ? 'bg-blue-50 text-blue-700'
                            : q.difficulty === 'HARD'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        id: {q.id}
                      </span>
                    </div>

                    {/* Order Controls & Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveQuestion(originalIndex, 'up')}
                        disabled={originalIndex === 0 || isReordering}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        title="Naikkan Urutan (#)"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveQuestion(originalIndex, 'down')}
                        disabled={originalIndex === questionsList.length - 1 || isReordering}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        title="Turunkan Urutan (#)"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/admin/bank-soal/${q.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                        title="Buka & Edit Soal di Bank Soal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        disabled={isRemoving}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                        title="Lepaskan dari Paket"
                      >
                        {isRemoving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Question Content & KaTeX Formula */}
                  <div className="text-xs text-slate-800 leading-relaxed overflow-x-auto py-1">
                    <MathRenderer content={q.contentMarkdown} />
                  </div>

                  {/* Stimulus Image if exists */}
                  {q.imageUrl && (
                    <div className="pt-1">
                      <img
                        src={q.imageUrl}
                        alt="Stimulus Soal"
                        className="max-h-48 rounded-xl border border-slate-200 object-contain bg-slate-50 p-1"
                      />
                    </div>
                  )}

                  {/* Options List Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                          opt.isCorrect
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            opt.isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <div className="flex-1 overflow-x-auto">
                          <MathRenderer content={opt.contentMarkdown} />
                        </div>
                        {opt.isCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN & ATURAN PENILAIAN */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Pengaturan Lengkap Paket</h2>
              <p className="text-xs text-slate-500">Sesuaikan metadata, durasi, opsi pengacakan, dan formula scoring</p>
            </div>
            {settingsSuccessMessage && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                {settingsSuccessMessage}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* Judul & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Paket Ujian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:border-indigo-600 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Kategori, Tipe, Durasi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipe Paket
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                >
                  <option value="SIMULATION">Simulasi Ujian (Timer Berjalan Terus)</option>
                  <option value="PRACTICE">Latihan Mandiri (Fitur Pause Aktif)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Durasi Pengerjaan (Menit)
                </label>
                <input
                  type="number"
                  min={5}
                  max={360}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(1, parseInt(e.target.value, 10) || 60))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Aturan Penilaian & Kelulusan (Scoring Rules) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-black text-slate-800">
                    Formula Skor & Ambang Batas Kelulusan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pilih preset atau sesuaikan skor benar, salah, dan nilai kelulusan
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleRulesPreset('olimpiade')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      presetRule === 'olimpiade'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    Olimpiade (+4/-1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRulesPreset('utbk')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      presetRule === 'utbk'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    UTBK (+4/0)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRulesPreset('cpns')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      presetRule === 'cpns'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    CPNS SKD
                  </button>
                </div>
              </div>

              {!rules?.twkPassingGrade ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">Skor Benar</span>
                    <input
                      type="number"
                      value={rules?.correctScore ?? 4}
                      onChange={(e) =>
                        setRules({ ...rules, correctScore: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">Skor Salah</span>
                    <input
                      type="number"
                      value={rules?.wrongScore ?? -1}
                      onChange={(e) =>
                        setRules({ ...rules, wrongScore: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">Skor Kosong</span>
                    <input
                      type="number"
                      value={rules?.emptyScore ?? 0}
                      onChange={(e) =>
                        setRules({ ...rules, emptyScore: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-indigo-700 font-bold block mb-1">Passing Score</span>
                    <input
                      type="number"
                      value={rules?.passingScore ?? 70}
                      onChange={(e) =>
                        setRules({ ...rules, passingScore: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 bg-white rounded-xl border border-indigo-300 text-xs font-bold text-indigo-700"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">Passing Grade TWK</span>
                    <input
                      type="number"
                      value={rules?.twkPassingGrade ?? 65}
                      onChange={(e) =>
                        setRules({ ...rules, twkPassingGrade: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">Passing Grade TIU</span>
                    <input
                      type="number"
                      value={rules?.tiuPassingGrade ?? 80}
                      onChange={(e) =>
                        setRules({ ...rules, tiuPassingGrade: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">Passing Grade TKP</span>
                    <input
                      type="number"
                      value={rules?.tkpPassingGrade ?? 166}
                      onChange={(e) =>
                        setRules({ ...rules, tkpPassingGrade: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Opsi Pengacakan & Publikasi */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold block">Acak Butir Soal</span>
                  <span className="text-[11px] text-slate-400">Urutan soal akan diacak otomatis saat peserta memulai ujian</span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold block">Acak Opsi Pilihan Ganda</span>
                  <span className="text-[11px] text-slate-400">Opsi jawaban A, B, C, D, E akan diacak posisinya</span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Status Publikasi (Aktifkan untuk Peserta)</span>
                  <span className="text-[11px] text-slate-400">Jika dinonaktifkan, paket hanya terlihat oleh Admin</span>
                </div>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan Pengaturan Paket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: STATISTIK & PESERTA */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{totalAttempts}</div>
                <div className="text-xs font-semibold text-slate-500">Total Percobaan Ujian</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">
                  {passRate !== null ? `${passRate}%` : '-'}
                </div>
                <div className="text-xs font-semibold text-slate-500">Tingkat Kelulusan</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600">
                  {avgScore !== null ? avgScore : '-'}
                </div>
                <div className="text-xs font-semibold text-slate-500">Rata-rata Skor</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900">
                  {highestScore !== null ? `${highestScore} / ${lowestScore}` : '-'}
                </div>
                <div className="text-xs font-semibold text-slate-500">Tertinggi / Terendah</div>
              </div>
            </div>
          </div>

          {/* Attempts Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Riwayat Pengerjaan Peserta</h3>
              <span className="text-xs text-slate-400 font-medium">Menampilkan {attempts.length} riwayat</span>
            </div>

            {attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Nama Peserta</th>
                      <th className="py-3 px-4">Waktu Mulai</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Skor Akhir</th>
                      <th className="py-3 px-4 text-center">Hasil</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {attempts.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-semibold">
                          <div className="text-slate-900 font-bold">{att.userName || 'Peserta'}</div>
                          <div className="text-[10px] font-mono text-slate-400">@{att.userUsername}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {formatDate(att.startedAt)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              att.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : att.status === 'IN_PROGRESS'
                                ? 'bg-blue-50 text-blue-700'
                                : att.status === 'PAUSED'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {att.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-black text-slate-900 text-sm">
                          {att.scoreTotal}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              att.isPassed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {att.isPassed ? 'LULUS' : 'TIDAK LULUS'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/results/${att.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition"
                          >
                            <span>Ulasan</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Belum ada peserta yang mengerjakan paket ujian ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH SOAL DARI BANK SOAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Pilih Butir Soal dari Bank Soal</h3>
                  <p className="text-xs text-slate-500">
                    Cari, filter, dan tandai butir soal untuk dimasukkan ke paket &ldquo;{pkg.title}&rdquo;
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Filter Bar inside Modal */}
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 shrink-0 space-y-3">
              <form onSubmit={handleModalSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-4 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari konten teks atau rumus..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs border border-slate-300 focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={modalCategory}
                    onChange={(e) => {
                      setModalCategory(e.target.value);
                      setModalPage(1);
                    }}
                    className="w-full px-2.5 py-2 bg-white rounded-xl text-xs border border-slate-300 focus:outline-hidden"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={modalTopic}
                    onChange={(e) => {
                      setModalTopic(e.target.value);
                      setModalPage(1);
                    }}
                    className="w-full px-2.5 py-2 bg-white rounded-xl text-xs border border-slate-300 focus:outline-hidden"
                  >
                    <option value="">Semua Topik</option>
                    {topics
                      .filter((t) => !modalCategory || t.categoryId === modalCategory)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <select
                    value={modalDifficulty}
                    onChange={(e) => {
                      setModalDifficulty(e.target.value);
                      setModalPage(1);
                    }}
                    className="w-full px-2.5 py-2 bg-white rounded-xl text-xs border border-slate-300 focus:outline-hidden"
                  >
                    <option value="">Semua Kesulitan</option>
                    <option value="EASY">Mudah</option>
                    <option value="MEDIUM">Sedang</option>
                    <option value="HARD">Sulit</option>
                    <option value="HOTS">HOTS</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center gap-1">
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition"
                  >
                    Cari
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={modalHideAssigned}
                    onChange={(e) => {
                      setModalHideAssigned(e.target.checked);
                      setModalPage(1);
                    }}
                    className="w-3.5 h-3.5 rounded text-indigo-600"
                  />
                  <span>Sembunyikan soal yang sudah ada di paket ini</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllOnPage}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Pilih / Batal Semua di Halaman ini
                  </button>
                </div>
              </div>
            </div>

            {/* Questions List inside Modal */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingAvailable ? (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs">Memuat daftar soal...</span>
                </div>
              ) : modalQuestions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Tidak ada butir soal yang sesuai filter pencarian.
                </div>
              ) : (
                modalQuestions.map((q) => {
                  const isChecked = selectedAddIds.has(q.id);
                  const isAlready = q.isAlreadyInPackage;

                  return (
                    <div
                      key={q.id}
                      onClick={() => {
                        if (!isAlready) toggleSelectQuestion(q.id);
                      }}
                      className={`p-3.5 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                        isAlready
                          ? 'bg-slate-50/60 border-slate-200 opacity-60 cursor-not-allowed'
                          : isChecked
                          ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isAlready}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-indigo-600 mt-0.5 shrink-0"
                      />

                      <div className="flex-1 space-y-1.5 overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                            {q.topicName}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">{q.id}</span>
                          {isAlready && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Sudah di Paket Ini
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-800 line-clamp-3">
                          <MathRenderer content={q.contentMarkdown} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer with Pagination & Add Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
              {/* Pagination */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <button
                  type="button"
                  disabled={modalPage <= 1 || isLoadingAvailable}
                  onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="font-semibold text-slate-700">
                  Hal {modalPage} dari {modalTotalPages}
                </span>
                <button
                  type="button"
                  disabled={modalPage >= modalTotalPages || isLoadingAvailable}
                  onClick={() => setModalPage((p) => p + 1)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleAddSelectedQuestions}
                  disabled={selectedAddIds.size === 0 || isAddingQuestions}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition active:scale-95 cursor-pointer"
                >
                  {isAddingQuestions ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Tambahkan ({selectedAddIds.size}) Soal Terpilih</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH MASSAL PER TOPIK */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Tambah Massal per Topik</h3>
                <p className="text-xs text-slate-500">
                  Masukkan seluruh butir soal dari suatu topik ke dalam paket ini secara otomatis
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Pilih Topik Soal</label>
              <select
                value={selectedBulkTopicId}
                onChange={(e) => setSelectedBulkTopicId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-purple-600 focus:outline-hidden"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Sistem akan menyaring dan hanya memasukkan butir soal yang belum ada di dalam paket ini.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsTopicModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleBulkAddTopic}
                disabled={isAddingBulkTopic}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isAddingBulkTopic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memasukkan Soal...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Tambahkan Semua Soal Topik Ini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS PAKET */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-lg">Hapus Paket Ujian Ini?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tindakan ini akan menghapus paket <strong className="text-slate-900 font-bold">&ldquo;{pkg.title}&rdquo;</strong> beserta seluruh riwayat ujian peserta yang terkait.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeletingPackage}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeletePackage}
                disabled={isDeletingPackage}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isDeletingPackage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Paket Ini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
