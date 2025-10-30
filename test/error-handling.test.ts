// test/error-handling.test.ts
import { removeComments } from '../src/index';

// ============================================================================
// ERROR HANDLING & EXCEPTIONS
// ============================================================================

describe('Error Handling - Invalid Input', () => {
  test('handles null input gracefully', () => {
    const result = removeComments(null as any, { language: 'javascript' });
    expect(result.code).toBe(null);
    expect(result.removedCount).toBe(0);
  });

  test('handles undefined input gracefully', () => {
    const result = removeComments(undefined as any, { language: 'javascript' });
    expect(result.code).toBe(undefined);
    expect(result.removedCount).toBe(0);
  });

  test('handles empty string', () => {
    const result = removeComments('', { language: 'javascript' });
    expect(result.code).toBe('');
    expect(result.removedCount).toBe(0);
  });

  test('handles whitespace-only string', () => {
    const result = removeComments('   \n\t\n   ', { language: 'javascript' });
    expect(result.code).toBeDefined();
    expect(result.removedCount).toBe(0);
  });

  test('handles invalid language parameter', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { language: 'invalid-lang' as any });
    
    // Should return original code without crashing
    expect(result.code).toBe(code);
    expect(result.removedCount).toBe(0);
  });

  test('handles missing options parameter', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code);
    
    expect(result.code).toBeDefined();
  });

  test('handles options with all undefined values', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, {
      language: undefined,
      filename: undefined,
      preserveLicense: undefined,
      dryRun: undefined,
      keepEmptyLines: undefined
    });
    
    expect(result.code).toBeDefined();
  });

  test('handles non-string code input (number)', () => {
    const result = removeComments(12345 as any, { language: 'javascript' });
    expect(result.code).toBeDefined();
  });

  test('handles non-string code input (object)', () => {
    const result = removeComments({ key: 'value' } as any, { language: 'javascript' });
    expect(result.code).toBeDefined();
  });

  test('handles non-string code input (array)', () => {
    const result = removeComments(['line1', 'line2'] as any, { language: 'javascript' });
    expect(result.code).toBeDefined();
  });

  test('handles circular reference in input', () => {
    const obj: any = { code: '// comment\ncode();' };
    obj.self = obj;
    
    const result = removeComments(obj as any, { language: 'javascript' });
    expect(result.code).toBeDefined();
  });

  test('handles invalid filename parameter (non-string)', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 123 as any });
    
    expect(result.code).toBeDefined();
  });

  test('handles empty filename', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: '' });
    
    expect(result.code).toBeDefined();
  });

  test('handles filename with no extension', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'README' });
    
    expect(result.code).toBeDefined();
  });

  test('handles filename with multiple dots', () => {
    const code = '// comment\ncode();';
    const result = removeComments(code, { filename: 'file.test.spec.js' });
    
    expect(result.detectedLanguage).toBe('javascript');
  });
});

describe('Error Handling - Corrupted Code', () => {
  test('handles code with null bytes', () => {
    const code = `// comment\x00\nconst x = 5;\x00`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
    expect(result.code).toContain('const x = 5');
  });

  test('handles code with control characters', () => {
    const code = `// comment\x01\x02\x03\nconst x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles code with BEL character', () => {
    const code = `// comment\x07\nconst x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles code with DEL character', () => {
    const code = `// comment\x7F\nconst x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles incomplete UTF-8 sequences', () => {
    const code = `// comment\xC0\nconst x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles mixed valid and invalid UTF-8', () => {
    const code = `// comment válido\xFF inválido\nconst x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });
});

describe('Error Handling - Syntax Errors', () => {
  test('handles unbalanced brackets', () => {
    const code = `// comment
function test() {
  const x = 5;
  // missing closing bracket`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
    expect(result.code).not.toContain('// comment');
  });

  test('handles unbalanced quotes', () => {
    const code = `const str = "unclosed string
// comment
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles unclosed multiline comment at EOF', () => {
    const code = `const x = 5;
/* This comment is never closed`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
    expect(result.code).toContain('const x = 5');
  });

  test('handles multiple unclosed comments', () => {
    const code = `/* Comment 1
const x = 5;
/* Comment 2
const y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles comment inside unclosed string', () => {
    const code = `const str = "text // not a comment
// real comment
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles invalid regex pattern', () => {
    const code = `const regex = /[/; // Invalid regex
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles truncated code', () => {
    const code = `function test() {
  // comment
  const x = 5`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
    expect(result.code).not.toContain('// comment');
  });
});

describe('Error Handling - Memory & Resources', () => {
  test('handles very deep recursion (1000+ levels)', () => {
    let code = '';
    for (let i = 0; i < 1000; i++) {
      code += `{\n// Comment ${i}\n`;
    }
    code += 'const x = 5;\n';
    for (let i = 0; i < 1000; i++) {
      code += '}\n';
    }
    
    expect(() => {
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code).toBeDefined();
    }).not.toThrow();
  });

  test('handles extremely long single line (1MB line)', () => {
    const longComment = '// ' + 'x'.repeat(1000000);
    const code = `${longComment}\nconst x = 5;`;
    
    expect(() => {
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code).toContain('const x = 5');
    }).not.toThrow();
  });

  test('handles file with 100,000+ lines', () => {
    const lines = [];
    for (let i = 0; i < 100000; i++) {
      lines.push(`const var${i} = ${i}; // Comment ${i}`);
    }
    const code = lines.join('\n');
    
    const start = Date.now();
    const result = removeComments(code, { language: 'javascript' });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(10000); // Should complete in reasonable time
    expect(result.code).toBeDefined();
  });

  test('handles 10MB+ file', () => {
    // Generate ~10MB of code
    const chunk = '// ' + 'x'.repeat(1000) + '\nconst x = 5;\n';
    const code = chunk.repeat(10000); // ~10MB
    
    const start = Date.now();
    expect(() => {
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code).toBeDefined();
    }).not.toThrow();
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(15000); // Should handle large files
  });

  test('handles code with 50MB size', () => {
    // Generate ~50MB of code (might be slow, but shouldn't crash)
    const chunk = 'const x = 5;\n';
    const iterations = Math.floor(50 * 1024 * 1024 / chunk.length);
    const code = chunk.repeat(iterations);
    
    expect(() => {
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code).toBeDefined();
    }).not.toThrow();
  }, 30000); // 30 second timeout

  test('handles 10,000+ nested function calls', () => {
    let code = '';
    for (let i = 0; i < 10000; i++) {
      code += `func${i}(`;
    }
    code += '5';
    for (let i = 0; i < 10000; i++) {
      code += ')';
    }
    code = `// comment\n${code};`;
    
    expect(() => {
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code).toBeDefined();
    }).not.toThrow();
  });
});

describe('Error Handling - Edge Cases in Processing', () => {
  test('handles code that becomes empty after removal', () => {
    const code = `// Only comments
// Another comment
/* Block comment */`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
    expect(result.code.trim().length).toBeLessThan(code.length);
  });

  test('handles alternating comments and code', () => {
    const code = `// 1
const a = 1;
// 2
const b = 2;
// 3
const c = 3;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const a = 1');
    expect(result.code).toContain('const b = 2');
    expect(result.code).toContain('const c = 3');
    expect(result.code).not.toContain('// 1');
  });

  test('handles comment at every possible position', () => {
    const code = `// Before
const/* Middle */x/* After */=/* Value */5;// End`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const');
    expect(result.code).toContain('x');
    expect(result.code).toContain('5');
    expect(result.code).not.toContain('// Before');
    expect(result.code).not.toContain('/* Middle */');
  });

  test('handles consecutive comment markers', () => {
    const code = `//// Quadruple slash
const x = 5;
/*/* Nested start markers */
const y = 10;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('////');
  });

  test('handles comment markers at string boundaries', () => {
    const code = `const str = "text"//"comment"
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const str = "text"');
    expect(result.code).toContain('const x = 5');
  });
});