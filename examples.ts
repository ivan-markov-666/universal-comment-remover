/**
 * Примерна употреба на universal-comment-remover пакета
 */

import { removeComments } from './src/index';

// Пример 1: JavaScript код с коментари
console.log('\n=== Пример 1: JavaScript ===');
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
console.log('Оригинален код:');
console.log(jsCode);
console.log('\nОбработен код:');
console.log(jsResult.code);
console.log(`Премахнати коментари: ${jsResult.removedCount}`);

// Пример 2: Python код с коментари
console.log('\n=== Пример 2: Python ===');
const pythonCode = `
# This is a comment
def hello():
    """This is a docstring"""
    print("Hello")  # inline comment
    return 42
`;

const pythonResult = removeComments(pythonCode, { language: 'python' });
console.log('Оригинален код:');
console.log(pythonCode);
console.log('\nОбработен код:');
console.log(pythonResult.code);
console.log(`Премахнати коментари: ${pythonResult.removedCount}`);

// Пример 3: Автоматично разпознаване по име на файл
console.log('\n=== Пример 3: Авто-разпознаване (HTML) ===');
const htmlCode = `
<!-- This is an HTML comment -->
<div class="container">
  <!-- Another comment -->
  <p>Hello World</p>
</div>
`;

const htmlResult = removeComments(htmlCode, { filename: 'index.html' });
console.log('Оригинален код:');
console.log(htmlCode);
console.log('\nОбработен код:');
console.log(htmlResult.code);
console.log(`Разпознат език: ${htmlResult.detectedLanguage}`);

// Пример 4: Запазване на лицензионни коментари
console.log('\n=== Пример 4: Лицензионни коментари ===');
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
console.log('Оригинален код:');
console.log(codeWithLicense);
console.log('\nОбработен код (license запазен):');
console.log(licenseResult.code);

// Пример 5: Dry-run режим
console.log('\n=== Пример 5: Dry-run режим ===');
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
console.log(`Dry-run: Кодът НЕ е променен`);
console.log(`Брой коментари, които биха били премахнати: ${dryRunResult.removedCount}`);
console.log(`Оригиналният код остава същият: ${dryRunResult.code === dryRunCode}`);

// Пример 6: SQL коментари
console.log('\n=== Пример 6: SQL ===');
const sqlCode = `
-- This is a single-line comment
SELECT * FROM users
WHERE age > 18; -- Filter adults
/* Multi-line comment
   for complex query */
`;

const sqlResult = removeComments(sqlCode, { language: 'sql' });
console.log('Оригинален код:');
console.log(sqlCode);
console.log('\nОбработен код:');
console.log(sqlResult.code);
