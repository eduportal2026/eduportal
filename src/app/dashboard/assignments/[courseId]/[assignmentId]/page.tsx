import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import GradingView from './GradingView';

export default async function AssignmentGradingPage({ params }: { params: { courseId: string, assignmentId: string } }) {
  const session = await auth();
  if (!session) redirect('/login');
  
  const role = (session.user as any).role;
  if (role !== 'TEACHER' && role !== 'ADMIN') redirect('/dashboard/assignments');

  const assignment = await prisma.assignment.findUnique({
    where: { id: params.assignmentId },
    include: {
      course: true,
      submissions: {
        include: { user: true }
      }
    }
  });

  if (!assignment) redirect(`/dashboard/assignments/${params.courseId}`);

  // Fetch all students in the course target room
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      ...(assignment.course.targetRoom ? { room: assignment.course.targetRoom } : {})
    },
    orderBy: { rollNumber: 'asc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <a href={`/dashboard/assignments/${params.courseId}`} style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>&larr; กลับหน้าใบงาน</a>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>ตรวจงาน: {assignment.title}</h1>
      </div>

      <GradingView assignment={assignment} students={students} courseId={params.courseId} />
    </div>
  );
}
