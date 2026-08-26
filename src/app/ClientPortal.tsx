'use client';

import React, { useState } from 'react';

export default function ClientPortal({ apps, session }: { apps: any[], session: any }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = Array.from(new Set(apps.map(a => a.category)));

  // Filter apps based on search, category, and role visibility
  const filteredApps = apps.filter(app => {
    // Role Check
    if (app.visibility === 'ADMIN_ONLY' && session?.user?.role !== 'ADMIN') return false;
    if (app.visibility === 'TEACHER_ONLY' && session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') return false;

    // Search Check
    if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.description?.toLowerCase().includes(search.toLowerCase())) return false;
    
    // Category Check
    if (selectedCategory !== 'ALL' && app.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header - Glassmorphism */}
      <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            🎓 EduPortal
          </h1>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {session ? (
              <>
                <span style={{ fontSize: '0.9rem', color: 'var(--foreground)', opacity: 0.8, fontWeight: 500 }}>
                  สวัสดี, <span className="text-gradient">{session.user?.name}</span>
                </span>
                <a href="/dashboard" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>ไปที่แผงควบคุม</a>
              </>
            ) : (
              <a href="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>เข้าสู่ระบบ</a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section - Gradient Background */}
      <div className="bg-gradient-primary" style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--primary-dark)', borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem', boxShadow: '0 10px 30px rgba(142, 197, 252, 0.3)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', textShadow: '0 2px 4px rgba(255,255,255,0.5)' }}>
          ศูนย์รวมระบบสารสนเทศโรงเรียน
        </h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '600px', margin: '0 auto', fontWeight: 400 }}>
          เข้าถึงทุกระบบการเรียนการสอนและการบริหารงานได้ในที่เดียว ง่าย สะดวก และรวดเร็ว
        </p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: '550px', margin: '1.5rem auto 0 auto', position: 'relative' }}>
          <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '0 1rem', fontSize: '1.25rem' }}>🔍</span>
            <input 
              type="text" 
              placeholder="ค้นหาระบบที่ต้องการ..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem', border: 'none', background: 'transparent', outline: 'none', color: 'var(--foreground)' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, padding: '3rem 1rem' }}>
        
        {/* Categories Tab */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button 
            onClick={() => setSelectedCategory('ALL')}
            style={{ 
              padding: '0.5rem 1.5rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s ease',
              background: selectedCategory === 'ALL' ? 'var(--primary-blue)' : 'white', 
              color: selectedCategory === 'ALL' ? 'white' : 'var(--primary-blue)', 
              boxShadow: selectedCategory === 'ALL' ? '0 4px 14px rgba(79, 70, 229, 0.4)' : '0 2px 10px rgba(0,0,0,0.05)',
              border: selectedCategory === 'ALL' ? 'none' : '1px solid #E0E7FF'
            }}
          >
            ทั้งหมด
          </button>
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{ 
                padding: '0.5rem 1.5rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s ease',
                background: selectedCategory === c ? 'var(--primary-blue)' : 'white', 
                color: selectedCategory === c ? 'white' : 'var(--primary-blue)', 
                boxShadow: selectedCategory === c ? '0 4px 14px rgba(79, 70, 229, 0.4)' : '0 2px 10px rgba(0,0,0,0.05)',
                border: selectedCategory === c ? 'none' : '1px solid #E0E7FF'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* App Grid - 3 Columns per row (Custom CSS) */}
        <div className="app-grid">
          {filteredApps.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--foreground)', opacity: 0.6 }}>
              ไม่พบระบบที่ค้นหา
            </div>
          ) : (
            filteredApps.map(app => {
              // Use provided image or fallback to screenshot API (WordPress mshots)
              const imageSrc = app.imageUrl || `https://s.wordpress.com/mshots/v1/${encodeURIComponent(app.url)}?w=600`;
              
              return (
                <a 
                  key={app.id} 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="app-card"
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit', backgroundColor: 'white', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', transition: 'all 0.3s ease', cursor: 'pointer', border: '1px solid rgba(226, 232, 240, 0.8)' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.15), 0 8px 10px -6px rgba(79, 70, 229, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)';
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                  }}
                >
                  <div style={{ height: '160px', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden', padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <img 
                      src={imageSrc} 
                      alt={app.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                        (e.target as any).nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ display: 'none', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-blue) 100%)', color: 'white' }}>
                      {app.icon || '🔗'}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem', background: '#EEF2FF', padding: '0.5rem', borderRadius: '0.75rem' }}>{app.icon}</span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>{app.name}</h3>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--foreground)', opacity: 0.7, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      {app.description || 'คลิกเพื่อเข้าสู่ระบบและการใช้งาน'}
                    </p>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </main>
      
      <footer style={{ textAlign: 'center', padding: '4rem 1rem 2rem 1rem', color: 'var(--foreground)' }}>
        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          © 2026 EduPortal. All rights reserved.
        </p>
        <p style={{ fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span style={{ opacity: 0.6 }}>ผู้พัฒนาระบบทั้งหมด</span>
          <span className="text-gradient" style={{ fontWeight: 700, letterSpacing: '0.5px', borderBottom: '1px dashed rgba(6, 182, 212, 0.5)', paddingBottom: '2px' }}>
            ครูชญานัท บัวหลวง
          </span>
        </p>
      </footer>
    </div>
  );
}
