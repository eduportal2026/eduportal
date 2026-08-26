'use client';

import React from 'react';
import MathText from './MathText';

interface MathInputPreviewProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export default function MathInputPreview({ label, value, onChange, placeholder = '', multiline = false }: MathInputPreviewProps) {
  
  // Reuse the logic to detect if a text chunk is math (surrounded by $$ or $)
  const renderTextWithMath = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathContent = part.substring(2, part.length - 2);
        return (
          <div key={index} style={{ margin: '0.5rem 0', overflowX: 'auto' }}>
            <MathText math={mathContent} block={true} />
          </div>
        );
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const mathContent = part.substring(1, part.length - 1);
        return <MathText key={index} math={mathContent} block={false} />;
      }
      return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--foreground)' }}>
        {label}
      </label>
      
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {/* Input Area */}
        <div style={{ flex: 1 }}>
          {multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            />
          )}
        </div>
        
        {/* Preview Area */}
        {value && (
          <div style={{ 
            flex: 1, 
            padding: '0.75rem', 
            borderRadius: '0.5rem', 
            backgroundColor: 'var(--surface-hover)', 
            border: '1px dashed var(--border)',
            minHeight: multiline ? '100px' : '45px',
            fontSize: '1rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              LIVE PREVIEW
            </div>
            <div>{renderTextWithMath(value)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
