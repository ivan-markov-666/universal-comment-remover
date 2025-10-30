/**
 * Премахва коментари от JSON код (JSON5 стил)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари (не се поддържа за JSON)
 * @returns Обработен код
 */
export function removeJsonComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  try {
    // Опростена имплементация за премахване на // и /* */ коментари от JSON
    let result = '';
    let inString = false;
    let inSingleLineComment = false;
    let inMultiLineComment = false;
    let stringChar = '';
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const nextChar = i < code.length - 1 ? code[i + 1] : '';
      
      // Ако сме в string, просто добавяме символа
      if (inString) {
        result += char;
        if (char === stringChar && code[i - 1] !== '\\') {
          inString = false;
        }
        continue;
      }
      
      // Проверка за начало на string
      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        result += char;
        continue;
      }
      
      // Ако сме в single-line коментар
      if (inSingleLineComment) {
        if (char === '\n') {
          inSingleLineComment = false;
          result += char;  // Запазваме newline
        }
        continue;
      }
      
      // Ако сме в multi-line коментар
      if (inMultiLineComment) {
        if (char === '*' && nextChar === '/') {
          inMultiLineComment = false;
          i++;  // Skip '/'
        }
        continue;
      }
      
      // Проверка за начало на single-line коментар
      if (char === '/' && nextChar === '/') {
        inSingleLineComment = true;
        i++;  // Skip second '/'
        continue;
      }
      
      // Проверка за начало на multi-line коментар
      if (char === '/' && nextChar === '*') {
        inMultiLineComment = true;
        i++;  // Skip '*'
        continue;
      }
      
      // Нормален символ
      result += char;
    }
    
    return result;
  } catch (error) {
    console.error('Error removing JSON comments:', error);
    return code;
  }
}

/**
 * Премахва коментари от YAML код
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeYamlComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  const lines = code.split('\n');
  const result: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Празен ред или само коментар
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
      // Обикновен ред без коментар
      result.push(line);
    }
  }
  
  return result.join('\n');
}

/**
 * Премахва коментари от Ruby код
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
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
    
    // Multiline коментари =begin ... =end
    if (trimmed.startsWith('=begin')) {
      inMultilineComment = true;
      multilineBuffer = [line];
      // Проверяваме дали е license блок
      isLicenseBlock = preserveLicense && isLicenseComment(line);
      continue;
    }
    
    if (inMultilineComment) {
      multilineBuffer.push(line);
      
      if (trimmed.startsWith('=end')) {
        inMultilineComment = false;
        
        // Ако е license блок, проверяваме целия буфер за license keywords
        if (preserveLicense) {
          const blockContent = multilineBuffer.join('\n');
          if (isLicenseBlock || isLicenseComment(blockContent)) {
            // Запазваме целия блок
            result.push(...multilineBuffer);
          }
        }
        
        multilineBuffer = [];
        isLicenseBlock = false;
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
      const comment = line.substring(commentIndex);
      
      if (codeBeforeComment.length > 0) {
        // Ако има код преди коментара и коментарът е license, запазваме и двете
        if (preserveLicense && isLicenseComment(comment)) {
          result.push(line);
        } else {
          result.push(codeBeforeComment);
        }
      } else if (preserveLicense && isLicenseComment(comment)) {
        // Само коментар на реда и е license
        result.push(line);
      }
      continue;
    }
    
    // Обикновен ред с код
    result.push(line);
  }
  
  return result.join('\n');
}

/**
 * Проверява дали коментарът е лицензионен
 */
function isLicenseComment(comment: string): boolean {
  const lower = comment.toLowerCase();
  return lower.includes('copyright') ||
         lower.includes('license') ||
         lower.includes('licence') ||
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
