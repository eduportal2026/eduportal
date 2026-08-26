import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AssignmentList from './AssignmentList';
import StudentAssignmentList from './StudentAssignmentList';

export default async function CourseAssignmentsPage({ params }: { params: { courseId: string } }) {
  const session = await auth();
  if (!session) redirect('/login');
  
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const course = await prisma.course.findUnique({ where: { id: params.courseId } });
  if (!course) redirect('/dashboard/assignments');

  const assignments = await prisma.assignment.findMany({
    where: { courseId: params.courseId },
    include: { submissions: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <a href="/dashboard/assignments" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>&larr; ย้อนกลับ</a>
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
