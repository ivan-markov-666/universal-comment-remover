/**
 * Премахва коментари от Python код
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removePythonComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  const lines = code.split('\n');
  const result: string[] = [];
  let inMultilineString = false;
  let multilineQuote = '';
  let skipDocstring = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Проверка за начало на multiline string (""" или ''')
    if (!inMultilineString) {
      const tripleDoubleMatch = line.indexOf('"""');
      const tripleSingleMatch = line.indexOf("'''");
      
      let matchIndex = -1;
      let quote = '';
      
      if (tripleDoubleMatch !== -1 && (tripleSingleMatch === -1 || tripleDoubleMatch < tripleSingleMatch)) {
        matchIndex = tripleDoubleMatch;
        quote = '"""';
      } else if (tripleSingleMatch !== -1) {
        matchIndex = tripleSingleMatch;
        quote = "'''";
      }
      
      if (matchIndex !== -1) {
        // Намерен multiline string
        const afterQuote = line.substring(matchIndex + 3);
        const closingIndex = afterQuote.indexOf(quote);
        
        if (closingIndex !== -1) {
          // Single-line docstring: """text"""
          const beforeQuote = line.substring(0, matchIndex);
          const isDocstring = beforeQuote.trim().length === 0 && isDocstringContext(lines, i);
          
          if (isDocstring && !preserveLicense) {
            // Skip this docstring
            continue;
          } else {
            // It's a regular string, keep it
            result.push(line);
          }
        } else {
          // Multi-line docstring начало
          const beforeQuote = line.substring(0, matchIndex);
          const isDocstring = beforeQuote.trim().length === 0 && isDocstringContext(lines, i);
          
          if (isDocstring) {
            skipDocstring = !preserveLicense || !isLicenseComment(line);
            inMultilineString = true;
            multilineQuote = quote;
            
            if (!skipDocstring) {
              result.push(line);
            }
            continue;
          } else {
            // Regular multi-line string
            inMultilineString = true;
            multilineQuote = quote;
            result.push(line);
            continue;
          }
        }
      }
    } else {
      // Вътре в multiline string
      if (line.includes(multilineQuote)) {
        inMultilineString = false;
        multilineQuote = '';
        
        if (!skipDocstring) {
          result.push(line);
        }
        skipDocstring = false;
        continue;
      }
      
      // Все още в multiline string
      if (!skipDocstring) {
        result.push(line);
      }
      continue;
    }
    
    // Single line коментари с #
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
      continue;
    }
    
    // Обикновен ред с код
    result.push(line);
  }
  
  return result.join('\n');
}

/**
 * Проверява дали текущата позиция е в контекст за docstring
 */
function isDocstringContext(lines: string[], index: number): boolean {
  if (index === 0) return false;
  
  // Провери предишните редове
  for (let i = index - 1; i >= 0; i--) {
    const prevLine = lines[i].trim();
    
    if (prevLine.length === 0) {
      // Празен ред, продължаваме
      continue;
    }
    
    // Проверка за def, class или : в края (функция/клас/метод)
    if (prevLine.startsWith('def ') || 
        prevLine.startsWith('class ') ||
        prevLine.startsWith('async def ') ||
        prevLine.endsWith(':')) {
      return true;
    }
    
    // Ако има друг код, не е docstring
    return false;
  }
  
  return false;
}

/**
 * Проверява дали коментарът е лицензионен
 */
function isLicenseComment(comment: string): boolean {
  const lower = comment.toLowerCase();
  return lower.includes('copyright') ||
         lower.includes('license') ||
         lower.includes('licence') ||
         lower.includes('spdx') ||
         lower.includes('author');
}

/**
 * Намира индекса на # коментар в реда (игнорира # в стрингове)
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
    
    if (char === '"' || char === "'") {
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