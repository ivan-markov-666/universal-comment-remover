/**
 * Премахва коментари от CSS код
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeCssComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  // CSS коментари са /* ... */
  const commentRegex = /\/\*[\s\S]*?\*\//g;
  
  if (!preserveLicense) {
    return code.replace(commentRegex, '');
  }
  
  // Запази само license коментари
  return code.replace(commentRegex, (match) => {
    const lower = match.toLowerCase();
    if (lower.includes('copyright') ||
        lower.includes('license') ||
        lower.includes('licence') ||
        lower.includes('author') ||
        match.startsWith('/*!')) {
      return match;
    }
    return '';
  });
}

/**
 * Премахва коментари от HTML код
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeHtmlComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  // HTML коментари са <!-- ... -->
  const commentRegex = /<!--[\s\S]*?-->/g;
  
  if (!preserveLicense) {
    return code.replace(commentRegex, '');
  }
  
  // Запази само license коментари
  return code.replace(commentRegex, (match) => {
    const lower = match.toLowerCase();
    if (lower.includes('copyright') ||
        lower.includes('license') ||
        lower.includes('licence') ||
        lower.includes('author')) {
      return match;
    }
    return '';
  });
}

/**
 * Премахва коментари от XML код (използва същата логика като HTML)
 * @param code - Входен код
 * @param preserveLicense - Дали да запази лицензионни коментари
 * @returns Обработен код
 */
export function removeXmlComments(code: string, preserveLicense: boolean = false): string {
  return removeHtmlComments(code, preserveLicense);
}
