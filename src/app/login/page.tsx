'use client';

import { useActionState } from 'react';
import { authenticate } from './actions';
import Link from 'next/link';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--surface)', padding: '3rem 2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary-blue)', fontSize: '2rem', marginBottom: '0.5rem' }}>EduLMS</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>
        
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>ชื่อผู้ใช้งาน / อีเมล</label>
            <input 
              type="text" 
              name="username"
              id="username"
              required
              placeholder="กรอกชื่อผู้ใช้งาน..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>รหัสผ่าน</label>
            <input 
              type="password" 
              name="password"
              id="password"
              required
              placeholder="กรอกรหัสผ่าน..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            />
          </div>

          {errorMessage && (
            <p style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isPending}
            style={{ marginTop: '1rem', width: '100%', opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <Link href="/" style={{ color: 'var(--primary-light)' }}>← กลับหน้าหลัก</Link>
        </div>
      </div>
    </div>
  );
}
