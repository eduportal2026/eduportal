'use client';

import { useState } from 'react';
import { updateProfile } from './actions';
import { useRouter } from 'next/navigation';

export default function ClientSettings({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await updateProfile(formData);
    if (res.success) {
      setSuccess('อัปเดตข้อมูลสำเร็จ! (หากเปลี่ยน Username โปรดใช้ Username ใหม่ในการเข้าสู่ระบบครั้งหน้า)');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
      router.refresh();
    } else {
      setError(res.error || 'เกิดข้อผิดพลาด');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '500px', backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {error && <div style={{ color: 'red', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{error}</div>}
        {success && <div style={{ color: 'green', padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '8px' }}>{success}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>ชื่อ-นามสกุล (ชื่อที่แสดง)</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>ชื่อผู้ใช้ (Username)</label>
          <input 
            type="text" 
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>รหัสผ่านใหม่ (ปล่อยว่างไว้ถ้าไม่ต้องการเปลี่ยน)</label>
          <input 
            type="password" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            placeholder="รหัสผ่านใหม่"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
          style={{ padding: '0.75rem', marginTop: '1rem' }}
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
        </button>
      </form>
    </div>
  );
}
