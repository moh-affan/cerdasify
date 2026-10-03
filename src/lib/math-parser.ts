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

  // Replace unicode shapes with LaTeX equivalents if inside or near math
  res = res
    .replace(/☐/g, '\\square ')
    .replace(/▲/g, '\\blacktriangle ')
    .replace(/●/g, '\\bullet ')
    .replace(/■/g, '\\blacksquare ')
    .replace(/⊗/g, '\\otimes ')
    .replace(/⊕/g, '\\oplus ')
    .replace(/★/g, '\\star ')
    .replace(/✦/g, '\\diamondsuit ')
    .replace(/⊙/g, '\\odot ')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ');

  return res;
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
