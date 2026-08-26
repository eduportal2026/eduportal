'use client';

export default function StudentCourseList({ courses }: { courses: any[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
      {courses.map(course => (
        <div key={course.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{course.title}</h3>
          {course.description && <p style={{ color: 'var(--foreground)', opacity: 0.7, margin: '0.5rem 0' }}>{course.description}</p>}
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--foreground)', opacity: 0.8 }}>
            ผู้สอน: {course.teacher?.name || course.teacher?.username || 'ไม่ระบุ'}
          </div>
        </div>
      ))}
      {courses.length === 0 && <p>ยังไม่มีรายวิชาที่คุณครูกำหนดให้ห้องของคุณ</p>}
    </div>
  );
}
