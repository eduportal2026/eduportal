'use client';

import React, { useState } from 'react';
import { addAppLink, updateAppLink, deleteAppLink } from './actions';

export default function AppsClientPage({ initialApps }: { initialApps: any[] }) {
  const [apps, setApps] = useState(initialApps);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', url: '', icon: '🔗', imageUrl: '', 
    category: 'สำหรับนักเรียน', visibility: 'ALL', isActive: true, orderIndex: '0'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ["สำหรับนักเรียน", "สำหรับครู", "ระบบบริหารงาน", "ทั่วไป"];
  const visibilities = [
    { value: 'ALL', label: 'เห็นทุกคน' },
    { value: 'TEACHER_ONLY', label: 'เฉพาะครู' },
    { value: 'ADMIN_ONLY', label: 'เฉพาะผู้ดูแลระบบ' },
  ];

  const [file, setFile] = useState<File | null>(null);

  const openAddModal = () => {
    setFormData({
      name: '', description: '', url: '', icon: '🔗', imageUrl: '', 
      category: 'สำหรับนักเรียน', visibility: 'ALL', isActive: true, orderIndex: '0'
    });
    setEditingId(null);
    setFile(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (app: any) => {
    setFormData({
      name: app.name || '',
      description: app.description || '',
      url: app.url || '',
      icon: app.icon || '🔗',
      imageUrl: app.imageUrl || '',
      category: app.category || 'ทั่วไป',
      visibility: app.visibility || 'ALL',
      isActive: app.isActive,
      orderIndex: String(app.orderIndex || 0)
    });
    setEditingId(app.id);
    setFile(null);
    setError('');
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let finalImageUrl = formData.imageUrl;

    // Upload file if selected
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        const uploadResult = await uploadRes.json();
        
        if (uploadResult.success) {
          finalImageUrl = uploadResult.url;
        } else {
          setError('อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadResult.error);
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อเพื่ออัปโหลดไฟล์');
        setIsSubmitting(false);
        return;
      }
    }

    const payload = { ...formData, imageUrl: finalImageUrl };

    let res;
    if (editingId) {
      res = await updateAppLink(editingId, payload);
    } else {
      res = await addAppLink(payload);
    }

    if (res.success) {
      setShowModal(false);
      window.location.reload();
    } else {
      setError(res.error || 'เกิดข้อผิดพลาด');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณต้องการลบระบบนี้ใช่หรือไม่?')) {
      const res = await deleteAppLink(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error || 'ไม่สามารถลบได้');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)" }}>จัดการแอประบบ (App Launcher)</h1>
          <p style={{ color: "var(--foreground)", opacity: 0.7, marginTop: '0.5rem' }}>จัดการลิงก์ระบบต่างๆ ที่จะไปโชว์ในหน้าแรก (Portal)</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          + เพิ่มระบบใหม่
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', backgroundColor: 'var(--surface)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
              <th style={{ padding: '1rem' }}>ไอคอน</th>
              <th style={{ padding: '1rem' }}>ชื่อระบบ</th>
              <th style={{ padding: '1rem' }}>หมวดหมู่</th>
              <th style={{ padding: '1rem' }}>การมองเห็น</th>
              <th style={{ padding: '1rem' }}>สถานะ</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>ไม่พบข้อมูลระบบ</td>
              </tr>
            ) : (
              apps.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontSize: '1.5rem' }}>{app.icon}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-blue)' }}>{app.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.url}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{app.category}</td>
                  <td style={{ padding: '1rem' }}>{visibilities.find(v => v.value === app.visibility)?.label || app.visibility}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        backgroundColor: app.isActive ? '#dcfce7' : '#fee2e2',
                        color: app.isActive ? '#166534' : '#b91c1c',
                        fontSize: '0.8rem', fontWeight: 'bold'
                      }}>
                      {app.isActive ? 'เปิดใช้งาน' : 'ซ่อน'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button onClick={() => openEditModal(app)} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      แก้ไข
                    </button>
                    <button onClick={() => handleDelete(app.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
              {editingId ? 'แก้ไขระบบ' : 'เพิ่มระบบใหม่'}
            </h2>
            
            {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ไอคอน (Emoji)</label>
                  <input type="text" required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1.5rem', textAlign: 'center' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ชื่อระบบ</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ลิงก์ระบบ (URL)</label>
                <input type="url" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>คำอธิบาย (ไม่บังคับ)</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>อัปโหลดรูปภาพหน้าปก / Screenshot (แนะนำขนาด 600x400px)</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }} />
                  <div style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.6 }}>หรือวางลิงก์รูปภาพ (URL) ด้านล่าง หากไม่ต้องการอัปโหลด</div>
                  <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="/uploads/..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>หมวดหมู่</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>สิทธิ์การมองเห็น</label>
                  <select value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    {visibilities.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ลำดับการแสดง (ตัวเลข 1, 2, 3...)</label>
                  <input type="number" value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '2rem' }}>
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
                  <label htmlFor="isActive">เปิดใช้งาน (แสดงบนหน้าแรก)</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" disabled={isSubmitting}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
