'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package as PackageIcon,
  Clock,
  Award,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Play,
  ExternalLink,
  Search,
  Trash2,
  Copy,
  SlidersHorizontal,
  Layers,
  Users,
  Check,
  Loader2,
  AlertTriangle,
  ArrowUpDown,
  LayoutGrid,
  List,
  ChevronRight,
} from 'lucide-react';

export interface PackageItem {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  type: 'SIMULATION' | 'PRACTICE';
  durationMinutes: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  passingGradeRules: string | null;
  isPublished: boolean;
  createdAt: string;
  questionCount: number;
  attemptCount: number;
  completedCount: number;
  avgScore: number | null;
  passRate: number | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface PackagesListClientProps {
  initialPackages: PackageItem[];
  categories: CategoryItem[];
}

export default function PackagesListClient({
  initialPackages,
  categories,
}: PackagesListClientProps) {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title' | 'questions' | 'duration'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals & Action States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<PackageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Package Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id || '');
  const [newType, setNewType] = useState<'SIMULATION' | 'PRACTICE'>('SIMULATION');
  const [newDuration, setNewDuration] = useState(60);
  const [newShuffleQuestions, setNewShuffleQuestions] = useState(false);
  const [newShuffleOptions, setNewShuffleOptions] = useState(false);
  const [newIsPublished, setNewIsPublished] = useState(true);
  const [newPresetRule, setNewPresetRule] = useState<'olimpiade' | 'utbk' | 'cpns' | 'custom'>('olimpiade');
  const [newCorrectScore, setNewCorrectScore] = useState(4);
  const [newWrongScore, setNewWrongScore] = useState(-1);
  const [newEmptyScore, setNewEmptyScore] = useState(0);
  const [newPassingScore, setNewPassingScore] = useState(70);

  // Sync rule presets
  const handlePresetChange = (preset: 'olimpiade' | 'utbk' | 'cpns' | 'custom') => {
    setNewPresetRule(preset);
    if (preset === 'olimpiade') {
      setNewCorrectScore(4);
      setNewWrongScore(-1);
      setNewEmptyScore(0);
      setNewPassingScore(70);
    } else if (preset === 'utbk') {
      setNewCorrectScore(4);
      setNewWrongScore(0);
      setNewEmptyScore(0);
      setNewPassingScore(60);
    } else if (preset === 'cpns') {
      setNewCorrectScore(4);
      setNewWrongScore(0);
      setNewEmptyScore(0);
      setNewPassingScore(65);
    }
  };

  // Toggle Published
  const handleTogglePublish = async (pkg: PackageItem) => {
    try {
      setActionLoadingId(pkg.id);
      const res = await fetch(`/api/admin/packages/${pkg.id}/toggle-publish`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, isPublished: data.isPublished } : p))
        );
      } else {
        alert(data.error || 'Gagal mengubah status');
      }
    } catch {
      alert('Gagal mengubah status publikasi');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Duplicate / Clone Package
  const handleClonePackage = async (pkg: PackageItem) => {
    if (!confirm(`Duplikasi paket "${pkg.title}" beserta seluruh butir soalnya?`)) return;
    try {
      setActionLoadingId(pkg.id);
      const res = await fetch(`/api/admin/packages/${pkg.id}/clone`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
        // Redirect to newly cloned package
        router.push(`/admin/packages/${data.newPackageId}`);
      } else {
        alert(data.error || 'Gagal menduplikasi paket');
      }
    } catch {
      alert('Gagal menduplikasi paket');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Package
  const handleDeletePackage = async () => {
    if (!packageToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/packages/${packageToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPackages((prev) => prev.filter((p) => p.id !== packageToDelete.id));
        setPackageToDelete(null);
      } else {
        alert(data.error || 'Gagal menghapus paket');
      }
    } catch {
      alert('Gagal menghapus paket');
    } finally {
      setIsDeleting(false);
    }
  };

  // Create Package
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setCreateError('Judul paket wajib diisi');
      return;
    }
    if (!newCategoryId) {
      setCreateError('Kategori wajib dipilih');
      return;
    }

    try {
      setIsSubmittingCreate(true);
      setCreateError('');

      let rulesPayload: Record<string, number> = {
        correctScore: newCorrectScore,
        wrongScore: newWrongScore,
        emptyScore: newEmptyScore,
        passingScore: newPassingScore,
      };

      if (newPresetRule === 'cpns') {
        rulesPayload = {
          twkPassingGrade: 65,
          tiuPassingGrade: 80,
          tkpPassingGrade: 166,
        };
      }

      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          categoryId: newCategoryId,
          type: newType,
          durationMinutes: newDuration,
          shuffleQuestions: newShuffleQuestions,
          shuffleOptions: newShuffleOptions,
          passingGradeRules: rulesPayload,
          isPublished: newIsPublished,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        // Direct jump to package detail so admin can assign questions right away
        router.push(`/admin/packages/${data.packageId}`);
      } else {
        setCreateError(data.error || 'Gagal membuat paket');
      }
    } catch {
      setCreateError('Terjadi kesalahan saat membuat paket ujian');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Stats calculation
  const totalPackages = packages.length;
  const publishedPackages = packages.filter((p) => p.isPublished).length;
  const draftPackages = packages.filter((p) => !p.isPublished).length;
  const totalAttempts = packages.reduce((acc, p) => acc + (p.attemptCount || 0), 0);

  // Filtered & Sorted packages
  const filteredPackages = packages
    .filter((pkg) => {
      if (selectedCategory && pkg.categoryId !== selectedCategory) return false;
      if (selectedType && pkg.type !== selectedType) return false;
      if (selectedStatus === 'published' && !pkg.isPublished) return false;
      if (selectedStatus === 'draft' && pkg.isPublished) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pkg.title.toLowerCase().includes(q);
        const matchesCat = pkg.categoryName.toLowerCase().includes(q);
        const matchesSlug = pkg.slug.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesSlug) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'questions') return b.questionCount - a.questionCount;
      if (sortBy === 'duration') return b.durationMinutes - a.durationMinutes;
      // Default: latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const parseRulesSummary = (rulesStr: string | null) => {
    if (!rulesStr) return null;
    try {
      const r = JSON.parse(rulesStr);
      if (r.twkPassingGrade) {
        return `CPNS (TWK: ${r.twkPassingGrade}, TIU: ${r.tiuPassingGrade}, TKP: ${r.tkpPassingGrade})`;
      }
      const c = r.correctScore ?? 4;
      const w = r.wrongScore ?? -1;
      const p = r.passingScore ?? 70;
      return `+${c} / ${w} • Min: ${p}`;
    } catch {
      return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <PackageIcon className="w-5 h-5" />
            </div>
            Manajemen Paket Ujian
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola paket simulasi, konfigurasi durasi, passing grade, dan butir soal ujian
          </p>
        </div>

        <button
          onClick={() => {
            setCreateError('');
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Paket Baru</span>
        </button>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <PackageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalPackages}</div>
            <div className="text-xs font-semibold text-slate-500">Total Paket Ujian</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{publishedPackages}</div>
            <div className="text-xs font-semibold text-slate-500">Dipublikasikan</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{draftPackages}</div>
            <div className="text-xs font-semibold text-slate-500">Draf (Belum Terbit)</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">{totalAttempts}</div>
            <div className="text-xs font-semibold text-slate-500">Total Sesi Ujian</div>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Search, Filters & View Mode */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama paket atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl text-xs font-medium border border-slate-200/80 focus:border-indigo-500 focus:outline-hidden transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200/80 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200/80 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="">Semua Tipe</option>
              <option value="SIMULATION">Simulasi Ujian</option>
              <option value="PRACTICE">Latihan Mandiri</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200/80 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="">Semua Status</option>
              <option value="published">Terbit Saja</option>
              <option value="draft">Draf Saja</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="lg:col-span-1 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel Ringkas"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sorting & Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Menampilkan</span>
            <span className="font-bold text-slate-900">{filteredPackages.length}</span>
            <span>dari</span>
            <span className="font-bold text-slate-900">{packages.length}</span>
            <span>paket ujian</span>
            {(selectedCategory || selectedType || selectedStatus || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedType('');
                  setSelectedStatus('');
                  setSearchQuery('');
                }}
                className="ml-2 text-indigo-600 hover:underline font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="latest">Terbaru Ditambahkan</option>
              <option value="oldest">Terlama Ditambahkan</option>
              <option value="title">Judul A-Z</option>
              <option value="questions">Butir Soal Terbanyak</option>
              <option value="duration">Durasi Terlama</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => {
            const rulesText = parseRulesSummary(pkg.passingGradeRules);
            const isActing = actionLoadingId === pkg.id;

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition group"
              >
                <div className="space-y-3.5">
                  {/* Category & Status Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                        {pkg.categoryName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                          pkg.type === 'PRACTICE'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {pkg.type === 'PRACTICE' ? 'Latihan' : 'Simulasi'}
                      </span>
                    </div>

                    {/* Published Toggle Button */}
                    <button
                      onClick={() => handleTogglePublish(pkg)}
                      disabled={isActing}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        pkg.isPublished
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                      }`}
                      title="Klik untuk mengubah status publikasi"
                    >
                      {isActing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : pkg.isPublished ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terbit</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Draf</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Slug */}
                  <div>
                    <Link
                      href={`/admin/packages/${pkg.id}`}
                      className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition block line-clamp-2"
                    >
                      {pkg.title}
                    </Link>
                    <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      slug: {pkg.slug}
                    </div>
                  </div>

                  {/* Meta Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{pkg.durationMinutes} Menit</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-semibold">
                      <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      {pkg.questionCount > 0 ? (
                        <span className="text-slate-800">{pkg.questionCount} Butir Soal</span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">0 Soal (Kosong)</span>
                      )}
                    </div>

                    {rulesText && (
                      <div className="col-span-2 text-[11px] text-slate-500 border-t border-slate-200/60 pt-1.5 mt-0.5 flex items-center gap-1">
                        <SlidersHorizontal className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{rulesText}</span>
                      </div>
                    )}
                  </div>

                  {/* Attempts & Pass Rate Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {pkg.attemptCount} Sesi Dikerjakan
                    </span>
                    {pkg.completedCount > 0 && pkg.avgScore !== null && (
                      <span className="font-semibold text-slate-700">
                        Rata-rata: {pkg.avgScore}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/admin/packages/${pkg.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Kelola Soal</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-300" />
                  </Link>

                  <button
                    onClick={() => handleClonePackage(pkg)}
                    disabled={isActing}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    title="Duplikasi / Kloning Paket"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/exam/${pkg.id}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                    title="Uji Coba Tampilan Ujian di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setPackageToDelete(pkg)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition cursor-pointer"
                    title="Hapus Paket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama Paket & Slug</th>
                  <th className="py-3 px-4">Kategori & Tipe</th>
                  <th className="py-3 px-4">Durasi</th>
                  <th className="py-3 px-4 text-center">Jumlah Soal</th>
                  <th className="py-3 px-4 text-center">Peserta</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-semibold">
                      <Link
                        href={`/admin/packages/${pkg.id}`}
                        className="text-slate-900 hover:text-indigo-600 font-bold block"
                      >
                        {pkg.title}
                      </Link>
                      <span className="text-[10px] font-mono text-slate-400">{pkg.slug}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 mr-1.5 uppercase">
                        {pkg.categoryName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {pkg.type === 'PRACTICE' ? 'Latihan' : 'Simulasi'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {pkg.durationMinutes} mnt
                    </td>
                    <td className="py-3 px-4 text-center">
                      {pkg.questionCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800">
                          {pkg.questionCount}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 font-bold text-rose-700">
                          0 Soal
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-medium">
                      {pkg.attemptCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(pkg)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition ${
                          pkg.isPublished
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {pkg.isPublished ? 'Terbit' : 'Draf'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/packages/${pkg.id}`}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                          title="Kelola Butir Soal"
                        >
                          <Layers className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleClonePackage(pkg)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                          title="Duplikasi"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/exam/${pkg.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                          title="Uji Coba Ujian"
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setPackageToDelete(pkg)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <PackageIcon className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Tidak ada paket ujian ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedCategory || selectedType || selectedStatus
              ? 'Coba sesuaikan kata kunci pencarian atau bersihkan filter di atas.'
              : 'Belum ada paket ujian yang dibuat. Silakan tambahkan paket simulasi pertama Anda.'}
          </p>
          {(selectedCategory || selectedType || selectedStatus || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedType('');
                setSelectedStatus('');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              Bersihkan Filter
            </button>
          )}
        </div>
      )}

      {/* Modal: Buat Paket Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200/80 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Buat Paket Ujian Baru</h3>
                  <p className="text-xs text-slate-500">Konfigurasi info dasar, durasi, dan aturan penilaian</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePackage} className="space-y-4">
              {/* Judul Paket */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Paket Ujian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tryout Akbar UTBK SNBT 2026 - Gelombang 1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                  required
                />
              </div>

              {/* Kategori & Tipe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                    required
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
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'SIMULATION' | 'PRACTICE')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                  >
                    <option value="SIMULATION">Simulasi Ujian (Timer Ketat)</option>
                    <option value="PRACTICE">Latihan Mandiri (Bisa Dijeda)</option>
                  </select>
                </div>
              </div>

              {/* Durasi Pengerjaan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Durasi Pengerjaan (Menit)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={360}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Math.max(1, parseInt(e.target.value, 10) || 60))}
                    className="w-28 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                  />
                  <div className="flex items-center gap-1.5">
                    {[30, 60, 90, 120].map((dur) => (
                      <button
                        type="button"
                        key={dur}
                        onClick={() => setNewDuration(dur)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                          newDuration === dur
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {dur}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preset Aturan Penilaian */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Aturan Penilaian & Kelulusan
                  </label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handlePresetChange('olimpiade')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        newPresetRule === 'olimpiade'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Olimpiade (+4, -1)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('utbk')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        newPresetRule === 'utbk'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      UTBK (+4, 0)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('cpns')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        newPresetRule === 'cpns'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      CPNS SKD
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetChange('custom')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        newPresetRule === 'custom'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Kustom
                    </button>
                  </div>
                </div>

                {newPresetRule !== 'cpns' ? (
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Skor Benar</span>
                      <input
                        type="number"
                        value={newCorrectScore}
                        onChange={(e) => setNewCorrectScore(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Skor Salah</span>
                      <input
                        type="number"
                        value={newWrongScore}
                        onChange={(e) => setNewWrongScore(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Skor Kosong</span>
                      <input
                        type="number"
                        value={newEmptyScore}
                        onChange={(e) => setNewEmptyScore(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Passing Grade</span>
                      <input
                        type="number"
                        value={newPassingScore}
                        onChange={(e) => setNewPassingScore(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-bold text-indigo-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-800">Standar Ambang Batas SKD CPNS:</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      TWK minimal 65 • TIU minimal 80 • TKP minimal 166
                    </p>
                  </div>
                )}
              </div>

              {/* Opsi Acak & Publikasi */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShuffleQuestions}
                    onChange={(e) => setNewShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Acak urutan butir soal saat ujian dimulai</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShuffleOptions}
                    onChange={(e) => setNewShuffleOptions(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Acak urutan opsi pilihan (A, B, C, D, E) untuk tiap peserta</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsPublished}
                    onChange={(e) => setNewIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-slate-900">
                    Langsung terbitkan paket ujian (Dapat dilihat peserta di Beranda)
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingCreate ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan & Atur Soal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-lg">Hapus Paket Ujian?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Anda yakin ingin menghapus paket ujian{' '}
                <strong className="text-slate-900 font-bold">&ldquo;{packageToDelete.title}&rdquo;</strong>?
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 mt-3">
                ⚠️ Menghapus paket ini akan melepaskan seluruh relasi butir soal di dalamnya ({packageToDelete.questionCount} butir soal) dan riwayat ujian peserta jika ada. Soal asli di Bank Soal tetap aman.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeletePackage}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Paket</span>
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
