import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AssignmentList from './AssignmentList';
import StudentAssignmentList from './StudentAssignmentList';
import Link from 'next/link';

export default async function CourseAssignmentsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) redirect('/login');
  
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) redirect('/dashboard/assignments');

  const assignments = await prisma.assignment.findMany({
    where: { courseId: courseId },
    include: { submissions: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/assignments" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>&larr; ย้อนกลับ</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>ใบงาน: {course.title}</h1>
      </div>

      {role === 'TEACHER' || role === 'ADMIN' ? (
        <AssignmentList courseId={course.id} assignments={assignments} />
      ) : (
        <StudentAssignmentList courseId={course.id} assignments={assignments} userId={userId} />
      )}
    </div>
  );
}
