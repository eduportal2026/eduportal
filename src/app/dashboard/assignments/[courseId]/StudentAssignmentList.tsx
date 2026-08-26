'use client';

import { useState } from 'react';
import { submitAssignment } from '../actions';
import { useRouter } from 'next/navigation';

export default function StudentAssignmentList({ courseId, assignments, userId }: { courseId: string, assignments: any[], userId: string }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('ไฟล์มีขนาดใหญ่เกินไป กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 2MB');
      return;
    }

    setLoadingId(assignmentId);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Content = event.target?.result as string;
      const res = await submitAssignment(assignmentId, base64Content, courseId);
      if (res.success) {
        alert('ส่งงานสำเร็จ!');
        router.refresh();
      } else {
        alert(res.error);
      }
      setLoadingId(null);
    };
    reader.onerror = () => {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
      setLoadingId(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {assignments.map(assign => {
        const mySubmission = assign.submissions.find((s: any) => s.userId === userId);
        const isPastDue = new Date(assign.dueDate) < new Date();

        return (
          <div key={assign.id} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{assign.title}</h3>
                <p style={{ color: 'var(--foreground)', opacity: 0.8, margin: '0.5rem 0' }}>{assign.description}</p>
                <div style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', backgroundColor: isPastDue && !mySubmission ? '#fee2e2' : '#e0e7ff', color: isPastDue && !mySubmission ? '#991b1b' : '#4f46e5', borderRadius: '20px', display: 'inline-block' }}>
                  กำหนดส่ง: {new Date(assign.dueDate).toLocaleDateString('th-TH')}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                {mySubmission ? (
                  <div style={{ padding: '0.5rem 1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', fontWeight: 'bold' }}>
                    ส่งแล้ว
                    {mySubmission.score !== null && <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>คะแนน: {mySubmission.score}</div>}
                  </div>
                ) : (
                  <div style={{ padding: '0.5rem 1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontWeight: 'bold' }}>
                    ยังไม่ส่ง
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {mySubmission && mySubmission.content.startsWith('data:') && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>ไฟล์ที่ส่ง:</p>
                  {mySubmission.content.startsWith('data:image/') ? (
                     <img src={mySubmission.content} alt="งาน" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border)' }} />
                  ) : (
                     <a href={mySubmission.content} download={`submission-${assign.id}`} style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>ดาวน์โหลดไฟล์แนบ</a>
                  )}
                </div>
              )}

              {mySubmission?.feedback && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '8px' }}>
                  <strong>ข้อเสนอแนะจากครู:</strong> {mySubmission.feedback}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>{mySubmission ? 'อัปโหลดไฟล์ใหม่ (แทนที่ของเดิม)' : 'แนบไฟล์ส่งงาน (ขนาดไม่เกิน 2MB)'}</label>
                <input 
                  type="file" 
                  onChange={(e) => handleFileUpload(e, assign.id)}
                  disabled={loadingId === assign.id}
                  style={{ padding: '0.5rem', border: '1px dashed var(--border)', borderRadius: '8px' }}
                />
                {loadingId === assign.id && <span style={{ color: 'var(--primary-blue)' }}>กำลังอัปโหลด...</span>}
              </div>
            </div>
          </div>
        );
      })}
      {assignments.length === 0 && <p>ยังไม่มีใบงานสำหรับวิชานี้</p>}
    </div>
  );
}
