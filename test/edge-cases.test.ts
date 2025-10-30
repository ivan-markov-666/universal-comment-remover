import { removeComments } from '../src/index';

describe('Edge Cases', () => {
  describe('Error Handling', () => {
    test('handles circular references in input', () => {
      const obj: any = { code: '// comment\ncode();' };
      obj.self = obj;
      const result = removeComments(obj);
      expect(result.code).toBeDefined();
      expect(result.removedCount).toBe(0);
    });

    test('handles very large input', () => {
      const largeCode = '// ' + 'x'.repeat(1000000) + '\nconst x = 5;';
      const result = removeComments(largeCode, { language: 'javascript' });
      expect(result.code).toContain('const x = 5');
      expect(result.removedCount).toBeGreaterThan(0);
    });

    test('handles invalid language gracefully', () => {
      const code = '// comment\ncode();';
      const result = removeComments(code, { language: 'nonexistent' as any });
      expect(result.code).toBe(code);
      expect(result.removedCount).toBe(0);
    });
  });

  describe('Special Characters', () => {
    test('handles BOM (Byte Order Mark)', () => {
      const code = '\uFEFF// Comment\nconst x = 1;';
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code).toContain('const x = 1');
      expect(result.code.trim()).toBe('const x = 1;');
    });

    test('handles mixed line endings', () => {
      const code = '// comment\r\nconst x = 1;\nconst y = 2;\r\n// another comment';
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code).toContain('const x = 1;');
      expect(result.code).toContain('const y = 2;');
      expect(result.code).not.toContain('comment');
    });

    test('handles non-ASCII characters in comments', () => {
      const code = '// коментар на кирилица\nconst x = 1;';
      const result = removeComments(code, { language: 'javascript' });
      expect(result.code.trim()).toBe('const x = 1;');
    });
  });
});
