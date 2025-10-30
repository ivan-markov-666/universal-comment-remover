
import { removeComments } from '../src/index';

// ============================================================================
// SECURITY TESTS
// ============================================================================

describe('Security - Malicious Input', () => {
  test('handles potential ReDoS patterns in comments', () => {
    const code = `// ${'a'.repeat(10000)}b
const x = 5;`;
    
    const start = Date.now();
    const result = removeComments(code, { language: 'javascript' });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000); // Should not timeout
    expect(result.code).toContain('const x = 5');
  });

  test('handles extremely nested structures', () => {
    let code = '';
    for (let i = 0; i < 100; i++) {
      code += `{\n// Comment ${i}\n`;
    }
    code += 'const x = 5;\n';
    for (let i = 0; i < 100; i++) {
      code += '}\n';
    }
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('// Comment');
  });

  test('handles comment injection attempts', () => {
    const code = `const data = "*/; alert('XSS'); /*";
/* Real comment */
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain("*/; alert('XSS'); /*");
    expect(result.code).not.toContain('/* Real comment */');
  });

  test('handles path traversal in filenames', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      filename: '../../etc/passwd.js'
    });
    
    expect(result.detectedLanguage).toBe('javascript');
    expect(result.code).not.toContain('//');
  });

  test('handles XSS patterns in HTML comments', () => {
    const code = `<!-- <script>alert('XSS')</script> -->
<div>Safe content</div>
<!-- "><script>alert(1)</script> -->`;
    const result = removeComments(code, { language: 'html' });
    
    expect(result.code).toContain('<div>Safe content</div>');
    expect(result.code).not.toContain("alert('XSS')");
    expect(result.code).not.toContain('alert(1)');
  });

  test('handles SQL injection patterns in SQL comments', () => {
    const code = `-- ' OR '1'='1
SELECT * FROM users WHERE id = 1;
/* '; DROP TABLE users; -- */`;
    const result = removeComments(code, { language: 'sql' });
    
    expect(result.code).toContain('SELECT * FROM users');
    expect(result.code).not.toContain("' OR '1'='1");
    expect(result.code).not.toContain('DROP TABLE');
  });
});

describe('Security - Malformed Code', () => {
  test('handles unclosed multi-line comment', () => {
    const code = `/* Unclosed comment
const x = 5;
const y = 10;`;
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toBeDefined();
    expect(typeof result.code).toBe('string');
  });

  test('handles unclosed string with comment', () => {
    const code = `const str = "unclosed
// comment
const x = 5;`;
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toBeDefined();
  });

  test('handles mixed quote types', () => {
    const code = `const str1 = "double';
// comment
const str2 = 'single";`;
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toBeDefined();
  });

  test('handles invalid escape sequences', () => {
    const code = `const str = "\\x\\y\\z"; // Invalid escapes
const x = 5;`;
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toContain('const x = 5');
  });

  test('handles incomplete regex pattern', () => {
    const code = `const regex = /incomplete
// comment
const x = 5;`;
    
    const result = removeComments(code, { language: 'javascript' });
    expect(result.code).toBeDefined();
  });
});

describe('Security - Performance Limits', () => {
  test('handles 1MB+ file efficiently', () => {
    const largeLine = '// ' + 'x'.repeat(1000) + '\nconst x = 5;\n';
    const code = largeLine.repeat(1000); // ~1MB
    
    const start = Date.now();
    const result = removeComments(code, { language: 'javascript' });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(5000); // Should be reasonable
    expect(result.code).toContain('const x = 5');
  });

  test('handles 10,000+ lines efficiently', () => {
    const lines = [];
    for (let i = 0; i < 10000; i++) {
      lines.push(`// Comment ${i}`);
      lines.push(`const var${i} = ${i};`);
    }
    const code = lines.join('\n');
    
    const start = Date.now();
    const result = removeComments(code, { language: 'javascript' });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(2000);
    expect(result.code).not.toContain('// Comment');
  });

  test('handles 1,000+ comments in one file', () => {
    let code = '';
    for (let i = 0; i < 1000; i++) {
      code += `/* Comment ${i} */\n`;
    }
    code += 'const x = 5;';
    
    const start = Date.now();
    const result = removeComments(code, { language: 'javascript' });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000);
    expect(result.code).toContain('const x = 5');
  });

  test('handles line with 100,000+ characters', () => {
    const longLine = '// ' + 'x'.repeat(100000);
    const code = `${longLine}\nconst x = 5;`;
    
    const start = Date.now();
    const result = removeComments(code, { language: 'javascript' });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000);
    expect(result.code).toContain('const x = 5');
  });
});
