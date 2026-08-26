'use client';

import { useState } from 'react';
import { addCourse, deleteCourse } from './actions';
import { useRouter } from 'next/navigation';

export default function CourseList({ initialCourses }: { initialCourses: any[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [formData, setFormData] = useState({ title: '', description: '', targetRoom: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await addCourse(formData);
    if (res.success) {
      setFormData({ title: '', description: '', targetRoom: '' });
      router.refresh(); 
      setTimeout(() => window.location.reload(), 500);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันการลบวิชานี้? ข้อมูลใบงานและการเช็คชื่อที่ผูกกับวิชานี้อาจได้รับผลกระทบ')) {
      await deleteCourse(id);
      router.refresh();
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>เพิ่มรายวิชาใหม่</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>ชื่อวิชา (เช่น คณิตศาสตร์)</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>รายละเอียดวิชา</label>
            <input 
              type="text" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>ห้องที่สอน (เช่น ม.1/1)</label>
            <input 
              type="text" 
              placeholder="เว้นว่างได้ถ้าสอนรวม"
              value={formData.targetRoom}
              onChange={e => setFormData({...formData, targetRoom: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 1.5rem', height: 'max-content' }}>
            {loading ? 'กำลังเพิ่ม...' : '+ เพิ่มวิชา'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{course.title}</h3>
            {course.description && <p style={{ color: 'var(--foreground)', opacity: 0.7, margin: '0.5rem 0' }}>{course.description}</p>}
            {course.targetRoom && <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '20px', fontSize: '0.85rem', marginTop: '0.5rem' }}>กลุ่มเป้าหมาย: {course.targetRoom}</div>}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleDelete(course.id)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>ลบวิชา</button>
            </div>
          </div>
        ))}
        {courses.length === 0 && <p>ยังไม่มีรายวิชา</p>}
      </div>
    </div>
  );
}
