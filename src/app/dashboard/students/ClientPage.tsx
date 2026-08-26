'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { addStudent, updateStudent, updateStudentStatus, importStudents } from './actions';

export default function StudentClientPage({ initialStudents }: { initialStudents: any[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filters
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '', password: '', title: 'เด็กชาย', firstName: '', lastName: '', 
    email: '', studentId: '', rollNumber: '', gradeLevel: 'ม.1', room: 'ม.1/1', status: 'ACTIVE'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const grades = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
  const rooms = [
    "ม.1/1", "ม.1/2", "ม.2/1", "ม.2/2", "ม.3/1", "ม.3/2", 
    "ม.4/1", "ม.4/2", "ม.5/1", "ม.5/2", "ม.6/1", "ม.6/2"
  ];
  const titles = ["เด็กชาย", "เด็กหญิง", "นาย", "นางสาว"];
  const statuses = [
    { value: 'ACTIVE', label: 'ปกติ' },
    { value: 'TRANSFERRED', label: 'ย้ายสถานศึกษา' },
    { value: 'DROPOUT', label: 'ออก' },
    { value: 'GRADUATED', label: 'จบการศึกษา' },
  ];

  const filteredStudents = students.filter(s => {
    if (filterGrade !== 'ALL' && s.gradeLevel !== filterGrade) return false;
    if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchId = s.studentId?.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  const openAddModal = () => {
    setFormData({
      username: '', password: '', title: 'เด็กชาย', firstName: '', lastName: '', 
      email: '', studentId: '', rollNumber: '', gradeLevel: 'ม.1', room: 'ม.1/1', status: 'ACTIVE'
    });
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (student: any) => {
    setFormData({
      username: student.username || '',
      password: student.password || '',
      title: student.title || 'เด็กชาย',
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      studentId: student.studentId || '',
      rollNumber: student.rollNumber ? String(student.rollNumber) : '',
      gradeLevel: student.gradeLevel || 'ม.1',
      room: student.room || 'ม.1/1',
      status: student.status || 'ACTIVE'
    });
    setEditingId(student.id);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let res;
    if (editingId) {
      res = await updateStudent(editingId, formData);
    } else {
      res = await addStudent(formData);
    }

    if (res.success) {
      setShowModal(false);
      window.location.reload(); // Quick refresh to get latest data from server
    } else {
      setError(res.error || 'เกิดข้อผิดพลาด');
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateStudentStatus(id, newStatus);
    if (res.success) {
      setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } else {
      alert("ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await importStudents(results.data);
          if (res.success) {
            alert(res.message);
            window.location.reload();
          } else {
            alert(res.error || 'เกิดข้อผิดพลาดในการนำเข้า');
          }
        } catch (err) {
          alert('เกิดข้อผิดพลาด');
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (error: any) => {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV: ' + error.message);
        setIsImporting(false);
      }
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)" }}>จัดการนักเรียน</h1>
          <p style={{ color: "var(--foreground)", opacity: 0.7, marginTop: '0.5rem' }}>ระบบจัดการข้อมูลและสถานะนักเรียน</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="btn-secondary"
            disabled={isImporting}
          >
            {isImporting ? 'กำลังนำเข้า...' : '📥 นำเข้าจาก CSV'}
          </button>
          <button onClick={openAddModal} className="btn-primary">
            + เพิ่มนักเรียนใหม่
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>ค้นหา:</label>
          <input 
            type="text" 
            placeholder="รหัสนักเรียน หรือ ชื่อ..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.4rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>ระดับชั้น:</label>
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}>
            <option value="ALL">ทั้งหมด</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>สถานะ:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}>
            <option value="ALL">ทั้งหมด</option>
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', backgroundColor: 'var(--surface)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
              <th style={{ padding: '1rem' }}>รหัสนักเรียน</th>
              <th style={{ padding: '1rem' }}>เลขที่</th>
              <th style={{ padding: '1rem' }}>ชื่อ - นามสกุล</th>
              <th style={{ padding: '1rem' }}>ห้องเรียน</th>
              <th style={{ padding: '1rem' }}>สถานะ</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>ไม่พบข้อมูลนักเรียน</td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{student.studentId || '-'}</td>
                  <td style={{ padding: '1rem' }}>{student.rollNumber || '-'}</td>
                  <td style={{ padding: '1rem' }}>{student.title}{student.firstName} {student.lastName}</td>
                  <td style={{ padding: '1rem' }}>{student.room || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      value={student.status} 
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        border: '1px solid var(--border)',
                        backgroundColor: student.status === 'ACTIVE' ? '#dcfce7' : student.status === 'TRANSFERRED' ? '#ffedd5' : student.status === 'DROPOUT' ? '#fee2e2' : '#dbeafe',
                        color: student.status === 'ACTIVE' ? '#166534' : student.status === 'TRANSFERRED' ? '#9a3412' : student.status === 'DROPOUT' ? '#991b1b' : '#1e40af',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}
                    >
                      {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button onClick={() => openEditModal(student)} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      แก้ไข
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
              {editingId ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
            </h2>
            
            {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>รหัสนักเรียน</label>
                  <input type="text" required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>เลขที่</label>
                  <input type="number" required value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>คำนำหน้า</label>
                  <select value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    {titles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ชื่อ</label>
                  <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>นามสกุล</label>
                  <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ระดับชั้นเรียน</label>
                  <select value={formData.gradeLevel} onChange={e => setFormData({...formData, gradeLevel: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ห้องเรียน</label>
                  <select value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', margin: '0.5rem 0' }}></div>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-blue)' }}>ข้อมูลสำหรับเข้าระบบ (Login)</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username (ตั้งเป็นรหัสนักเรียนได้)</label>
                  <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                  <input type="text" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email (ไม่บังคับ)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
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
