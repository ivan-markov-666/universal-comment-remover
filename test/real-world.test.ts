import { removeComments } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

describe('Real-World Code Tests', () => {
  test('handles minified JavaScript', () => {
    const minified = '!function(){var e=1;console.log(e)}();';
    const result = removeComments(minified, { language: 'javascript' });
    expect(result.code).toBe(minified);
    expect(result.removedCount).toBe(0);
  });

  test('handles large JSON files', () => {
    const json = `{
      // This is a comment
      "name": "test",
      "version": "1.0.0",
      /* Multi-line
         comment */
      "description": "Test package"
    }`;
    const result = removeComments(json, { language: 'json' });
    expect(result.code).toContain('"name": "test"');
    expect(result.code).not.toContain('comment');
  });

  test('handles TypeScript decorators', () => {
    const code = `// Class comment
@Component({
  selector: 'app-root',
  template: '<!-- template comment --><h1>Hello</h1>'
})
export class AppComponent {
  // Property comment
  @Input() title = 'app';
}`;
    const result = removeComments(code, { language: 'typescript' });
    expect(result.code).toContain('@Component');
    expect(result.code).toContain('@Input');
    expect(result.code).toContain('Hello');
    // The template comment should be preserved inside the template string
    expect(result.code).toContain('template: \'<!-- template comment --><h1>Hello</h1>\'');
  });
});

// Helper function to test with actual project files
function testWithProjectFiles() {
  const testFiles = [
    'package.json',
    'tsconfig.json',
    'src/index.ts'
  ];

  describe('Project File Tests', () => {
    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        test(`processes ${file} without errors`, () => {
          const content = fs.readFileSync(file, 'utf-8');
          const ext = path.extname(file).substring(1);
          const language = (ext === 'ts' || ext === 'tsx') ? 'typescript' : 
                         (ext === 'js' ? 'javascript' : 
                         (ext === 'json' ? 'json' : 'text'));
          
          const result = removeComments(content, { 
            language: language as any // Cast to any to avoid type issues
          });
          expect(result).toBeDefined();
          expect(typeof result.code).toBe('string');
        });
      }
    });
  });
}

// Run project file tests if we're not in CI
try {
  if (!process.env.CI) {
    testWithProjectFiles();
  }
} catch (error) {
  console.warn('Skipping project file tests:', error instanceof Error ? error.message : String(error));
}
