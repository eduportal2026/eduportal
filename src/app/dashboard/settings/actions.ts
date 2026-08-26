'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function updateProfile(data: any) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const updateData: any = {};
    if (data.username) {
      // Check if username exists for OTHER users
      const existing = await prisma.user.findFirst({
        where: { username: data.username, id: { not: userId } }
      });
      if (existing) return { success: false, error: 'Username นี้ถูกใช้งานแล้ว' };
      updateData.username = data.username;
    }
    
    if (data.name) updateData.name = data.name;
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' };
  }
}
