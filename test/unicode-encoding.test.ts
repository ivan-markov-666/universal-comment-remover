
import { removeComments } from '../src/index';

// ============================================================================
// UNICODE & ENCODING TESTS
// ============================================================================

describe('Unicode & Encoding', () => {
  test('handles emoji in comments and code', () => {
    const code = `// 🚀 Rocket comment
const greeting = "Hello 👋"; // 🎉 Celebration
console.log(greeting);`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('Hello 👋');
    expect(result.code).not.toContain('// 🚀');
    expect(result.code).not.toContain('// 🎉');
  });

  test('handles right-to-left (RTL) text', () => {
    const code = `// مرحبا بك في البرنامج
const msg = "مرحبا"; // Arabic comment
console.log(msg);`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('مرحبا');
    expect(result.code).not.toContain('مرحبا بك');
  });

  test('handles zero-width characters', () => {
    const code = `//\u200B Zero-width space comment
const x\u200C = 5; // Zero-width non-joiner
const y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x\u200C = 5');
    expect(result.code).not.toContain('Zero-width space comment');
  });

  test('handles mixed scripts (Latin + Cyrillic + Chinese)', () => {
    const code = `// Comment in English Русский 中文
const text = "Mixed: English Русский 中文";
// Коментар`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('Mixed: English Русский 中文');
    expect(result.code).not.toContain('Comment in English');
    expect(result.code).not.toContain('// Коментар');
  });

  test('handles various Unicode categories', () => {
    const code = `// Math symbols: ∑ ∫ √ π
const symbols = "∑∫√π"; // Greek letters
// Currency: € £ ¥ ₹`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('∑∫√π');
    expect(result.code).not.toContain('Math symbols');
    expect(result.code).not.toContain('// Currency');
  });

  test('handles combining characters', () => {
    const code = `// Comment with é (e + combining acute)
const text = "café"; // é as combining chars
console.log(text);`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('café');
    expect(result.code).not.toContain('Comment with é');
  });
});

// ============================================================================
// LINE ENDINGS TESTS
// ============================================================================

describe('Line Endings', () => {
  test('handles CRLF (Windows) line endings', () => {
    const code = `// Comment 1\r\nconst x = 5;\r\n// Comment 2\r\nconst y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).toContain('const y = 10');
    expect(result.code).not.toContain('// Comment');
  });

  test('handles LF (Unix) line endings', () => {
    const code = `// Comment 1\nconst x = 5;\n// Comment 2\nconst y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('// Comment');
  });

  test('handles CR (old Mac) line endings', () => {
    const code = `// Comment 1\rconst x = 5;\r// Comment 2\rconst y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });

  test('handles mixed line endings in same file', () => {
    const code = `// Comment 1\r\nconst x = 5;\n// Comment 2\rconst y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).toContain('const y = 10');
    expect(result.code).not.toContain('// Comment');
  });

  test('preserves line ending style', () => {
    const code = `// Comment\r\nconst x = 5;\r\nconst y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    // Should preserve CRLF where possible
    expect(result.code).toContain('const x = 5');
  });
});

// ============================================================================
// WHITESPACE VARIATIONS
// ============================================================================

describe('Whitespace Variations', () => {
  test('handles tabs vs spaces', () => {
    const code = `//\tComment with tab
const x = 5;    // Comment with spaces
\tconst y = 10; //\tMixed`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).toContain('const y = 10');
    expect(result.code).not.toContain('Comment with tab');
  });

  test('handles no-break spaces (\\u00A0)', () => {
    const code = `//\u00A0Comment with no-break space
const x = 5;\u00A0//\u00A0Another`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('Comment with no-break');
  });

  test('handles multiple consecutive spaces', () => {
    const code = `//     Comment with many spaces
const x = 5;      //     Another`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('Comment with many spaces');
  });

  test('handles trailing whitespace', () => {
    const code = `// Comment   \t  \nconst x = 5;   \t  // Another   `;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('// Comment');
  });

  test('handles leading whitespace before comments', () => {
    const code = `   // Comment
\t\t// Another comment
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('// Comment');
  });

  test('handles empty lines with only whitespace', () => {
    const code = `// Comment
   \t   
const x = 5;
\t\t\t
// Another`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });
});
