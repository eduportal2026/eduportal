import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AssignmentsIndexPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  let courses = [];
  
  if (role === 'TEACHER' || role === 'ADMIN') {
    courses = await prisma.course.findMany({
      where: role === 'ADMIN' ? {} : { teacherId: userId },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    courses = await prisma.course.findMany({
      where: { targetRoom: user?.room || '' },
      orderBy: { createdAt: 'desc' }
    });
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        จัดการใบงานและส่งงาน (เลือกรายวิชา)
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{course.title}</h3>
            <p style={{ margin: '0.5rem 0' }}>ห้องเป้าหมาย: {course.targetRoom || 'ทั้งหมด'}</p>
            
            <Link href={`/dashboard/assignments/${course.id}`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
              เข้าสู่หน้าใบงาน
            </Link>
          </div>
        ))}
        {courses.length === 0 && <p>ไม่พบรายวิชา</p>}
      </div>
    </div>
  );
}
