'use client';

import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { parseMathSegments, convertShorthandToLatex } from '@/lib/math-parser';
import { BookOpen } from 'lucide-react';

interface MathRendererProps {
  content: string;
  className?: string;
  enableShorthand?: boolean;
}

/**
 * Helper to render basic inline markdown formatting (**bold**, *italic*, `code`)
 */
function renderInlineFormatting(text: string, keyPrefix: string): React.ReactNode {
  if (!text) return null;

  // Tokenize by **bold**, *italic*, `code`
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={`${keyPrefix}-b-${pIdx}`} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={`${keyPrefix}-i-${pIdx}`} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={`${keyPrefix}-c-${pIdx}`}
          className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs border border-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Render text with KaTeX formulas and line formatting (including blockquotes)
 */
function renderContentSegments(
  content: string,
  enableShorthand: boolean,
  keyPrefix: string
): React.ReactNode {
  const preprocessed = enableShorthand ? convertShorthandToLatex(content) : content;
  const segments = parseMathSegments(preprocessed);

  if (segments.length === 0) {
    return <span key={keyPrefix}>{renderInlineFormatting(content, keyPrefix)}</span>;
  }

  return segments.map((seg, idx) => {
    if (seg.type === 'text') {
      const lines = seg.content.split('\n');
      return (
        <React.Fragment key={`${keyPrefix}-${idx}`}>
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            const isBlockquote = trimmed.startsWith('>');

            if (isBlockquote) {
              const quoteText = trimmed.replace(/^>\s*/, '');
              return (
                <blockquote
                  key={`${keyPrefix}-${idx}-${lIdx}`}
                  className="my-2.5 pl-3.5 border-l-4 border-indigo-400 bg-indigo-50/50 py-1.5 pr-3 rounded-r-lg text-slate-700 italic"
                >
                  {renderInlineFormatting(quoteText, `${keyPrefix}-${idx}-${lIdx}`)}
                </blockquote>
              );
            }

            return (
              <React.Fragment key={`${keyPrefix}-${idx}-${lIdx}`}>
                {renderInlineFormatting(line, `${keyPrefix}-${idx}-${lIdx}`)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
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
            key={`${keyPrefix}-${idx}`}
            className="overflow-x-auto max-w-full py-2 my-2 text-center select-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      return (
        <span
          key={`${keyPrefix}-${idx}`}
          className="inline-block px-0.5 select-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return (
        <span
          key={`${keyPrefix}-${idx}`}
          className="inline-block px-1.5 py-0.5 text-xs text-amber-700 bg-amber-50 rounded border border-amber-200 font-mono"
        >
          {seg.content}
        </span>
      );
    }
  });
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  enableShorthand = true,
}) => {
  if (!content) return null;

  // Check if content contains :::passage blocks
  const passageRegex = /:::passage(?:\[([\s\S]*?)\])?\s*([\s\S]*?):::/g;
  const hasPassage = passageRegex.test(content);

  // If no passage blocks, render normally
  if (!hasPassage) {
    return (
      <div className={`prose-math leading-relaxed break-words text-inherit ${className}`}>
        {renderContentSegments(content, enableShorthand, 'main')}
      </div>
    );
  }

  // Parse passages and body sections
  passageRegex.lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let passageCounter = 0;

  while ((match = passageRegex.exec(content)) !== null) {
    const matchStart = match.index;
    const matchEnd = passageRegex.lastIndex;

    // Render preceding text if any
    if (matchStart > lastIndex) {
      const preceding = content.slice(lastIndex, matchStart).trim();
      if (preceding) {
        elements.push(
          <div key={`pre-${passageCounter}`} className="mb-4">
            {renderContentSegments(preceding, enableShorthand, `pre-${passageCounter}`)}
          </div>
        );
      }
    }

    const passageTitle = match[1]?.trim() || 'Teks Cerita / Bacaan';
    const passageContent = match[2]?.trim() || '';

    elements.push(
      <div
        key={`passage-${passageCounter}`}
        className="mb-6 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-blue-50/60 border border-indigo-100/90 p-4 sm:p-5 shadow-xs select-text"
      >
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm tracking-wide">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
            <span>{passageTitle}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white/90 border border-indigo-200 px-2.5 py-0.5 rounded-full shadow-2xs">
            Stimulus Bacaan
          </span>
        </div>
        <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-2.5 font-normal font-sans">
          {renderContentSegments(passageContent, enableShorthand, `passage-body-${passageCounter}`)}
        </div>
      </div>
    );

    lastIndex = matchEnd;
    passageCounter++;
  }

  // Render remaining text after last passage (the actual question prompt)
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      elements.push(
        <div key="remaining-question-body" className="pt-1">
          {renderContentSegments(remaining, enableShorthand, 'body-rem')}
        </div>
      );
    }
  }

  return (
    <div className={`prose-math leading-relaxed break-words text-inherit ${className}`}>
      {elements}
    </div>
  );
};
