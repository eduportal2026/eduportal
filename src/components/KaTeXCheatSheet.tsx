import React from 'react';

export default function KaTeXCheatSheet() {
  return (
    <div style={{ 
      backgroundColor: 'var(--surface)', 
      padding: '1.5rem', 
      borderRadius: '1rem', 
      border: '1px solid var(--border)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        💡 คู่มือคำสั่งคณิตศาสตร์
      </h3>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--foreground)', opacity: 0.8, marginBottom: '1rem' }}>
        ใช้เครื่องหมาย <code>$</code> คลุมข้อความเพื่อพิมพ์สมการ
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
        <li>
          <div style={{ fontWeight: 500, color: 'var(--primary-blue)' }}>แทรกในบรรทัด (Inline)</div>
          <code style={{ fontSize: '0.8rem', backgroundColor: 'var(--background)', padding: '0.25rem', borderRadius: '0.25rem' }}>$ x^2 $</code> ➔ $x^2$
        </li>
        <li>
          <div style={{ fontWeight: 500, color: 'var(--primary-blue)' }}>แยกบรรทัด (Block)</div>
          <code style={{ fontSize: '0.8rem', backgroundColor: 'var(--background)', padding: '0.25rem', borderRadius: '0.25rem' }}>$$ x^2 $$</code>
        </li>
        <li style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <div style={{ fontWeight: 500 }}>ตัวอย่างคำสั่งที่พบบ่อย:</div>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ fontSize: '0.8rem' }}>{"x^2"}</code>
          <span style={{ opacity: 0.7 }}>ยกกำลัง</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ fontSize: '0.8rem' }}>{"x_1"}</code>
          <span style={{ opacity: 0.7 }}>ตัวห้อย</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ fontSize: '0.8rem' }}>{"\\frac{1}{2}"}</code>
          <span style={{ opacity: 0.7 }}>เศษส่วน</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ fontSize: '0.8rem' }}>{"\\sqrt{x}"}</code>
          <span style={{ opacity: 0.7 }}>รากที่สอง</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ fontSize: '0.8rem' }}>{"\\int_{0}^{1} x dx"}</code>
          <span style={{ opacity: 0.7 }}>อินทิเกรต</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ fontSize: '0.8rem' }}>{"\\sin(x)"}</code>
          <span style={{ opacity: 0.7 }}>ตรีโกณมิติ</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ fontSize: '0.8rem' }}>{"\\infty"}</code>
          <span style={{ opacity: 0.7 }}>อนันต์</span>
        </li>
      </ul>
      
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', textAlign: 'center' }}>
        <a href="https://katex.org/docs/supported.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>
          ดูคำสั่งทั้งหมด
        </a>
      </div>
    </div>
  );
}
