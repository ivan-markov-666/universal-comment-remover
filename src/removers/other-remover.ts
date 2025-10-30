/**
 * Removes comments from JSON code (JSON5 style)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments (not supported for JSON)
 * @returns Processed code
 */
export function removeJsonComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  try {
    // Simplified implementation for removing // and /* */ comments from JSON
    let result = '';
    let inString = false;
    let inSingleLineComment = false;
    let inMultiLineComment = false;
    let stringChar = '';
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const nextChar = i < code.length - 1 ? code[i + 1] : '';
      
      // If we're in a string, just add the character
      if (inString) {
        result += char;
        if (char === stringChar && code[i - 1] !== '\\') {
          inString = false;
        }
        continue;
      }
      
      // Check for string start
      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        result += char;
        continue;
      }
      
      // If we're in a single-line comment
      if (inSingleLineComment) {
        if (char === '\n') {
          inSingleLineComment = false;
          result += char;  // Preserve newline
        }
        continue;
      }
      
      // If we're in a multi-line comment
      if (inMultiLineComment) {
        if (char === '*' && nextChar === '/') {
          inMultiLineComment = false;
          i++;  // Skip '/'
        }
        continue;
      }
      
      // Check for start of single-line comment
      if (char === '/' && nextChar === '/') {
        inSingleLineComment = true;
        i++;  // Skip second '/'
        continue;
      }
      
      // Check for start of multi-line comment
      if (char === '/' && nextChar === '*') {
        inMultiLineComment = true;
        i++;  // Skip '*'
        continue;
      }
      
      // Normal character
      result += char;
    }
    
    return result;
  } catch (error) {
    console.error('Error removing JSON comments:', error);
    return code;
  }
}

/**
 * Removes comments from YAML code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeYamlComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  const lines = code.split('\n');
  const result: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Empty line or just a comment
    if (trimmed.startsWith('#')) {
      if (preserveLicense && isLicenseComment(trimmed)) {
        result.push(line);
      }
      continue;
    }
    
    // Ред с код и коментар
    const commentIndex = findCommentIndex(line);
    if (commentIndex !== -1) {
      const codeBeforeComment = line.substring(0, commentIndex).trimEnd();
      if (codeBeforeComment.length > 0) {
        result.push(codeBeforeComment);
      }
    } else {
      // Regular line without a comment
      result.push(line);
    }
  }
  
  return result.join('\n');
}

/**
 * Removes comments from Ruby code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeRubyComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  const lines = code.split('\n');
  const result: string[] = [];
  let inMultilineComment = false;
  let multilineBuffer: string[] = [];
  let isLicenseBlock = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Multiline comments =begin ... =end
    if (trimmed.startsWith('=begin')) {
      inMultilineComment = true;
      multilineBuffer = [line];
      // Check if it's a license block
      isLicenseBlock = preserveLicense && isLicenseComment(line);
      continue;
    }
    
    if (inMultilineComment) {
      multilineBuffer.push(line);
      
      if (trimmed.startsWith('=end')) {
        inMultilineComment = false;
        
        // If it's a license block, check the entire buffer for license keywords
        if (preserveLicense) {
          const blockContent = multilineBuffer.join('\n');
          if (isLicenseBlock || isLicenseComment(blockContent)) {
            // Keep the entire block
            result.push(...multilineBuffer);
          }
        }
        
        multilineBuffer = [];
        isLicenseBlock = false;
      }
      continue;
    }
    
    // Single line comments with #
    if (trimmed.startsWith('#')) {
      if (preserveLicense && isLicenseComment(trimmed)) {
        result.push(line);
      }
      continue;
    }
    
    // Ред с код и коментар
    const commentIndex = findCommentIndex(line);
    if (commentIndex !== -1) {
      const codeBeforeComment = line.substring(0, commentIndex).trimEnd();
      const comment = line.substring(commentIndex);
      
      if (codeBeforeComment.length > 0) {
        // If there's code before the comment and the comment is a license, keep both
        if (preserveLicense && isLicenseComment(comment)) {
          result.push(line);
        } else {
          result.push(codeBeforeComment);
        }
      } else if (preserveLicense && isLicenseComment(comment)) {
        // Just a comment on the line and it's a license
        result.push(line);
      }
      continue;
    }
    
    // Regular line of code
    result.push(line);
  }
  
  return result.join('\n');
}

/**
 * Checks if a comment is a license comment
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
 */
function findCommentIndex(line: string): number {
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
    
    if (char === '"' || char === "'" || char === '`') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }
    
    if (char === '#' && !inString) {
      return i;
    }
  }
  
  return -1;
}
