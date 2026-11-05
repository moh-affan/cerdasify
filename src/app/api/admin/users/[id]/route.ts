import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { users } from '@/db/schema';
import { requireSuperAdmin, hashPassword, validateUsername, isUserRole } from '@/lib/auth';
import { eq, and, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { apiError, readJson } from '@/lib/api';

const parents = alias(users, 'parents');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin();
    const { id } = await params;

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        isParent: users.isParent,
        gradeLevel: users.gradeLevel,
        parentId: users.parentId,
        parentName: parents.name,
        parentUsername: parents.username,
        dailyGameMinutes: users.dailyGameMinutes,
        childrenCount: sql<number>`(SELECT count(*)::int FROM users children WHERE children.parent_id = ${users.id})`,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(parents, eq(users.parentId, parents.id))
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return apiError(error, 'Admin API error');
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentAdmin = await requireSuperAdmin();
    const { id } = await params;
    const body = await readJson<{
      name?: string;
      username?: string;
      role?: string;
      isActive?: boolean;
      password?: string;
      isParent?: boolean;
      parentId?: string | null;
      gradeLevel?: number | null;
      dailyGameMinutes?: number | null;
    }>(req);

    const { name, username, role, isActive, password, isParent, parentId, gradeLevel, dailyGameMinutes } = body;

    if (role !== undefined && !isUserRole(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    const [existingUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!existingUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Hitung jumlah anak yang dimiliki user saat ini
    const [childCountRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.parentId, id));
    const childrenCount = childCountRow?.count ?? 0;

    // Safety 1: prevent deactivating own active superadmin account
    if (currentAdmin.userId === id && isActive === false) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menonaktifkan akun Super Admin Anda sendiri' },
        { status: 400 }
      );
    }

    // Safety 2: prevent demoting own superadmin account
    if (currentAdmin.userId === id && role && role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Anda tidak dapat menurunkan role akun Anda sendiri' },
        { status: 400 }
      );
    }

    // Safety 3: Pengaman minimal 1 Super Admin aktif di sistem
    const willBeDemoted = role !== undefined && role !== 'SUPER_ADMIN' && existingUser.role === 'SUPER_ADMIN';
    const willBeDeactivated = isActive === false && existingUser.isActive && existingUser.role === 'SUPER_ADMIN';
    if (willBeDemoted || willBeDeactivated) {
      const [superAdminCountRow] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(and(eq(users.role, 'SUPER_ADMIN'), eq(users.isActive, true)));
      const activeSuperAdmins = superAdminCountRow?.count ?? 0;
      if (activeSuperAdmins <= 1) {
        return NextResponse.json(
          { error: 'Sistem harus memiliki minimal 1 Super Admin aktif. Tidak dapat menonaktifkan atau mengubah role Super Admin terakhir.' },
          { status: 400 }
        );
      }
    }

    // Validasi Name
    let cleanName: string | undefined = undefined;
    if (name !== undefined) {
      cleanName = name.trim();
      if (!cleanName) {
        return NextResponse.json({ error: 'Nama lengkap tidak boleh kosong' }, { status: 400 });
      }
    }

    // Validasi Username
    let cleanUsername: string | undefined = undefined;
    if (username !== undefined) {
      const val = validateUsername(username);
      if (!val.valid) {
        return NextResponse.json({ error: val.error }, { status: 400 });
      }
      cleanUsername = val.normalized;

      if (cleanUsername !== existingUser.username.toLowerCase()) {
        const [duplicate] = await db
          .select({ id: users.id })
          .from(users)
          .where(and(sql`LOWER(${users.username}) = ${cleanUsername}`, sql`${users.id} != ${id}`))
          .limit(1);

        if (duplicate) {
          return NextResponse.json(
            { error: `Username @${cleanUsername} sudah digunakan pengguna lain` },
            { status: 400 }
          );
        }
      }
    }

    // Validasi Relasi Orang Tua & Anak
    const effectiveRole = role ?? existingUser.role;
    const effectiveParentId = parentId !== undefined ? parentId : existingUser.parentId;

    // Jika memiliki parentId -> Wajib role USER
    if (effectiveParentId) {
      if (effectiveRole !== 'USER') {
        return NextResponse.json(
          { error: 'Akun anak hanya boleh memiliki role Peserta (USER). Lepas relasi orang tua terlebih dahulu jika ingin menaikkan role.' },
          { status: 400 }
        );
      }
      if (effectiveParentId === id) {
        return NextResponse.json(
          { error: 'Pengguna tidak dapat menjadi orang tua dari dirinya sendiri' },
          { status: 400 }
        );
      }
      if (childrenCount > 0) {
        return NextResponse.json(
          { error: 'Pengguna yang sudah memiliki anak tidak dapat ditautkan sebagai anak dari orang tua lain (tidak boleh bertingkat).' },
          { status: 400 }
        );
      }

      if (parentId !== undefined && parentId !== null) {
        const [parentRecord] = await db.select().from(users).where(eq(users.id, parentId)).limit(1);
        if (!parentRecord) {
          return NextResponse.json({ error: 'Akun orang tua yang dipilih tidak ditemukan' }, { status: 400 });
        }
        if (parentRecord.parentId) {
          return NextResponse.json(
            { error: 'Akun anak tidak dapat dipilih sebagai orang tua' },
            { status: 400 }
          );
        }
      }
    }

    // Validasi gradeLevel
    if (gradeLevel !== undefined && gradeLevel !== null) {
      if (!Number.isInteger(gradeLevel) || gradeLevel < 1 || gradeLevel > 13) {
        return NextResponse.json({ error: 'Kelas tidak valid (1–13)' }, { status: 400 });
      }
    }

    // Validasi dailyGameMinutes
    if (dailyGameMinutes !== undefined && dailyGameMinutes !== null) {
      if (!Number.isInteger(dailyGameMinutes) || dailyGameMinutes < 5 || dailyGameMinutes > 600) {
        return NextResponse.json({ error: 'Batas bermain harus 5–600 menit atau kosongkan' }, { status: 400 });
      }
    }

    // Eksekusi update dalam transaksi
    await client.begin(async (sqlClient) => {
      const updates: Record<string, unknown> = {};

      if (cleanName !== undefined) updates.name = cleanName;
      if (cleanUsername !== undefined) updates.username = cleanUsername;
      if (role !== undefined) updates.role = role;
      if (isActive !== undefined) {
        updates.is_active = Boolean(isActive);
        // Jika dinonaktifkan, cabut sesi aktif seketika
        if (!isActive) {
          updates.token_version = sql`token_version + 1`;
        }
      }

      if (password && password.trim().length > 0) {
        if (password.trim().length < 6) {
          throw new Error('PASSWORD_TOO_SHORT');
        }
        updates.password_hash = await hashPassword(password.trim());
        // Jika password diubah, cabut sesi aktif di semua perangkat lain
        updates.token_version = sql`token_version + 1`;
      }

      if (parentId !== undefined) {
        updates.parent_id = parentId;
        if (parentId) {
          updates.is_parent = false; // Akun anak tidak berstatus orang tua
        }
      }

      if (gradeLevel !== undefined) {
        updates.grade_level = gradeLevel;
      }

      if (dailyGameMinutes !== undefined) {
        updates.daily_game_minutes = dailyGameMinutes;
      }

      if (isParent !== undefined) {
        // Jika punya anak, tidak bisa dipaksa false
        if (!isParent && childrenCount > 0) {
          throw new Error('CANNOT_DISABLE_PARENT_WITH_CHILDREN');
        }
        if (!effectiveParentId && effectiveRole === 'USER') {
          updates.is_parent = Boolean(isParent);
        }
      }

      // Jika role dinaikkan ke ADMIN / SUPER_ADMIN, bersihkan data anak
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        updates.parent_id = null;
        updates.grade_level = null;
        updates.daily_game_minutes = null;
        updates.is_parent = false;
      }

      if (Object.keys(updates).length > 0) {
        await sqlClient`
          UPDATE users
          SET ${sqlClient(updates)}
          WHERE id = ${id}
        `;
      }

      // Bila ditautkan ke orang tua baru, tandai orang tua tersebut is_parent = true
      if (parentId) {
        await sqlClient`
          UPDATE users SET is_parent = true WHERE id = ${parentId}
        `;
      }
    }).catch((err) => {
      if (err instanceof Error) {
        if (err.message === 'PASSWORD_TOO_SHORT') {
          throw new Error('Password minimal 6 karakter');
        }
        if (err.message === 'CANNOT_DISABLE_PARENT_WITH_CHILDREN') {
          throw new Error('Status orang tua tidak dapat dinonaktifkan karena akun masih memiliki anak');
        }
      }
      throw err;
    });

    return NextResponse.json({
      success: true,
      message: 'Data pengguna berhasil diperbarui',
    });
  } catch (error) {
    return apiError(error, 'Error updating user');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentAdmin = await requireSuperAdmin();
    const { id } = await params;

    if (currentAdmin.userId === id) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menghapus akun Anda sendiri saat ini' },
        { status: 400 }
      );
    }

    if (id === 'usr_superadmin') {
      return NextResponse.json(
        { error: 'Akun Super Administrator utama dilindungi dan tidak dapat dihapus' },
        { status: 400 }
      );
    }

    const [existingUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!existingUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Safety: Cek Super Admin aktif terakhir
    if (existingUser.role === 'SUPER_ADMIN' && existingUser.isActive) {
      const [superAdminCountRow] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(and(eq(users.role, 'SUPER_ADMIN'), eq(users.isActive, true)));
      const activeSuperAdmins = superAdminCountRow?.count ?? 0;
      if (activeSuperAdmins <= 1) {
        return NextResponse.json(
          { error: 'Tidak dapat menghapus Super Admin aktif terakhir di sistem.' },
          { status: 400 }
        );
      }
    }

    // Cek apakah akun memiliki anak
    const [childCountRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.parentId, id));
    const childCount = childCountRow?.count ?? 0;

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action'); // 'cascade' | 'reassign'
    const newParentId = searchParams.get('newParentId');

    if (childCount > 0 && !action) {
      return NextResponse.json(
        {
          error: `Pengguna @${existingUser.username} memiliki ${childCount} akun anak terhubung. Pilih untuk menghapus beserta seluruh akun anak atau pindahkan anak ke akun orang tua lain terlebih dahulu.`,
          hasChildren: true,
          childrenCount: childCount,
        },
        { status: 400 }
      );
    }

    // Eksekusi penghapusan dalam transaksi
    await client.begin(async (sqlClient) => {
      if (childCount > 0) {
        if (action === 'cascade') {
          // Hapus anak-anak beserta riwayat ujian dan progres mereka
          const childRecords = await sqlClient<{ id: string }[]>`
            SELECT id FROM users WHERE parent_id = ${id}
          `;
          const childIds = childRecords.map((c) => c.id);

          if (childIds.length > 0) {
            await sqlClient`DELETE FROM attempt_answers WHERE attempt_id IN (SELECT id FROM attempts WHERE user_id IN ${sqlClient(childIds)})`;
            await sqlClient`DELETE FROM attempts WHERE user_id IN ${sqlClient(childIds)}`;
            await sqlClient`DELETE FROM reading_progress WHERE user_id IN ${sqlClient(childIds)}`;
            await sqlClient`DELETE FROM game_sessions WHERE user_id IN ${sqlClient(childIds)}`;
            await sqlClient`DELETE FROM game_progress WHERE user_id IN ${sqlClient(childIds)}`;
            await sqlClient`DELETE FROM vocab_mastery WHERE user_id IN ${sqlClient(childIds)}`;
            await sqlClient`DELETE FROM users WHERE id IN ${sqlClient(childIds)}`;
          }
        } else if (action === 'reassign' && newParentId) {
          if (newParentId === id) {
            throw new Error('INVALID_NEW_PARENT');
          }
          const [newParent] = await sqlClient<{ id: string; parent_id: string | null }[]>`
            SELECT id, parent_id FROM users WHERE id = ${newParentId}
          `;
          if (!newParent || newParent.parent_id) {
            throw new Error('INVALID_NEW_PARENT');
          }

          // Pindahkan anak-anak ke orang tua baru
          await sqlClient`
            UPDATE users SET parent_id = ${newParentId} WHERE parent_id = ${id}
          `;
          // Pastikan orang tua baru memiliki is_parent = true
          await sqlClient`
            UPDATE users SET is_parent = true WHERE id = ${newParentId}
          `;
        } else {
          throw new Error('INVALID_DELETE_ACTION');
        }
      }

      // Hapus data pengguna itu sendiri
      await sqlClient`DELETE FROM attempt_answers WHERE attempt_id IN (SELECT id FROM attempts WHERE user_id = ${id})`;
      await sqlClient`DELETE FROM attempts WHERE user_id = ${id}`;
      await sqlClient`DELETE FROM reading_progress WHERE user_id = ${id}`;
      await sqlClient`DELETE FROM game_sessions WHERE user_id = ${id}`;
      await sqlClient`DELETE FROM game_progress WHERE user_id = ${id}`;
      await sqlClient`DELETE FROM vocab_mastery WHERE user_id = ${id}`;
      await sqlClient`DELETE FROM users WHERE id = ${id}`;
    }).catch((err) => {
      if (err instanceof Error) {
        if (err.message === 'INVALID_NEW_PARENT') {
          throw new Error('Akun orang tua baru tidak valid atau merupakan akun anak');
        }
        if (err.message === 'INVALID_DELETE_ACTION') {
          throw new Error('Aksi penghapusan relasi orang tua tidak valid');
        }
      }
      throw err;
    });

    return NextResponse.json({
      success: true,
      message: `Pengguna @${existingUser.username} berhasil dihapus`,
    });
  } catch (error) {
    return apiError(error, 'Error deleting user');
  }
}
