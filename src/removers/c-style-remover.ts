import { removeJavaScriptComments } from './javascript-remover';

/**
 * Премахва коментари от Java код (използва C-style коментари)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeJavaComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Премахва коментари от C# код (използва C-style коментари)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeCSharpComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Премахва коментари от C код (използва C-style коментари)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeCComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Премахва коментари от C++ код (използва C-style коментари)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeCppComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Премахва коментари от PHP код
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removePhpComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  // PHP използва //, /* */ и # коментари
  // Първо премахваме C-style коментари
  let result = removeJavaScriptComments(code, preserveLicense);
  
  // След това премахваме # коментари (като Python)
  const lines = result.split('\n');
  const finalLines: string[] = [];
  
  for (const line of lines) {
    const hashIndex = line.indexOf('#');
    if (hashIndex === -1) {
      finalLines.push(line);
    } else {
      // Проверяваме дали # е в string
      const beforeHash = line.substring(0, hashIndex);
      const quotes = (beforeHash.match(/"/g) || []).length + (beforeHash.match(/'/g) || []).length;
      
      if (quotes % 2 === 0) {
        // # е извън string - премахваме коментара
        const codeBeforeComment = line.substring(0, hashIndex).trimEnd();
        if (codeBeforeComment.length > 0) {
          finalLines.push(codeBeforeComment);
        }
      } else {
        // # е в string - запазваме целия ред
        finalLines.push(line);
      }
    }
  }
  
  return finalLines.join('\n');
}

/**
 * Премахва коментари от Go код (използва C-style коментари)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeGoComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Премахва коментари от Rust код (използва C-style коментари)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeRustComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}

/**
 * Премахва коментари от Swift код (използва C-style коментари)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeSwiftComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}
