'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function addAppLink(data: any) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.appLink.create({
      data: {
        name: data.name,
        description: data.description,
        url: data.url,
        icon: data.icon,
        imageUrl: data.imageUrl,
        category: data.category,
        visibility: data.visibility || 'ALL',
        isActive: data.isActive ?? true,
        orderIndex: parseInt(data.orderIndex || '0', 10),
      }
    });

    revalidatePath('/dashboard/apps');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding app link:', error);
    return { success: false, error: 'Failed to add app link' };
  }
}

export async function updateAppLink(id: string, data: any) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.appLink.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        url: data.url,
        icon: data.icon,
        imageUrl: data.imageUrl,
        category: data.category,
        visibility: data.visibility,
        isActive: data.isActive,
        orderIndex: parseInt(data.orderIndex || '0', 10),
      }
    });

    revalidatePath('/dashboard/apps');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating app link:', error);
    return { success: false, error: 'Failed to update app link' };
  }
}

export async function deleteAppLink(id: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN') { // Only admins can delete
    return { success: false, error: 'Unauthorized. Admin only.' };
  }

  try {
    await prisma.appLink.delete({
      where: { id }
    });

    revalidatePath('/dashboard/apps');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting app link:', error);
    return { success: false, error: 'Failed to delete app link' };
  }
}
