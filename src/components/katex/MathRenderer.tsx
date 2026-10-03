'use client';

import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { parseMathSegments, convertShorthandToLatex } from '@/lib/math-parser';

interface MathRendererProps {
  content: string;
  className?: string;
  enableShorthand?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  enableShorthand = true,
}) => {
  if (!content) return null;

  const preprocessed = enableShorthand ? convertShorthandToLatex(content) : content;
  const segments = parseMathSegments(preprocessed);

  // If no math segments found, render text with linebreaks preserved
  if (segments.length === 0) {
    return <span className={className}>{content}</span>;
  }

  return (
    <div className={`prose-math leading-relaxed break-words text-inherit ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          // Preserve newlines as breaks
          const lines = seg.content.split('\n');
          return (
            <React.Fragment key={idx}>
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {line}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }

        const isBlock = seg.type === 'block-math';

        try {
          const html = katex.renderToString(seg.content, {
            throwOnError: false,
            errorColor: '#ef4444',
            displayMode: isBlock,
          });

          if (isBlock) {
            return (
              <div
                key={idx}
                className="overflow-x-auto max-w-full py-2 my-2 text-center select-text"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          return (
            <span
              key={idx}
              className="inline-block px-0.5 select-text"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          // Graceful fallback for broken LaTeX syntax
          return (
            <span
              key={idx}
              className="inline-block px-1.5 py-0.5 text-xs text-amber-700 bg-amber-50 rounded border border-amber-200 font-mono"
            >
              {seg.content}
            </span>
          );
        }
      })}
    </div>
  );
};
