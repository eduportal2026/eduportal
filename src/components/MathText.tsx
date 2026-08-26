'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathTextProps {
  math: string;
  block?: boolean;
}

export default function MathText({ math, block = false }: MathTextProps) {
  if (block) {
    return <BlockMath math={math} />;
  }
  return <InlineMath math={math} />;
}
