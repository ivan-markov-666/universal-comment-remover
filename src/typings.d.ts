/**
 * Type declarations for modules without TypeScript definitions
 */

declare module 'strip-comments' {
  interface StripOptions {
    line?: boolean;
    block?: boolean;
    keepProtected?: boolean;
    preserveNewlines?: boolean;
  }
  
  function strip(input: string, options?: StripOptions): string;
  
  export = strip;
}
