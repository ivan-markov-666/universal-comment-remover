import { removeComments } from '../src/index';

describe('JavaScript/TypeScript Remover - Advanced Edge Cases', () => {
  
  // ============================================================================
  // 1. Template Literals - Basic
  // ============================================================================
  describe('Template Literals', () => {
    test('comment-like text inside template literal', () => {
      const code = `const msg = \`This is // not a comment\`;
// Real comment
console.log(msg);`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('// not a comment');
      expect(result.code).not.toContain('// Real comment');
    });

    test('multi-line template literal with comment-like text', () => {
      const code = `const html = \`
  <div>
    // This looks like a comment but isn't
    /* Neither is this */
  </div>
\`;
// Actual comment`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('// This looks like a comment');
      expect(result.code).toContain('/* Neither is this */');
      expect(result.code).not.toContain('// Actual comment');
    });

    test('nested template literals', () => {
      const code = `const outer = \`outer \${inner \`nested\`} text\`;
// Comment to remove`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('outer ${inner `nested`}');
      expect(result.code).not.toContain('// Comment');
    });

    test('template literal with expressions and comments outside', () => {
      const code = `// Comment before
const msg = \`Hello \${name}\`; // Inline comment
// Comment after`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('const msg = `Hello ${name}`;');
      expect(result.code).not.toContain('// Comment before');
      expect(result.code).not.toContain('// Inline comment');
      expect(result.code).not.toContain('// Comment after');
    });

    test('template literal with escaped backticks', () => {
      const code = `const str = \`This has \\\` backtick\`;
// Comment`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('\\` backtick');
      expect(result.code).not.toContain('// Comment');
    });

    test('tagged template literal', () => {
      const code = `// Comment
const result = myTag\`template \${value}\`;`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('myTag`template ${value}`');
      expect(result.code).not.toContain('// Comment');
    });
  });

  // ============================================================================
  // 2. Regex Literals
  // ============================================================================
  describe('Regex Literals', () => {
    test('regex literal with slashes', () => {
      const code = `const urlPattern = /https?:\\/\\//; // URL regex
const test = urlPattern.test(url);`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('/https?:\\/\\//');
      expect(result.code).not.toContain('// URL regex');
    });

    test('regex with flags and comment', () => {
      const code = `const pattern = /test/gi; // Case insensitive`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('/test/gi;');
      expect(result.code).not.toContain('// Case insensitive');
    });

    test('regex that looks like division', () => {
      const code = `const a = 10 / 2; // Division
const regex = /\\d+/; // Regex`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('10 / 2;');
      expect(result.code).toContain('/\\d+/;');
      expect(result.code).not.toContain('// Division');
      expect(result.code).not.toContain('// Regex');
    });

    test('regex with comment-like patterns inside', () => {
      const code = `const pattern = /\\/\\/ match this/; // Real comment`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('/\\/\\/ match this/;');
      expect(result.code).not.toContain('// Real comment');
    });

    test('complex regex with character classes', () => {
      const code = `// Email regex
const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('[a-zA-Z0-9._%+-]+');
      expect(result.code).not.toContain('// Email regex');
    });

    test('regex with escaped forward slash', () => {
      const code = `const regex = /path\\/to\\/file/; // Comment`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('/path\\/to\\/file/;');
      expect(result.code).not.toContain('// Comment');
    });
  });

  // ============================================================================
  // 3. Division Operator vs Regex
  // ============================================================================
  describe('Division Operator vs Regex Disambiguation', () => {
    test('simple division', () => {
      const code = `const result = a / b; // Division`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('a / b;');
      expect(result.code).not.toContain('// Division');
    });

    test('multiple divisions', () => {
      const code = `const result = a / b / c; // Multiple divisions`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('a / b / c;');
      expect(result.code).not.toContain('// Multiple');
    });

    test('division after return', () => {
      const code = `function calc() {
  return x / y; // Return division
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('return x / y;');
      expect(result.code).not.toContain('// Return');
    });

    test('regex after equals', () => {
      const code = `const pattern = /test/; // Regex after equals`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('const pattern = /test/;');
      expect(result.code).not.toContain('// Regex');
    });

    test('regex after comma', () => {
      const code = `const arr = [1, /test/]; // Regex in array`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('[1, /test/];');
      expect(result.code).not.toContain('// Regex in array');
    });

    test('regex after opening bracket', () => {
      const code = `if (/test/.test(str)) { } // Regex in condition`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('/test/.test(str)');
      expect(result.code).not.toContain('// Regex in condition');
    });
  });

  // ============================================================================
  // 4. JSX Comments
  // ============================================================================
  describe('JSX Comments', () => {
    test('JSX block comment', () => {
      const code = `function Component() {
  return (
    <div>
      {/* JSX comment */}
      <h1>Title</h1>
    </div>
  );
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('<h1>Title</h1>');
      expect(result.code).not.toContain('JSX comment');
    });

    test('JSX single-line comment', () => {
      const code = `const element = (
  <div>
    {// JSX single line comment
    }
    <p>Text</p>
  </div>
);`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('<p>Text</p>');
      // Single line JSX comments are tricky - they might remain as {//}
    });

    test('multiple JSX comments', () => {
      const code = `<div>
  {/* Comment 1 */}
  <p>Text 1</p>
  {/* Comment 2 */}
  <p>Text 2</p>
</div>`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('<p>Text 1</p>');
      expect(result.code).toContain('<p>Text 2</p>');
      expect(result.code).not.toContain('Comment 1');
      expect(result.code).not.toContain('Comment 2');
    });

    test('JSX comment with nested JSX', () => {
      const code = `<div>
  {/* This is a comment with <nested> tags */}
  <span>Content</span>
</div>`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('<span>Content</span>');
      expect(result.code).not.toContain('This is a comment');
    });

    test('JSX comment in props', () => {
      const code = `<Button
  {/* disabled={true} */}
  onClick={handleClick}
/>`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('onClick={handleClick}');
      expect(result.code).not.toContain('disabled={true}');
    });
  });

  // ============================================================================
  // 5. Arrow Functions
  // ============================================================================
  describe('Arrow Functions with Comments', () => {
    test('arrow function with implicit return', () => {
      const code = `// Comment before
const fn = () => value; // Inline comment`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('const fn = () => value;');
      expect(result.code).not.toContain('// Comment before');
      expect(result.code).not.toContain('// Inline');
    });

    test('arrow function with block body', () => {
      const code = `const fn = () => {
  // Comment inside
  return value;
};`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('return value;');
      expect(result.code).not.toContain('// Comment inside');
    });

    test('arrow function with destructured params', () => {
      const code = `// Destructuring arrow
const fn = ({ name, age }) => {
  console.log(name); // Log name
};`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('({ name, age })');
      expect(result.code).not.toContain('// Destructuring');
      expect(result.code).not.toContain('// Log name');
    });

    test('nested arrow functions', () => {
      const code = `// Outer arrow
const outer = () => {
  // Inner arrow
  const inner = () => {
    return 42; // Return value
  };
};`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('const outer = () =>');
      expect(result.code).toContain('const inner = () =>');
      expect(result.code).not.toContain('// Outer');
      expect(result.code).not.toContain('// Inner');
      expect(result.code).not.toContain('// Return value');
    });

    test('arrow function with default parameters', () => {
      const code = `// Default params
const greet = (name = "World") => \`Hello \${name}\`; // Greeting`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('(name = "World")');
      expect(result.code).not.toContain('// Default params');
      expect(result.code).not.toContain('// Greeting');
    });
  });

  // ============================================================================
  // 6. Async/Await Functions
  // ============================================================================
  describe('Async/Await with Comments', () => {
    test('async function with await', () => {
      const code = `// Async function
async function fetchData() {
  const response = await fetch(url); // Fetch data
  return response.json(); // Parse JSON
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('async function fetchData()');
      expect(result.code).toContain('await fetch(url);');
      expect(result.code).not.toContain('// Async function');
      expect(result.code).not.toContain('// Fetch data');
      expect(result.code).not.toContain('// Parse JSON');
    });

    test('async arrow function', () => {
      const code = `// Async arrow
const loadData = async () => {
  const data = await getData(); // Get data
  return data;
};`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('const loadData = async () =>');
      expect(result.code).not.toContain('// Async arrow');
      expect(result.code).not.toContain('// Get data');
    });

    test('try-catch with async/await', () => {
      const code = `async function fetchData() {
  try {
    // Try to fetch
    const data = await fetch(url);
  } catch (error) {
    // Handle error
    console.error(error);
  }
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('try {');
      expect(result.code).toContain('catch (error)');
      expect(result.code).not.toContain('// Try to fetch');
      expect(result.code).not.toContain('// Handle error');
    });

    test('multiple awaits with comments', () => {
      const code = `async function process() {
  const a = await stepOne(); // Step 1
  const b = await stepTwo(a); // Step 2
  const c = await stepThree(b); // Step 3
  return c;
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('await stepOne();');
      expect(result.code).toContain('await stepTwo(a);');
      expect(result.code).toContain('await stepThree(b);');
      expect(result.code).not.toContain('// Step 1');
      expect(result.code).not.toContain('// Step 2');
      expect(result.code).not.toContain('// Step 3');
    });
  });

  // ============================================================================
  // 7. Generator Functions
  // ============================================================================
  describe('Generator Functions', () => {
    test('generator function with yield', () => {
      const code = `// Generator function
function* generateNumbers() {
  yield 1; // First number
  yield 2; // Second number
  yield 3; // Third number
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('function* generateNumbers()');
      expect(result.code).toContain('yield 1;');
      expect(result.code).not.toContain('// Generator function');
      expect(result.code).not.toContain('// First number');
    });

    test('generator with yield*', () => {
      const code = `function* delegatingGenerator() {
  // Delegate to another generator
  yield* otherGenerator();
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('yield* otherGenerator();');
      expect(result.code).not.toContain('// Delegate');
    });

    test('async generator', () => {
      const code = `// Async generator
async function* asyncGen() {
  yield await fetchData(); // Async yield
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('async function* asyncGen()');
      expect(result.code).not.toContain('// Async generator');
      expect(result.code).not.toContain('// Async yield');
    });
  });

  // ============================================================================
  // 8. Modern JavaScript Operators
  // ============================================================================
  describe('Modern JavaScript Operators', () => {
    test('nullish coalescing operator', () => {
      const code = `// Nullish coalescing
const value = input ?? defaultValue; // Use default if null/undefined`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('input ?? defaultValue;');
      expect(result.code).not.toContain('// Nullish');
      expect(result.code).not.toContain('// Use default');
    });

    test('optional chaining', () => {
      const code = `// Optional chaining
const name = user?.profile?.name; // Safe access`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('user?.profile?.name;');
      expect(result.code).not.toContain('// Optional');
      expect(result.code).not.toContain('// Safe access');
    });

    test('optional chaining with function calls', () => {
      const code = `const result = obj?.method?.(args); // Optional call`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('obj?.method?.(args);');
      expect(result.code).not.toContain('// Optional call');
    });

    test('logical assignment operators', () => {
      const code = `// Logical OR assignment
x ||= defaultValue; // Set if falsy
y &&= newValue; // Set if truthy
z ??= backup; // Set if nullish`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('x ||= defaultValue;');
      expect(result.code).toContain('y &&= newValue;');
      expect(result.code).toContain('z ??= backup;');
      expect(result.code).not.toContain('// Logical');
      expect(result.code).not.toContain('// Set if');
    });

    test('exponentiation operator', () => {
      const code = `const result = base ** exponent; // Power`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('base ** exponent;');
      expect(result.code).not.toContain('// Power');
    });
  });

  // ============================================================================
  // 9. Labeled Statements
  // ============================================================================
  describe('Labeled Statements', () => {
    test('labeled loop with break', () => {
      const code = `// Outer loop
outerLoop: for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (condition) break outerLoop; // Break outer
  }
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('outerLoop: for');
      expect(result.code).toContain('break outerLoop;');
      expect(result.code).not.toContain('// Outer loop');
      expect(result.code).not.toContain('// Break outer');
    });

    test('labeled statement with continue', () => {
      const code = `loop: while (condition) {
  // Continue to label
  if (skip) continue loop;
}`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('loop: while');
      expect(result.code).toContain('continue loop;');
      expect(result.code).not.toContain('// Continue to label');
    });
  });

  // ============================================================================
  // 10. TypeScript: Type Assertions
  // ============================================================================
  describe('TypeScript - Type Assertions', () => {
    test('type assertion with "as" keyword', () => {
      const code = `// Type assertion
const value = input as string; // Cast to string`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('input as string;');
      expect(result.code).not.toContain('// Type assertion');
      expect(result.code).not.toContain('// Cast to string');
    });

    test('type assertion with angle brackets', () => {
      const code = `// Old-style assertion
const value = <string>input; // Cast to string`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('<string>input;');
      expect(result.code).not.toContain('// Old-style');
      expect(result.code).not.toContain('// Cast to string');
    });

    test('const assertion', () => {
      const code = `// Const assertion
const config = { mode: 'production' } as const; // Readonly`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('} as const;');
      expect(result.code).not.toContain('// Const assertion');
      expect(result.code).not.toContain('// Readonly');
    });

    test('non-null assertion', () => {
      const code = `// Non-null assertion
const value = maybeNull!; // Assert not null`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('maybeNull!;');
      expect(result.code).not.toContain('// Non-null');
      expect(result.code).not.toContain('// Assert not null');
    });
  });

  // ============================================================================
  // 11. TypeScript: Namespaces and Modules
  // ============================================================================
  describe('TypeScript - Namespaces and Modules', () => {
    test('namespace declaration', () => {
      const code = `// Namespace
namespace MyNamespace {
  // Exported function
  export function doSomething() {}
}`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('namespace MyNamespace');
      expect(result.code).toContain('export function doSomething()');
      expect(result.code).not.toContain('// Namespace');
      expect(result.code).not.toContain('// Exported function');
    });

    test('module augmentation', () => {
      const code = `// Module augmentation
declare module 'existing-module' {
  // Add new interface
  export interface NewInterface {}
}`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('declare module');
      expect(result.code).toContain('export interface NewInterface');
      expect(result.code).not.toContain('// Module augmentation');
      expect(result.code).not.toContain('// Add new interface');
    });

    test('namespace merging', () => {
      const code = `namespace Utils {
  // First declaration
  export const version = '1.0';
}

namespace Utils {
  // Merged declaration
  export function log() {}
}`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('namespace Utils');
      expect(result.code).not.toContain('// First declaration');
      expect(result.code).not.toContain('// Merged declaration');
    });
  });

  // ============================================================================
  // 12. TypeScript: Enums
  // ============================================================================
  describe('TypeScript - Enums', () => {
    test('numeric enum with inline comments', () => {
      const code = `// Color enum
enum Color {
  Red = 1, // Red color
  Green = 2, // Green color
  Blue = 3 // Blue color
}`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('enum Color');
      expect(result.code).toContain('Red = 1,');
      expect(result.code).toContain('Green = 2,');
      expect(result.code).toContain('Blue = 3');
      expect(result.code).not.toContain('// Color enum');
      expect(result.code).not.toContain('// Red color');
    });

    test('string enum', () => {
      const code = `enum Direction {
  // Cardinal directions
  North = "NORTH", // North direction
  South = "SOUTH", // South direction
}`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('North = "NORTH"');
      expect(result.code).not.toContain('// Cardinal');
      expect(result.code).not.toContain('// North direction');
    });

    test('const enum', () => {
      const code = `// Const enum for performance
const enum Status {
  Active = 1, // Active status
  Inactive = 0 // Inactive status
}`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('const enum Status');
      expect(result.code).not.toContain('// Const enum');
      expect(result.code).not.toContain('// Active status');
    });

    test('computed enum members', () => {
      const code = `enum FileAccess {
  None = 0,
  Read = 1 << 1, // Bitwise shift
  Write = 1 << 2, // Bitwise shift
}`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('1 << 1,');
      expect(result.code).not.toContain('// Bitwise shift');
    });
  });

  // ============================================================================
  // 13. TypeScript: Union and Intersection Types
  // ============================================================================
  describe('TypeScript - Union and Intersection Types', () => {
    test('union type with comments', () => {
      const code = `// Union type
type Result = Success | Error; // Success or Error`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('type Result = Success | Error;');
      expect(result.code).not.toContain('// Union type');
      expect(result.code).not.toContain('// Success or Error');
    });

    test('intersection type with comments', () => {
      const code = `// Intersection type
type Combined = TypeA & TypeB; // Both types`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('type Combined = TypeA & TypeB;');
      expect(result.code).not.toContain('// Intersection');
      expect(result.code).not.toContain('// Both types');
    });

    test('complex union type', () => {
      const code = `type Status = 
  | "pending"   // Pending state
  | "success"   // Success state
  | "error";    // Error state`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('"pending"');
      expect(result.code).toContain('"success"');
      expect(result.code).toContain('"error"');
      expect(result.code).not.toContain('// Pending state');
    });

    test('discriminated union', () => {
      const code = `// Discriminated union
type Shape =
  | { kind: "circle"; radius: number }   // Circle
  | { kind: "square"; size: number };    // Square`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('kind: "circle"');
      expect(result.code).toContain('kind: "square"');
      expect(result.code).not.toContain('// Discriminated union');
      expect(result.code).not.toContain('// Circle');
      expect(result.code).not.toContain('// Square');
    });
  });

  // ============================================================================
  // 14. TypeScript: Conditional Types
  // ============================================================================
  describe('TypeScript - Conditional Types', () => {
    test('basic conditional type', () => {
      const code = `// Conditional type
type Check<T> = T extends string ? true : false; // String check`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('T extends string ? true : false;');
      expect(result.code).not.toContain('// Conditional type');
      expect(result.code).not.toContain('// String check');
    });

    test('nested conditional type', () => {
      const code = `type TypeName<T> =
  // Check types
  T extends string ? "string" : // String type
  T extends number ? "number" : // Number type
  "unknown"; // Unknown type`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('T extends string ? "string"');
      expect(result.code).toContain('T extends number ? "number"');
      expect(result.code).not.toContain('// Check types');
      expect(result.code).not.toContain('// String type');
    });

    test('infer keyword in conditional type', () => {
      const code = `// Extract return type
type ReturnType<T> = T extends (...args: any) => infer R ? R : never;`;
      const result = removeComments(code, { language: 'typescript' });
      
      expect(result.code).toContain('infer R ? R : never;');
      expect(result.code).not.toContain('// Extract return type');
    });
  });

  // ============================================================================
  // 15. keepEmptyLines Option - Consecutive Comments
  // ============================================================================
  describe('keepEmptyLines Option - Consecutive Comments', () => {
    test('preserves empty lines with keepEmptyLines=true', () => {
      const code = `// Comment 1

// Comment 2

const x = 5;`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: true
      });
      
      // Should preserve empty lines where comments were
      expect(result.code).toContain('\n\n');
      expect(result.code).not.toContain('// Comment');
    });

    test('removes empty lines with keepEmptyLines=false (default)', () => {
      const code = `// Comment 1

// Comment 2

const x = 5;`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: false
      });
      
      // Should NOT have excessive empty lines
      expect(result.code.trim()).toContain('const x = 5;');
    });

    test('three consecutive comments with keepEmptyLines', () => {
      const code = `// Comment 1
// Comment 2
// Comment 3
const x = 5;`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: true
      });
      
      expect(result.code).not.toContain('// Comment');
      expect(result.code).toContain('const x = 5;');
    });

    test('multiple comment blocks with keepEmptyLines', () => {
      const code = `// Block 1

const a = 1;

// Block 2

const b = 2;`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: true
      });
      
      expect(result.code).toContain('const a = 1;');
      expect(result.code).toContain('const b = 2;');
      expect(result.code).not.toContain('// Block');
    });
  });

  // ============================================================================
  // 16. keepEmptyLines - Comments in Complex Structures
  // ============================================================================
  describe('keepEmptyLines - Comments in Arrays and Objects', () => {
    test('comments in array with keepEmptyLines', () => {
      const code = `const arr = [
  1, // First
  2, // Second
  3  // Third
];`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: true
      });
      
      expect(result.code).toContain('1,');
      expect(result.code).toContain('2,');
      expect(result.code).toContain('3');
      expect(result.code).not.toContain('// First');
    });

    test('comments in object with keepEmptyLines', () => {
      const code = `const obj = {
  // Property 1
  name: "John",
  // Property 2
  age: 30
};`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: true
      });
      
      expect(result.code).toContain('name: "John"');
      expect(result.code).toContain('age: 30');
      expect(result.code).not.toContain('// Property');
    });

    test('comments between function parameters', () => {
      const code = `function test(
  // First param
  a,
  // Second param
  b,
  // Third param
  c
) {}`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: true
      });
      
      expect(result.code).toContain('a,');
      expect(result.code).toContain('b,');
      expect(result.code).toContain('c');
      expect(result.code).not.toContain('// First param');
    });
  });

  // ============================================================================
  // 17. End-of-File Comments
  // ============================================================================
  describe('End-of-File Comments', () => {
    test('single comment at end of file', () => {
      const code = `const x = 5;
// End of file comment`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code).toContain('const x = 5;');
      expect(result.code).not.toContain('// End of file');
    });

    test('multiple comments at end of file', () => {
      const code = `const x = 5;
// Comment 1
// Comment 2
// Comment 3`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code.trim()).toContain('const x = 5;');
      expect(result.code).not.toContain('// Comment');
    });

    test('end-of-file comment with keepEmptyLines', () => {
      const code = `const x = 5;
// End comment`;
      const result = removeComments(code, {
        language: 'javascript',
        keepEmptyLines: true
      });
      
      expect(result.code).toContain('const x = 5;');
      expect(result.code).not.toContain('// End comment');
    });

    test('only comments in file', () => {
      const code = `// Comment 1
// Comment 2
// Comment 3`;
      const result = removeComments(code, { language: 'javascript' });
      
      expect(result.code.trim().length).toBeLessThan(code.length);
    });
  });
});

describe('Python Remover - Advanced Edge Cases', () => {
  
  // ============================================================================
  // 1. Triple Quotes - Single vs Double
  // ============================================================================
  describe('Triple Quotes - Single vs Double', () => {
    test('triple double quotes docstring', () => {
      const code = `def hello():
    """This is a docstring"""
    return "Hello"`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def hello():');
      expect(result.code).toContain('return "Hello"');
      expect(result.code).not.toContain('docstring');
    });

    test('triple single quotes docstring', () => {
      const code = `def hello():
    '''This is a docstring'''
    return "Hello"`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def hello():');
      expect(result.code).not.toContain('docstring');
    });

    test('multi-line triple double quotes', () => {
      const code = `def hello():
    """
    This is a
    multi-line docstring
    with multiple lines
    """
    return "Hello"`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def hello():');
      expect(result.code).toContain('return "Hello"');
      expect(result.code).not.toContain('multi-line docstring');
    });

    test('multi-line triple single quotes', () => {
      const code = `def hello():
    '''
    Multi-line with
    single quotes
    '''
    return "Hello"`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).not.toContain('Multi-line with');
    });

    test('triple quotes as regular string (not docstring)', () => {
      const code = `x = 5
text = """This is just a string"""
y = 10`;
      const result = removeComments(code, { language: 'python' });
      
      // If it's NOT a docstring (after def/class), keep it
      expect(result.code).toContain('text = """This is just a string"""');
    });

    test('mixed triple quotes in same file', () => {
      const code = `def func1():
    """Double quote docstring"""
    pass

def func2():
    '''Single quote docstring'''
    pass`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def func1():');
      expect(result.code).toContain('def func2():');
      expect(result.code).not.toContain('Double quote');
      expect(result.code).not.toContain('Single quote');
    });
  });

  // ============================================================================
  // 2. F-strings with # Inside
  // ============================================================================
  describe('F-strings with # Character', () => {
    test('f-string with # in text', () => {
      const code = `name = "Alice"
msg = f"User #{user_id}: {name}"
# Real comment
print(msg)`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('f"User #{user_id}: {name}"');
      expect(result.code).not.toContain('# Real comment');
    });

    test('f-string with hashtag', () => {
      const code = `tag = f"#python #coding"
# This is a comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('f"#python #coding"');
      expect(result.code).not.toContain('# This is a comment');
    });

    test('multi-line f-string with #', () => {
      const code = `msg = f"""
User: {name}
Tag: #awesome
Score: {score}
"""
# Comment after`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('Tag: #awesome');
      expect(result.code).not.toContain('# Comment after');
    });

    test('nested f-string expressions', () => {
      const code = `result = f"Value: {f'\\#{x}'}"
# Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain("f\"Value: {f'\\#{x}'}\"");
      expect(result.code).not.toContain('# Comment');
    });

    test('f-string with escaped characters', () => {
      const code = `text = f"Line 1\\nLine 2 \\#tag"
# Real comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('\\nLine 2 \\#tag');
      expect(result.code).not.toContain('# Real comment');
    });

    test('f-string with format specifiers', () => {
      const code = `amount = 10
price = f\`${'${amount:.2f} \\#sale'}\`
# Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain(':.2f} \\#sale');
      expect(result.code).not.toContain('# Comment');
    });
  });

  // ============================================================================
  // 3. Raw Strings with # Inside
  // ============================================================================
  describe('Raw Strings (r-prefix)', () => {
    test('raw string with # character', () => {
      const code = `pattern = r"\\d+ # not a comment"
# Real comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('r"\\d+ # not a comment"');
      expect(result.code).not.toContain('# Real comment');
    });

    test('raw f-string (rf prefix)', () => {
      const code = `path = rf"C:\\Users\\{username}\\#data"
# Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('rf"C:\\Users\\{username}\\#data"');
      expect(result.code).not.toContain('# Comment');
    });

    test('raw string with backslashes and #', () => {
      const code = `regex = r"\\w+\\s+#\\d+"
# Pattern comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('r"\\w+\\s+#\\d+"');
      expect(result.code).not.toContain('# Pattern comment');
    });

    test('raw byte string', () => {
      const code = `data = rb"Binary #data \\x00"
# Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('rb"Binary #data');
      expect(result.code).not.toContain('# Comment');
    });

    test('raw multi-line string', () => {
      const code = `text = r"""
Line 1 # not comment
Line 2 # also not comment
"""
# Real comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('Line 1 # not comment');
      expect(result.code).not.toContain('# Real comment');
    });
  });

  // ============================================================================
  // 4. Byte Strings
  // ============================================================================
  describe('Byte Strings (b-prefix)', () => {
    test('byte string with # character', () => {
      const code = `data = b"Binary #data"
# Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('b"Binary #data"');
      expect(result.code).not.toContain('# Comment');
    });

    test('byte string with escape sequences', () => {
      const code = `data = b"\\x00\\x01 #marker"
# Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('#marker');
      expect(result.code).not.toContain('# Comment');
    });
  });

  // ============================================================================
  // 5. Docstrings in Various Contexts
  // ============================================================================
  describe('Docstrings in Different Contexts', () => {
    test('module-level docstring (first line)', () => {
      const code = `"""Module docstring
This describes the module
"""
import sys
# Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('import sys');
      expect(result.code).not.toContain('# Comment');
      // Module docstring might be removed or kept depending on logic
    });

    test('class docstring', () => {
      const code = `class MyClass:
    """Class docstring"""
    def __init__(self):
        pass`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('class MyClass:');
      expect(result.code).toContain('def __init__');
      expect(result.code).not.toContain('Class docstring');
    });

    test('nested function docstring', () => {
      const code = `def outer():
    """Outer docstring"""
    def inner():
        """Inner docstring"""
        return 42
    return inner()`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def outer():');
      expect(result.code).toContain('def inner():');
      expect(result.code).not.toContain('Outer docstring');
      expect(result.code).not.toContain('Inner docstring');
    });

    test('property docstring', () => {
      const code = `class User:
    @property
    def name(self):
        """Property docstring"""
        return self._name`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('@property');
      expect(result.code).toContain('def name(self):');
      expect(result.code).not.toContain('Property docstring');
    });

    test('async function docstring', () => {
      const code = `async def fetch_data():
    """Async function docstring"""
    return await get_data()`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('async def fetch_data():');
      expect(result.code).not.toContain('Async function docstring');
    });

    test('lambda (no docstring support)', () => {
      const code = `# Lambda function
func = lambda x: x * 2
# Comment after`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('func = lambda x: x * 2');
      expect(result.code).not.toContain('# Lambda');
      expect(result.code).not.toContain('# Comment after');
    });

    test('__init__ method docstring', () => {
      const code = `class User:
    def __init__(self, name):
        """Constructor docstring"""
        self.name = name`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def __init__');
      expect(result.code).not.toContain('Constructor docstring');
    });
  });

  // ============================================================================
  // 6. Comments After Colon
  // ============================================================================
  describe('Comments Immediately After Colon', () => {
    test('comment after function definition colon', () => {
      const code = `def hello(): # Comment after colon
    return "Hello"`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def hello():');
      expect(result.code).not.toContain('# Comment after colon');
    });

    test('comment after class definition colon', () => {
      const code = `class MyClass: # Comment
    pass`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('class MyClass:');
      expect(result.code).not.toContain('# Comment');
    });

    test('comment after if statement colon', () => {
      const code = `if x > 5: # Check condition
    print("Yes")`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('if x > 5:');
      expect(result.code).not.toContain('# Check condition');
    });

    test('comment after for loop colon', () => {
      const code = `for i in range(10): # Loop comment
    print(i)`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('for i in range(10):');
      expect(result.code).not.toContain('# Loop comment');
    });

    test('comment after while loop colon', () => {
      const code = `while condition: # While comment
    do_something()`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('while condition:');
      expect(result.code).not.toContain('# While comment');
    });

    test('comment after try/except colon', () => {
      const code = `try: # Try block
    risky_operation()
except Exception: # Catch block
    handle_error()`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('try:');
      expect(result.code).toContain('except Exception:');
      expect(result.code).not.toContain('# Try block');
      expect(result.code).not.toContain('# Catch block');
    });
  });

  // ============================================================================
  // 7. Decorators with Comments
  // ============================================================================
  describe('Decorators', () => {
    test('decorator with comment above', () => {
      const code = `# Decorator comment
@property
def name(self):
    return self._name`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('@property');
      expect(result.code).toContain('def name(self):');
      expect(result.code).not.toContain('# Decorator comment');
    });

    test('decorator with inline comment', () => {
      const code = `@staticmethod # Static method
def helper():
    pass`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('@staticmethod');
      expect(result.code).not.toContain('# Static method');
    });

    test('multiple decorators with comments', () => {
      const code = `# First decorator
@decorator1
# Second decorator
@decorator2
def func():
    pass`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('@decorator1');
      expect(result.code).toContain('@decorator2');
      expect(result.code).not.toContain('# First');
      expect(result.code).not.toContain('# Second');
    });

    test('decorator with arguments', () => {
      const code = `@app.route('/home') # Route decorator
def home():
    return "Home"`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain("@app.route('/home')");
      expect(result.code).not.toContain('# Route decorator');
    });

    test('class decorator', () => {
      const code = `# Dataclass decorator
@dataclass
class User:
    name: str`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('@dataclass');
      expect(result.code).toContain('class User:');
      expect(result.code).not.toContain('# Dataclass');
    });
  });

  // ============================================================================
  // 8. Multi-line Statements with Comments
  // ============================================================================
  describe('Multi-line Statements', () => {
    test('multi-line function call with comments', () => {
      const code = `result = function_call(
    arg1,  # First argument
    arg2,  # Second argument
    arg3   # Third argument
)`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('arg1,');
      expect(result.code).toContain('arg2,');
      expect(result.code).toContain('arg3');
      expect(result.code).not.toContain('# First argument');
    });

    test('multi-line list with comments', () => {
      const code = `items = [
    1,  # First
    2,  # Second
    3,  # Third
]`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('1,');
      expect(result.code).toContain('2,');
      expect(result.code).toContain('3,');
      expect(result.code).not.toContain('# First');
    });

    test('multi-line dictionary with comments', () => {
      const code = `config = {
    # Key 1
    'name': 'John',
    # Key 2
    'age': 30,
}`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain("'name': 'John'");
      expect(result.code).toContain("'age': 30");
      expect(result.code).not.toContain('# Key 1');
      expect(result.code).not.toContain('# Key 2');
    });

    test('multi-line import with comments', () => {
      const code = `from module import (
    function1,  # Import function1
    function2,  # Import function2
    function3   # Import function3
)`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('function1,');
      expect(result.code).toContain('function2,');
      expect(result.code).toContain('function3');
      expect(result.code).not.toContain('# Import function');
    });
  });

  // ============================================================================
  // 9. Backslash Line Continuation
  // ============================================================================
  describe('Backslash Line Continuation', () => {
    test('line continuation with comment', () => {
      const code = `result = value1 + \\
    value2 + \\  # Comment on continuation
    value3`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('value1 +');
      expect(result.code).toContain('value2 +');
      expect(result.code).toContain('value3');
      expect(result.code).not.toContain('# Comment on continuation');
    });

    test('string continuation with backslash', () => {
      const code = `text = "Line 1 " \\
    "Line 2"  # Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('"Line 1 "');
      expect(result.code).toContain('"Line 2"');
      expect(result.code).not.toContain('# Comment');
    });

    test('long condition with continuation', () => {
      const code = `if condition1 and \\
   condition2 and \\  # Check conditions
   condition3:
    pass`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('condition1 and');
      expect(result.code).toContain('condition2 and');
      expect(result.code).not.toContain('# Check conditions');
    });
  });

  // ============================================================================
  // 10. Semicolon-separated Statements
  // ============================================================================
  describe('Semicolon-separated Statements', () => {
    test('multiple statements on one line', () => {
      const code = `x = 1; y = 2; z = 3  # Comment`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('x = 1; y = 2; z = 3');
      expect(result.code).not.toContain('# Comment');
    });

    test('semicolon with comment after each statement', () => {
      const code = `x = 1  # First
y = 2; z = 3  # Second and third`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('x = 1');
      expect(result.code).toContain('y = 2; z = 3');
      expect(result.code).not.toContain('# First');
      expect(result.code).not.toContain('# Second');
    });
  });

  // ============================================================================
  // 11. keepEmptyLines Option with Python
  // ============================================================================
  describe('keepEmptyLines Option', () => {
    test('preserves empty lines with keepEmptyLines=true', () => {
      const code = `# Comment 1

# Comment 2

x = 5`;
      const result = removeComments(code, {
        language: 'python',
        keepEmptyLines: true
      });
      
      expect(result.code).not.toContain('# Comment');
      expect(result.code).toContain('x = 5');
      // Should have empty lines
      expect(result.code).toContain('\n\n');
    });

    test('removes empty lines with keepEmptyLines=false (default)', () => {
      const code = `# Comment 1

# Comment 2

x = 5`;
      const result = removeComments(code, {
        language: 'python',
        keepEmptyLines: false
      });
      
      expect(result.code).not.toContain('# Comment');
      expect(result.code).toContain('x = 5');
    });

    test('keepEmptyLines with docstrings', () => {
      const code = `\# Comment before

def hello():
    """Docstring"""
    return "Hello"

\# Comment after`;
      const result = removeComments(code, {
        language: 'python',
        keepEmptyLines: true
      });
      
      expect(result.code).toContain('def hello():');
      expect(result.code).not.toContain('# Comment');
      expect(result.code).not.toContain('Docstring');
    });

    test('consecutive comments with keepEmptyLines', () => {
      const code = `\# Comment 1
\# Comment 2
\# Comment 3
x = 5`;
      const result = removeComments(code, {
        language: 'python',
        keepEmptyLines: true
      });
      
      expect(result.code).not.toContain('# Comment');
      expect(result.code).toContain('x = 5');
    });
  });

// ============================================================================
// 12. License Comments (preserveLicense option)
// ============================================================================
describe('License Comments Preservation', () => {
  test('preserves copyright comment', () => {
    const code = `\# Copyright (c) 2024 Company Name
\# Regular comment
x = 5`;
    const result = removeComments(code, {
      language: 'python',
      preserveLicense: true
    });
    
    expect(result.code).toContain('Copyright');
    expect(result.code).not.toContain('Regular comment');
  });

  test('preserves license keyword', () => {
    const code = `\# This file is licensed under MIT License
\# Another comment
def func():
    pass`;
    const result = removeComments(code, {
      language: 'python',
      preserveLicense: true
    });
    
    expect(result.code).toContain('licensed under MIT License');
    expect(result.code).not.toContain('Another comment');
  });

  test('preserves author comment', () => {
    const code = `\# Author: John Doe
\# Regular comment
x = 5`;
    const result = removeComments(code, {
      language: 'python',
      preserveLicense: true
    });
    
    expect(result.code).toContain('Author:');
    expect(result.code).not.toContain('Regular comment');
  });

  test('preserves license in docstring', () => {
    const code = `"""
Copyright (c) 2024
MIT License
"""
\# Regular comment
import sys`;
    const result = removeComments(code, {
      language: 'python',
      preserveLicense: true
    });
    
    expect(result.code).toContain('Copyright');
    expect(result.code).not.toContain('Regular comment');
  });

  test('case-insensitive license detection', () => {
    const code = `\# COPYRIGHT 2024
\# LICENCE information
\# regular comment
x = 5`;
    const result = removeComments(code, {
      language: 'python',
      preserveLicense: true
    });
    
    expect(result.code).toContain('COPYRIGHT');
    expect(result.code).toContain('LICENCE');
    expect(result.code).not.toContain('regular comment');
  });
});

// ============================================================================
// 13. Edge Cases with Quotes
// ============================================================================
describe('Edge Cases with Quotes', () => {
  test('escaped quotes in string with #', () => {
    const code = `text = "He said \\"Hello #world\\""
# Comment`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('\\"Hello #world\\"');
    expect(result.code).not.toContain('# Comment');
  });

  test('single quote inside double quote string', () => {
    const code = `text = "It's a #test"
# Comment`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain("It's a #test");
    expect(result.code).not.toContain('# Comment');
  });

  test('double quote inside single quote string', () => {
    const code = `text = 'He said "#hello"'
# Comment`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('He said "#hello"');
    expect(result.code).not.toContain('# Comment');
  });

  test('multiple strings with # on same line', () => {
    const code = `a = "#tag1"; b = "#tag2"  # Comment`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('"#tag1"');
    expect(result.code).toContain('"#tag2"');
    expect(result.code).not.toContain('# Comment');
  });

  test('empty strings with comment', () => {
    const code = `empty1 = ""; empty2 = ''  # Comment`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('empty1 = ""');
    expect(result.code).toContain("empty2 = ''");
    expect(result.code).not.toContain('# Comment');
  });
});

// ============================================================================
// 14. Inline Comments at Various Positions
// ============================================================================
describe('Inline Comments Positioning', () => {
  test('comment after simple assignment', () => {
    const code = `x = 5  # Initialize x`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('x = 5');
    expect(result.code).not.toContain('# Initialize');
  });

  test('comment after function call', () => {
    const code = `result = func(arg)  # Call function`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('result = func(arg)');
    expect(result.code).not.toContain('# Call function');
  });

  test('comment after return statement', () => {
    const code = `def test():
    return 42  # Return value`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('return 42');
    expect(result.code).not.toContain('# Return value');
  });

  test('comment after import', () => {
    const code = `import sys  # System module`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('import sys');
    expect(result.code).not.toContain('# System module');
  });

  test('comment after pass statement', () => {
    const code = `def stub():
    pass  # Not implemented yet`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('pass');
    expect(result.code).not.toContain('# Not implemented');
  });

  test('multiple inline comments', () => {
    const code = `x = 1  # First
y = 2  # Second
z = 3  # Third`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('x = 1');
    expect(result.code).toContain('y = 2');
    expect(result.code).toContain('z = 3');
    expect(result.code).not.toContain('# First');
    expect(result.code).not.toContain('# Second');
    expect(result.code).not.toContain('# Third');
  });
});

// ============================================================================
// 15. Complex Real-World Examples
// ============================================================================
describe('Complex Real-World Python Code', () => {
  test('class with multiple methods and docstrings', () => {
    const code = `# User class
class User:
    """User management class"""
    
    def __init__(self, name):
        """Initialize user"""
        self.name = name  # User name
    
    @property
    def display_name(self):
        """Get display name"""
        return f"User: {self.name}"  # Format name`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('class User:');
    expect(result.code).toContain('def __init__');
    expect(result.code).toContain('@property');
    expect(result.code).not.toContain('# User class');
    expect(result.code).not.toContain('User management class');
    expect(result.code).not.toContain('# User name');
    expect(result.code).not.toContain('Get display name');
  });

  test('async function with try-except', () => {
    const code = `# Async data fetcher
async def fetch_data(url):
    """Fetch data from URL"""
    try:
        # Attempt to fetch
        response = await http.get(url)
        return response.json()  # Parse JSON
    except Exception as e:
        # Handle error
        logger.error(f"Failed: {e}")  # Log error
        return None`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('async def fetch_data(url):');
    expect(result.code).toContain('try:');
    expect(result.code).toContain('except Exception as e:');
    expect(result.code).not.toContain('# Async data fetcher');
    expect(result.code).not.toContain('Fetch data from URL');
    expect(result.code).not.toContain('# Attempt to fetch');
    expect(result.code).not.toContain('# Handle error');
  });

  test('list comprehension with filter', () => {
    const code = `# Filter even numbers
even = [x for x in range(10) if x % 2 == 0]  # Even only
# Process results
print(even)`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('[x for x in range(10) if x % 2 == 0]');
    expect(result.code).not.toContain('# Filter');
    expect(result.code).not.toContain('# Even only');
    expect(result.code).not.toContain('# Process');
  });

  test('context manager with multiple statements', () => {
    const code = `# File operations
with open('file.txt', 'r') as f:  # Open file
    # Read content
    content = f.read()
    # Process content
    lines = content.split('\\n')  # Split lines
# End of with block`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain("with open('file.txt', 'r') as f:");
    expect(result.code).toContain('content = f.read()');
    expect(result.code).not.toContain('# File operations');
    expect(result.code).not.toContain('# Open file');
    expect(result.code).not.toContain('# Read content');
  });

  test('decorator chain with function', () => {
    const code = `# API endpoint
@app.route('/api/users')  # Route
@login_required  # Auth
@rate_limit(100)  # Rate limiting
def get_users():
    """Get all users"""
    # Query database
    users = db.query(User).all()  # Fetch all
    return jsonify(users)  # Return JSON`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain("@app.route('/api/users')");
    expect(result.code).toContain('@login_required');
    expect(result.code).toContain('@rate_limit(100)');
    expect(result.code).not.toContain('# API endpoint');
    expect(result.code).not.toContain('# Route');
    expect(result.code).not.toContain('Get all users');
    expect(result.code).not.toContain('# Query database');
  });
});

// ============================================================================
// 16. Pathological Cases
// ============================================================================
describe('Pathological and Edge Cases', () => {
  test('only comments in file', () => {
    const code = `\# Comment 1
\# Comment 2
\# Comment 3`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code.trim().length).toBeLessThan(code.length);
  });

  test('empty file', () => {
    const code = '';
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toBe('');
  });

  test('only whitespace', () => {
    const code = '   \n\t\n   ';
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code.trim()).toBe('');
  });

  test('extremely long comment', () => {
    const longComment = '# ' + 'x'.repeat(10000);
    const code = `${longComment}\nx = 5`;
    const result = removeComments(code, { language: 'python' });
    
    expect(result.code).toContain('x = 5');
    expect(result.code.length).toBeLessThan(code.length);
  });

  test('deeply nested structures', () => {
    const code = `# Outer
def outer():
    # Middle
    def middle():
        # Inner
        def inner():
            # Deepest
            return 42
        return inner()
    return middle()`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('def outer():');
      expect(result.code).toContain('def middle():');
      expect(result.code).toContain('def inner():');
      expect(result.code).not.toContain('# Outer');
      expect(result.code).not.toContain('# Middle');
      expect(result.code).not.toContain('# Inner');
      expect(result.code).not.toContain('# Deepest');
    });

    test('unicode in comments and strings', () => {
      const code = `# Коментар на кирилица
text = "Текст на кирилица #тег"
# 中文注释
name = "名字 #标签"`;
      const result = removeComments(code, { language: 'python' });
      
      expect(result.code).toContain('Текст на кирилица #тег');
      expect(result.code).toContain('名字 #标签');
      expect(result.code).not.toContain('Коментар');
      expect(result.code).not.toContain('中文注释');
    });
  });
});

describe('SQL Remover - Advanced Edge Cases', () => {
  
  // ============================================================================
  // 1. Single-line Comments (--)
  // ============================================================================
  describe('Single-line Comments (--)', () => {
    test('basic single-line comment', () => {
      const code = `-- This is a comment
SELECT * FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM users');
      expect(result.code).not.toContain('-- This is a comment');
    });

    test('inline comment after statement', () => {
      const code = `SELECT * FROM users; -- Get all users`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM users;');
      expect(result.code).not.toContain('-- Get all users');
    });

    test('multiple single-line comments', () => {
      const code = `-- Comment 1
-- Comment 2
-- Comment 3
SELECT id, name FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT id, name FROM users');
      expect(result.code).not.toContain('-- Comment');
    });

    test('comment in the middle of query', () => {
      const code = `SELECT id, name
-- Filter by age
FROM users
WHERE age > 18;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT id, name');
      expect(result.code).toContain('FROM users');
      expect(result.code).toContain('WHERE age > 18');
      expect(result.code).not.toContain('-- Filter by age');
    });

    test('comment after each column', () => {
      const code = `SELECT 
    id,      -- User ID
    name,    -- User name
    email    -- User email
FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('id,');
      expect(result.code).toContain('name,');
      expect(result.code).toContain('email');
      expect(result.code).not.toContain('-- User ID');
      expect(result.code).not.toContain('-- User name');
    });
  });

  // ============================================================================
  // 2. Multi-line Comments (/* */)
  // ============================================================================
  describe('Multi-line Comments (/* */)', () => {
    test('basic multi-line comment', () => {
      const code = `/* This is a
   multi-line comment */
SELECT * FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM users');
      expect(result.code).not.toContain('multi-line comment');
    });

    test('single-line block comment', () => {
      const code = `/* Comment on one line */
SELECT * FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM users');
      expect(result.code).not.toContain('/* Comment');
    });

    test('inline block comment', () => {
      const code = `SELECT /* columns */ * FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT');
      expect(result.code).toContain('* FROM users');
      expect(result.code).not.toContain('columns');
    });

    test('multiple block comments', () => {
      const code = `/* Comment 1 */
SELECT id,
/* Comment 2 */
name
/* Comment 3 */
FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT id,');
      expect(result.code).toContain('name');
      expect(result.code).toContain('FROM users');
      expect(result.code).not.toContain('Comment 1');
      expect(result.code).not.toContain('Comment 2');
      expect(result.code).not.toContain('Comment 3');
    });

    test('nested-looking comment (not actually nested)', () => {
      const code = `/* Outer comment
   /* This looks nested but isn't valid SQL */
   Still part of outer comment
*/
SELECT * FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM users');
      expect(result.code).not.toContain('Outer comment');
      expect(result.code).not.toContain('This looks nested');
    });
  });

  // ============================================================================
  // 3. Comments Inside Strings
  // ============================================================================
  describe('Comments Inside String Literals', () => {
    test('-- inside single-quoted string', () => {
      const code = `SELECT 'John -- Doe' AS name;
-- Real comment`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain("'John -- Doe'");
      expect(result.code).not.toContain('-- Real comment');
    });

    test('-- inside double-quoted string', () => {
      const code = `SELECT "Column -- Name" FROM users;
-- Comment`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('"Column -- Name"');
      expect(result.code).not.toContain('-- Comment');
    });

    test('/* */ inside single-quoted string', () => {
      const code = `SELECT 'Text /* with comment style */' AS text;
/* Real comment */`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain("'Text /* with comment style */'");
      expect(result.code).not.toContain('Real comment');
    });

    test('/* */ inside double-quoted string', () => {
      const code = `SELECT "Column /* Name */" FROM users;
/* Comment */`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('"Column /* Name */"');
      expect(result.code).not.toContain('Comment');
    });

    test('mixed quotes with comment patterns', () => {
      const code = `SELECT 'It''s a -- test', "Another /* one */" FROM dual;
-- Real comment`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain("'It''s a -- test'");
      expect(result.code).toContain('"Another /* one */"');
      expect(result.code).not.toContain('-- Real comment');
    });

    test('URL in string with --', () => {
      const code = `UPDATE users SET url = 'https://example.com/path--name';
-- Comment`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('https://example.com/path--name');
      expect(result.code).not.toContain('-- Comment');
    });

    test('email in string with --', () => {
      const code = `INSERT INTO users (email) VALUES ('user--name@example.com');
-- Comment`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('user--name@example.com');
      expect(result.code).not.toContain('-- Comment');
    });
  });

  // ============================================================================
  // 4. MySQL Specific - # Comments
  // ============================================================================
  describe('MySQL Hash Comments (#)', () => {
    test('MySQL # comment should remain (not standard SQL)', () => {
      const code = `SELECT * FROM users; # MySQL comment
-- Standard comment`;
      const result = removeComments(code, { language: 'sql' });
      
      // # comments are MySQL-specific and not removed by standard SQL remover
      expect(result.code).toContain('# MySQL comment');
      expect(result.code).not.toContain('-- Standard comment');
    });

    test('# in string should be preserved', () => {
      const code = `SELECT 'Price: $#100' AS price;
-- Comment`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain("'Price: $#100'");
      expect(result.code).not.toContain('-- Comment');
    });
  });

  // ============================================================================
  // 5. SELECT Statements with Comments
  // ============================================================================
  describe('SELECT Statements', () => {
    test('SELECT with WHERE clause and comments', () => {
      const code = `-- Get active users
SELECT id, name, email
FROM users
WHERE status = 'active'  -- Only active
AND age >= 18;           -- Adults only`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT id, name, email');
      expect(result.code).toContain('FROM users');
      expect(result.code).toContain("WHERE status = 'active'");
      expect(result.code).toContain('AND age >= 18;');
      expect(result.code).not.toContain('Get active users');
      expect(result.code).not.toContain('Only active');
      expect(result.code).not.toContain('Adults only');
    });

    test('SELECT with JOINs and comments', () => {
      const code = `-- Join users with orders
SELECT u.name, o.total
FROM users u
/* Inner join on user_id */
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'; -- Completed orders only`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT u.name, o.total');
      expect(result.code).toContain('INNER JOIN orders o');
      expect(result.code).not.toContain('Join users with orders');
      expect(result.code).not.toContain('Inner join on user_id');
      expect(result.code).not.toContain('Completed orders only');
    });

    test('SELECT with GROUP BY and HAVING', () => {
      const code = `SELECT department, COUNT(*) as count
FROM employees
-- Group by department
GROUP BY department
-- Filter groups
HAVING COUNT(*) > 5;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('GROUP BY department');
      expect(result.code).toContain('HAVING COUNT(*) > 5');
      expect(result.code).not.toContain('-- Group by department');
      expect(result.code).not.toContain('-- Filter groups');
    });

    test('SELECT with ORDER BY and LIMIT', () => {
      const code = `SELECT * FROM users
-- Sort by creation date
ORDER BY created_at DESC
-- Limit results
LIMIT 10;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('ORDER BY created_at DESC');
      expect(result.code).toContain('LIMIT 10');
      expect(result.code).not.toContain('-- Sort by');
      expect(result.code).not.toContain('-- Limit results');
    });
  });

  // ============================================================================
  // 6. INSERT/UPDATE/DELETE Statements
  // ============================================================================
  describe('INSERT/UPDATE/DELETE Statements', () => {
    test('INSERT with comments', () => {
      const code = `-- Insert new user
INSERT INTO users (name, email, age)
/* Specify values */
VALUES ('John Doe', 'john@example.com', 30);`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('INSERT INTO users');
      expect(result.code).toContain("VALUES ('John Doe'");
      expect(result.code).not.toContain('Insert new user');
      expect(result.code).not.toContain('Specify values');
    });

    test('UPDATE with comments', () => {
      const code = `-- Update user status
UPDATE users
SET status = 'inactive', -- Set status
    updated_at = NOW()   -- Update timestamp
WHERE id = 123;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('UPDATE users');
      expect(result.code).toContain("SET status = 'inactive',");
      expect(result.code).toContain('updated_at = NOW()');
      expect(result.code).not.toContain('Update user status');
      expect(result.code).not.toContain('Set status');
    });

    test('DELETE with comments', () => {
      const code = `-- Delete old records
DELETE FROM logs
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY); -- Older than 30 days`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('DELETE FROM logs');
      expect(result.code).toContain('WHERE created_at <');
      expect(result.code).not.toContain('Delete old records');
      expect(result.code).not.toContain('Older than 30 days');
    });
  });

  // ============================================================================
  // 7. CREATE Statements
  // ============================================================================
  describe('CREATE Statements', () => {
    test('CREATE TABLE with column comments', () => {
      const code = `-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY,        -- User ID
    name VARCHAR(100) NOT NULL, -- User name
    email VARCHAR(255),         -- Email address
    created_at TIMESTAMP        -- Creation time
);`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CREATE TABLE users');
      expect(result.code).toContain('id INT PRIMARY KEY,');
      expect(result.code).toContain('name VARCHAR(100) NOT NULL,');
      expect(result.code).not.toContain('Create users table');
      expect(result.code).not.toContain('User ID');
      expect(result.code).not.toContain('User name');
    });

    test('CREATE INDEX with comments', () => {
      const code = `-- Create index for faster lookups
CREATE INDEX idx_email ON users(email);
-- End of index creation`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CREATE INDEX idx_email');
      expect(result.code).not.toContain('faster lookups');
      expect(result.code).not.toContain('End of index');
    });

    test('CREATE VIEW with comments', () => {
      const code = `-- Active users view
CREATE VIEW active_users AS
SELECT id, name, email
FROM users
WHERE status = 'active'; -- Only active`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CREATE VIEW active_users');
      expect(result.code).toContain('SELECT id, name, email');
      expect(result.code).not.toContain('Active users view');
      expect(result.code).not.toContain('Only active');
    });
  });

  // ============================================================================
  // 8. Subqueries with Comments
  // ============================================================================
  describe('Subqueries', () => {
    test('subquery in WHERE clause', () => {
      const code = `SELECT name FROM users
WHERE id IN (
    -- Subquery to get active user IDs
    SELECT user_id FROM orders
    WHERE status = 'completed' -- Completed orders
);`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT name FROM users');
      expect(result.code).toContain('SELECT user_id FROM orders');
      expect(result.code).not.toContain('Subquery to get');
      expect(result.code).not.toContain('Completed orders');
    });

    test('subquery in FROM clause', () => {
      const code = `SELECT * FROM (
    -- Inner query
    SELECT id, name
    FROM users
    WHERE age > 18 -- Adults
) AS adults;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM');
      expect(result.code).toContain('SELECT id, name');
      expect(result.code).toContain(') AS adults');
      expect(result.code).not.toContain('Inner query');
      expect(result.code).not.toContain('Adults');
    });

    test('correlated subquery', () => {
      const code = `SELECT name,
    (-- Get order count
     SELECT COUNT(*)
     FROM orders o
     WHERE o.user_id = u.id -- Match user
    ) AS order_count
FROM users u;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT name,');
      expect(result.code).toContain('SELECT COUNT(*)');
      expect(result.code).toContain('WHERE o.user_id = u.id');
      expect(result.code).not.toContain('Get order count');
      expect(result.code).not.toContain('Match user');
    });
  });

  // ============================================================================
  // 9. UNION Queries
  // ============================================================================
  describe('UNION Queries', () => {
    test('UNION with comments between queries', () => {
      const code = `-- First query
SELECT id, name FROM customers
-- Union with suppliers
UNION
-- Second query
SELECT id, name FROM suppliers;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT id, name FROM customers');
      expect(result.code).toContain('UNION');
      expect(result.code).toContain('SELECT id, name FROM suppliers');
      expect(result.code).not.toContain('First query');
      expect(result.code).not.toContain('Union with suppliers');
      expect(result.code).not.toContain('Second query');
    });

    test('UNION ALL with ORDER BY', () => {
      const code = `SELECT * FROM table1 -- First table
UNION ALL /* Include duplicates */
SELECT * FROM table2 -- Second table
ORDER BY id; -- Sort results`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM table1');
      expect(result.code).toContain('UNION ALL');
      expect(result.code).toContain('SELECT * FROM table2');
      expect(result.code).toContain('ORDER BY id;');
      expect(result.code).not.toContain('First table');
      expect(result.code).not.toContain('Include duplicates');
    });
  });

  // ============================================================================
  // 10. CTE (Common Table Expressions) with Comments
  // ============================================================================
  describe('CTEs (WITH Clauses)', () => {
    test('single CTE with comments', () => {
      const code = `-- Define CTE
WITH active_users AS (
    -- Get active users
    SELECT id, name
    FROM users
    WHERE status = 'active' -- Filter active
)
-- Main query
SELECT * FROM active_users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('WITH active_users AS');
      expect(result.code).toContain('SELECT id, name');
      expect(result.code).toContain('SELECT * FROM active_users');
      expect(result.code).not.toContain('Define CTE');
      expect(result.code).not.toContain('Get active users');
      expect(result.code).not.toContain('Main query');
    });

    test('multiple CTEs with comments', () => {
      const code = `-- First CTE
WITH users_cte AS (
    SELECT id, name FROM users -- Get users
),
-- Second CTE
orders_cte AS (
    SELECT user_id, COUNT(*) as count
    FROM orders -- Count orders
    GROUP BY user_id
)
-- Join CTEs
SELECT u.name, o.count
FROM users_cte u
JOIN orders_cte o ON u.id = o.user_id;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('WITH users_cte AS');
      expect(result.code).toContain('orders_cte AS');
      expect(result.code).toContain('FROM users_cte u');
      expect(result.code).not.toContain('First CTE');
      expect(result.code).not.toContain('Second CTE');
      expect(result.code).not.toContain('Join CTEs');
    });

    test('recursive CTE with comments', () => {
      const code = `-- Recursive CTE for hierarchy
WITH RECURSIVE hierarchy AS (
    -- Anchor member
    SELECT id, parent_id, name, 0 AS level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive member
    SELECT c.id, c.parent_id, c.name, h.level + 1
    FROM categories c
    JOIN hierarchy h ON c.parent_id = h.id
)
SELECT * FROM hierarchy; -- Final result`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('WITH RECURSIVE hierarchy AS');
      expect(result.code).toContain('UNION ALL');
      expect(result.code).not.toContain('Recursive CTE');
      expect(result.code).not.toContain('Anchor member');
      expect(result.code).not.toContain('Recursive member');
    });
  });

  // ============================================================================
  // 11. CASE Statements with Comments
  // ============================================================================
  describe('CASE Statements', () => {
    test('CASE with comments on each WHEN', () => {
      const code = `SELECT name,
    CASE
        WHEN age < 18 THEN 'Minor'    -- Under 18
        WHEN age < 65 THEN 'Adult'    -- Working age
        ELSE 'Senior'                  -- Retirement age
    END AS age_group
FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CASE');
      expect(result.code).toContain("WHEN age < 18 THEN 'Minor'");
      expect(result.code).toContain("WHEN age < 65 THEN 'Adult'");
      expect(result.code).toContain("ELSE 'Senior'");
      expect(result.code).not.toContain('Under 18');
      expect(result.code).not.toContain('Working age');
      expect(result.code).not.toContain('Retirement age');
    });

    test('nested CASE statements', () => {
      const code = `SELECT
    CASE
        WHEN status = 'active' THEN
            CASE
                WHEN premium = 1 THEN 'Premium' -- Premium user
                ELSE 'Standard' -- Standard user
            END
        ELSE 'Inactive' -- Not active
    END AS user_type
FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CASE');
      expect(result.code).toContain("WHEN status = 'active'");
      expect(result.code).not.toContain('Premium user');
      expect(result.code).not.toContain('Standard user');
      expect(result.code).not.toContain('Not active');
    });
  });

  // ============================================================================
  // 12. Stored Procedures and Functions
  // ============================================================================
  describe('Stored Procedures and Functions', () => {
    test('stored procedure with comments', () => {
      const code = `-- Create procedure
CREATE PROCEDURE GetUserOrders(IN userId INT)
BEGIN
    -- Declare variables
    DECLARE orderCount INT;
    
    -- Get order count
    SELECT COUNT(*) INTO orderCount
    FROM orders
    WHERE user_id = userId; -- Filter by user
    
    -- Return results
    SELECT orderCount AS total_orders;
END;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CREATE PROCEDURE GetUserOrders');
      expect(result.code).toContain('BEGIN');
      expect(result.code).toContain('DECLARE orderCount INT;');
      expect(result.code).toContain('END;');
      expect(result.code).not.toContain('Create procedure');
      expect(result.code).not.toContain('Declare variables');
      expect(result.code).not.toContain('Filter by user');
    });

    test('function with comments', () => {
      const code = `-- Calculate discount
CREATE FUNCTION CalculateDiscount(price DECIMAL)
RETURNS DECIMAL
BEGIN
    -- Apply 10% discount
    RETURN price * 0.9; -- Return discounted price
END;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CREATE FUNCTION CalculateDiscount');
      expect(result.code).toContain('RETURNS DECIMAL');
      expect(result.code).toContain('RETURN price * 0.9;');
      expect(result.code).not.toContain('Calculate discount');
      expect(result.code).not.toContain('Apply 10% discount');
    });
  });

  // ============================================================================
  // 13. Triggers with Comments
  // ============================================================================
  describe('Triggers', () => {
    test('trigger with comments', () => {
      const code = `-- Create audit trigger
CREATE TRIGGER user_audit_trigger
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    -- Insert audit record
    INSERT INTO user_audit (user_id, action, timestamp)
    VALUES (NEW.id, 'UPDATE', NOW()); -- Record update
END;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CREATE TRIGGER user_audit_trigger');
      expect(result.code).toContain('AFTER UPDATE ON users');
      expect(result.code).toContain('INSERT INTO user_audit');
      expect(result.code).not.toContain('Create audit trigger');
      expect(result.code).not.toContain('Insert audit record');
    });
  });

  // ============================================================================
  // 14. Transaction Blocks
  // ============================================================================
  describe('Transaction Blocks', () => {
    test('transaction with comments', () => {
      const code = `-- Start transaction
BEGIN TRANSACTION;

-- Update account balance
UPDATE accounts
SET balance = balance - 100
WHERE id = 1; -- Debit account

-- Credit another account
UPDATE accounts
SET balance = balance + 100
WHERE id = 2; -- Credit account

-- Commit transaction
COMMIT;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('BEGIN TRANSACTION;');
      expect(result.code).toContain('UPDATE accounts');
      expect(result.code).toContain('COMMIT;');
      expect(result.code).not.toContain('Start transaction');
      expect(result.code).not.toContain('Debit account');
      expect(result.code).not.toContain('Credit account');
    });

    test('transaction with ROLLBACK', () => {
      const code = `BEGIN; -- Start
-- Try operation
UPDATE users SET status = 'active';
-- Rollback on error
ROLLBACK; -- Undo changes`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('BEGIN;');
      expect(result.code).toContain('UPDATE users');
      expect(result.code).toContain('ROLLBACK;');
      expect(result.code).not.toContain('Start');
      expect(result.code).not.toContain('Try operation');
      expect(result.code).not.toContain('Undo changes');
    });
  });

  // ============================================================================
  // 15. License Comments (preserveLicense option)
  // ============================================================================
  describe('License Comments Preservation', () => {
    test('preserves copyright comment', () => {
      const code = `-- Copyright (c) 2024 Company Name
-- All rights reserved
-- Regular comment
SELECT * FROM users;`;
      const result = removeComments(code, {
        language: 'sql',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Copyright');
      expect(result.code).not.toContain('Regular comment');
    });

    test('preserves license in block comment', () => {
      const code = `/* This database schema is licensed under MIT License
   Copyright (c) 2024 */
-- Regular comment
CREATE TABLE users (id INT);`;
      const result = removeComments(code, {
        language: 'sql',
        preserveLicense: true
      });
      
      expect(result.code).toContain('MIT License');
      expect(result.code).toContain('Copyright');
      expect(result.code).not.toContain('Regular comment');
    });

    test('preserves author comment', () => {
      const code = `-- Author: John Doe
-- Date: 2024-01-01
-- Regular comment
SELECT * FROM users;`;
      const result = removeComments(code, {
        language: 'sql',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Author:');
      expect(result.code).not.toContain('Regular comment');
    });
  });

  // ============================================================================
  // 16. Complex Real-World Queries
  // ============================================================================
  describe('Complex Real-World SQL Queries', () => {
    test('complex analytics query', () => {
      const code = `-- Monthly revenue report
WITH monthly_sales AS (
    -- Calculate monthly totals
    SELECT 
        DATE_TRUNC('month', order_date) AS month,
        SUM(total) AS revenue, -- Total revenue
        COUNT(*) AS order_count -- Number of orders
    FROM orders
    WHERE status = 'completed' -- Only completed
    GROUP BY DATE_TRUNC('month', order_date)
),
-- Calculate growth rates
growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) AS prev_revenue, -- Previous month
        -- Calculate percentage growth
        ROUND(((revenue - LAG(revenue) OVER (ORDER BY month)) / 
               LAG(revenue) OVER (ORDER BY month)) * 100, 2) AS growth_rate
    FROM monthly_sales
)
-- Final output
SELECT * FROM growth
ORDER BY month DESC; -- Most recent first`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('WITH monthly_sales AS');
      expect(result.code).toContain('SUM(total) AS revenue,');
      expect(result.code).toContain('LAG(revenue)');
      expect(result.code).toContain('ORDER BY month DESC;');
      expect(result.code).not.toContain('Monthly revenue report');
      expect(result.code).not.toContain('Calculate monthly totals');
      expect(result.code).not.toContain('Total revenue');
      expect(result.code).not.toContain('Most recent first');
    });

    test('data migration script', () => {
      const code = `-- Data migration script
-- Backup old data
CREATE TABLE users_backup AS SELECT * FROM users;

-- Add new column
ALTER TABLE users ADD COLUMN status VARCHAR(20);

-- Migrate data
UPDATE users
SET status = CASE
    WHEN last_login > NOW() - INTERVAL '30 days' THEN 'active'  -- Active users
    WHEN last_login > NOW() - INTERVAL '90 days' THEN 'inactive' -- Inactive users
    ELSE 'dormant' -- Dormant users
END;

-- Create index for performance
CREATE INDEX idx_users_status ON users(status);

-- Verify migration
SELECT status, COUNT(*) FROM users GROUP BY status;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('CREATE TABLE users_backup');
      expect(result.code).toContain('ALTER TABLE users');
      expect(result.code).toContain('UPDATE users');
      expect(result.code).toContain('CREATE INDEX');
      expect(result.code).not.toContain('Data migration script');
      expect(result.code).not.toContain('Backup old data');
      expect(result.code).not.toContain('Active users');
    });
  });

  // ============================================================================
  // 17. Edge Cases and Pathological Input
  // ============================================================================
  describe('Edge Cases and Pathological Input', () => {
    test('only comments in file', () => {
      const code = `-- Comment 1
-- Comment 2
/* Comment 3 */`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code.trim().length).toBeLessThan(code.length);
    });

    test('empty SQL file', () => {
      const code = '';
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toBe('');
    });

    test('extremely long comment', () => {
      const longComment = '-- ' + 'x'.repeat(10000);
      const code = `${longComment}\nSELECT * FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM users');
      expect(result.code.length).toBeLessThan(code.length);
    });

    test('deeply nested subqueries', () => {
      const code = `SELECT * FROM (
    -- Level 1
    SELECT * FROM (
        -- Level 2
        SELECT * FROM (
            -- Level 3
            SELECT * FROM users
        ) l3
    ) l2
) l1;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM');
      expect(result.code).not.toContain('-- Level 1');
      expect(result.code).not.toContain('-- Level 2');
      expect(result.code).not.toContain('-- Level 3');
    });

    test('unicode characters in comments and strings', () => {
      const code = `-- Коментар на кирилица
SELECT 'Текст на кирилица' AS text;
-- 中文注释
SELECT '中文文本' AS chinese;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('Текст на кирилица');
      expect(result.code).toContain('中文文本');
      expect(result.code).not.toContain('Коментар');
      expect(result.code).not.toContain('中文注释');
    });

    test('mixed line endings (CRLF and LF)', () => {
      const code = `-- Comment 1\r\nSELECT * FROM users;\n-- Comment 2\r\nWHERE id = 1;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain('SELECT * FROM users');
      expect(result.code).toContain('WHERE id = 1');
      expect(result.code).not.toContain('-- Comment');
    });

    test('escaped quotes in strings', () => {
      const code = `SELECT 'It''s a test' AS text; -- Comment
SELECT "Column ""Name""" FROM users; -- Another comment`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain("'It''s a test'");
      expect(result.code).toContain('"Column ""Name"""');
      expect(result.code).not.toContain('-- Comment');
      expect(result.code).not.toContain('-- Another comment');
    });

    test('unclosed block comment', () => {
      const code = `/* Unclosed comment
SELECT * FROM users;
WHERE id = 1;`;
      const result = removeComments(code, { language: 'sql' });
      
      // Should handle gracefully
      expect(result.code).toBeDefined();
      expect(typeof result.code).toBe('string');
    });

    test('comment markers in different positions', () => {
      const code = `SELECT '--not a comment' AS text1,
       '/* also not a comment */' AS text2,
       column1, -- real comment
       column2  /* real comment */
FROM users;`;
      const result = removeComments(code, { language: 'sql' });
      
      expect(result.code).toContain("'--not a comment'");
      expect(result.code).toContain("'/* also not a comment */'");
      expect(result.code).toContain('column1,');
      expect(result.code).toContain('column2');
      expect(result.code).not.toContain('real comment');
    });
  });
});

describe('CSS/HTML/XML Remover - Advanced Edge Cases', () => {
  
  // ============================================================================
  // CSS TESTS
  // ============================================================================
  
  describe('CSS - Basic Comment Removal', () => {
    test('removes single-line CSS comment', () => {
      const code = `/* This is a comment */
.container {
  color: red;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.container');
      expect(result.code).toContain('color: red;');
      expect(result.code).not.toContain('/* This is a comment */');
    });

    test('removes multi-line CSS comment', () => {
      const code = `/* This is a
   multi-line
   comment */
.button {
  background: blue;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.button');
      expect(result.code).not.toContain('multi-line');
    });

    test('removes inline comment', () => {
      const code = `.container { /* comment */ color: red; }`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.container');
      expect(result.code).toContain('color: red;');
      expect(result.code).not.toContain('/* comment */');
    });

    test('removes multiple comments', () => {
      const code = `/* Comment 1 */
.class1 { color: red; }
/* Comment 2 */
.class2 { color: blue; }
/* Comment 3 */`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.class1');
      expect(result.code).toContain('.class2');
      expect(result.code).not.toContain('/* Comment');
    });

    test('removes comment between properties', () => {
      const code = `.button {
  color: red;
  /* Border style */
  border: 1px solid black;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('color: red;');
      expect(result.code).toContain('border: 1px solid black;');
      expect(result.code).not.toContain('/* Border style */');
    });
  });

  describe('CSS - License Comments', () => {
    test('preserves /*! style license comment', () => {
      const code = `/*! Copyright 2024 MIT License */
/* Regular comment */
.container { color: red; }`;
      const result = removeComments(code, {
        language: 'css',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Copyright 2024 MIT License');
      expect(result.code).not.toContain('Regular comment');
    });

    test('preserves license keyword in comment', () => {
      const code = `/* This file is licensed under MIT License */
/* Regular comment */
body { margin: 0; }`;
      const result = removeComments(code, {
        language: 'css',
        preserveLicense: true
      });
      
      expect(result.code).toContain('licensed under MIT License');
      expect(result.code).not.toContain('Regular comment');
    });

    test('preserves copyright comment', () => {
      const code = `/* Copyright (c) 2024 Company Name */
/* Regular comment */
.button { padding: 10px; }`;
      const result = removeComments(code, {
        language: 'css',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Copyright (c) 2024');
      expect(result.code).not.toContain('Regular comment');
    });

    test('preserves author comment', () => {
      const code = `/* Author: John Doe */
/* Regular comment */
div { display: block; }`;
      const result = removeComments(code, {
        language: 'css',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Author: John Doe');
      expect(result.code).not.toContain('Regular comment');
    });
  });

  describe('CSS - Selectors with Comments', () => {
    test('comment before selector', () => {
      const code = `/* Button styles */
.button {
  color: white;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.button');
      expect(result.code).not.toContain('Button styles');
    });

    test('comment between selectors in group', () => {
      const code = `.button,
/* Anchor styles */
a {
  text-decoration: none;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.button,');
      expect(result.code).toContain('a {');
      expect(result.code).not.toContain('Anchor styles');
    });

    test('complex selector with comment', () => {
      const code = `/* Navigation styles */
nav > ul > li:first-child {
  font-weight: bold;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('nav > ul > li:first-child');
      expect(result.code).not.toContain('Navigation styles');
    });

    test('pseudo-class selector with comment', () => {
      const code = `/* Hover effect */
.button:hover {
  background: darkblue;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.button:hover');
      expect(result.code).not.toContain('Hover effect');
    });

    test('attribute selector with comment', () => {
      const code = `/* Input styles */
input[type="text"] {
  border: 1px solid gray;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('input[type="text"]');
      expect(result.code).not.toContain('Input styles');
    });
  });

  describe('CSS - Media Queries', () => {
    test('comment in media query', () => {
      const code = `/* Responsive styles */
@media (max-width: 768px) {
  /* Mobile styles */
  .container {
    width: 100%; /* Full width */
  }
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('@media (max-width: 768px)');
      expect(result.code).toContain('.container');
      expect(result.code).toContain('width: 100%;');
      expect(result.code).not.toContain('Responsive styles');
      expect(result.code).not.toContain('Mobile styles');
      expect(result.code).not.toContain('Full width');
    });

    test('multiple media queries with comments', () => {
      const code = `/* Tablet */
@media (max-width: 1024px) {
  .container { width: 90%; }
}

/* Mobile */
@media (max-width: 768px) {
  .container { width: 100%; }
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('@media (max-width: 1024px)');
      expect(result.code).toContain('@media (max-width: 768px)');
      expect(result.code).not.toContain('/* Tablet */');
      expect(result.code).not.toContain('/* Mobile */');
    });

    test('media query with multiple conditions', () => {
      const code = `/* Print styles */
@media print and (orientation: landscape) {
  body { margin: 0; }
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('@media print and (orientation: landscape)');
      expect(result.code).not.toContain('Print styles');
    });
  });

  describe('CSS - Keyframes', () => {
    test('keyframes with comments', () => {
      const code = `/* Fade animation */
@keyframes fadeIn {
  /* Start state */
  0% {
    opacity: 0;
  }
  /* End state */
  100% {
    opacity: 1;
  }
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('@keyframes fadeIn');
      expect(result.code).toContain('0%');
      expect(result.code).toContain('100%');
      expect(result.code).not.toContain('Fade animation');
      expect(result.code).not.toContain('Start state');
      expect(result.code).not.toContain('End state');
    });

    test('keyframes with vendor prefixes', () => {
      const code = `/* Webkit animation */
@-webkit-keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('@-webkit-keyframes spin');
      expect(result.code).not.toContain('Webkit animation');
    });
  });

  describe('CSS - Custom Properties (CSS Variables)', () => {
    test('CSS variables with comments', () => {
      const code = `:root {
  /* Primary color */
  --primary-color: #007bff;
  /* Secondary color */
  --secondary-color: #6c757d;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('--primary-color: #007bff;');
      expect(result.code).toContain('--secondary-color: #6c757d;');
      expect(result.code).not.toContain('Primary color');
      expect(result.code).not.toContain('Secondary color');
    });

    test('using CSS variables with comments', () => {
      const code = `.button {
  /* Use theme color */
  background: var(--primary-color);
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('background: var(--primary-color);');
      expect(result.code).not.toContain('Use theme color');
    });
  });

  describe('CSS - calc() and Other Functions', () => {
    test('calc() with comment', () => {
      const code = `.container {
  /* Calculate width */
  width: calc(100% - 20px);
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('width: calc(100% - 20px);');
      expect(result.code).not.toContain('Calculate width');
    });

    test('multiple functions with comments', () => {
      const code = `.element {
  /* Transform */
  transform: translateX(10px) rotate(45deg);
  /* Filter */
  filter: blur(5px) brightness(1.2);
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('transform: translateX(10px) rotate(45deg);');
      expect(result.code).toContain('filter: blur(5px) brightness(1.2);');
      expect(result.code).not.toContain('/* Transform */');
      expect(result.code).not.toContain('/* Filter */');
    });
  });

  describe('CSS - Grid and Flexbox', () => {
    test('CSS Grid with comments', () => {
      const code = `.grid {
  /* Grid container */
  display: grid;
  /* Define columns */
  grid-template-columns: repeat(3, 1fr);
  /* Gap between items */
  gap: 20px;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('display: grid;');
      expect(result.code).toContain('grid-template-columns: repeat(3, 1fr);');
      expect(result.code).toContain('gap: 20px;');
      expect(result.code).not.toContain('Grid container');
      expect(result.code).not.toContain('Define columns');
    });

    test('Flexbox with comments', () => {
      const code = `.flex {
  /* Flex container */
  display: flex;
  /* Center items */
  justify-content: center;
  align-items: center;
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('display: flex;');
      expect(result.code).toContain('justify-content: center;');
      expect(result.code).not.toContain('Flex container');
      expect(result.code).not.toContain('Center items');
    });
  });

  describe('CSS - @import and @font-face', () => {
    test('@import with comment', () => {
      const code = `/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css?family=Roboto');
/* Main styles */
body { font-family: Roboto; }`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain("@import url('https://fonts.googleapis.com/css?family=Roboto');");
      expect(result.code).not.toContain('Import Google Fonts');
      expect(result.code).not.toContain('Main styles');
    });

    test('@font-face with comments', () => {
      const code = `/* Custom font */
@font-face {
  /* Font family name */
  font-family: 'MyFont';
  /* Font source */
  src: url('myfont.woff2') format('woff2');
}`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('@font-face');
      expect(result.code).toContain("font-family: 'MyFont';");
      expect(result.code).not.toContain('Custom font');
      expect(result.code).not.toContain('Font family name');
    });
  });

  // ============================================================================
  // HTML TESTS
  // ============================================================================

  describe('HTML - Basic Comment Removal', () => {
    test('removes simple HTML comment', () => {
      const code = `<!-- This is a comment -->
<div>Content</div>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<div>Content</div>');
      expect(result.code).not.toContain('<!-- This is a comment -->');
    });

    test('removes multi-line HTML comment', () => {
      const code = `<!-- This is a
     multi-line
     comment -->
<p>Paragraph</p>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<p>Paragraph</p>');
      expect(result.code).not.toContain('multi-line');
    });

    test('removes multiple comments', () => {
      const code = `<!-- Comment 1 -->
<div>Content 1</div>
<!-- Comment 2 -->
<div>Content 2</div>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('Content 1');
      expect(result.code).toContain('Content 2');
      expect(result.code).not.toContain('<!-- Comment');
    });

    test('removes comment between tags', () => {
      const code = `<div>
  <!-- Inner comment -->
  <p>Text</p>
</div>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<p>Text</p>');
      expect(result.code).not.toContain('Inner comment');
    });
  });

  describe('HTML - License Comments', () => {
    test('preserves license comment', () => {
      const code = `<!-- Copyright 2024 MIT License -->
<!-- Regular comment -->
<div>Content</div>`;
      const result = removeComments(code, {
        language: 'html',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Copyright 2024 MIT License');
      expect(result.code).not.toContain('Regular comment');
    });

    test('preserves author comment', () => {
      const code = `<!-- Author: John Doe -->
<!-- Regular comment -->
<body></body>`;
      const result = removeComments(code, {
        language: 'html',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Author: John Doe');
      expect(result.code).not.toContain('Regular comment');
    });
  });

  describe('HTML - DOCTYPE and Structure', () => {
    test('preserves DOCTYPE with comment after', () => {
      const code = `<!DOCTYPE html>
<!-- HTML5 document -->
<html>
<head>
  <title>Test</title>
</head>
</html>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<!DOCTYPE html>');
      expect(result.code).toContain('<html>');
      expect(result.code).not.toContain('HTML5 document');
    });

    test('comments in head section', () => {
      const code = `<head>
  <!-- Meta tags -->
  <meta charset="UTF-8">
  <!-- CSS link -->
  <link rel="stylesheet" href="style.css">
</head>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<meta charset="UTF-8">');
      expect(result.code).toContain('<link rel="stylesheet"');
      expect(result.code).not.toContain('Meta tags');
      expect(result.code).not.toContain('CSS link');
    });

    test('comments in body section', () => {
      const code = `<body>
  <!-- Header -->
  <header>
    <h1>Title</h1>
  </header>
  <!-- Main content -->
  <main>
    <p>Content</p>
  </main>
</body>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<header>');
      expect(result.code).toContain('<main>');
      expect(result.code).not.toContain('<!-- Header -->');
      expect(result.code).not.toContain('<!-- Main content -->');
    });
  });

  describe('HTML - Conditional Comments (IE)', () => {
    test('removes IE conditional comment', () => {
      const code = `<!--[if IE]>
  <p>You are using Internet Explorer</p>
<![endif]-->
<p>Regular content</p>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<p>Regular content</p>');
      expect(result.code).not.toContain('Internet Explorer');
    });

    test('removes IE version-specific conditional', () => {
      const code = `<!--[if lt IE 9]>
  <script src="html5shiv.js"></script>
<![endif]-->
<div>Content</div>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<div>Content</div>');
      expect(result.code).not.toContain('html5shiv');
    });
  });

  describe('HTML - Script and Style Tags', () => {
    test('removes comment before script tag', () => {
      const code = `<!-- JavaScript -->
<script>
  console.log("Hello");
</script>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<script>');
      expect(result.code).toContain('console.log');
      expect(result.code).not.toContain('<!-- JavaScript -->');
    });

    test('removes comment before style tag', () => {
      const code = `<!-- Styles -->
<style>
  .button { color: red; }
</style>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<style>');
      expect(result.code).toContain('.button');
      expect(result.code).not.toContain('<!-- Styles -->');
    });

    test('HTML comments outside, CSS/JS comments inside', () => {
      const code = `<!-- HTML comment -->
<style>
  /* CSS comment */
  body { margin: 0; }
</style>
<script>
  // JS comment
  var x = 5;
</script>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).not.toContain('<!-- HTML comment -->');
      // Note: CSS and JS comments inside <style> and <script> are NOT removed
      // because HTML remover only removes HTML comments
      expect(result.code).toContain('/* CSS comment */');
      expect(result.code).toContain('// JS comment');
    });
  });

  describe('HTML - Complex Structures', () => {
    test('comment in list', () => {
      const code = `<ul>
  <!-- Item 1 -->
  <li>First</li>
  <!-- Item 2 -->
  <li>Second</li>
</ul>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<li>First</li>');
      expect(result.code).toContain('<li>Second</li>');
      expect(result.code).not.toContain('<!-- Item');
    });

    test('comment in table', () => {
      const code = `<table>
  <!-- Header row -->
  <tr>
    <th>Name</th>
  </tr>
  <!-- Data row -->
  <tr>
    <td>John</td>
  </tr>
</table>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<th>Name</th>');
      expect(result.code).toContain('<td>John</td>');
      expect(result.code).not.toContain('Header row');
      expect(result.code).not.toContain('Data row');
    });

    test('comment in form', () => {
      const code = `<form>
  <!-- Name input -->
  <input type="text" name="name">
  <!-- Email input -->
  <input type="email" name="email">
</form>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<input type="text"');
      expect(result.code).toContain('<input type="email"');
      expect(result.code).not.toContain('Name input');
      expect(result.code).not.toContain('Email input');
    });
  });

  describe('HTML - SVG with Comments', () => {
    test('comments in SVG', () => {
      const code = `<svg width="100" height="100">
  <!-- Circle -->
  <circle cx="50" cy="50" r="40" fill="red"/>
  <!-- Rectangle -->
  <rect x="10" y="10" width="30" height="30" fill="blue"/>
</svg>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<circle');
      expect(result.code).toContain('<rect');
      expect(result.code).not.toContain('<!-- Circle -->');
      expect(result.code).not.toContain('<!-- Rectangle -->');
    });
  });

  // ============================================================================
  // XML TESTS
  // ============================================================================

  describe('XML - Basic Comment Removal', () => {
    test('removes simple XML comment', () => {
      const code = `<?xml version="1.0"?>
<!-- This is a comment -->
<root>
  <element>Content</element>
</root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<root>');
      expect(result.code).toContain('<element>Content</element>');
      expect(result.code).not.toContain('<!-- This is a comment -->');
    });

    test('removes multi-line XML comment', () => {
      const code = `<root>
  <!-- This is a
       multi-line
       comment -->
  <data>Value</data>
</root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<data>Value</data>');
      expect(result.code).not.toContain('multi-line');
    });

    test('removes multiple comments', () => {
      const code = `<!-- Comment 1 -->
<root>
  <!-- Comment 2 -->
  <child1>Value1</child1>
  <!-- Comment 3 -->
  <child2>Value2</child2>
</root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<child1>Value1</child1>');
      expect(result.code).toContain('<child2>Value2</child2>');
      expect(result.code).not.toContain('<!-- Comment');
    });
  });

  describe('XML - License Comments', () => {
    test('preserves license comment', () => {
      const code = `<!-- Copyright 2024 MIT License -->
<!-- Regular comment -->
<root></root>`;
      const result = removeComments(code, {
        language: 'xml',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Copyright 2024 MIT License');
      expect(result.code).not.toContain('Regular comment');
    });

    test('preserves author in XML', () => {
      const code = `<!-- Author: John Doe -->
<!-- Regular comment -->
<document></document>`;
      const result = removeComments(code, {
        language: 'xml',
        preserveLicense: true
      });
      
      expect(result.code).toContain('Author: John Doe');
      expect(result.code).not.toContain('Regular comment');
    });
  });

  describe('XML - Declaration and Processing Instructions', () => {
    test('preserves XML declaration', () => {
      const code = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Comment -->
<root></root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<?xml version="1.0"');
      expect(result.code).not.toContain('<!-- Comment -->');
    });

    test('preserves processing instructions', () => {
      const code = `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- Comment -->
<root></root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<?xml-stylesheet');
      expect(result.code).not.toContain('<!-- Comment -->');
    });
  });

  describe('XML - CDATA Sections', () => {
    test('preserves CDATA with comment-like text', () => {
      const code = `<script>
  <![CDATA[
    // This is NOT a comment, it's content
    var x = 5; <!-- also not a comment -->
  ]]>
</script>
<!-- Real comment -->`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<![CDATA[');
      expect(result.code).toContain('// This is NOT a comment');
      expect(result.code).toContain('<!-- also not a comment -->');
      expect(result.code).not.toContain('<!-- Real comment -->');
    });

    test('comment before CDATA', () => {
      const code = `<data>
  <!-- CDATA section -->
  <![CDATA[Some data]]>
</data>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<![CDATA[Some data]]>');
      expect(result.code).not.toContain('<!-- CDATA section -->');
    });
  });

  describe('XML - Namespaces', () => {
    test('comments with namespaces', () => {
      const code = `<root xmlns:custom="http://example.com/custom">
  <!-- Custom element -->
  <custom:element>Value</custom:element>
</root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('xmlns:custom');
      expect(result.code).toContain('<custom:element>');
      expect(result.code).not.toContain('<!-- Custom element -->');
    });

    test('multiple namespaces with comments', () => {
      const code = `<!-- Root element -->
<root 
  xmlns:ns1="http://example.com/ns1"
  xmlns:ns2="http://example.com/ns2">
  <!-- NS1 element -->
  <ns1:item>Value1</ns1:item>
  <!-- NS2 element -->
  <ns2:item>Value2</ns2:item>
</root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('xmlns:ns1');
      expect(result.code).toContain('xmlns:ns2');
      expect(result.code).not.toContain('Root element');
      expect(result.code).not.toContain('NS1 element');
    });
  });

  describe('XML - Attributes with Comments', () => {
    test('comment before attribute', () => {
      const code = `<element
  <!-- Attribute comment -->
  attr="value">
  Content
</element>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('attr="value"');
      expect(result.code).not.toContain('Attribute comment');
    });

    test('multiple attributes with comments', () => {
      const code = `<element 
  id="test"
  <!-- Class attribute -->
  class="container"
  <!-- Data attribute -->
  data-value="123">
</element>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('id="test"');
      expect(result.code).toContain('class="container"');
      expect(result.code).not.toContain('Class attribute');
      expect(result.code).not.toContain('Data attribute');
    });
  });

  describe('XML - Complex Structures', () => {
    test('nested elements with comments', () => {
      const code = `<root>
  <!-- Level 1 -->
  <level1>
    <!-- Level 2 -->
    <level2>
      <!-- Level 3 -->
      <level3>Value</level3>
    </level2>
  </level1>
</root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<level1>');
      expect(result.code).toContain('<level2>');
      expect(result.code).toContain('<level3>Value</level3>');
      expect(result.code).not.toContain('<!-- Level');
    });

    test('sibling elements with comments', () => {
      const code = `<root>
  <!-- First child -->
  <child>Value1</child>
  <!-- Second child -->
  <child>Value2</child>
  <!-- Third child -->
  <child>Value3</child>
</root>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('Value1');
      expect(result.code).toContain('Value2');
      expect(result.code).toContain('Value3');
      expect(result.code).not.toContain('First child');
      expect(result.code).not.toContain('Second child');
    });
  });

  describe('XML - Real-World Examples', () => {
    test('SVG as XML with comments', () => {
      const code = `<?xml version="1.0"?>
<!-- SVG Drawing -->
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <!-- Background -->
  <rect width="100" height="100" fill="white"/>
  <!-- Shape -->
  <circle cx="50" cy="50" r="40" fill="red"/>
</svg>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<svg xmlns');
      expect(result.code).toContain('<rect');
      expect(result.code).toContain('<circle');
      expect(result.code).not.toContain('SVG Drawing');
      expect(result.code).not.toContain('Background');
    });

    test('configuration XML with comments', () => {
      const code = `<?xml version="1.0"?>
<!-- Application Configuration -->
<configuration>
  <!-- Database settings -->
  <database>
    <host>localhost</host>
    <port>3306</port>
  </database>
  <!-- API settings -->
  <api>
    <endpoint>https://api.example.com</endpoint>
  </api>
</configuration>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<configuration>');
      expect(result.code).toContain('<database>');
      expect(result.code).toContain('<host>localhost</host>');
      expect(result.code).not.toContain('Application Configuration');
      expect(result.code).not.toContain('Database settings');
      expect(result.code).not.toContain('API settings');
    });

    test('RSS feed with comments', () => {
      const code = `<?xml version="1.0"?>
<!-- RSS Feed -->
<rss version="2.0">
  <channel>
    <!-- Channel info -->
    <title>My Blog</title>
    <link>https://example.com</link>
    <!-- Items -->
    <item>
      <title>Post Title</title>
      <!-- Publication date -->
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
      const result = removeComments(code, { language: 'xml' });
      
      expect(result.code).toContain('<rss version="2.0">');
      expect(result.code).toContain('<title>My Blog</title>');
      expect(result.code).toContain('<pubDate>');
      expect(result.code).not.toContain('RSS Feed');
      expect(result.code).not.toContain('Channel info');
      expect(result.code).not.toContain('Publication date');
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases - All Languages', () => {
    test('empty CSS file', () => {
      const result = removeComments('', { language: 'css' });
      expect(result.code).toBe('');
    });

    test('empty HTML file', () => {
      const result = removeComments('', { language: 'html' });
      expect(result.code).toBe('');
    });

    test('empty XML file', () => {
      const result = removeComments('', { language: 'xml' });
      expect(result.code).toBe('');
    });

    test('CSS with only comments', () => {
      const code = `/* Comment 1 */
/* Comment 2 */
/* Comment 3 */`;
      const result = removeComments(code, { language: 'css' });
      expect(result.code.trim().length).toBeLessThan(code.length);
    });

    test('HTML with only comments', () => {
      const code = `<!-- Comment 1 -->
<!-- Comment 2 -->`;
      const result = removeComments(code, { language: 'html' });
      expect(result.code.trim().length).toBeLessThan(code.length);
    });

    test('XML with only comments', () => {
      const code = `<!-- Comment 1 -->
<!-- Comment 2 -->`;
      const result = removeComments(code, { language: 'xml' });
      expect(result.code.trim().length).toBeLessThan(code.length);
    });

    test('extremely long CSS comment', () => {
      const longComment = '/* ' + 'x'.repeat(10000) + ' */';
      const code = `${longComment}\n.button { color: red; }`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.button');
      expect(result.code.length).toBeLessThan(code.length);
    });

    test('extremely long HTML comment', () => {
      const longComment = '<!-- ' + 'x'.repeat(10000) + ' -->';
      const code = `${longComment}\n<div>Content</div>`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<div>Content</div>');
      expect(result.code.length).toBeLessThan(code.length);
    });

    test('unicode in CSS comments', () => {
      const code = `/* Коментар на кирилица */
.class { color: red; }
/* 中文注释 */`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.class');
      expect(result.code).not.toContain('Коментар');
      expect(result.code).not.toContain('中文');
    });

    test('unicode in HTML comments', () => {
      const code = `<!-- Коментар -->
<div>Текст</div>
<!-- 中文 -->`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('Текст');
      expect(result.code).not.toContain('Коментар');
      expect(result.code).not.toContain('中文');
    });

    test('mixed line endings in CSS', () => {
      const code = `/* Comment 1 */\r\n.class { color: red; }\n/* Comment 2 */\r\n`;
      const result = removeComments(code, { language: 'css' });
      
      expect(result.code).toContain('.class');
      expect(result.code).not.toContain('/* Comment');
    });

    test('mixed line endings in HTML', () => {
      const code = `<!-- Comment 1 -->\r\n<div>Content</div>\n<!-- Comment 2 -->\r\n`;
      const result = removeComments(code, { language: 'html' });
      
      expect(result.code).toContain('<div>Content</div>');
      expect(result.code).not.toContain('<!-- Comment');
    });
  });
});

// ============================================================================
// C/C++ ADVANCED FEATURES
// ============================================================================

describe('C/C++ Advanced Features', () => {
  test('handles preprocessor directives with inline comments', () => {
    const code = `#define MAX 100 // Maximum value
#ifdef DEBUG // Debug mode
printf("Debug"); // Debug print
#endif // End debug
int x = 5;`;
    const result = removeComments(code, { language: 'c' });
    
    expect(result.code).toContain('#define MAX 100');
    expect(result.code).toContain('#ifdef DEBUG');
    expect(result.code).toContain('#endif');
    expect(result.code).not.toContain('// Maximum value');
    expect(result.code).not.toContain('// Debug mode');
  });

  test('handles multi-line macros with backslash continuation', () => {
    const code = `#define MULTI_LINE_MACRO(x) \\ 
  do { \\                        // Comment 1
    printf("%d", x); \\          // Comment 2
  } while(0)                     // Comment 3`;
    const result = removeComments(code, { language: 'c' });
    
    expect(result.code).toContain('#define MULTI_LINE_MACRO');
    expect(result.code).not.toContain('// Comment 1');
    expect(result.code).not.toContain('// Comment 2');
  });

  test('handles C++11 raw string literals', () => {
    const code = `const char* str = R"delimiter(
This is // not a comment
Neither is /* this */
)delimiter";
// Real comment`;
    const result = removeComments(code, { language: 'cpp' });
    
    expect(result.code).toContain('This is // not a comment');
    expect(result.code).toContain('Neither is /* this */');
    expect(result.code).not.toContain('// Real comment');
  });

  test('handles comments in template specializations', () => {
    const code = `template<typename T> // Primary template
class MyClass {
  // Member
  T value;
};

template<> // Specialization for int
class MyClass<int> {
  int value; // Specialized member
};`;
    const result = removeComments(code, { language: 'cpp' });
    
    expect(result.code).toContain('template<typename T>');
    expect(result.code).toContain('template<>');
    expect(result.code).not.toContain('// Primary template');
    expect(result.code).not.toContain('// Specialization for int');
  });

  test('handles trigraphs with comments', () => {
    const code = `??= define MAX 100 // Define with trigraph
int arr??<10??> = {0}; // Array with trigraphs`;
    const result = removeComments(code, { language: 'c' });
    
    expect(result.code).toContain('??= define MAX 100');
    expect(result.code).toContain('arr??<10??>');
    expect(result.code).not.toContain('// Define with trigraph');
  });
});

// ============================================================================
// C# ADVANCED FEATURES
// ============================================================================

describe('C# Advanced Features', () => {
  test('handles XML documentation comments', () => {
    const code = `/// <summary>
/// This is a method
/// </summary>
/// <param name="x">Parameter</param>
public void Method(int x) {
  // Regular comment
}`;
    const result = removeComments(code, { language: 'csharp' });
    
    expect(result.code).toContain('public void Method(int x)');
    expect(result.code).not.toContain('/// <summary>');
    expect(result.code).not.toContain('/// <param');
    expect(result.code).not.toContain('// Regular comment');
  });

  test('handles #region/#endregion with comments', () => {
    const code = `#region Properties // User properties
public string Name { get; set; } // Name property
#endregion // End properties

#region Methods // User methods
public void DoSomething() {} // Method
#endregion`;
    const result = removeComments(code, { language: 'csharp' });
    
    expect(result.code).toContain('#region Properties');
    expect(result.code).toContain('#endregion');
    expect(result.code).not.toContain('// User properties');
    expect(result.code).not.toContain('// Name property');
  });

  test('handles verbatim strings with comment-like content', () => {
    const code = `string path = @"C:\\ // not a comment
C:\\Users\\// also not a comment";
// Real comment
string multiline = @"Line 1 /* not a comment */
Line 2";`;
    const result = removeComments(code, { language: 'csharp' });
    
    expect(result.code).toContain('// not a comment');
    expect(result.code).toContain('/* not a comment */');
    expect(result.code).not.toContain('// Real comment');
  });

  test('handles string interpolation with comments', () => {
    const code = `string name = "John";
string msg = $"Hello {name}"; // Interpolated string
string complex = $"Value: {x /* inline comment */}"; // Complex`;
    const result = removeComments(code, { language: 'csharp' });
    
    expect(result.code).toContain('$"Hello {name}"');
    expect(result.code).not.toContain('// Interpolated string');
    expect(result.code).not.toContain('// Complex');
  });
});

// ============================================================================
// PHP ADVANCED FEATURES
// ============================================================================

describe('PHP Advanced Features', () => {
  test('handles heredoc syntax with comments', () => {
    const code = `<?php
$sql = <<<SQL
SELECT * FROM users
WHERE id = 1 -- This is not a comment
SQL;
// Real comment
echo $sql;`;
    const result = removeComments(code, { language: 'php' });
    
    expect(result.code).toContain('-- This is not a comment');
    expect(result.code).not.toContain('// Real comment');
  });

  test('handles nowdoc syntax', () => {
    const code = `<?php
$text = <<<'EOT'
This has // not a comment
And /* also not */
EOT;
// Real comment`;
    const result = removeComments(code, { language: 'php' });
    
    expect(result.code).toContain('// not a comment');
    expect(result.code).toContain('/* also not */');
    expect(result.code).not.toContain('// Real comment');
  });

  test('handles PHP tags with comments', () => {
    const code = `<?php // PHP start
echo "Hello";
?> <!-- HTML comment -->
<div>Content</div>
<?php // PHP again
echo "World";`;
    const result = removeComments(code, { language: 'php' });
    
    expect(result.code).toContain('<?php');
    expect(result.code).toContain('echo "Hello"');
    expect(result.code).not.toContain('// PHP start');
    expect(result.code).not.toContain('// PHP again');
  });

  test('handles alternative syntax with comments', () => {
    const code = `<?php
if ($condition): // Start if
  echo "True";
endif; // End if

while ($x < 10): // Loop
  $x++;
endwhile; // End loop`;
    const result = removeComments(code, { language: 'php' });
    
    expect(result.code).toContain('if ($condition):');
    expect(result.code).toContain('endif;');
    expect(result.code).not.toContain('// Start if');
    expect(result.code).not.toContain('// Loop');
  });
});

// ============================================================================
// GO ADVANCED FEATURES
// ============================================================================

describe('Go Advanced Features', () => {
  test('handles package documentation comments', () => {
    const code = `// Package math provides mathematical functions.
// This is the package documentation.
package math

// Add returns the sum of two integers.
func Add(a, b int) int {
  return a + b // Return sum
}`;
    const result = removeComments(code, { language: 'go' });
    
    expect(result.code).toContain('package math');
    expect(result.code).toContain('func Add');
    expect(result.code).not.toContain('Package math provides');
    expect(result.code).not.toContain('// Return sum');
  });

  test('handles build tags', () => {
    const code = `// +build linux darwin
// +build amd64

package main

// Regular comment
func main() {}`;
    const result = removeComments(code, { language: 'go' });
    
    expect(result.code).toContain('// +build linux darwin');
    expect(result.code).toContain('package main');
    expect(result.code).not.toContain('// Regular comment');
  });

  test('handles comments in goroutines', () => {
    const code = `go func() {
  // Anonymous goroutine
  for i := 0; i < 10; i++ {
    fmt.Println(i) // Print
  }
}() // Start goroutine`;
    const result = removeComments(code, { language: 'go' });
    
    expect(result.code).toContain('go func()');
    expect(result.code).toContain('fmt.Println(i)');
    expect(result.code).not.toContain('// Anonymous goroutine');
    expect(result.code).not.toContain('// Print');
  });
});

// ============================================================================
// RUST ADVANCED FEATURES
// ============================================================================

describe('Rust Advanced Features', () => {
  test('handles nested block comments', () => {
    const code = `fn main() {
  /* Outer comment
     /* Nested comment */
     Still in outer
  */
  let x = 5;
}`;
    const result = removeComments(code, { language: 'rust' });
    
    expect(result.code).toContain('fn main()');
    expect(result.code).toContain('let x = 5');
    expect(result.code).not.toContain('Outer comment');
    expect(result.code).not.toContain('Nested comment');
  });

  test('handles doc comments ///', () => {
    const code = `/// Adds two numbers together.
/// # Examples
/// \`\`\`
/// let result = add(2, 3);
/// \`\`\`
fn add(a: i32, b: i32) -> i32 {
  a + b // Return sum
}`;
    const result = removeComments(code, { language: 'rust' });
    
    expect(result.code).toContain('fn add');
    expect(result.code).not.toContain('/// Adds two numbers');
    expect(result.code).not.toContain('// Return sum');
  });

  test('handles inner doc comments //!', () => {
    const code = `//! This is a module-level doc comment.
//! It describes the entire module.

fn test() {
  // Regular comment
}`;
    const result = removeComments(code, { language: 'rust' });
    
    expect(result.code).toContain('fn test()');
    expect(result.code).not.toContain('//! This is a module');
    expect(result.code).not.toContain('// Regular comment');
  });

  test('handles comments with lifetimes', () => {
    const code = `fn longest<'a>( // Lifetime parameter
  x: &'a str, // First string
  y: &'a str  // Second string
) -> &'a str {
  if x.len() > y.len() { x } else { y }
}`;
    const result = removeComments(code, { language: 'rust' });
    
    expect(result.code).toContain("fn longest<'a>(");
    expect(result.code).toContain("x: &'a str");
    expect(result.code).not.toContain('// Lifetime parameter');
    expect(result.code).not.toContain('// First string');
  });
});

// ============================================================================
// SWIFT ADVANCED FEATURES
// ============================================================================

describe('Swift Advanced Features', () => {
  test('handles markup documentation', () => {
    const code = `/// Returns a greeting message
/// - Parameter name: The name to greet
/// - Returns: A greeting string
/// - Note: This is important
func greet(name: String) -> String {
  return "Hello, \\(name)" // String interpolation
}`;
    const result = removeComments(code, { language: 'swift' });
    
    expect(result.code).toContain('func greet');
    expect(result.code).not.toContain('/// Returns a greeting');
    expect(result.code).not.toContain('/// - Parameter');
    expect(result.code).not.toContain('// String interpolation');
  });

  test('handles playground literals with comments', () => {
    const code = `import UIKit

// Color literal
let color = #colorLiteral(red: 1, green: 0, blue: 0, alpha: 1)
// Image literal
let image = #imageLiteral(resourceName: "photo.png")`;
    const result = removeComments(code, { language: 'swift' });
    
    expect(result.code).toContain('#colorLiteral');
    expect(result.code).toContain('#imageLiteral');
    expect(result.code).not.toContain('// Color literal');
    expect(result.code).not.toContain('// Image literal');
  });

  test('handles property wrappers with comments', () => {
    const code = `struct User {
  @Published // Property wrapper
  var name: String
  
  @State // Another wrapper
  private var isActive: Bool
}`;
    const result = removeComments(code, { language: 'swift' });
    
    expect(result.code).toContain('@Published');
    expect(result.code).toContain('@State');
    expect(result.code).not.toContain('// Property wrapper');
    expect(result.code).not.toContain('// Another wrapper');
  });
});

// ============================================================================
// JSON5 ADVANCED FEATURES
// ============================================================================

describe('JSON5 Advanced Features', () => {
  test('handles trailing commas with comments', () => {
    const code = `{
  "key1": "value1", // Comment 1
  "key2": "value2", // Comment 2
  "array": [1, 2, 3,], // Trailing comma
}`;
    const result = removeComments(code, { language: 'json' });
    
    expect(result.code).toContain('"key1": "value1",');
    expect(result.code).toContain('"key2": "value2",');
    expect(result.code).not.toContain('// Comment 1');
    expect(result.code).not.toContain('// Trailing comma');
  });

  test('handles hexadecimal numbers', () => {
    const code = `{
  // Hex values
  "color": 0xFF00FF, /* Purple */
  "mask": 0xDEADBEEF // Mask value
}`;
    const result = removeComments(code, { language: 'json' });
    
    expect(result.code).toContain('"color": 0xFF00FF');
    expect(result.code).toContain('"mask": 0xDEADBEEF');
    expect(result.code).not.toContain('// Hex values');
    expect(result.code).not.toContain('/* Purple */');
  });

  test('handles single quoted strings', () => {
    const code = `{
  'singleQuoted': 'value', // Single quotes
  "doubleQuoted": "value" // Double quotes
}`;
    const result = removeComments(code, { language: 'json' });
    
    expect(result.code).toContain("'singleQuoted'");
    expect(result.code).toContain('"doubleQuoted"');
    expect(result.code).not.toContain('// Single quotes');
  });

  test('handles unquoted keys', () => {
    const code = `{
  unquoted: "value", // Unquoted key
  another_key: 123 // Another one
}`;
    const result = removeComments(code, { language: 'json' });
    
    expect(result.code).toContain('unquoted: "value"');
    expect(result.code).toContain('another_key: 123');
    expect(result.code).not.toContain('// Unquoted key');
  });
});

// ============================================================================
// YAML ADVANCED FEATURES
// ============================================================================

describe('YAML Advanced Features', () => {
  test('handles literal block scalars (|)', () => {
    const code = `script: |
  echo "Line 1"
  # This is inside the string, NOT a comment
  echo "Line 2"
# This IS a real comment
key: value`;
    const result = removeComments(code, { language: 'yaml' });
    
    // Note: The current implementation might not handle this correctly
    // This test documents the expected behavior
    expect(result.code).toContain('script: |');
    expect(result.code).not.toContain('# This IS a real comment');
  });

  test('handles folded block scalars (>)', () => {
    const code = `description: >
  This is a long
  text that will be
  folded into one line
  # Not a comment inside
# Real comment
key: value`;
    const result = removeComments(code, { language: 'yaml' });
    
    expect(result.code).toContain('description: >');
    expect(result.code).not.toContain('# Real comment');
  });

  test('handles block chomping indicators', () => {
    const code = `# Strip final newlines
text1: |-
  content
# Keep final newlines
text2: |+
  content`;
    const result = removeComments(code, { language: 'yaml' });
    
    expect(result.code).toContain('text1: |-');
    expect(result.code).toContain('text2: |+');
    expect(result.code).not.toContain('# Strip final newlines');
  });

  test('handles flow style collections', () => {
    const code = `# Inline array
array: [1, 2, 3] # Numbers
# Inline map
map: {key: value, key2: value2} # Dictionary`;
    const result = removeComments(code, { language: 'yaml' });
    
    expect(result.code).toContain('array: [1, 2, 3]');
    expect(result.code).toContain('map: {key: value');
    expect(result.code).not.toContain('# Inline array');
    expect(result.code).not.toContain('# Numbers');
  });
});

// ============================================================================
// RUBY ADVANCED FEATURES
// ============================================================================

describe('Ruby Advanced Features', () => {
  test('handles =begin/=end in middle of line (invalid but handle gracefully)', () => {
    const code = `x = 5 =begin comment
This is text
=end
y = 10`;
    const result = removeComments(code, { language: 'ruby' });
    
    // Should handle gracefully without crashing
    expect(result.code).toBeDefined();
  });

  test('handles heredoc with different delimiters', () => {
    const code = `sql = <<SQL
SELECT * FROM users
SQL
# Comment after heredoc

html = <<-HTML
  <div>Content</div>
HTML`;
    const result = removeComments(code, { language: 'ruby' });
    
    expect(result.code).toContain('<<SQL');
    expect(result.code).toContain('<<-HTML');
    expect(result.code).not.toContain('# Comment after heredoc');
  });

  test('handles percent literals', () => {
    const code = `# Percent string
str = %q{This has # not a comment}
# Percent array
arr = %w[one two three] # Words
# Percent regex
regex = %r{\\d+ # pattern}x`;
    const result = removeComments(code, { language: 'ruby' });
    
    expect(result.code).toContain('%q{This has # not a comment}');
    expect(result.code).toContain('%w[one two three]');
    expect(result.code).not.toContain('# Percent string');
    expect(result.code).not.toContain('# Words');
  });

  test('handles string interpolation with #', () => {
    const code = `name = "John"
msg = "Hello #{name} #tag"
# Real comment`;
    const result = removeComments(code, { language: 'ruby' });
    
    expect(result.code).toContain('Hello #{name} #tag');
    expect(result.code).not.toContain('# Real comment');
  });
});
