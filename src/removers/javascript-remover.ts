import stripComments from 'strip-comments';

/**
 * Removes comments from JavaScript/TypeScript code
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeJavaScriptComments(code: string, preserveLicense: boolean = false): string {
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
  
  const options: any = {
    line: true,
    block: true,
    keepProtected: preserveLicense,
    preserveNewlines: false
  };
  
  try {
    return stripComments(processedCode, options);
  } catch (error) {
    console.error('Error removing JavaScript comments:', error);
    return code;
  }
}

/**
 * Removes comments from TypeScript code (uses the same logic as JavaScript)
 * @param code - Input code
 * @param preserveLicense - Whether to preserve license comments
 * @returns Processed code
 */
export function removeTypeScriptComments(code: string, preserveLicense: boolean = false): string {
  return removeJavaScriptComments(code, preserveLicense);
}