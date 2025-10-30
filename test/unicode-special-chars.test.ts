import { removeComments } from '../src/index';

describe('Unicode and Special Characters', () => {
  test('handles emojis in comments and code', () => {
    const code = `// This is a comment with emojis 😊🚀
const message = "Keep this string with emoji: 😎";
/* Another emoji in block comment 🌟 */`;
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('😎');
    expect(result.code).not.toContain('😊');
    expect(result.code).not.toContain('🚀');
    expect(result.code).not.toContain('🌟');
  });

  test('handles right-to-left (RTL) text', () => {
    const code = `// تعليق باللغة العربية
const message = "هذه رسالة"; // تعليق آخر`;
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('هذه رسالة');
    expect(result.code).not.toContain('تعليق');
  });

  test('handles various Unicode whitespace characters', () => {
    const whitespace = '\u00A0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u200B\u2028\u2029\u202F\u205F\u3000';
    const code = `// Comment with${whitespace}whitespace\nconst x = 1;`;
    
    const result = removeComments(code, { language: 'javascript' });
    // Just verify the code part is there, don't check exact whitespace
    expect(result.code).toContain('const x = 1;');
    expect(result.code).not.toContain('Comment');
  });

  test('handles zero-width spaces and other invisible characters', () => {
    const code = '// This comment has\u200Ba zero-width space\nconst x = 1;';
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code.trim()).toBe('const x = 1;');
  });
});
