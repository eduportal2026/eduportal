import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import GradingView from './GradingView';
import Link from 'next/link';

export default async function AssignmentGradingPage({ params }: { params: Promise<{ courseId: string, assignmentId: string }> }) {
  const { courseId, assignmentId } = await params;
  const session = await auth();
  if (!session) redirect('/login');
  
  const role = (session.user as any).role;
  if (role !== 'TEACHER' && role !== 'ADMIN') redirect('/dashboard/assignments');

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: true,
      submissions: {
        include: { user: true }
      }
    }
  });

  if (!assignment) redirect(`/dashboard/assignments/${courseId}`);

  // Fetch all students in the course target room
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      ...(assignment.course.targetRoom ? { room: assignment.course.targetRoom } : {})
    },
    select: {
      id: true,
      name: true,
      rollNumber: true
    },
    orderBy: { rollNumber: 'asc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/dashboard/assignments/${courseId}`} style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>&larr; กลับหน้าใบงาน</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>ตรวจงาน: {assignment.title}</h1>
      </div>

      <GradingView assignment={assignment} students={students} courseId={courseId} />
    </div>
  );
}
