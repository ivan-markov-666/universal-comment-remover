/**
 * Премахва коментари от SQL код
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
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
      
      // Проверка за multiline коментари /* ... */
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
      
      // Проверка за string literals
      if (char === "'" || char === '"') {
        if (!inString) {
          inString = true;
          stringChar = char;
          processedLine += char;
        } else if (char === stringChar) {
          // Проверка за escaped quote
          if (j > 0 && line[j - 1] !== '\\') {
            inString = false;
          }
          processedLine += char;
        } else {
          processedLine += char;
        }
        continue;
      }
      
      // Проверка за single-line коментари --
      if (!inString && char === '-' && nextChar === '-') {
        // Остатъкът от реда е коментар
        const comment = line.substring(j);
        if (preserveLicense && isLicenseComment(comment)) {
          processedLine += comment;
        }
        break;
      }
      
      // Нормален символ
      if (!inMultilineComment) {
        processedLine += char;
      }
    }
    
    // Добавяме реда ако има съдържание или ако сме в multiline коментар
    const trimmed = processedLine.trim();
    if (trimmed.length > 0 || inMultilineComment) {
      result.push(processedLine);
    }
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
