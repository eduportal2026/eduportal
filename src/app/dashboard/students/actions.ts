'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function addStudent(data: any) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Check if username or studentId already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      return { success: false, error: 'Username นี้ถูกใช้งานแล้ว' };
    }

    if (data.studentId) {
      const existingStudentId = await prisma.user.findUnique({
        where: { studentId: data.studentId },
      });
      if (existingStudentId) {
        return { success: false, error: 'รหัสนักเรียนนี้ถูกใช้งานแล้ว' };
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    await prisma.user.create({
      data: {
        role: 'STUDENT',
        username: data.username,
        password: hashedPassword,
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.title || ''}${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email,
        studentId: data.studentId,
        rollNumber: data.rollNumber ? parseInt(data.rollNumber, 10) : null,
        gradeLevel: data.gradeLevel,
        room: data.room,
        status: data.status || 'ACTIVE',
      }
    });

    revalidatePath('/dashboard/students');
    return { success: true };
  } catch (error) {
    console.error('Error adding student:', error);
    return { success: false, error: 'Failed to add student' };
  }
}

export async function updateStudent(id: string, data: any) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Verify target user is actually a STUDENT (prevent privilege escalation)
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!targetUser || targetUser.role !== 'STUDENT') {
      return { success: false, error: 'ไม่สามารถแก้ไขข้อมูลผู้ใช้ที่ไม่ใช่นักเรียนได้' };
    }

    // Basic uniqueness check for username/studentId on update (ignoring self)
    if (data.username) {
      const existing = await prisma.user.findFirst({
        where: { username: data.username, id: { not: id } }
      });
      if (existing) return { success: false, error: 'Username นี้ถูกใช้งานแล้ว' };
    }

    if (data.studentId) {
      const existing = await prisma.user.findFirst({
        where: { studentId: data.studentId, id: { not: id } }
      });
      if (existing) return { success: false, error: 'รหัสนักเรียนนี้ถูกใช้งานแล้ว' };
    }

    const updateData: any = {
      username: data.username,
      title: data.title,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.title || ''}${data.firstName || ''} ${data.lastName || ''}`.trim(),
      email: data.email,
      studentId: data.studentId,
      rollNumber: data.rollNumber ? parseInt(data.rollNumber, 10) : null,
      gradeLevel: data.gradeLevel,
      room: data.room,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });

    revalidatePath('/dashboard/students');
    return { success: true };
  } catch (error) {
    console.error('Error updating student:', error);
    return { success: false, error: 'Failed to update student' };
  }
}

export async function updateStudentStatus(id: string, status: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Verify target user is actually a STUDENT
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!targetUser || targetUser.role !== 'STUDENT') {
      return { success: false, error: 'ไม่สามารถเปลี่ยนสถานะผู้ใช้ที่ไม่ใช่นักเรียนได้' };
    }

    await prisma.user.update({
      where: { id },
      data: { status }
    });

    revalidatePath('/dashboard/students');
    return { success: true };
    } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: 'Failed to update student status' };
  }
}

export async function importStudents(studentsData: any[]) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return { success: false, error: 'Unauthorized' };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const data of studentsData) {
    if (!data.username || !data.studentId) {
      errorCount++;
      continue;
    }

    try {
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { username: data.username },
            { studentId: data.studentId }
          ]
        }
      });

      if (existing) {
        // Skip duplicates for now instead of overwriting, to be safe
        errorCount++;
        continue;
      }

      const plainPassword = data.password || data.username; // default to username if no password
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      await prisma.user.create({
        data: {
          role: 'STUDENT',
          username: data.username,
          password: hashedPassword,
          title: data.title || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          name: `${data.title || ''}${data.firstName || ''} ${data.lastName || ''}`.trim(),
          studentId: data.studentId,
          rollNumber: data.rollNumber ? parseInt(data.rollNumber, 10) : null,
          gradeLevel: data.gradeLevel || 'ม.1',
          room: data.room || 'ม.1/1',
          status: 'ACTIVE',
        }
      });
      successCount++;
    } catch (e) {
      console.error(e);
      errorCount++;
    }
  }

  revalidatePath('/dashboard/students');
  return { success: true, message: `นำเข้าสำเร็จ ${successCount} รายการ, ข้าม/ซ้ำ/ข้อมูลไม่ครบ ${errorCount} รายการ` };
}

