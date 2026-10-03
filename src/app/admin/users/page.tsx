import React from 'react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { desc } from 'drizzle-orm';
import UsersManagementClient, { UserItem } from './UsersManagementClient';

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const allUsers = db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .all();

  const formattedUsers: UserItem[] = allUsers.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    role: u.role as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
    isActive: Boolean(u.isActive),
    createdAt: u.createdAt,
  }));

  return (
    <UsersManagementClient
      initialUsers={formattedUsers}
      currentUserId={currentUser.userId}
    />
  );
}
