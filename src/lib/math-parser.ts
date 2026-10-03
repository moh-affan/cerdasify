/**
 * Math parser & formula preprocessor for Cerdasify
 * Supports LaTeX, KaTeX delimiters, and AsciiMath / shorthand conversions.
 */

export interface MathSegment {
  type: 'text' | 'inline-math' | 'block-math';
  content: string;
}

/**
 * Converts shorthand / AsciiMath notation to LaTeX
 * Examples:
 *  - sqrt(x) -> \sqrt{x}
 *  - a/b -> \frac{a}{b} (when inside simple parenthesis)
 *  - <= -> \le, >= -> \ge, != -> \ne, +- -> \pm
 *  - Special Olympiad shapes: ☐ -> \square, ▲ -> \blacktriangle, ● -> \bullet, ■ -> \blacksquare
 *  - Operators: ⊗ -> \otimes, ⊕ -> \oplus, ★ -> \star, ✦ -> \diamondsuit, ⊙ -> \odot
 */
export function convertShorthandToLatex(input: string): string {
  if (!input) return '';

  let res = input;

  // 1. Convert degree notations like 72o, 144 o, 180 o, 216 o, 60o, 80o, 90°, 360° to LaTeX
  res = res.replace(/(^|[^a-zA-Z0-9_\$])(\d+)\s*[o°º](?![a-zA-Z0-9])/g, (_m, p1, p2) => `${p1}$${p2}^\\circ$`);

  // Also replace freestanding degree symbols inside math formulas
  res = res.replace(/°/g, '^\\circ');
  res = res.replace(/º/g, '^\\circ');

  // 2. Split text by existing math delimiters: $$, $, \[, \(
  // so we only transform text outside math delimiters without messing up math formulas
  const parts = res.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g);

  for (let i = 0; i < parts.length; i++) {
    // Even indices are OUTSIDE math delimiters
    if (i % 2 === 0) {
      let t = parts[i];

      // A. Convert standalone LaTeX macros that are missing $ delimiters
      t = t.replace(/(\\frac\{[^{}]+\}\{[^{}]+\})/g, (m) => `$${m}$`);
      t = t.replace(/(\\sqrt(?:\[[^{}]+\])?\{[^{}]+\})/g, (m) => `$${m}$`);
      t = t.replace(/\\(square|triangle|blacktriangle|blacksquare|bullet|bigcirc|heartsuit|diamondsuit|star|odot|otimes|oplus|times|div|pm|le|ge|ne|neq|approx|angle|alpha|beta|gamma|theta|pi|dots|ldots|cdots)\b/g, (m) => `$${m}$`);

      // B. Convert unicode symbols to LaTeX inline math
      t = t
        .replace(/☐/g, '$\\square$')
        .replace(/▲/g, '$\\blacktriangle$')
        .replace(/●/g, '$\\bullet$')
        .replace(/■/g, '$\\blacksquare$')
        .replace(/△/g, '$\\triangle$')
        .replace(/◯/g, '$\\bigcirc$')
        .replace(/♡/g, '$\\heartsuit$')
        .replace(/♢/g, '$\\diamondsuit$')
        .replace(/⋆/g, '$\\star$')
        .replace(/∙/g, '$\\bullet$')
        .replace(/×/g, '$\\times$')
        .replace(/÷/g, '$\\div$')
        .replace(/±/g, '$\\pm$')
        .replace(/≤/g, '$\\le$')
        .replace(/≥/g, '$\\ge$')
        .replace(/≠/g, '$\\ne$');

      parts[i] = t;
    }
  }

  return parts.join('');
}

/**
 * Splits markdown content into text, inline-math, and block-math segments
 * Handles:
 *  - $$...$$ (Block)
 *  - \[...\] (Block)
 *  - $...$ (Inline)
 *  - \(...\) (Inline)
 */
export function parseMathSegments(content: string): MathSegment[] {
  if (!content) return [];

  const segments: MathSegment[] = [];

  // Match block math: $$...$$ or \[...\]
  // Match inline math: $...$ or \(...\)
  // Non-greedy matching with proper escaping
  const mathRegex = /(\$\$(?:[^\$]|\\\$)+?\$\$|\\\[(?:[\s\S]*?)\\\]|\$(?:[^\$\n]|\\\$)+?\$|\\\((?:[\s\S]*?)\\\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(content)) !== null) {
    const matchStart = match.index;
    const matchEnd = mathRegex.lastIndex;

    // Add plain text before match
    if (matchStart > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, matchStart),
      });
    }

    const rawFormula = match[0];

    if (rawFormula.startsWith('$$') && rawFormula.endsWith('$$')) {
      segments.push({
        type: 'block-math',
        content: rawFormula.slice(2, -2).trim(),
      });
    } else if (rawFormula.startsWith('\\[') && rawFormula.endsWith('\\]')) {
      segments.push({
        type: 'block-math',
        content: rawFormula.slice(2, -2).trim(),
      });
    } else if (rawFormula.startsWith('\\(') && rawFormula.endsWith('\\)')) {
      segments.push({
        type: 'inline-math',
        content: rawFormula.slice(2, -2).trim(),
      });
    } else if (rawFormula.startsWith('$') && rawFormula.endsWith('$')) {
      segments.push({
        type: 'inline-math',
        content: rawFormula.slice(1, -1).trim(),
      });
    }

    lastIndex = matchEnd;
  }

  // Trailing text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return segments;
}
