'use client';

import React, { useState } from 'react';
import MathText from './MathText';
import { submitQuiz } from '@/app/dashboard/quiz/actions';

interface Question {
  id: string;
  text: string;
  options: string[]; // parsed from JSON
}

interface QuizViewerProps {
  quizId?: string; // Made optional for backward compatibility / preview mode
  title: string;
  questions: Question[];
  onSubmit?: (answers: Record<string, string>) => void;
}

interface QuizResult {
  score: number;
  totalScore: number;
  passed: boolean;
}

export default function QuizViewer({ quizId, title, questions, onSubmit }: QuizViewerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSelect = (questionId: string, option: string) => {
    if (result) return; // Prevent changing answers after submission
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(answers);
      return;
    } 
    
    if (quizId) {
      setIsSubmitting(true);
      const res = await submitQuiz(quizId, answers);
      setIsSubmitting(false);

      if (res.success) {
        setResult({
          score: res.score!,
          totalScore: res.totalScore!,
          passed: res.passed!
        });
      } else {
        alert("เกิดข้อผิดพลาดในการส่งคำตอบ");
      }
    } else {
      console.log("Submitted answers (Preview):", answers);
      alert("ส่งคำตอบเรียบร้อยแล้ว (โหมดพรีวิว)");
    }
  };

  const renderTextWithMath = (text: string) => {
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/gs);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathContent = part.substring(2, part.length - 2);
        return (
          <div key={index} style={{ margin: '1rem 0', overflowX: 'auto' }}>
            <MathText math={mathContent} block={true} />
          </div>
        );
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const mathContent = part.substring(1, part.length - 1);
        return <MathText key={index} math={mathContent} block={false} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (result) {
    return (
      <div style={{ backgroundColor: 'var(--surface)', padding: '3rem', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {result.passed ? '🎉' : '📚'}
        </div>
        <h2 style={{ color: result.passed ? 'var(--success)' : 'var(--danger)', fontSize: '2rem', marginBottom: '1rem' }}>
          {result.passed ? 'ยินดีด้วย! คุณสอบผ่าน' : 'พยายามอีกนิดนะ! คุณยังสอบไม่ผ่าน'}
        </h2>
        <div style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          ได้คะแนน <strong style={{ fontSize: '1.5rem', color: 'var(--primary-blue)' }}>{result.score}</strong> จาก {result.totalScore} คะแนน
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            ทำแบบทดสอบอีกครั้ง
          </button>
          <a href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            กลับสู่หน้าหลัก
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
      <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{title}</h2>
      
      <form onSubmit={handleSubmit} autoComplete="off">
        {questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 500 }}>
              {idx + 1}. {renderTextWithMath(q.text)}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {q.options.map((opt, i) => (
                <label 
                  key={i} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
                    border: '1px solid var(--border)', borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: answers[q.id] === opt ? 'var(--surface-hover)' : 'transparent',
                    borderColor: answers[q.id] === opt ? 'var(--primary-blue)' : 'var(--border)'
                  }}
                >
                  <input 
                    type="radio" 
                    name={`question-${q.id}`} 
                    value={opt} 
                    checked={answers[q.id] === opt}
                    onChange={() => handleSelect(q.id, opt)}
                    style={{ accentColor: 'var(--primary-blue)' }}
                  />
                  <span>{renderTextWithMath(opt)}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={Object.keys(answers).length < questions.length || isSubmitting}>
          {isSubmitting ? 'กำลังตรวจคำตอบ...' : 'ส่งคำตอบ'}
        </button>
      </form>
    </div>
  );
}
