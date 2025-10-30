// test/encoding.test.ts
import { removeComments } from '../src/index';

// ============================================================================
// ENCODING & CHARACTER SET TESTS
// ============================================================================

describe('Encoding - UTF Variants', () => {
  test('handles UTF-8 BOM at start', () => {
    const code = '\uFEFF// comment\nconst x = 5;';
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('// comment');
  });

  test('handles UTF-16 BOM (BE)', () => {
    const code = '\uFEFF// comment\nconst x = 5;';
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles UTF-16 BOM (LE)', () => {
    const code = '\uFFFE// comment\nconst x = 5;';
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toBeDefined();
  });

  test('handles mixed BOM and content', () => {
    const code = '\uFEFF\uFEFF// comment\nconst x = 5;';
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });

  test('handles Latin-1 special characters', () => {
    const code = `// Comment with é à ñ
const text = "Café résumé"; // Latin-1 chars
console.log(text);`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('Café résumé');
    expect(result.code).not.toContain('Comment with é');
  });

  test('handles Windows-1252 characters', () => {
    const code = `// Comment with €
const price = "100€"; // Euro sign
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('100€');
    expect(result.code).not.toContain('Comment with €');
  });

  test('handles ISO-8859-1 characters', () => {
    const code = `// Comment ©®™
const symbols = "©®™"; // Symbols
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('©®™');
    expect(result.code).not.toContain('Comment ©®™');
  });
});

describe('Encoding - Special Unicode Characters', () => {
  test('handles emoji modifiers', () => {
    const code = `// Comment 👨‍👩‍👧‍👦 family emoji
const family = "👨‍👩‍👧‍👦"; // With ZWJ
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('👨‍👩‍👧‍👦');
    expect(result.code).not.toContain('Comment 👨‍👩‍👧‍👦');
  });

  test('handles emoji skin tones', () => {
    const code = `// Comment 👋🏻👋🏿
const wave = "👋🏻👋🏿"; // Different skin tones
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('👋🏻👋🏿');
    expect(result.code).not.toContain('Comment 👋🏻');
  });

  test('handles combining diacritical marks', () => {
    const code = `// Comment é (e + combining acute)
const text = "e\u0301"; // Combining acute accent
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('e\u0301');
    expect(result.code).not.toContain('Comment é');
  });

  test('handles variation selectors', () => {
    const code = `// Comment ︎text selector
const text = "Text\uFE0E\uFE0F"; // Variation selectors
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('Text\uFE0E\uFE0F');
  });

  test('handles zero-width joiner (ZWJ)', () => {
    const code = `// Comment with ZWJ
const text = "A\u200DB"; // Zero-width joiner
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('A\u200DB');
    expect(result.code).not.toContain('Comment with ZWJ');
  });

  test('handles zero-width non-joiner (ZWNJ)', () => {
    const code = `// Comment with ZWNJ
const text = "A\u200CB"; // Zero-width non-joiner
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('A\u200CB');
  });

  test('handles bidirectional text markers', () => {
    const code = `// Comment \u202E reverse
const text = "Normal\u202EreversE"; // Right-to-left override
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('Normal\u202EreversE');
  });

  test('handles surrogate pairs', () => {
    const code = `// Comment 𝕳𝖊𝖑𝖑𝖔 (surrogate pairs)
const text = "𝕳𝖊𝖑𝖑𝖔"; // Mathematical bold fraktur
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('𝕳𝖊𝖑𝖑𝖔');
    expect(result.code).not.toContain('Comment 𝕳𝖊𝖑𝖑𝖔');
  });
});

describe('Encoding - Non-Latin Scripts', () => {
  test('handles Arabic with diacritics', () => {
    const code = `// تعليق بالعربية مع التشكيل
const text = "مَرْحَبًا"; // Arabic with diacritics
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('مَرْحَبًا');
    expect(result.code).not.toContain('تعليق بالعربية');
  });

  test('handles Hebrew with points', () => {
    const code = `// הערה בעברית
const text = "שָׁלוֹם"; // Hebrew with niqqud
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('שָׁלוֹם');
    expect(result.code).not.toContain('הערה בעברית');
  });

  test('handles Devanagari script', () => {
    const code = `// टिप्पणी हिन्दी में
const text = "नमस्ते"; // Hindi
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('नमस्ते');
    expect(result.code).not.toContain('टिप्पणी');
  });

  test('handles Thai script', () => {
    const code = `// ความคิดเห็นภาษาไทย
const text = "สวัสดี"; // Thai
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('สวัสดี');
    expect(result.code).not.toContain('ความคิดเห็น');
  });

  test('handles Japanese (Hiragana, Katakana, Kanji)', () => {
    const code = `// コメント日本語
const text = "こんにちは世界"; // Japanese mixed scripts
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('こんにちは世界');
    expect(result.code).not.toContain('コメント日本語');
  });

  test('handles Korean Hangul', () => {
    const code = `// 주석 한국어
const text = "안녕하세요"; // Korean
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('안녕하세요');
    expect(result.code).not.toContain('주석 한국어');
  });

  test('handles mixed scripts in same file', () => {
    const code = `// English Русский 中文 العربية
const text1 = "Hello";
const text2 = "Привет";
const text3 = "你好";
const text4 = "مرحبا";`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('Hello');
    expect(result.code).toContain('Привет');
    expect(result.code).toContain('你好');
    expect(result.code).toContain('مرحبا');
    expect(result.code).not.toContain('// English');
  });
});

describe('Encoding - Invisible and Control Characters', () => {
  test('handles soft hyphen (\\u00AD)', () => {
    const code = `// Com\u00ADment
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
    expect(result.code).not.toContain('Com\u00ADment');
  });

  test('handles word joiner (\\u2060)', () => {
    const code = `// Com\u2060ment
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });

  test('handles line separator (\\u2028)', () => {
    const code = `// Comment\u2028const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });

  test('handles paragraph separator (\\u2029)', () => {
    const code = `// Comment\u2029const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });

  test('handles invisible separator (\\u2063)', () => {
    const code = `// Com\u2063ment
const x = 5;`;
    const result = removeComments(code, { language: 'javascript' });
    
    expect(result.code).toContain('const x = 5');
  });
});