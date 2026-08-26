'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function addAssignment(courseId: string, data: any) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        courseId
      }
    });

    revalidatePath(`/dashboard/assignments/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding assignment:', error);
    return { success: false, error: 'Failed to add assignment' };
  }
}

export async function deleteAssignment(id: string, courseId: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.assignment.delete({
      where: { id }
    });

    revalidatePath(`/dashboard/assignments/${courseId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete assignment' };
  }
}

export async function submitAssignment(assignmentId: string, content: string, courseId: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  if (!userId || role !== 'STUDENT') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const existing = await prisma.assignmentSubmission.findFirst({
      where: { assignmentId, userId }
    });

    if (existing) {
      await prisma.assignmentSubmission.update({
        where: { id: existing.id },
        data: { content, updatedAt: new Date() }
      });
    } else {
      await prisma.assignmentSubmission.create({
        data: {
          assignmentId,
          userId,
          content
        }
      });
    }

    revalidatePath(`/dashboard/assignments/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting:', error);
    return { success: false, error: 'Failed to submit' };
  }
}

export async function gradeSubmission(submissionId: string, score: number, feedback: string, courseId: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: { score, feedback }
    });
    
    revalidatePath(`/dashboard/assignments/${courseId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to grade' };
  }
}
