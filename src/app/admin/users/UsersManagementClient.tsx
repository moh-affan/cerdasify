'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Shield,
  User,
  GraduationCap,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Loader2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Check,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export interface UserItem {
  id: string;
  name: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: string | null;
}

interface UsersManagementClientProps {
  initialUsers: UserItem[];
  currentUserId: string;
}

export default function UsersManagementClient({
  initialUsers,
  currentUserId,
}: UsersManagementClientProps) {
  const router = useRouter();
  const [userList, setUserList] = useState<UserItem[]>(initialUsers);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [resettingPasswordUser, setResettingPasswordUser] = useState<UserItem | null>(null);

  // Form states for Add User
  const [addForm, setAddForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'USER' as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
    isActive: true,
  });
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState('');

  // Form states for Edit User
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    role: 'USER' as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
    isActive: true,
    newPassword: '',
  });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Quick reset password state
  const [newQuickPassword, setNewQuickPassword] = useState('');
  const [showQuickPassword, setShowQuickPassword] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetError, setResetError] = useState('');

  // Action states
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to generate secure random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.name.toLowerCase().includes(q);
        const matchUsername = u.username.toLowerCase().includes(q);
        if (!matchName && !matchUsername) return false;
      }
      if (filterRole && u.role !== filterRole) return false;
      if (filterStatus) {
        if (filterStatus === 'ACTIVE' && !u.isActive) return false;
        if (filterStatus === 'INACTIVE' && u.isActive) return false;
      }
      return true;
    });
  }, [userList, searchQuery, filterRole, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    let superAdmin = 0;
    let admin = 0;
    let user = 0;
    let active = 0;
    userList.forEach((u) => {
      if (u.role === 'SUPER_ADMIN') superAdmin++;
      if (u.role === 'ADMIN') admin++;
      if (u.role === 'USER') user++;
      if (u.isActive) active++;
    });
    return {
      total: userList.length,
      superAdmin,
      admin,
      user,
      active,
      inactive: userList.length - active,
    };
  }, [userList]);

  // 1. Toggle Active/Inactive Status
  const handleToggleStatus = async (user: UserItem) => {
    if (user.id === currentUserId) {
      alert('Anda tidak dapat menonaktifkan akun yang sedang digunakan');
      return;
    }

    try {
      setTogglingId(user.id);
      const newStatus = !user.isActive;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah status');

      setUserList((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus } : u))
      );
      showToast(`Status @${user.username} diubah menjadi ${newStatus ? 'Aktif' : 'Nonaktif'}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setTogglingId(null);
    }
  };

  // 2. Add New User
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!addForm.name.trim() || !addForm.username.trim() || !addForm.password.trim()) {
      setAddError('Semua kolom wajib diisi');
      return;
    }

    if (addForm.password.length < 6) {
      setAddError('Password minimal 6 karakter');
      return;
    }

    try {
      setIsSubmittingAdd(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name.trim(),
          username: addForm.username.trim(),
          password: addForm.password.trim(),
          role: addForm.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menambahkan pengguna');

      const newUser: UserItem = {
        id: data.userId || `usr_${Date.now()}`,
        name: addForm.name.trim(),
        username: addForm.username.trim(),
        role: addForm.role,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setUserList((prev) => [newUser, ...prev]);
      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        username: '',
        password: '',
        role: 'USER',
        isActive: true,
      });
      showToast(`Pengguna @${newUser.username} berhasil dibuat!`);
      router.refresh();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // 3. Open Edit Modal
  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      newPassword: '',
    });
    setEditError('');
    setShowEditPassword(false);
  };

  // 4. Save Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError('');

    try {
      setIsSubmittingEdit(true);
      const payload: { name: string; username: string; role: UserItem['role']; isActive: boolean; password?: string } = {
        name: editForm.name.trim(),
        username: editForm.username.trim(),
        role: editForm.role,
        isActive: editForm.isActive,
      };
      if (editForm.newPassword.trim()) {
        payload.password = editForm.newPassword.trim();
      }

      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengguna');

      setUserList((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: editForm.name.trim(),
                username: editForm.username.trim(),
                role: editForm.role,
                isActive: editForm.isActive,
              }
            : u
        )
      );

      setEditingUser(null);
      showToast(`Data @${editForm.username} berhasil diperbarui!`);
      router.refresh();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // 5. Quick Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingPasswordUser) return;
    setResetError('');

    if (newQuickPassword.trim().length < 6) {
      setResetError('Password baru minimal 6 karakter');
      return;
    }

    try {
      setIsSubmittingReset(true);
      const res = await fetch(`/api/admin/users/${resettingPasswordUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newQuickPassword.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mereset password');

      showToast(`Password untuk @${resettingPasswordUser.username} berhasil diperbarui!`);
      setResettingPasswordUser(null);
      setNewQuickPassword('');
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmittingReset(false);
    }
  };

  // 6. Delete User
  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengguna');

      setUserList((prev) => prev.filter((u) => u.id !== deletingUser.id));
      showToast(`Pengguna @${deletingUser.username} berhasil dihapus`);
      setDeletingUser(null);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus pengguna');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Manajemen Pengguna & RBAC
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola akses Super Administrator, Guru/Pengajar, dan akun Peserta Ujian
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Impor Peserta Excel</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setAddError('');
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pengguna</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{stats.active} akun aktif</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Super Admin</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.superAdmin}</div>
          <div className="text-[11px] text-slate-400">Akses penuh sistem</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Admin & Pengajar</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.admin}</div>
          <div className="text-[11px] text-slate-400">Kelola soal & simulasi</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Peserta Ujian</span>
            <User className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.user}</div>
          <div className="text-[11px] text-slate-400">Siswa & peserta aktif</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama lengkap atau @username..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 transition"
          >
            <option value="">Semua Role</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin / Pengajar</option>
            <option value="USER">Peserta Ujian</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 transition"
          >
            <option value="">Semua Status</option>
            <option value="ACTIVE">Aktif Saja</option>
            <option value="INACTIVE">Nonaktif Saja</option>
          </select>

          {(searchQuery || filterRole || filterStatus) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterRole('');
                setFilterStatus('');
              }}
              className="px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Menampilkan {filteredUsers.length} dari {userList.length} Pengguna
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ID Session Anda: {currentUserId}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6">Pengguna</th>
                <th className="py-3.5">Username</th>
                <th className="py-3.5">Role Akses</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Dibuat Pada</th>
                <th className="py-3.5 pr-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold">Tidak ada pengguna yang cocok dengan kriteria filter</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u.id === currentUserId;
                  const isProtected = u.id === 'usr_superadmin';

                  let roleBadge = 'bg-sky-50 text-sky-700 border-sky-200';
                  let RoleIcon = User;
                  let roleText = 'Peserta Ujian';

                  if (u.role === 'SUPER_ADMIN') {
                    roleBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                    RoleIcon = Shield;
                    roleText = 'Super Admin';
                  } else if (u.role === 'ADMIN') {
                    roleBadge = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                    RoleIcon = GraduationCap;
                    roleText = 'Admin / Pengajar';
                  }

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Avatar */}
                      <td className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-amber-500 text-white'
                                : u.role === 'ADMIN'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-md">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">ID: {u.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 font-mono text-slate-700 font-semibold">
                        @{u.username}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${roleBadge}`}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          <span>{roleText}</span>
                        </span>
                      </td>

                      {/* Active Status with Quick Toggle */}
                      <td className="py-3.5">
                        <button
                          type="button"
                          disabled={togglingId === u.id || isSelf}
                          onClick={() => handleToggleStatus(u)}
                          title={isSelf ? 'Akun Anda sendiri' : 'Klik untuk mengubah status'}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition active:scale-95 ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          } ${isSelf ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                        >
                          {togglingId === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : u.isActive ? (
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <UserX className="w-3.5 h-3.5 text-rose-500" />
                          )}
                          <span>{u.isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 text-slate-400 text-[11px]">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Reset Password Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setResettingPasswordUser(u);
                              setNewQuickPassword('');
                              setResetError('');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                            title="Reset Kata Sandi"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Edit User Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit Data Pengguna"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete User Button */}
                          {!isSelf && !isProtected && (
                            <button
                              type="button"
                              onClick={() => setDeletingUser(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL TAMBAH PENGGUNA ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tambah Pengguna Baru</h3>
                  <p className="text-[11px] text-slate-400">Buat akun dengan hak akses sesuai perannya</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Contoh: Muhammad Budi Santoso"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username (ID Login)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                    placeholder="budisantoso"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      const p = generatePassword();
                      setAddForm({ ...addForm, password: p });
                      setShowAddPassword(true);
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Acak Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Peran / Role Pengguna</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value as UserItem['role'] })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                >
                  <option value="USER">Peserta Ujian (Akses Mengerjakan Soal & Melihat Hasil)</option>
                  <option value="ADMIN">Admin / Pengajar (Akses Bank Soal & Paket Ujian)</option>
                  <option value="SUPER_ADMIN">Super Administrator (Akses Penuh Seluruh Sistem)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmittingAdd ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Simpan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT PENGGUNA ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Pengguna</h3>
                  <p className="text-[11px] text-slate-400">ID: {editingUser.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Role Akses</label>
                <select
                  value={editForm.role}
                  disabled={editingUser.id === currentUserId}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserItem['role'] })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white disabled:opacity-50"
                >
                  <option value="USER">Peserta Ujian</option>
                  <option value="ADMIN">Admin / Pengajar</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
                {editingUser.id === currentUserId && (
                  <p className="text-[11px] text-slate-400 mt-1">Role akun yang sedang Anda gunakan tidak dapat diubah</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Akun</label>
                <select
                  value={editForm.isActive ? 'true' : 'false'}
                  disabled={editingUser.id === currentUserId}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white disabled:opacity-50"
                >
                  <option value="true">Aktif (Dapat Login)</option>
                  <option value="false">Nonaktif (Dilarang Login)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ubah Kata Sandi (Opsional)
                </label>
                <p className="text-[11px] text-slate-400 mb-1.5">
                  Kosongkan jika tidak ingin mengubah kata sandi akun ini
                </p>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    placeholder="Masukkan kata sandi baru (min 6 karakter)..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmittingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL QUICK RESET PASSWORD ================= */}
      {resettingPasswordUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Reset Kata Sandi</h3>
                  <p className="text-[11px] text-slate-400">Untuk @{resettingPasswordUser.username}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResettingPasswordUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {resetError}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password Baru</label>
                  <button
                    type="button"
                    onClick={() => {
                      const p = generatePassword();
                      setNewQuickPassword(p);
                      setShowQuickPassword(true);
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Acak</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showQuickPassword ? 'text' : 'password'}
                    value={newQuickPassword}
                    onChange={(e) => setNewQuickPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowQuickPassword(!showQuickPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showQuickPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResettingPasswordUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {isSubmittingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Perbarui Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS PENGGUNA ================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Hapus Pengguna Ini?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pengguna <strong className="text-slate-800 font-bold">{deletingUser.name}</strong> (@{deletingUser.username}) akan dihapus permanen beserta seluruh riwayat pengerjaan ujiannya.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Ya, Hapus Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
