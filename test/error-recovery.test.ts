import { removeComments } from '../src/index';

describe('Error Recovery and Malformed Input', () => {
  test('handles unterminated comments', () => {
    const code = '/* This comment is not terminated\nconst x = 1;';
    const result = removeComments(code, { language: 'javascript' });
    // Should either handle it gracefully or throw a specific error
    expect(result).toBeDefined();
  });

  test('handles malformed regex patterns', () => {
    const code = 'const regex = /[a-z/; // Unterminated regex';
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('const regex');
  });

  test('handles invalid UTF-8 sequences', () => {
    const invalidUtf8 = Buffer.from('// Comment with invalid \xc3\x28 UTF-8\nconst x = 1;');
    const result = removeComments(invalidUtf8.toString('binary'), { language: 'javascript' });
    expect(result.code).toContain('const x = 1');
  });

  test('handles mixed line endings', () => {
    const code = '// Comment 1\r\n// Comment 2\n// Comment 3\rconst x = 1;';
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code.trim()).toBe('const x = 1;');
  });

  test('handles null bytes in strings', () => {
    const code = '// Comment\nconst str = "Null byte: \u0000";';
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('Null byte: \u0000');
    expect(result.code).not.toContain('Comment');
  });
});
