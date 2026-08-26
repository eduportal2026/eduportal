'use client';

import { useState } from 'react';
import { submitAttendance } from '../actions';

export default function AttendanceSheet({ courseId, students }: { courseId: string, students: any[] }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<{ [key: string]: string }>(() => {
    const initial: any = {};
    students.forEach(s => initial[s.id] = 'PRESENT');
    return initial;
  });
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: string) => {
    const newAtt: any = {};
    students.forEach(s => newAtt[s.id] = status);
    setAttendance(newAtt);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const records = Object.entries(attendance).map(([userId, status]) => ({ userId, status }));
    const res = await submitAttendance(courseId, date, records);
    if (res.success) {
      alert('บันทึกข้อมูลสำเร็จ!');
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>วันที่:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleMarkAll('PRESENT')} style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>มาทั้งหมด</button>
          <button onClick={() => handleMarkAll('ABSENT')} style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>ขาดทั้งหมด</button>
        </div>
      </div>

      {students.length === 0 ? (
        <p>ไม่พบนักเรียนในห้องนี้</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>เลขที่</th>
                <th style={{ padding: '1rem' }}>รหัสนักเรียน</th>
                <th style={{ padding: '1rem' }}>ชื่อ-นามสกุล</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>มาเรียน</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>สาย</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>ขาด</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{student.rollNumber || '-'}</td>
                  <td style={{ padding: '1rem' }}>{student.studentId || '-'}</td>
                  <td style={{ padding: '1rem' }}>{student.name}</td>
                  
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input 
                      type="radio" 
                      name={`att-${student.id}`} 
                      checked={attendance[student.id] === 'PRESENT'}
                      onChange={() => handleStatusChange(student.id, 'PRESENT')}
                      style={{ transform: 'scale(1.5)' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input 
                      type="radio" 
                      name={`att-${student.id}`} 
                      checked={attendance[student.id] === 'LATE'}
                      onChange={() => handleStatusChange(student.id, 'LATE')}
                      style={{ transform: 'scale(1.5)' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input 
                      type="radio" 
                      name={`att-${student.id}`} 
                      checked={attendance[student.id] === 'ABSENT'}
                      onChange={() => handleStatusChange(student.id, 'ABSENT')}
                      style={{ transform: 'scale(1.5)' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: 'right' }}>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="btn-primary" 
              style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกการเช็คชื่อ'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
