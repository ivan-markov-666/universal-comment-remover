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
 * Removes comments from XML code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeXmlComments(code: string, preserveLicense: boolean = false): string {
  if (!code) return code;
  
  // Process CDATA sections first to protect their contents
  const cdataSections: {id: string, content: string}[] = [];
  let cdataIndex = 0;
  
  // Replace CDATA sections with placeholders
  const withCdataPlaceholders = code.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (match) => {
    const id = `__CDATA_${cdataIndex++}__`;
    cdataSections.push({ id, content: match });
    return id;
  });
  
  // Process comments in the code with CDATA sections replaced by placeholders
  const commentRegex = /<!--[\s\S]*?-->/g;
  let processedCode: string;
  
  if (!preserveLicense) {
    processedCode = withCdataPlaceholders.replace(commentRegex, '');
  } else {
    // Keep only license comments
    processedCode = withCdataPlaceholders.replace(commentRegex, (match) => {
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
  
  // Restore CDATA sections
  return processedCode.replace(/__CDATA_(\d+)__/g, (_, index) => {
    const cdata = cdataSections[parseInt(index)];
    return cdata ? cdata.content : '';
  });
}
