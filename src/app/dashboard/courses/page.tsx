import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import CourseList from './CourseList';
import StudentCourseList from './StudentCourseList';

export default async function CoursesPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === 'TEACHER' || role === 'ADMIN') {
    const courses = await prisma.course.findMany({
      where: role === 'ADMIN' ? {} : { teacherId: userId },
      orderBy: { createdAt: 'desc' }
    });
    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>จัดการรายวิชา (Courses)</h1>
        <CourseList initialCourses={courses} />
      </div>
    );
  } else {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userRoom = user?.room || '';

    const courses = await prisma.course.findMany({
      where: { targetRoom: userRoom },
      include: { teacher: { select: { name: true, username: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>รายวิชาของฉัน ({userRoom})</h1>
        <StudentCourseList courses={courses} />
      </div>
    );
  }
}
