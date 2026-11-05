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
  Check,
  Sparkles,
  Baby,
  HeartHandshake,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export interface UserItem {
  id: string;
  name: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  isActive: boolean;
  isParent: boolean;
  gradeLevel: number | null;
  parentId: string | null;
  parentName: string | null;
  parentUsername: string | null;
  dailyGameMinutes: number | null;
  childrenCount: number;
  createdAt: string | null;
}

interface UsersManagementClientProps {
  initialUsers: UserItem[];
  currentUserId: string;
}

type AccountType = 'REGULAR_USER' | 'PARENT' | 'CHILD' | 'ADMIN' | 'SUPER_ADMIN';

const GRADE_LABELS: Record<number, string> = {
  1: 'Kelas 1 SD',
  2: 'Kelas 2 SD',
  3: 'Kelas 3 SD',
  4: 'Kelas 4 SD',
  5: 'Kelas 5 SD',
  6: 'Kelas 6 SD',
  7: 'Kelas 7 SMP',
  8: 'Kelas 8 SMP',
  9: 'Kelas 9 SMP',
  10: 'Kelas 10 SMA',
  11: 'Kelas 11 SMA',
  12: 'Kelas 12 SMA',
  13: 'Umum / Lanjut',
};

export default function UsersManagementClient({
  initialUsers,
  currentUserId,
}: UsersManagementClientProps) {
  const router = useRouter();
  const [userList, setUserList] = useState<UserItem[]>(initialUsers);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [deleteAction, setDeleteAction] = useState<'cascade' | 'reassign'>('cascade');
  const [reassignParentId, setReassignParentId] = useState<string>('');
  const [resettingPasswordUser, setResettingPasswordUser] = useState<UserItem | null>(null);

  // Form states for Add User
  const [addAccountType, setAddAccountType] = useState<AccountType>('REGULAR_USER');
  const [addForm, setAddForm] = useState({
    name: '',
    username: '',
    password: '',
    parentId: '',
    gradeLevel: '1',
    dailyGameMinutes: '',
  });
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState('');

  // Form states for Edit User
  const [editAccountType, setEditAccountType] = useState<AccountType>('REGULAR_USER');
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    role: 'USER' as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
    isActive: true,
    isParent: false,
    parentId: '',
    gradeLevel: '1',
    dailyGameMinutes: '',
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
  const [deleteError, setDeleteError] = useState('');
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

  // Calon orang tua yang tersedia (bukan akun anak)
  const potentialParents = useMemo(() => {
    return userList.filter((u) => !u.parentId);
  }, [userList]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.name.toLowerCase().includes(q);
        const matchUsername = u.username.toLowerCase().includes(q);
        const matchParent = u.parentName?.toLowerCase().includes(q) || u.parentUsername?.toLowerCase().includes(q);
        if (!matchName && !matchUsername && !matchParent) return false;
      }

      if (filterType) {
        if (filterType === 'SUPER_ADMIN' && u.role !== 'SUPER_ADMIN') return false;
        if (filterType === 'ADMIN' && u.role !== 'ADMIN') return false;
        if (filterType === 'PARENT' && (!u.isParent && u.childrenCount === 0)) return false;
        if (filterType === 'CHILD' && !u.parentId) return false;
        if (
          filterType === 'REGULAR_USER' &&
          (u.role !== 'USER' || u.parentId || u.isParent || u.childrenCount > 0)
        ) {
          return false;
        }
      }

      if (filterStatus) {
        if (filterStatus === 'ACTIVE' && !u.isActive) return false;
        if (filterStatus === 'INACTIVE' && u.isActive) return false;
      }

      return true;
    });
  }, [userList, searchQuery, filterType, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    let superAdmin = 0;
    let admin = 0;
    let parents = 0;
    let children = 0;
    let regularUser = 0;
    let active = 0;

    userList.forEach((u) => {
      if (u.role === 'SUPER_ADMIN') superAdmin++;
      else if (u.role === 'ADMIN') admin++;
      else if (u.parentId) children++;
      else if (u.isParent || u.childrenCount > 0) parents++;
      else regularUser++;

      if (u.isActive) active++;
    });

    return {
      total: userList.length,
      superAdmin,
      admin,
      parents,
      children,
      regularUser,
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
      setAddError('Nama, username, dan password wajib diisi');
      return;
    }

    if (addAccountType === 'CHILD' && !addForm.parentId) {
      setAddError('Silakan pilih akun orang tua untuk akun anak');
      return;
    }

    try {
      setIsSubmittingAdd(true);

      let role: UserItem['role'] = 'USER';
      let isParent = false;
      let parentId: string | null = null;
      let gradeLevel: number | null = null;
      let dailyGameMinutes: number | null = null;

      if (addAccountType === 'SUPER_ADMIN') {
        role = 'SUPER_ADMIN';
      } else if (addAccountType === 'ADMIN') {
        role = 'ADMIN';
      } else if (addAccountType === 'PARENT') {
        role = 'USER';
        isParent = true;
      } else if (addAccountType === 'CHILD') {
        role = 'USER';
        parentId = addForm.parentId;
        gradeLevel = Number(addForm.gradeLevel) || 1;
        dailyGameMinutes = addForm.dailyGameMinutes ? Number(addForm.dailyGameMinutes) : null;
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name.trim(),
          username: addForm.username.trim(),
          password: addForm.password.trim(),
          role,
          isParent,
          parentId,
          gradeLevel,
          dailyGameMinutes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menambahkan pengguna');

      const selectedParent = parentId ? potentialParents.find((p) => p.id === parentId) : null;

      const newUser: UserItem = {
        id: data.userId || `usr_${Date.now()}`,
        name: addForm.name.trim(),
        username: addForm.username.trim().toLowerCase(),
        role,
        isActive: true,
        isParent,
        gradeLevel,
        parentId,
        parentName: selectedParent ? selectedParent.name : null,
        parentUsername: selectedParent ? selectedParent.username : null,
        dailyGameMinutes,
        childrenCount: 0,
        createdAt: new Date().toISOString(),
      };

      setUserList((prev) => {
        const next = [newUser, ...prev];
        if (parentId) {
          return next.map((u) =>
            u.id === parentId ? { ...u, isParent: true, childrenCount: u.childrenCount + 1 } : u
          );
        }
        return next;
      });

      setIsAddModalOpen(false);
      setAddAccountType('REGULAR_USER');
      setAddForm({
        name: '',
        username: '',
        password: '',
        parentId: '',
        gradeLevel: '1',
        dailyGameMinutes: '',
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
    let type: AccountType = 'REGULAR_USER';
    if (user.role === 'SUPER_ADMIN') type = 'SUPER_ADMIN';
    else if (user.role === 'ADMIN') type = 'ADMIN';
    else if (user.parentId) type = 'CHILD';
    else if (user.isParent || user.childrenCount > 0) type = 'PARENT';

    setEditAccountType(type);
    setEditForm({
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      isParent: user.isParent,
      parentId: user.parentId || '',
      gradeLevel: String(user.gradeLevel || 1),
      dailyGameMinutes: user.dailyGameMinutes ? String(user.dailyGameMinutes) : '',
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

      let role: UserItem['role'] = editForm.role;
      let isParent = editForm.isParent;
      let parentId: string | null = null;
      let gradeLevel: number | null = null;
      let dailyGameMinutes: number | null = null;

      if (editAccountType === 'SUPER_ADMIN') {
        role = 'SUPER_ADMIN';
        isParent = false;
      } else if (editAccountType === 'ADMIN') {
        role = 'ADMIN';
        isParent = false;
      } else if (editAccountType === 'PARENT') {
        role = 'USER';
        isParent = true;
      } else if (editAccountType === 'CHILD') {
        role = 'USER';
        isParent = false;
        if (!editForm.parentId) {
          setEditError('Silakan pilih akun orang tua');
          setIsSubmittingEdit(false);
          return;
        }
        parentId = editForm.parentId;
        gradeLevel = Number(editForm.gradeLevel) || 1;
        dailyGameMinutes = editForm.dailyGameMinutes ? Number(editForm.dailyGameMinutes) : null;
      } else {
        role = 'USER';
        isParent = false;
      }

      const payload: Record<string, unknown> = {
        name: editForm.name.trim(),
        username: editForm.username.trim(),
        role,
        isActive: editForm.isActive,
        isParent,
        parentId,
        gradeLevel,
        dailyGameMinutes,
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

      const selectedParent = parentId ? potentialParents.find((p) => p.id === parentId) : null;

      setUserList((prev) =>
        prev.map((u) => {
          if (u.id === editingUser.id) {
            return {
              ...u,
              name: editForm.name.trim(),
              username: editForm.username.trim().toLowerCase(),
              role,
              isActive: editForm.isActive,
              isParent,
              parentId,
              parentName: selectedParent ? selectedParent.name : null,
              parentUsername: selectedParent ? selectedParent.username : null,
              gradeLevel,
              dailyGameMinutes,
            };
          }
          return u;
        })
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

      showToast(`Password untuk @${resettingPasswordUser.username} berhasil diperbarui & sesi lama dicabut!`);
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
    setDeleteError('');

    try {
      setIsDeleting(true);

      let url = `/api/admin/users/${deletingUser.id}`;
      if (deletingUser.childrenCount > 0) {
        if (deleteAction === 'cascade') {
          url += '?action=cascade';
        } else if (deleteAction === 'reassign') {
          if (!reassignParentId) {
            setDeleteError('Pilih akun orang tua baru pengganti');
            setIsDeleting(false);
            return;
          }
          url += `?action=reassign&newParentId=${encodeURIComponent(reassignParentId)}`;
        }
      }

      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengguna');

      if (deletingUser.childrenCount > 0 && deleteAction === 'cascade') {
        setUserList((prev) => prev.filter((u) => u.id !== deletingUser.id && u.parentId !== deletingUser.id));
      } else {
        setUserList((prev) => prev.filter((u) => u.id !== deletingUser.id));
      }

      showToast(`Pengguna @${deletingUser.username} berhasil dihapus`);
      setDeletingUser(null);
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Gagal menghapus pengguna');
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
            Manajemen Pengguna & Relasi Keluarga
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola akses Super Admin, Guru/Admin, Orang Tua, Akun Anak, serta Peserta Mandiri
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <span>Impor Peserta Massal</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Akun</span>
          <span className="text-xl font-black text-slate-900">{stats.total}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Super Admin</span>
          <span className="text-xl font-black text-amber-600">{stats.superAdmin}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Admin / Guru</span>
          <span className="text-xl font-black text-indigo-600">{stats.admin}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Orang Tua</span>
          <span className="text-xl font-black text-emerald-600">{stats.parents}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block">Akun Anak</span>
          <span className="text-xl font-black text-sky-600">{stats.children}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mandiri / Aktif</span>
          <span className="text-xl font-black text-slate-800">{stats.regularUser} <span className="text-xs font-semibold text-emerald-600">({stats.active} aktif)</span></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, @username, orang tua..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-indigo-500"
          >
            <option value="">Semua Jenis Akun</option>
            <option value="SUPER_ADMIN">👑 Super Admin</option>
            <option value="ADMIN">🎓 Admin / Guru</option>
            <option value="PARENT">👨‍👩‍👦 Orang Tua</option>
            <option value="CHILD">🧒 Akun Anak</option>
            <option value="REGULAR_USER">👤 Peserta Mandiri</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-indigo-500"
          >
            <option value="">Semua Status</option>
            <option value="ACTIVE">Aktif Saja</option>
            <option value="INACTIVE">Nonaktif Saja</option>
          </select>

          {(searchQuery || filterType || filterStatus) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterType('');
                setFilterStatus('');
              }}
              className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition"
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
            Sesi Anda: {currentUserId}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6">Pengguna</th>
                <th className="py-3.5">Username</th>
                <th className="py-3.5">Tipe & Peran</th>
                <th className="py-3.5">Relasi Keluarga / Kelas</th>
                <th className="py-3.5">Status</th>
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
                  const isSuper = u.role === 'SUPER_ADMIN';
                  const isAdmin = u.role === 'ADMIN';
                  const isChild = Boolean(u.parentId);
                  const isParentAccount = !isChild && (u.isParent || u.childrenCount > 0);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Avatar */}
                      <td className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSuper
                                ? 'bg-amber-500 text-white'
                                : isAdmin
                                ? 'bg-indigo-600 text-white'
                                : isChild
                                ? 'bg-sky-500 text-white'
                                : isParentAccount
                                ? 'bg-emerald-600 text-white'
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

                      {/* Role & Account Type Badge */}
                      <td className="py-3.5">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-amber-50 text-amber-800 border-amber-200">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Super Admin</span>
                          </span>
                        ) : isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Admin / Guru</span>
                          </span>
                        ) : isChild ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-sky-50 text-sky-700 border-sky-200">
                            <Baby className="w-3.5 h-3.5" />
                            <span>Akun Anak</span>
                          </span>
                        ) : isParentAccount ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>Orang Tua ({u.childrenCount} anak)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-slate-100 text-slate-700 border-slate-200">
                            <User className="w-3.5 h-3.5" />
                            <span>Peserta Mandiri</span>
                          </span>
                        )}
                      </td>

                      {/* Relasi Orang Tua / Info Kelas */}
                      <td className="py-3.5">
                        {isChild ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <span>{u.gradeLevel ? GRADE_LABELS[u.gradeLevel] || `Kelas ${u.gradeLevel}` : 'Kelas -'}</span>
                              {u.dailyGameMinutes && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" /> {u.dailyGameMinutes}m
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Orang Tua: <span className="font-semibold text-indigo-600">@{u.parentUsername || u.parentName || 'tidak terhubung'}</span>
                            </div>
                          </div>
                        ) : isParentAccount ? (
                          <div className="text-slate-600 text-xs">
                            <span className="font-semibold text-emerald-700">{u.childrenCount} akun anak</span> terafiliasi
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Active Status */}
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

                      {/* Actions */}
                      <td className="py-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
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

                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit Pengguna"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {!isSelf && u.id !== 'usr_superadmin' && (
                            <button
                              type="button"
                              onClick={() => {
                                setDeletingUser(u);
                                setDeleteAction('cascade');
                                setReassignParentId('');
                                setDeleteError('');
                              }}
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tambah Pengguna Baru</h3>
                  <p className="text-[11px] text-slate-400">Pilih jenis akun dan masukkan informasi login</p>
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
              {/* Jenis Akun Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenis / Kategori Akun</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'REGULAR_USER', label: 'Peserta Mandiri', icon: User },
                    { id: 'PARENT', label: 'Orang Tua', icon: HeartHandshake },
                    { id: 'CHILD', label: 'Akun Anak', icon: Baby },
                    { id: 'ADMIN', label: 'Admin / Guru', icon: GraduationCap },
                    { id: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield },
                  ].map((t) => {
                    const Icon = t.icon;
                    const selected = addAccountType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAddAccountType(t.id as AccountType)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition ${
                          selected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bidang khusus Akun Anak */}
              {addAccountType === 'CHILD' && (
                <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3">
                  <div className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-sky-600" />
                    <span>Konfigurasi Relasi Akun Anak</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pilih Akun Orang Tua <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={addForm.parentId}
                      onChange={(e) => setAddForm({ ...addForm, parentId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                      required
                    >
                      <option value="">-- Pilih Orang Tua --</option>
                      {potentialParents.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (@{p.username}) {p.isParent ? '👨‍👩‍👦' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                      <select
                        value={addForm.gradeLevel}
                        onChange={(e) => setAddForm({ ...addForm, gradeLevel: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                      >
                        {Object.entries(GRADE_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Batas Bermain (Menit/hari)</label>
                      <input
                        type="number"
                        min={5}
                        max={600}
                        placeholder="Contoh: 30"
                        value={addForm.dailyGameMinutes}
                        onChange={(e) => setAddForm({ ...addForm, dailyGameMinutes: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nama Lengkap */}
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

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username (3–30 karakter: huruf kecil, angka, titik, atau garis bawah)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '') })}
                    placeholder="budisantoso"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
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
              {/* Jenis Akun Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenis Akun / Peran</label>
                <select
                  value={editAccountType}
                  disabled={editingUser.id === currentUserId || editingUser.childrenCount > 0}
                  onChange={(e) => setEditAccountType(e.target.value as AccountType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-indigo-500 focus:bg-white disabled:opacity-60"
                >
                  <option value="REGULAR_USER">👤 Peserta Mandiri</option>
                  <option value="PARENT">👨‍👩‍👦 Orang Tua</option>
                  <option value="CHILD">🧒 Akun Anak</option>
                  <option value="ADMIN">🎓 Admin / Guru</option>
                  <option value="SUPER_ADMIN">👑 Super Administrator</option>
                </select>
                {editingUser.childrenCount > 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Akun ini memiliki {editingUser.childrenCount} akun anak dan dikunci sebagai Orang Tua.
                  </p>
                )}
              </div>

              {/* Konfigurasi Akun Anak jika dipilih */}
              {editAccountType === 'CHILD' && (
                <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3">
                  <div className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-sky-600" />
                    <span>Pengaturan Relasi Anak</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pilih Orang Tua <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editForm.parentId}
                      onChange={(e) => setEditForm({ ...editForm, parentId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                      required
                    >
                      <option value="">-- Pilih Orang Tua --</option>
                      {potentialParents
                        .filter((p) => p.id !== editingUser.id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (@{p.username}) {p.isParent ? '👨‍👩‍👦' : ''}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                      <select
                        value={editForm.gradeLevel}
                        onChange={(e) => setEditForm({ ...editForm, gradeLevel: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                      >
                        {Object.entries(GRADE_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Batas Bermain (Menit/hari)</label>
                      <input
                        type="number"
                        min={5}
                        max={600}
                        placeholder="Contoh: 30"
                        value={editForm.dailyGameMinutes}
                        onChange={(e) => setEditForm({ ...editForm, dailyGameMinutes: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nama Lengkap */}
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

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '') })}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Status Akun */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Akun</label>
                <select
                  value={editForm.isActive ? 'true' : 'false'}
                  disabled={editingUser.id === currentUserId}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white disabled:opacity-50"
                >
                  <option value="true">Aktif (Dapat Login)</option>
                  <option value="false">Nonaktif (Sesi Dicabut & Dilarang Login)</option>
                </select>
              </div>

              {/* Ganti Password */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ubah Kata Sandi (Opsional)
                </label>
                <p className="text-[11px] text-slate-400 mb-1.5">
                  Mengubah password akan otomatis mencabut sesi login aktif di semua perangkat lain
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
                <p className="text-[10px] text-slate-400 mt-1">Sesi lama di semua perangkat akan dicabut seketika.</p>
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

      {/* ================= MODAL HAPUS PENGGUNA CERDAS ================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Hapus Pengguna Ini?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pengguna <strong className="text-slate-800 font-bold">{deletingUser.name}</strong> (@{deletingUser.username}) akan dihapus permanen.
              </p>
            </div>

            {/* Peringatan khusus jika pengguna memiliki akun anak */}
            {deletingUser.childrenCount > 0 && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5">
                <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-amber-600" />
                  <span>Perhatian: Memiliki {deletingUser.childrenCount} Akun Anak!</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Pilih penanganan untuk {deletingUser.childrenCount} akun anak yang tertaut:
                </p>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="deleteAction"
                      checked={deleteAction === 'cascade'}
                      onChange={() => setDeleteAction('cascade')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Hapus juga seluruh akun anak ({deletingUser.childrenCount} anak)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="deleteAction"
                      checked={deleteAction === 'reassign'}
                      onChange={() => setDeleteAction('reassign')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Pindahkan anak ke orang tua lain:</span>
                  </label>
                </div>

                {deleteAction === 'reassign' && (
                  <select
                    value={reassignParentId}
                    onChange={(e) => setReassignParentId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 mt-1"
                  >
                    <option value="">-- Pilih Orang Tua Baru --</option>
                    {potentialParents
                      .filter((p) => p.id !== deletingUser.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (@{p.username})
                        </option>
                      ))}
                  </select>
                )}
              </div>
            )}

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {deleteError}
              </div>
            )}

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
