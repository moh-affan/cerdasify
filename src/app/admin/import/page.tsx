'use client';

import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminImportPage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'users'>('questions');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Pilih file terlebih dahulu');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg(null);
      setResult(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', activeTab);

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses file impor');
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-indigo-600" />
          Impor Massal (CSV & Excel)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Unggah ratusan butir soal atau daftar akun peserta sekaligus dengan validasi otomatis
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('questions');
            setFile(null);
            setResult(null);
          }}
          className={`py-3 px-4 font-bold text-xs border-b-2 transition ${
            activeTab === 'questions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Impor Bank Soal (Matematika / Sains / CPNS)
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('users');
            setFile(null);
            setResult(null);
          }}
          className={`py-3 px-4 font-bold text-xs border-b-2 transition ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Impor Akun Peserta & Siswa
        </button>
      </div>

      {/* Template Download Box */}
      <div className="bg-indigo-50/60 rounded-3xl p-5 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-indigo-950 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            Download Template Resmi {activeTab === 'questions' ? 'Bank Soal' : 'Peserta'}
          </h3>
          <p className="text-xs text-indigo-800/80">
            {activeTab === 'questions'
              ? 'Gunakan template resmi untuk format kolom soal, rumus LaTeX ($...$), dan bobot TKP'
              : 'Gunakan template resmi untuk mengimpor nama, username, password, dan role'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'questions' ? (
            <>
              <a
                href="/templates/template-import-soal.xlsx"
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format .xlsx</span>
              </a>
              <a
                href="/templates/template-import-soal.csv"
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format .csv</span>
              </a>
            </>
          ) : (
            <>
              <a
                href="/templates/template-import-peserta.xlsx"
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format .xlsx</span>
              </a>
              <a
                href="/templates/template-import-peserta.csv"
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format .csv</span>
              </a>
            </>
          )}
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-indigo-400 transition bg-slate-50/50">
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">
            {file ? file.name : 'Klik untuk memilih berkas atau drag file ke sini'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Mendukung format berkas .xlsx dan .csv (Maksimal 5MB)</p>
          <input
            type="file"
            accept=".xlsx, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
            onChange={handleFileChange}
            className="mt-4 text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file || isUploading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition active:scale-95 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>{isUploading ? 'Memproses Impor...' : 'Mulai Impor Sekarang'}</span>
          </button>
        </div>
      </form>

      {/* Result feedback */}
      {result && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Hasil Pemrosesan Impor</h3>
              <p className="text-xs text-slate-500">
                Berhasil mengimpor <strong>{result.importedCount}</strong> dari {result.totalRows} baris data.
              </p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <span className="font-bold block">Peringatan / Baris yang Dilewati:</span>
              <ul className="list-disc pl-5 space-y-1">
                {result.errors.map((err: any, i: number) => (
                  <li key={i}>
                    Baris {err.row}: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
