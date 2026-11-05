import React from 'react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import UsersManagementClient, { UserItem } from './UsersManagementClient';

const parents = alias(users, 'parents');

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
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

  const formattedUsers: UserItem[] = allUsers.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    role: u.role as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
    isActive: Boolean(u.isActive),
    isParent: Boolean(u.isParent),
    gradeLevel: u.gradeLevel ?? null,
    parentId: u.parentId ?? null,
    parentName: u.parentName ?? null,
    parentUsername: u.parentUsername ?? null,
    dailyGameMinutes: u.dailyGameMinutes ?? null,
    childrenCount: Number(u.childrenCount || 0),
    createdAt: u.createdAt,
  }));

  return (
    <UsersManagementClient
      initialUsers={formattedUsers}
      currentUserId={currentUser.userId}
    />
  );
}
