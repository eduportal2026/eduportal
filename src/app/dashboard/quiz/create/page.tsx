'use client';

import React, { useState } from 'react';
import MathInputPreview from '@/components/MathInputPreview';
import KaTeXCheatSheet from '@/components/KaTeXCheatSheet';
import { createQuiz } from '../actions';
import { useRouter } from 'next/navigation';

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('POST_TEST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [nextId, setNextId] = useState(2);
  const [questions, setQuestions] = useState([
    { id: 1, text: '', options: ['', '', '', ''], correctAnswer: '0' }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: nextId, text: '', options: ['', '', '', ''], correctAnswer: '0' }
    ]);
    setNextId(nextId + 1);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    const newQs = [...questions];
    newQs.splice(index, 1);
    setQuestions(newQs);
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQs = [...questions];
    (newQs[index] as any)[field] = value;
    setQuestions(newQs);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQs = [...questions];
    newQs[qIndex].options[optIndex] = value;
    setQuestions(newQs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('กรุณากรอกชื่อแบบทดสอบ');
      return;
    }

    setIsSubmitting(true);
    
    // Process data to match action format
    const formattedData = {
      title,
      type,
      questions: questions.map(q => ({
        text: q.text,
        options: q.options,
        correctAnswer: q.options[parseInt(q.correctAnswer)] || q.options[0]
      }))
    };

    const result = await createQuiz(formattedData);
    
    if (result.success) {
      alert('สร้างแบบทดสอบสำเร็จ!');
      router.push(`/dashboard/quiz/${result.quizId}`); // Navigate to view the quiz
    } else {
      alert('เกิดข้อผิดพลาดในการสร้างแบบทดสอบ');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>สร้างแบบทดสอบคณิตศาสตร์</h1>
        <button onClick={() => router.back()} className="btn-secondary">ยกเลิก</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', lg: { gridTemplateColumns: '3fr 1fr' } } as any}>
        
        {/* Main Builder Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>ข้อมูลทั่วไป</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>ชื่อแบบทดสอบ</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น แบบทดสอบก่อนเรียน: ระบบสมการเชิงเส้น"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>ประเภทแบบทดสอบ</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                >
                  <option value="PRE_TEST">ก่อนเรียน (Pre-test)</option>
                  <option value="POST_TEST">หลังเรียน (Post-test)</option>
                  <option value="EXERCISE">แบบฝึกหัด (Exercise)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>รายการข้อสอบ ({questions.length} ข้อ)</h2>
          </div>

          {questions.map((q, qIndex) => (
            <div key={q.id} style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  disabled={questions.length === 1}
                  style={{ background: 'none', border: 'none', color: questions.length === 1 ? 'var(--text-muted)' : 'var(--danger)', cursor: questions.length === 1 ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
                >
                  ลบข้อนี้
                </button>
              </div>
              
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>ข้อที่ {qIndex + 1}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <MathInputPreview 
                  label="โจทย์คำถาม" 
                  value={q.text} 
                  onChange={(val) => updateQuestion(qIndex, 'text', val)} 
                  placeholder="พิมพ์โจทย์ที่นี่ ใช้ $$ คลุมสำหรับสมการ"
                  multiline={true}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--foreground)' }}>ตัวเลือกคำตอบ</label>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ paddingTop: '1rem' }}>
                        <input 
                          type="radio" 
                          name={`correct-${q.id}`} 
                          value={optIndex}
                          checked={q.correctAnswer === optIndex.toString()}
                          onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                          style={{ cursor: 'pointer', accentColor: 'var(--success)' }}
                          title="เลือกเป็นคำตอบที่ถูกต้อง"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <MathInputPreview 
                          label={`ตัวเลือกที่ ${optIndex + 1}`} 
                          value={opt} 
                          onChange={(val) => updateOption(qIndex, optIndex, val)} 
                          placeholder="พิมพ์ตัวเลือก (รองรับ KaTeX)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button onClick={addQuestion} className="btn-secondary" style={{ padding: '1rem', borderStyle: 'dashed' }}>
            + เพิ่มข้อสอบใหม่
          </button>

          <button 
            onClick={handleSubmit} 
            className="btn-primary" 
            style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังบันทึก...' : '💾 บันทึกแบบทดสอบ'}
          </button>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ position: 'sticky', top: '2rem' }}>
            <KaTeXCheatSheet />
          </div>
        </div>
      </div>
    </div>
  );
}
