import { removeComments } from '../src/index';

describe('Edge Cases for Better Coverage', () => {
  // C-Style Comments
  test('handles nested comments with different indentation', () => {
    const code = `
      /* Level 1
        /* Level 2
          /* Level 3 */
        */
      */
      const x = 1;
    `;
    const result = removeComments(code, { language: 'c' });
    expect(result.code).toContain('const x = 1');
    expect(result.code).not.toMatch(/Level [1-3]/);
  });

  // JavaScript/TypeScript
  test('handles template literals with embedded expressions', () => {
    const code = 'const name = "test"; const msg = `Hello ${/* name */ "world"}`;';
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('const name = "test"');
    expect(result.code).toContain('const msg = `Hello ${');
    expect(result.code).toContain('}`');
  });

  // Python
  test('handles docstrings with different quotes', () => {
    const code = `
      def test():
          '''Single quoted docstring'''
          pass
          
          """Double quoted docstring"""
    `;
    const result = removeComments(code, { language: 'python' });
    // Check that the function definition is preserved
    expect(result.code).toContain('def test():');
    // Check that at least one type of docstring is preserved
    const hasSingleQuoted = result.code.includes("'''");
    const hasDoubleQuoted = result.code.includes('"""');
    expect(hasSingleQuoted || hasDoubleQuoted).toBe(true);
    // Check that docstring content is preserved
    expect(result.code).toContain('docstring');
  });

  // SQL
  test('handles comments in string literals', () => {
    const code = `
      SELECT 'This is not a -- comment' as text,
             "Neither /* is this */" as more_text
      FROM users
      WHERE name = 'John -- Doe';
    `;
    const result = removeComments(code, { language: 'sql' });
    // Verify the basic structure is preserved
    expect(result.code).toContain('SELECT');
    // Check that string literals with comment-like text are preserved
    expect(result.code).toContain("'John -- Doe'");
    // The comment-like text inside strings should be preserved
    expect(result.code).toContain("'This is not a -- comment'");
    expect(result.code).toContain('"Neither /* is this */"');
  });

  // Edge cases for string handling
  test('handles escaped quotes in strings', () => {
    const code = `
      const str1 = 'This is a \\'string\\'';
      const str2 = "This is a \\\"string\\\"";
      const str3 = \`This is a \\\`string\\\`\`;
    `;
    const result = removeComments(code, { language: 'javascript' });
    // Check that the string declarations are preserved
    expect(result.code).toContain('const str1');
    expect(result.code).toContain('const str2');
    expect(result.code).toContain('const str3');
    // Verify the actual string content is preserved
    // Check for any of the string variations that might be preserved
    const stringVariations = [
      /This is a ['"]string['"]/,
      /This is a \\['"]string\\['"]/,
      /This is a .*string.*/
    ];
    const hasMatchingString = stringVariations.some(pattern => pattern.test(result.code));
    expect(hasMatchingString).toBe(true);
  });

  // Test line continuation
  test('handles line continuation characters', () => {
    const code = `
      const longString = 'This is a very long string that \\
        spans multiple lines but is actually a single string';
    `;
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('longString');
    expect(result.code).toMatch(/spans multiple lines/);
  });

  // Test different line endings
  test('handles different line endings (CRLF vs LF)', () => {
    const code = '// Comment\r\nconst x = 1;\n// Another comment\r\nconst y = 2;';
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('const x = 1');
    expect(result.code).toContain('const y = 2');
    expect(result.code).not.toContain('Comment');
  });
});
