'use client';

import { useState } from 'react';
import { gradeSubmission } from '../../actions';
import { useRouter } from 'next/navigation';

export default function GradingView({ assignment, students, courseId }: { assignment: any, students: any[], courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleGrade = async (submissionId: string) => {
    const scoreStr = prompt('กรอกคะแนน (เป็นตัวเลข):');
    if (scoreStr === null) return;
    const score = parseInt(scoreStr, 10);
    if (isNaN(score)) return alert('โปรดกรอกเป็นตัวเลข');
    
    const feedback = prompt('ข้อเสนอแนะ (เว้นว่างได้):') || '';
    
    setLoading(submissionId);
    const res = await gradeSubmission(submissionId, score, feedback, courseId);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(null);
  };

  return (
    <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>เลขที่</th>
            <th style={{ padding: '1rem' }}>ชื่อ-นามสกุล</th>
            <th style={{ padding: '1rem' }}>สถานะส่งงาน</th>
            <th style={{ padding: '1rem' }}>งานที่ส่ง</th>
            <th style={{ padding: '1rem' }}>คะแนน</th>
            <th style={{ padding: '1rem' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const submission = assignment.submissions.find((s: any) => s.userId === student.id);
            return (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>{student.rollNumber || '-'}</td>
                <td style={{ padding: '1rem' }}>{student.name}</td>
                <td style={{ padding: '1rem' }}>
                  {submission ? <span style={{ color: 'green', fontWeight: 'bold' }}>ส่งแล้ว</span> : <span style={{ color: 'red' }}>ยังไม่ส่ง</span>}
                </td>
                <td style={{ padding: '1rem' }}>
                  {submission && submission.content.startsWith('data:') ? (
                    submission.content.startsWith('data:image/') ? (
                      <a href={submission.content} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>ดูรูปภาพ</a>
                    ) : (
                      <a href={submission.content} download={`submission-${student.id}`} style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>ดาวน์โหลด</a>
                    )
                  ) : submission ? (
                    <span>ส่งข้อความแล้ว (ไม่มีไฟล์แนบ)</span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {submission?.score !== null && submission?.score !== undefined ? <strong style={{ fontSize: '1.1rem' }}>{submission.score}</strong> : '-'}
                </td>
                <td style={{ padding: '1rem' }}>
                  {submission && (
                    <button 
                      onClick={() => handleGrade(submission.id)}
                      disabled={loading === submission.id}
                      style={{ padding: '0.5rem 1rem', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      {loading === submission.id ? 'กำลังบันทึก...' : 'ให้คะแนน'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
