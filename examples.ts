/**
 * Example usage of the universal-comment-remover package
 */

import { removeComments } from './src/index';

// Example 1: JavaScript code with comments
console.log('\n=== Example 1: JavaScript ===');
const jsCode = `
// This is a single-line comment
const greeting = "Hello"; // inline comment
/* This is a 
   multi-line comment */
function sayHello() {
  console.log(greeting);
}
`;

const jsResult = removeComments(jsCode, { language: 'javascript' });
console.log('Original code:');
console.log(jsCode);
console.log('\nProcessed code:');
console.log(jsResult.code);
console.log(`Removed comments: ${jsResult.removedCount}`);

// Example 2: Python code with comments
console.log('\n=== Example 2: Python ===');
const pythonCode = `
# This is a comment
def hello():
    """This is a docstring"""
    print("Hello")  # inline comment
    return 42
`;

const pythonResult = removeComments(pythonCode, { language: 'python' });
console.log('Original code:');
console.log(pythonCode);
console.log('\nProcessed code:');
console.log(pythonResult.code);
console.log(`Removed comments: ${pythonResult.removedCount}`);

// Example 3: Automatic detection by filename
console.log('\n=== Example 3: Auto-detection (HTML) ===');
const htmlCode = `
<!-- This is an HTML comment -->
<div class="container">
  <!-- Another comment -->
  <p>Hello World</p>
</div>
`;

const htmlResult = removeComments(htmlCode, { filename: 'index.html' });
console.log('Original code:');
console.log(htmlCode);
console.log('\nProcessed code:');
console.log(htmlResult.code);
console.log(`Detected language: ${htmlResult.detectedLanguage}`);

// Example 4: Preserving license comments
console.log('\n=== Example 4: License comments ===');
const codeWithLicense = `
/*! MIT License - Copyright (c) 2024 */
// Regular comment to remove
const x = 5;
// Another regular comment
const y = 10;
`;

const licenseResult = removeComments(codeWithLicense, {
  language: 'javascript',
  preserveLicense: true
});
console.log('Original code:');
console.log(codeWithLicense);
console.log('\nProcessed code (license preserved):');
console.log(licenseResult.code);

// Example 5: Dry-run mode
console.log('\n=== Example 5: Dry-run mode ===');
const dryRunCode = `
// Comment 1
const a = 1;
// Comment 2
const b = 2;
`;

const dryRunResult = removeComments(dryRunCode, {
  language: 'javascript',
  dryRun: true
});
console.log(`Dry-run: Code was NOT modified`);
console.log(`Number of comments that would be removed: ${dryRunResult.removedCount}`);
console.log(`The original code remains the same: ${dryRunResult.code === dryRunCode}`);

// Example 6: SQL comments
console.log('\n=== Example 6: SQL ===');
const sqlCode = `
-- This is a single-line comment
SELECT * FROM users
WHERE age > 18; -- Filter adults
/* Multi-line comment
   for complex query */
`;

const sqlResult = removeComments(sqlCode, { language: 'sql' });
console.log('Original code:');
console.log(sqlCode);
console.log('\nProcessed code:');
console.log(sqlResult.code);
