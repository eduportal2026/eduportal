'use client';

import { useState } from 'react';
import { addAssignment, deleteAssignment } from '../actions';
import { useRouter } from 'next/navigation';

export default function AssignmentList({ courseId, assignments }: { courseId: string, assignments: any[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await addAssignment(courseId, formData);
    if (res.success) {
      setFormData({ title: '', description: '', dueDate: '' });
      router.refresh();
      setTimeout(() => window.location.reload(), 500);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันการลบใบงานนี้?')) {
      await deleteAssignment(id, courseId);
      router.refresh();
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>สร้างใบงานใหม่</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>หัวข้อใบงาน</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>รายละเอียด / คำสั่ง</label>
            <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>กำหนดส่ง</label>
            <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 1.5rem', height: 'max-content' }}>
            {loading ? 'กำลังสร้าง...' : '+ สร้างใบงาน'}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {assignments.map(assign => (
          <div key={assign.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{assign.title}</h3>
                <p style={{ color: 'var(--foreground)', opacity: 0.8, margin: '0.5rem 0' }}>{assign.description}</p>
                <div style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '20px', display: 'inline-block' }}>
                  กำหนดส่ง: {new Date(assign.dueDate).toLocaleDateString('th-TH')}
                </div>
              </div>
              <button onClick={() => handleDelete(assign.id)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}>ลบใบงาน</button>
            </div>
            
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>คนส่งงาน ({assign.submissions.length} คน)</h4>
              <a href={`/dashboard/assignments/${courseId}/${assign.id}`} className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                ตรวจงานและให้คะแนน
              </a>
            </div>
          </div>
        ))}
        {assignments.length === 0 && <p>ยังไม่มีใบงาน</p>}
      </div>
    </div>
  );
}
