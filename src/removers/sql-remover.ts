/**
 * Removes comments from SQL code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeSqlComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  const lines = code.split('\n');
  const result: string[] = [];
  let inMultilineComment = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let processedLine = '';
    let inString = false;
    let stringChar = '';
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = j < line.length - 1 ? line[j + 1] : '';
      
      // Check for multiline comments /* ... */
      if (!inString && !inMultilineComment && char === '/' && nextChar === '*') {
        inMultilineComment = true;
        const restOfLine = line.substring(j);
        if (preserveLicense && isLicenseComment(restOfLine)) {
          processedLine += restOfLine;
          break;
        }
        j++; // Skip next char
        continue;
      }
      
      if (inMultilineComment) {
        if (char === '*' && nextChar === '/') {
          inMultilineComment = false;
          j++; // Skip next char
        }
        continue;
      }
      
      // Check for string literals
      if (char === "'" || char === '"') {
        if (!inString) {
          inString = true;
          stringChar = char;
          processedLine += char;
        } else if (char === stringChar) {
          // Check for escaped quote
          if (j > 0 && line[j - 1] !== '\\') {
            inString = false;
          }
          processedLine += char;
        } else {
          processedLine += char;
        }
        continue;
      }
      
      // Check for single-line comments --
      if (!inString && char === '-' && nextChar === '-') {
        // The rest of the line is a comment
        const comment = line.substring(j);
        if (preserveLicense && isLicenseComment(comment)) {
          processedLine += comment;
        }
        break;
      }
      
      // Normal character
      if (!inMultilineComment) {
        processedLine += char;
      }
    }
    
    // Add the line if it has content or if we're in a multiline comment
    const trimmed = processedLine.trim();
    if (trimmed.length > 0 || inMultilineComment) {
      result.push(processedLine);
    }
  }
  
  return result.join('\n');
}

/**
 * Checks if the comment is a license comment
 */
function isLicenseComment(comment: string): boolean {
  const lower = comment.toLowerCase();
  return lower.includes('copyright') ||
         lower.includes('license') ||
         lower.includes('licence') ||
         lower.includes('author');
}
