import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { users } from '@/db/schema';
import { requireSuperAdmin, hashPassword, isUserRole, validateUsername } from '@/lib/auth';
import { eq, desc, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { apiError, readJson } from '@/lib/api';

const parents = alias(users, 'parents');

export async function GET() {
  try {
    await requireSuperAdmin();
    const list = await db
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
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ users: list });
  } catch (error) {
    return apiError(error, 'Admin API error');
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin();
    const {
      username,
      name,
      password,
      role = 'USER',
      isParent = false,
      parentId = null,
      gradeLevel = null,
      dailyGameMinutes = null,
    } = await readJson<{
      username?: string;
      name?: string;
      password?: string;
      role?: string;
      isParent?: boolean;
      parentId?: string | null;
      gradeLevel?: number | null;
      dailyGameMinutes?: number | null;
    }>(req);

    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName) {
      return NextResponse.json({ error: 'Nama lengkap wajib diisi' }, { status: 400 });
    }

    const usernameVal = validateUsername(username);
    if (!usernameVal.valid) {
      return NextResponse.json({ error: usernameVal.error }, { status: 400 });
    }
    const cleanUsername = usernameVal.normalized;

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }
    if (!isUserRole(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    // Pengecekan akun anak & relasi orang tua
    let effectiveParentId: string | null = null;
    let effectiveGradeLevel: number | null = null;
    let effectiveDailyGameMinutes: number | null = null;
    let effectiveIsParent = Boolean(isParent);

    if (parentId) {
      if (role !== 'USER') {
        return NextResponse.json(
          { error: 'Akun anak hanya boleh memiliki role Peserta (USER)' },
          { status: 400 }
        );
      }
      const [parentRecord] = await db
        .select()
        .from(users)
        .where(eq(users.id, parentId))
        .limit(1);

      if (!parentRecord) {
        return NextResponse.json({ error: 'Akun orang tua yang dipilih tidak ditemukan' }, { status: 400 });
      }
      if (parentRecord.parentId) {
        return NextResponse.json(
          { error: 'Akun anak tidak dapat dipilih sebagai orang tua (tidak boleh bersarang)' },
          { status: 400 }
        );
      }

      effectiveParentId = parentId;
      effectiveIsParent = false; // Akun anak bukan akun orang tua

      if (gradeLevel !== null && gradeLevel !== undefined) {
        if (!Number.isInteger(gradeLevel) || gradeLevel < 1 || gradeLevel > 13) {
          return NextResponse.json({ error: 'Kelas tidak valid (1–13)' }, { status: 400 });
        }
        effectiveGradeLevel = gradeLevel;
      }

      if (dailyGameMinutes !== null && dailyGameMinutes !== undefined) {
        if (!Number.isInteger(dailyGameMinutes) || dailyGameMinutes < 5 || dailyGameMinutes > 600) {
          return NextResponse.json({ error: 'Batas bermain harus 5–600 menit atau kosongkan' }, { status: 400 });
        }
        effectiveDailyGameMinutes = dailyGameMinutes;
      }
    } else {
      // Jika bukan akun anak, tapi role ADMIN/SUPER_ADMIN, tidak boleh diset gradeLevel atau isParent = true
      if (role !== 'USER') {
        effectiveIsParent = false;
        effectiveGradeLevel = null;
        effectiveDailyGameMinutes = null;
      }
    }

    // Cek duplikasi username (case-insensitive)
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`LOWER(${users.username}) = ${cleanUsername}`)
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: `Username @${cleanUsername} sudah digunakan` }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await client.begin(async (sqlClient) => {
      await sqlClient`
        INSERT INTO users (
          id, username, name, password_hash, role, is_active, is_parent,
          grade_level, parent_id, daily_game_minutes, token_version
        )
        VALUES (
          ${userId}, ${cleanUsername}, ${cleanName}, ${passwordHash}, ${role}, true, ${effectiveIsParent},
          ${effectiveGradeLevel}, ${effectiveParentId}, ${effectiveDailyGameMinutes}, 1
        )
      `;

      if (effectiveParentId) {
        await sqlClient`
          UPDATE users SET is_parent = true WHERE id = ${effectiveParentId}
        `;
      }
    });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    return apiError(error, 'Error creating user');
  }
}
