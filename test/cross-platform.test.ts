// test/cross-platform.test.ts
import { removeComments } from '../src/index';

// ============================================================================
// CROSS-PLATFORM COMPATIBILITY TESTS
// ============================================================================

describe('Cross-Platform - Path Handling', () => {
  test('handles Unix-style paths', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: '/home/user/project/src/index.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles Windows-style paths', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: 'C:\\Users\\User\\project\\src\\index.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles Windows UNC paths', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: '\\\\server\\share\\project\\index.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles mixed path separators', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: 'C:/Users/User\\project/src\\index.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles relative paths with ../', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: '../../src/index.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles paths with spaces', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: '/home/user/My Projects/src/index.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles paths with special characters', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: '/home/user/project-name_v2.0/índex.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles very long paths (260+ chars)', () => {
    const longPath = 'C:\\' + 'very-long-directory-name\\'.repeat(20) + 'index.js';
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: longPath });
    
    expect(result.detectedLanguage).toBe('javascript');
  });
});

describe('Cross-Platform - Line Endings Preservation', () => {
  test('preserves CRLF when input is CRLF', () => {
    const code = `// Comment\r\nconst x = 5;\r\n// Another\r\nconst y = 10;\r\n`;
    const result = removeComments(code, { language: 'javascript' });
    
    // Check if CRLF is preserved in output
    expect(result.code.includes('\r\n')).toBe(true);
  });

  test('preserves LF when input is LF', () => {
    const code = `// Comment\nconst x = 5;\n// Another\nconst y = 10;\n`;
    const result = removeComments(code, { language: 'javascript' });
    
    // Should not introduce CRLF
    expect(result.code.includes('\r\n')).toBe(false);
    expect(result.code.includes('\n')).toBe(true);
  });

  test('handles mixed line endings gracefully', () => {
    const code = `// Comment 1\r\nconst x = 5;\n// Comment 2\rconst y = 10;\r\n`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).toContain('const y = 10');
  });

  test('handles no trailing newline', () => {
    const code = `// Comment\nconst x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBe('const x = 5;');
  });

  test('handles multiple trailing newlines (CRLF)', () => {
    const code = `const x = 5;\r\n\r\n\r\n`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });

  test('handles multiple trailing newlines (LF)', () => {
    const code = `const x = 5;\n\n\n`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });

  test('handles file with only line endings', () => {
    const code = `\r\n\r\n\n\r\n`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });
});

describe('Cross-Platform - File System Compatibility', () => {
  test('handles case-sensitive extensions (Unix)', () => {
    const code = '// comment\ncode();';
    
    // On Unix, .JS and .js are different
    const result1 = removeComments(code, { filename: 'file.JS' });
    const result2 = removeComments(code, { filename: 'file.js' });
    
    expect(result1.detectedLanguage).toBe('javascript');
    expect(result2.detectedLanguage).toBe('javascript');
  });

  test('handles hidden files (Unix)', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: '.hidden.js' });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles filenames with $ (Unix)', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'file$name.js' });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles filenames with ~ (Unix)', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: '~/project/index.js' });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles reserved names (Windows)', () => {
    const code = '// comment\ncode();';
    
    // These are reserved on Windows but should still work for detection
    const names = ['CON.js', 'PRN.js', 'AUX.js', 'NUL.js', 'COM1.js'];
    
    names.forEach(name => {
      const result = removeComments(code, { filename: name });
      expect(result.detectedLanguage).toBe('javascript');
    });
  });

  test('handles trailing dots (Windows)', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'file.js.' });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles trailing spaces (Windows)', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'file.js ' });
    
    expect(result.detectedLanguage).toBe('javascript');
  });
});

describe('Cross-Platform - Special Cases', () => {
  test('handles symlink-like names', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'index.js -> real-file.js' });
    
    expect(result.code).toBeDefined();
  });

  test('handles URL-encoded filenames', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'file%20name.js' });
    
    expect(result.code).toBeDefined();
  });

  test('handles filenames with Unicode', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'файл-名字-αρχείο.js' });
    
    expect(result.detectedLanguage).toBe('javascript');
  });

  test('handles drive letters (A-Z)', () => {
    const code = '// comment\ncode();';
    const drives = ['A:', 'C:', 'D:', 'Z:'];
    
    drives.forEach(drive => {
      const result = removeComments(code, { filename: `${drive}\\index.js` });
      expect(result.detectedLanguage).toBe('javascript');
    });
  });

  test('handles empty drive letter', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: ':\\index.js' });
    
    expect(result.code).toBeDefined();
  });
});