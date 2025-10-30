import stripComments from 'strip-comments';

/**
 * Removes comments from JavaScript/TypeScript code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @param keepEmptyLines - Whether to keep empty lines
 * @returns Processed code
 */
export function removeJavaScriptComments(
  code: string, 
  preserveLicense: boolean = false,
  keepEmptyLines: boolean = false
): string {
  if (!code) return code;
  
  // Pre-process: Mark JavaDoc license comments with /*! to preserve them
  let processedCode = code;
  if (preserveLicense) {
    // Convert /** @license */ to /*! @license */ for strip-comments library
    processedCode = code.replace(/\/\*\*[\s\S]*?@license[\s\S]*?\*\//g, (match) => {
      return match.replace('/**', '/*!');
    });
    
    // Also handle /** @copyright */ and /** @author */
    processedCode = processedCode.replace(/\/\*\*[\s\S]*?@(copyright|author)[\s\S]*?\*\//g, (match) => {
      return match.replace('/**', '/*!');
    });
    
    // Handle // @license single-line comments
    processedCode = processedCode.replace(/\/\/\s*@(license|copyright)[^\n]*/g, (match) => {
      return '/*!' + match.substring(2) + '*/';
    });
  }
  
  if (keepEmptyLines) {
    const result = removeCommentsPreservingLines(processedCode, preserveLicense);
    // Do NOT call trimEmptyLines() when we want to preserve empty lines!
    return result;
  }

  const options: any = {
    line: true,
    block: true,
    keepProtected: preserveLicense,
    preserveNewlines: false
  };

  try {
    const result = stripComments(processedCode, options);
    // Remove empty lines at the start/end ONLY when keepEmptyLines is false
    return trimEmptyLines(result);
  } catch (error) {
    console.error('Error removing JavaScript comments:', error);
    return code;
  }
}

/**
 * Removes comments from TypeScript code (uses the same logic as JavaScript)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @param keepEmptyLines - Whether to keep empty lines
 * @returns Processed code
 */
export function removeTypeScriptComments(
  code: string, 
  preserveLicense: boolean = false,
  keepEmptyLines: boolean = false
): string {
  return removeJavaScriptComments(code, preserveLicense, keepEmptyLines);
}

/**
 * Removes empty lines from the beginning and end of code
 */
function trimEmptyLines(code: string): string {
  const lines = code.split('\n');
  
  // Remove empty lines at the start
  while (lines.length > 0 && lines[0].trim() === '') {
    lines.shift();
  }
  
  // Remove empty lines at the end
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }
  
  return lines.join('\n');
}

/**
 * Removes comments from code while preserving line breaks and empty lines
 * @param code - The source code to process
 * @param preserveLicense - Whether to preserve license and copyright comments
 * @returns Code with comments removed but line structure preserved
 */
function removeCommentsPreservingLines(code: string, preserveLicense: boolean): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let inMultilineComment = false;
  let skipMultilineComment = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Process multi-line comments /* ... */
    if (!inMultilineComment) {
      const commentStart = findCommentStart(line);
      
      if (commentStart !== -1 && line.substring(commentStart).startsWith('/*')) {
        const beforeComment = line.substring(0, commentStart).trimEnd();
        
        // Check for license/copyright comment
        const isProtected = preserveLicense && (
          line.substring(commentStart).startsWith('/*!') ||
          line.substring(commentStart).toLowerCase().includes('license') ||
          line.substring(commentStart).toLowerCase().includes('copyright')
        );
        
        if (isProtected) {
          result.push(line);
          if (line.indexOf('*/', commentStart + 2) === -1) {
            inMultilineComment = true;
            skipMultilineComment = false;
          }
          continue;
        }
        
        // Check if the comment ends on the same line
        const commentEnd = line.indexOf('*/', commentStart + 2);
        if (commentEnd !== -1) {
          // Single-line /* */ comment
          const afterComment = line.substring(commentEnd + 2);
          if (beforeComment.length === 0 && afterComment.trim().length === 0) {
            // The whole line is a comment - check the next line
            const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
            if (nextLine.trim().length === 0) {
              // Next line is empty, don't add an extra empty line
              continue;
            } else {
              result.push(''); // Add empty line
            }
          } else {
            result.push((beforeComment + afterComment).trimEnd());
          }
        } else {
          // Multi-line comment starts
          inMultilineComment = true;
          skipMultilineComment = true;
          if (beforeComment.length > 0) {
            result.push(beforeComment);
          } else {
            // Check next line
            const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
            if (nextLine.trim().length === 0) {
              continue;
            } else {
              result.push('');
            }
          }
        }
        continue;
      }
    } else {
      // Inside multi-line comment
      if (line.indexOf('*/') !== -1) {
        inMultilineComment = false;
        const afterComment = line.substring(line.indexOf('*/') + 2);
        if (afterComment.trim().length > 0) {
          result.push(afterComment.trimEnd());
        } else {
          // Check next line
          const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
          if (nextLine.trim().length === 0) {
            continue;
          } else {
            result.push('');
          }
        }
        skipMultilineComment = false;
      } else {
        // Inside multi-line comment - skip the line without adding empty line
        continue;
      }
      continue;
    }
    
    // Handle single-line comments //
    const commentIndex = findCommentStart(line);
    if (commentIndex !== -1 && line.substring(commentIndex).startsWith('//')) {
      const beforeComment = line.substring(0, commentIndex).trimEnd();
      const comment = line.substring(commentIndex);
      
      // Check for license/copyright
      const isLicense = preserveLicense && (
        comment.includes('@license') ||
        comment.toLowerCase().includes('license') ||
        comment.toLowerCase().includes('copyright')
      );
      
      if (isLicense) {
        result.push(line);
      } else if (beforeComment.length > 0) {
        result.push(beforeComment);
      } else {
        // The whole line is a comment - check the next line
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        if (nextLine.trim().length === 0) {
          // Next line is empty, don't add an extra empty line
          continue;
        } else {
          result.push(''); // Add empty line
        }
      }
      continue;
    }
    
    // Обикновен ред с код или празен ред
    result.push(line);
  }
  
  return result.join('\n');
}

/**
 * Finds the start of a comment (// or /*) outside of strings and regex
 */
function findCommentStart(line: string): number {
  let inString = false;
  let stringChar = '';
  let inRegex = false;
  let escapeNext = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i < line.length - 1 ? line[i + 1] : '';
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\' && (inString || inRegex)) {
      escapeNext = true;
      continue;
    }
    
    // String handling
    if (char === '"' || char === "'" || char === '`') {
      if (!inString && !inRegex) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar) {
        inString = false;
      }
      continue;
    }
    
    // Regex handling (simplified)
    if (char === '/' && !inString && !inRegex) {
      // Check if this is a regex or a comment
      if (nextChar === '/' || nextChar === '*') {
        return i; // Found comment start
      }
      // Could be regex - simplified check
      if (i > 0 && /[=,([]/.test(line[i - 1])) {
        inRegex = true;
      }
      continue;
    }
    
    if (char === '/' && inRegex) {
      inRegex = false;
      continue;
    }
  }
  
  return -1;
}
