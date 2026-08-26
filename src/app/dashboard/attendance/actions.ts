'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function submitAttendance(courseId: string, date: string, records: any[]) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const dateObj = new Date(date);
    dateObj.setHours(0,0,0,0);

    // Delete existing attendance for this course and date
    await prisma.attendance.deleteMany({
      where: {
        courseId,
        date: {
          gte: dateObj,
          lt: new Date(dateObj.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    // Create new records
    await prisma.attendance.createMany({
      data: records.map(record => ({
        courseId,
        userId: record.userId,
        status: record.status,
        date: dateObj
      }))
    });

    revalidatePath(`/dashboard/attendance/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting attendance:', error);
    return { success: false, error: 'Failed to submit attendance' };
  }
}
