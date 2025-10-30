import { removeComments } from '../src/index';

describe('Language-Specific Edge Cases', () => {
  describe('JSX/TSX', () => {
    test('handles JSX syntax', () => {
      const code = `// Comment before JSX
const Component = () => (
  <div>
    {/* JSX comment */}
    <h1>Hello</h1>
    {"// Not a comment"}
  </div>
);`;
      const result = removeComments(code, { language: 'typescript' });
      expect(result.code).toContain('const Component');
      expect(result.code).toContain('{"// Not a comment"}');
      expect(result.code).not.toContain('// Comment');
      expect(result.code).not.toContain('{/* JSX comment */}');
    });
  });

  describe('Python', () => {
    test('handles docstrings', () => {
      const code = `"""
This is a docstring
It should be preserved
"""
def hello():
    # This is a regular comment
    return "Hello"`;
      const result = removeComments(code, { language: 'python' });
      expect(result.code).toContain('def hello');
      expect(result.code).toContain('This is a docstring');
      expect(result.code).not.toContain('# This is a regular comment');
    });

    test('handles shebangs', () => {
      const code = `#!/usr/bin/env python3
# This is a comment
print("Hello")
# Another comment`;
      const result = removeComments(code, { language: 'python' });
      // The first line should contain the print statement since comments are removed
      const lines = result.code.split('\n');
      expect(lines[0]).toBe('print("Hello")');
      expect(result.code).not.toContain('This is a comment');
      expect(result.code).not.toContain('Another comment');
    });
  });

  describe('Ruby', () => {
    test('handles =begin/=end comments', () => {
      const code = `=begin
This is a multi-line
comment in Ruby
=end
puts "Hello" # inline comment`;
      const result = removeComments(code, { language: 'ruby' });
      expect(result.code).toContain('puts "Hello"');
      expect(result.code).not.toContain('=begin');
      expect(result.code).not.toContain('This is a multi-line');
      expect(result.code).not.toContain('# inline comment');
    });
  });

  describe('HTML', () => {
    test('handles conditional comments', () => {
      const code = `<!--[if IE]>
  <link href="ie-only.css" rel="stylesheet">
<![endif]-->
<!-- Regular comment -->
<div>Content</div>`;
      const result = removeComments(code, { language: 'html' });
      expect(result.code).toContain('<div>Content</div>');
      expect(result.code).not.toContain('<!--');
      expect(result.code).not.toContain('-->');
    });
  });
});
