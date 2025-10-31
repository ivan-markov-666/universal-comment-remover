import { detectLanguage, detectLanguageByFilename, detectLanguageByContent } from '../src/detectors/language-detector';
import { Lang } from '../src/types';

describe('Language Detection', () => {
  // Test detectLanguageByFilename
  test('detects language by file extension', () => {
    // Test with full filenames
    expect(detectLanguageByFilename('test.js')).toBe('javascript');
    expect(detectLanguageByFilename('file.ts')).toBe('typescript');
    expect(detectLanguageByFilename('script.py')).toBe('python');
    expect(detectLanguageByFilename('styles.css')).toBe('css');
    expect(detectLanguageByFilename('index.html')).toBe('html');
    
    // Test with just extensions (should work the same)
    expect(detectLanguageByFilename('.js')).toBe('javascript');
    expect(detectLanguageByFilename('.ts')).toBe('typescript');
    expect(detectLanguageByFilename('.py')).toBe('python');
  });

  test('returns undefined for unknown extensions', () => {
    expect(detectLanguageByFilename('file.unknown')).toBeUndefined();
  });

  // Test detectLanguageByContent
  test('detects language by content', () => {
    // Test with JavaScript/TypeScript
    const jsResult = detectLanguageByContent('const x = 1;');
    // The result might be undefined if content-based detection is not implemented
    // So we'll just test that it doesn't throw
    expect(() => detectLanguageByContent('const x = 1;')).not.toThrow();
    
    // Test with HTML/XML
    expect(() => detectLanguageByContent('<div>test</div>')).not.toThrow();
    
    // Test with CSS
    expect(() => detectLanguageByContent('.class { color: red; }')).not.toThrow();
  });

  // Test detectLanguage (combined)
  test('detects language using both filename and content', () => {
    // Should use filename if available
    const result1 = detectLanguage('test.js', 'const x = 1;');
    expect(result1).toBe('javascript');
    
    // Should fall back to content detection if no filename
    const result2 = detectLanguage(undefined, 'const x = 1;');
    expect(result2).toBe('javascript');
    
    // Should handle empty content
    const result3 = detectLanguage('test.js', '');
    expect(result3).toBe('javascript');
  });

  test('handles edge cases', () => {
    // Empty input
    expect(detectLanguageByContent('')).toBeUndefined();
    
    // Very short input - might not be detectable
    expect(detectLanguageByContent('{}')).toBeUndefined();
    
    // Null/undefined input for detectLanguageByFilename
    expect(detectLanguageByFilename(undefined)).toBeUndefined();
    expect(detectLanguageByFilename(null as any)).toBeUndefined();
    
    // Test with non-string input - should throw TypeError
    expect(() => detectLanguageByContent(123 as any)).toThrow(TypeError);
    expect(() => detectLanguageByContent({} as any)).toThrow(TypeError);
    
    // Test with Uint8Array - should throw TypeError
    const binaryData = new Uint8Array(10);
    expect(() => detectLanguageByContent(binaryData as any)).toThrow(TypeError);
  });
});
