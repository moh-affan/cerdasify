import { NextRequest, NextResponse } from 'next/server';
import { db, client } from '@/db';
import { users } from '@/db/schema';
import { requireSuperAdmin, hashPassword } from '@/lib/auth';
import { eq, and, ne } from 'drizzle-orm';

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
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Forbidden' }, { status: 403 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentAdmin = await requireSuperAdmin();
    const { id } = await params;
    const body = await req.json();

    const { name, username, role, isActive, password } = body;

    const [existingUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!existingUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Safety: prevent deactivating own active superadmin account
    if (currentAdmin.userId === id && isActive === false) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menonaktifkan akun Super Admin Anda sendiri' },
        { status: 400 }
      );
    }

    // Safety: prevent demoting own superadmin account
    if (currentAdmin.userId === id && role && role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Anda tidak dapat menurunkan role akun Anda sendiri' },
        { status: 400 }
      );
    }

    // Check if new username is already taken by another user
    if (username && username.trim() !== existingUser.username) {
      const [duplicateUsername] = await db
        .select()
        .from(users)
        .where(and(eq(users.username, username.trim()), ne(users.id, id)))
        .limit(1);

      if (duplicateUsername) {
        return NextResponse.json(
          { error: `Username @${username.trim()} sudah digunakan pengguna lain` },
          { status: 400 }
        );
      }
    }

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name.trim();
    if (username !== undefined) updates.username = username.trim();
    if (role !== undefined) updates.role = role;
    if (isActive !== undefined) updates.isActive = Boolean(isActive);

    if (password && password.trim().length > 0) {
      if (password.trim().length < 6) {
        return NextResponse.json(
          { error: 'Password minimal 6 karakter' },
          { status: 400 }
        );
      }
      updates.passwordHash = await hashPassword(password.trim());
    }

    await db.update(users)
      .set(updates)
      .where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      message: 'Data pengguna berhasil diperbarui',
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
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

    // Cascade delete attempts and user
    await client.begin(async (sql) => {
      await sql`DELETE FROM attempt_answers WHERE attempt_id IN (SELECT id FROM attempts WHERE user_id = ${id})`;
      await sql`DELETE FROM attempts WHERE user_id = ${id}`;
      await sql`DELETE FROM users WHERE id = ${id}`;
    });

    return NextResponse.json({
      success: true,
      message: `Pengguna @${existingUser.username} berhasil dihapus`,
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
