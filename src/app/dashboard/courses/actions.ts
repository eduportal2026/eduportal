'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function addCourse(data: any) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  if (!userId || (role !== 'ADMIN' && role !== 'TEACHER')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.course.create({
      data: {
        title: data.title,
        description: data.description || '',
        targetRoom: data.targetRoom || null,
        teacherId: userId
      }
    });

    revalidatePath('/dashboard/courses');
    return { success: true };
  } catch (error) {
    console.error('Error adding course:', error);
    return { success: false, error: 'Failed to add course' };
  }
}

export async function deleteCourse(id: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  if (!userId || (role !== 'ADMIN' && role !== 'TEACHER')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.course.delete({
      where: { id }
    });

    revalidatePath('/dashboard/courses');
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: 'Failed to delete course' };
  }
}
