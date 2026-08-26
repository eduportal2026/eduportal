import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import StudentAttendanceView from './StudentAttendanceView';

export default async function AttendancePage() {
  const session = await auth();
  if (!session) redirect('/login');

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === 'TEACHER' || role === 'ADMIN') {
    // Show courses to take attendance
    const courses = await prisma.course.findMany({
      where: role === 'ADMIN' ? {} : { teacherId: userId },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>เช็คชื่อเข้าเรียน (เลือกรายวิชา)</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {courses.map(course => (
            <div key={course.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{course.title}</h3>
              <p style={{ margin: '0.5rem 0' }}>ห้องเป้าหมาย: {course.targetRoom || 'ทั้งหมด'}</p>
              
              <Link href={`/dashboard/attendance/${course.id}`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
                เข้าสู่หน้าเช็คชื่อ
              </Link>
            </div>
          ))}
          {courses.length === 0 && <p>คุณยังไม่ได้สร้างรายวิชา โปรดไปที่เมนู "จัดการรายวิชา"</p>}
        </div>
      </div>
    );
  } else {
    // Student View
    const attendances = await prisma.attendance.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { date: 'desc' }
    });

    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>ประวัติการเข้าเรียนของฉัน</h1>
        <StudentAttendanceView attendances={attendances} />
      </div>
    );
  }
}
