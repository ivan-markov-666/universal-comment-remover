// Експортиране на типове
export { Lang, RemoveOptions, RemoveResult } from './types';

// Експортиране на детектори
export { detectLanguage, detectLanguageByFilename, detectLanguageByContent } from './detectors/language-detector';

// Импортиране на removers
import { removeJavaScriptComments, removeTypeScriptComments } from './removers/javascript-remover';
import { removePythonComments } from './removers/python-remover';
import { removeCssComments, removeHtmlComments, removeXmlComments } from './removers/css-html-remover';
import { removeSqlComments } from './removers/sql-remover';
import { 
  removeJavaComments, 
  removeCSharpComments, 
  removeCComments, 
  removeCppComments,
  removePhpComments,
  removeGoComments,
  removeRustComments,
  removeSwiftComments
} from './removers/c-style-remover';
import { removeJsonComments, removeYamlComments, removeRubyComments } from './removers/other-remover';

import { Lang, RemoveOptions, RemoveResult } from './types';
import { detectLanguage, detectLanguageByFilename } from './detectors/language-detector';

/**
 * Премахва коментари от код на различни програмни езици
 * 
 * @param code - Входният код за обработка
 * @param options - Опции за премахване на коментари
 * @returns Резултат с обработения код и метаданни
 * 
 * @example
 * ```typescript
 * const result = removeComments('// comment\nconst x = 5;', { language: 'javascript' });
 * console.log(result.code); // 'const x = 5;'
 * ```
 */
export function removeComments(code: string, options: RemoveOptions = {}): RemoveResult {
  if (!code || code.trim().length === 0) {
    return {
      code: code,
      removedCount: 0,
      detectedLanguage: undefined
    };
  }
  
  // Определяне на езика - filename има предимство пред language параметъра
  let language = options.language;
  
  // Ако има filename, опитай се да детектираш по него (override-ва language ако е успешно)
  if (options.filename) {
    const detectedByFilename = detectLanguageByFilename(options.filename);
    if (detectedByFilename) {
      language = detectedByFilename;
    }
  }
  
  // Ако все още няма език, опитай автоматично разпознаване
  if (!language) {
    language = detectLanguage(undefined, code);
  }
  
  if (!language) {
    // Не можем да определим езика
    return {
      code: code,
      removedCount: 0,
      detectedLanguage: undefined
    };
  }
  
  // Dry run режим - брои коментари като взема предвид preserveLicense
  if (options.dryRun) {
    const commentCount = countComments(code, language, options.preserveLicense || false);
    return {
      code: code,
      removedCount: commentCount,
      detectedLanguage: language
    };
  }
  
  // Премахване на коментари според езика
  const preserveLicense = options.preserveLicense || false;
  let processedCode = code;
  
  try {
    switch (language) {
      case 'javascript':
        processedCode = removeJavaScriptComments(code, preserveLicense);
        break;
      case 'typescript':
        processedCode = removeTypeScriptComments(code, preserveLicense);
        break;
      case 'python':
        processedCode = removePythonComments(code, preserveLicense);
        break;
      case 'ruby':
        processedCode = removeRubyComments(code, preserveLicense);
        break;
      case 'java':
        processedCode = removeJavaComments(code, preserveLicense);
        break;
      case 'csharp':
        processedCode = removeCSharpComments(code, preserveLicense);
        break;
      case 'c':
        processedCode = removeCComments(code, preserveLicense);
        break;
      case 'cpp':
        processedCode = removeCppComments(code, preserveLicense);
        break;
      case 'html':
        processedCode = removeHtmlComments(code, preserveLicense);
        break;
      case 'css':
        processedCode = removeCssComments(code, preserveLicense);
        break;
      case 'sql':
        processedCode = removeSqlComments(code, preserveLicense);
        break;
      case 'yaml':
        processedCode = removeYamlComments(code, preserveLicense);
        break;
      case 'json':
        processedCode = removeJsonComments(code, preserveLicense);
        break;
      case 'xml':
        processedCode = removeXmlComments(code, preserveLicense);
        break;
      case 'php':
        processedCode = removePhpComments(code, preserveLicense);
        break;
      case 'go':
        processedCode = removeGoComments(code, preserveLicense);
        break;
      case 'rust':
        processedCode = removeRustComments(code, preserveLicense);
        break;
      case 'swift':
        processedCode = removeSwiftComments(code, preserveLicense);
        break;
      default:
        // Непознат език - връщаме оригиналния код
        return {
          code: code,
          removedCount: 0,
          detectedLanguage: language
        };
    }
  } catch (error) {
    console.error(`Error removing comments for language ${language}:`, error);
    return {
      code: code,
      removedCount: 0,
      detectedLanguage: language
    };
  }
  
  // Изчисляване на броя премахнати коментари
  const removedCount = estimateRemovedComments(code, processedCode);
  
  return {
    code: processedCode,
    removedCount: removedCount,
    detectedLanguage: language
  };
}

/**
 * Брои коментари в код (приблизително)
 * @param code - Кодът за анализ
 * @param language - Програмният език
 * @param preserveLicense - Дали license коментарите се запазват (не се броят)
 */
function countComments(code: string, language: Lang, preserveLicense: boolean = false): number {
  const lines = code.split('\n');
  let count = 0;
  
  // Опростена логика за броене на коментари
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Ако е license коментар и preserveLicense е true, не го броим
    if (preserveLicense && isLicenseLine(trimmed)) {
      continue;
    }
    
    switch (language) {
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'csharp':
      case 'c':
      case 'cpp':
      case 'go':
      case 'rust':
      case 'swift':
      case 'php':
        if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
          count++;
        }
        break;
      case 'python':
      case 'ruby':
      case 'yaml':
        if (trimmed.startsWith('#') || trimmed.startsWith('=begin')) {
          count++;
        }
        break;
      case 'html':
      case 'xml':
        if (trimmed.startsWith('<!--')) {
          count++;
        }
        break;
      case 'css':
        if (trimmed.startsWith('/*')) {
          count++;
        }
        break;
      case 'sql':
        if (trimmed.startsWith('--') || trimmed.startsWith('/*')) {
          count++;
        }
        break;
    }
  }
  
  return count;
}

/**
 * Проверява дали редът съдържа license keywords
 */
function isLicenseLine(line: string): boolean {
  const lower = line.toLowerCase();
  return lower.includes('license') ||
         lower.includes('copyright') ||
         lower.includes('licence') ||
         lower.includes('author') ||
         line.startsWith('/*!') ||
         line.includes('@license') ||
         line.includes('@copyright') ||
         line.includes('@author');
}

/**
 * Оценява колко коментари са премахнати чрез сравнение на редовете
 */
function estimateRemovedComments(original: string, processed: string): number {
  const originalLines = original.split('\n').filter(l => l.trim().length > 0);
  const processedLines = processed.split('\n').filter(l => l.trim().length > 0);
  
  return Math.max(0, originalLines.length - processedLines.length);
}

/**
 * Default експорт на главната функция
 */
export default removeComments;