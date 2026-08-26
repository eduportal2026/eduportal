'use client';

import { useEffect, useState } from 'react';

export default function TimeTracker({ lessonId, initialTime = 0 }: { lessonId: string, initialTime?: number }) {
  const [timeSpent, setTimeSpent] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Send update to server every 10 seconds
    if (timeSpent > 0 && timeSpent % 10 === 0) {
      fetch('/api/track-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, timeSpent })
      }).catch(console.error);
    }
  }, [timeSpent, lessonId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--surface-hover)', borderRadius: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--primary-dark)', fontSize: '0.9rem' }}>
      ⏱ เวลาเรียน: {formatTime(timeSpent)}
    </div>
  );
}
