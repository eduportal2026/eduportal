import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AttendanceSheet from './AttendanceSheet';
import Link from 'next/link';

export default async function CourseAttendancePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) redirect('/login');
  const role = (session.user as any).role;
  if (role !== 'TEACHER' && role !== 'ADMIN') redirect('/dashboard');

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) redirect('/dashboard/attendance');

  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      ...(course.targetRoom ? { room: course.targetRoom } : {})
    },
    select: {
      id: true,
      name: true,
      rollNumber: true,
      studentId: true
    },
    orderBy: { rollNumber: 'asc' } 
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/attendance" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>&larr; ย้อนกลับ</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>เช็คชื่อ: {course.title}</h1>
        <p>ห้องเป้าหมาย: {course.targetRoom || 'นักเรียนทั้งหมด'}</p>
      </div>

      <AttendanceSheet courseId={course.id} students={students} />
    </div>
  );
}
