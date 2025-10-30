const { removeComments, detectLanguage } = require('./dist/index.js');

console.log('🚀 Comprehensive Manual Testing\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.error(error.message);
    failed++;
  }
}

// Test 1: Basic functionality
test('JavaScript single-line comments', () => {
  const result = removeComments('// comment\ncode();', { language: 'javascript' });
  if (!result.code.includes('//')) return;
  throw new Error('Comment not removed');
});

// Test 2: Multi-line comments
test('JavaScript multi-line comments', () => {
  const result = removeComments('/* comment */\ncode();', { language: 'javascript' });
  if (!result.code.includes('/*')) return;
  throw new Error('Multi-line comment not removed');
});

// Test 3: Python
test('Python comments', () => {
  const result = removeComments('# comment\nprint()', { language: 'python' });
  if (!result.code.includes('#')) return;
  throw new Error('Python comment not removed');
});

// Test 4: HTML
test('HTML comments', () => {
  const result = removeComments('<!-- comment --><div></div>', { language: 'html' });
  if (!result.code.includes('<!--')) return;
  throw new Error('HTML comment not removed');
});

// Test 5: Auto-detection by filename
test('Auto-detection by filename', () => {
  const lang = detectLanguage('test.py');
  if (lang !== 'python') throw new Error(`Expected python, got ${lang}`);
});

// Test 6: Auto-detection by content
test('Auto-detection by content', () => {
  const lang = detectLanguage(undefined, 'def hello():\n    pass');
  if (lang !== 'python') throw new Error(`Expected python, got ${lang}`);
});

// Test 7: License preservation
test('License comment preservation', () => {
  const result = removeComments('/*! License */\n// comment\ncode();', {
    language: 'javascript',
    preserveLicense: true
  });
  if (!result.code.includes('License')) throw new Error('License not preserved');
  if (result.code.includes('// comment')) throw new Error('Regular comment not removed');
});

// Test 8: Dry run
test('Dry run mode', () => {
  const original = '// comment\ncode();';
  const result = removeComments(original, { language: 'javascript', dryRun: true });
  if (result.code !== original) throw new Error('Code was modified in dry run');
  if (result.removedCount === 0) throw new Error('Should count comments in dry run');
});

// Test 9: TypeScript declarations
test('TypeScript declarations exist', () => {
  const fs = require('fs');
  if (!fs.existsSync('./dist/index.d.ts')) {
    throw new Error('TypeScript declarations not found');
  }
});

// Test 10: SQL comments
test('SQL comments', () => {
  const result = removeComments('-- comment\nSELECT * FROM users;', { language: 'sql' });
  if (result.code.includes('--')) throw new Error('SQL comment not removed');
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('✅ All tests passed! Package is ready for publishing!');
  process.exit(0);
}
