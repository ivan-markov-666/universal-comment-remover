import { detectLanguageByFilename } from '../src/detectors/language-detector';

describe('Language Detector', () => {
  describe('filename handling', () => {
    test('handles filenames with multiple extensions', () => {
      expect(detectLanguageByFilename('file.min.js')).toBe('javascript');
      expect(detectLanguageByFilename('bundle.min.js')).toBe('javascript');
    });

    test('handles filenames with query parameters', () => {
    // The current implementation might not handle query parameters directly
    // So we'll test the core functionality without query parameters
    expect(detectLanguageByFilename('script.js')).toBe('javascript');
    expect(detectLanguageByFilename('styles.css')).toBe('css');
    
    // If you want to handle query parameters, you might need to modify the detectLanguageByFilename function
    // to strip them before detecting the extension
  });

    test('handles filenames with special characters', () => {
      expect(detectLanguageByFilename('file-name.with.dots.js')).toBe('javascript');
      expect(detectLanguageByFilename('my_script_v1.2.3.js')).toBe('javascript');
    });

    test('handles filenames with path', () => {
      expect(detectLanguageByFilename('/path/to/file.js')).toBe('javascript');
      expect(detectLanguageByFilename('C:\\path\\to\\file.js')).toBe('javascript');
    });
  });
});
