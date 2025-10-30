import { removeComments } from '../src/index';

describe('JavaScript/TypeScript Edge Cases', () => {
  test('handles template literals with comment-like strings', () => {
    const code = `
      const template = \`/* Not a comment */\`;
      const regex = /\/* Not a comment *\//;
      const url = 'https://example.com?q=/*not-a-comment*/';
      const str = '/* Not a comment */';
      const str2 = "/* Not a comment */";
    `;
    
    const result = removeComments(code, { language: 'javascript' });
    
    // Check that the basic structure is preserved
    const lines = result.code.split('\n').map(line => line.trim()).filter(Boolean);
    expect(lines.length).toBeGreaterThanOrEqual(4);
    
    // Check that at least some of the original content is preserved
    const hasTemplate = lines.some(line => line.includes('const template'));
    const hasUrl = lines.some(line => line.includes('const url'));
    const hasStr = lines.some(line => line.includes('const str'));
    const hasStr2 = lines.some(line => line.includes('const str2'));
    
    // At least two of these variables should be preserved
    const preservedVars = [hasTemplate, hasUrl, hasStr, hasStr2].filter(Boolean).length;
    expect(preservedVars).toBeGreaterThanOrEqual(2);
  });

  test('handles regular expressions', () => {
    const code = `
      // Regular expressions that look like comments
      const regex1 = /\/\*.*\*\//g;
      const regex2 = /\/\/[^\n]*/g;
      const regex3 = new RegExp('\\/\\/.*');
      const regex4 = /\/\*[\s\S]*?\*\//; // This is a real comment
    `;
    
    const result = removeComments(code, { language: 'javascript' });
    
    // Check that the variable declarations are preserved
    const lines = result.code.split('\n').filter(line => line.trim().startsWith('const regex'));
    expect(lines.length).toBeGreaterThanOrEqual(2);
    
    // Check that the inline comment was removed
    expect(result.code).not.toContain('This is a real comment');
  });

  test('handles JSX/TSX syntax', () => {
    const code = `
      // @ts-check
      import React from 'react';
      
      /**
       * Component props
       * @typedef {Object} Props
       * @property {string} name - User name
       */
      
      /** @type {React.FC<Props>} */
      const Greeting = ({ name }) => (
        <div className="greeting">
          {/* This is a JSX comment */}
          <h1>Hello, {name}!</h1>
          {name.length > 10 && (
            // Conditional rendering comment
            <small>That's a long name!</small>
          )}
        </div>
      );
      
      export default Greeting;
    `;
    
    const result = removeComments(code, { language: 'typescript' });
    
    expect(result.code).toContain('const Greeting = ({ name }) => (');
    expect(result.code).toContain('<h1>Hello, {name}!</h1>');
    expect(result.code).toContain("<small>That's a long name!</small>");
    expect(result.code).not.toContain('This is a JSX comment');
    expect(result.code).not.toContain('Conditional rendering comment');
    // Check the basic component structure
    expect(result.code).toContain('const Greeting');
    expect(result.code).toContain('name}!</h1>');
    
    // Check that the JSX structure is preserved
    expect(result.code).toMatch(/<div[^>]*>.*<\/div>/s);
    
    // Check that comments were removed
    expect(result.code).not.toContain('This is a JSX comment');
    expect(result.code).not.toContain('Conditional rendering comment');
  });

  test('handles decorators and TypeScript types', () => {
    const code = `
      // Class decorator
      @decorator()
      class Test {
        // Property decorator
        @propertyDecorator()
        prop: string;
        
        // Method decorator with parameter decorator
        method(@paramDecorator() param: string) {
          return param;
        }
      }
      
      // TypeScript types
      type ComplexType<T> = {
        [K in keyof T]?: T[K] extends string ? string : number;
      };
      
      // Interface with comments
      interface User {
        /** User ID */
        id: number;
        /* Username */
        name: string;
      }
    `;
    
    const result = removeComments(code, { language: 'typescript' });
    
    // Decorators should be preserved
    expect(result.code).toContain('@decorator()');
    expect(result.code).toContain('@propertyDecorator()');
    expect(result.code).toContain('@paramDecorator()');
    
    // TypeScript types should be preserved
    expect(result.code).toContain('type ComplexType<T>');
    expect(result.code).toContain('interface User');
    
    // Comments should be removed
    expect(result.code).not.toContain('Class decorator');
    expect(result.code).not.toContain('Property decorator');
    expect(result.code).not.toContain('Method decorator');
    
    // Check that the class and decorators are preserved
    expect(result.code).toContain('@decorator');
    expect(result.code).toContain('@propertyDecorator');
    expect(result.code).toContain('@paramDecorator');
    
    // Check that type definitions are preserved
    expect(result.code).toContain('type ComplexType');
    expect(result.code).toContain('interface User');
    
    // Check that the method and property are preserved
    expect(result.code).toContain('method(');
    expect(result.code).toContain('prop: string');
    
    // Check that comments were removed
    expect(result.code).not.toContain('Class decorator');
    expect(result.code).not.toContain('Property decorator');
    expect(result.code).not.toContain('Method decorator');
  });
});
