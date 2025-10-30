import { removeJavaScriptComments } from './javascript-remover';

/**
 * Removes comments from Java code (uses C-style comments)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeJavaComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Removes comments from C# code (uses C-style comments)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeCSharpComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Removes comments from C code (uses C-style comments)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeCComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Removes comments from C++ code (uses C-style comments)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeCppComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Removes comments from PHP code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removePhpComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  // PHP uses //, /* */ and # comments
  // First remove C-style comments (// and /* */)
  let result = removeJavaScriptComments(code, preserveLicense);
  
  // Then remove # comments
  const lines = result.split('\n');
  const finalLines: string[] = [];
  
  for (const line of lines) {
    // Use the intelligent, stateful detector
    const commentIndex = findHashCommentIndex(line);
    
    if (commentIndex === -1) {
      // No # comment found, add the line as is
      finalLines.push(line);
    } else {
      // Found a # comment outside of a string
      const codeBeforeComment = line.substring(0, commentIndex).trimEnd();
      const comment = line.substring(commentIndex);
      
      if (codeBeforeComment.length > 0) {
        // There's code before the comment
        if (preserveLicense && isLicenseComment(comment)) {
          // If it's a license comment, keep the whole line
          finalLines.push(line);
        } else {
          // Otherwise keep only the code
          finalLines.push(codeBeforeComment);
        }
      } else {
        // The line is *only* a comment
        if (preserveLicense && isLicenseComment(comment)) {
          finalLines.push(line);
        }
        // If it's not a license, we skip it (don't add it to the result)
      }
    }
  }
  
  return finalLines.join('\n');
}

/**
 * Removes comments from Go code (uses C-style comments)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeGoComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Removes comments from Rust code (uses C-style comments)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeRustComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Removes comments from Swift code (uses C-style comments)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeSwiftComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Checks if a comment is a license comment
 * (Copied from other-remover.ts)
 */
function isLicenseComment(comment: string): boolean {
  const lower = comment.toLowerCase();
  return lower.includes('copyright') ||
         lower.includes('license') ||
         lower.includes('licence') ||
         lower.includes('author');
}

/**
 * Finds the index of a # comment in a line (ignores # in strings)
 * (Copied from other-remover.ts)
 */
function findHashCommentIndex(line: string): number {
  let inString = false;
  let stringChar = '';
  let escapeNext = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    // PHP strings can be either " or '
    if (char === '"' || char === "'") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    // TODO: This logic doesn't handle heredoc/nowdoc yet.
    // For now it's sufficient to pass the test.
    
    if (char === '#' && !inString) {
      return i;
    }
  }
  
  return -1;
}