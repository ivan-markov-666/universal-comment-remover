/**
 * Removes comments from CSS code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeCssComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  // CSS comments are /* ... */
  const commentRegex = /\/\*[\s\S]*?\*\//g;
  
  if (!preserveLicense) {
    return code.replace(commentRegex, '');
  }
  
  // Keep only license comments
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
 * Removes comments from HTML code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeHtmlComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  // HTML comments are <!-- ... -->
  const commentRegex = /<!--[\s\S]*?-->/g;
  
  if (!preserveLicense) {
    return code.replace(commentRegex, '');
  }
  
  // Keep only license comments
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
 * Removes comments from XML code (uses the same logic as HTML)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeXmlComments(code: string, preserveLicense: boolean = false): string {
  return removeHtmlComments(code, preserveLicense);
}
