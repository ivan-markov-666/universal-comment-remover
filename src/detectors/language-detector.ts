import { Lang } from '../types';

/**
 * Мапинг на файлови разширения към програмни езици
 */
const EXTENSION_MAP: Record<string, Lang> = {
  // JavaScript/TypeScript
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.mts': 'typescript',
  '.cts': 'typescript',
  
  // Python
  '.py': 'python',
  '.pyw': 'python',
  '.pyi': 'python',
  
  // Ruby
  '.rb': 'ruby',
  '.rake': 'ruby',
  
  // Java
  '.java': 'java',
  
  // C#
  '.cs': 'csharp',
  
  // C/C++
  '.c': 'c',
  '.h': 'c',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.hpp': 'cpp',
  '.hh': 'cpp',
  '.hxx': 'cpp',
  
  // Web
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.scss': 'css',
  '.sass': 'css',
  '.less': 'css',
  
  // SQL
  '.sql': 'sql',
  
  // Config/Data
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.json': 'json',
  '.xml': 'xml',
  
  // Other
  '.php': 'php',
  '.go': 'go',
  '.rs': 'rust',
  '.swift': 'swift',
};

/**
 * Детектира програмния език по име на файл или разширение
 * @param filename - Име на файл с разширение
 * @returns Разпознатият език или undefined
 */
export function detectLanguageByFilename(filename: string): Lang | undefined {
  if (!filename) return undefined;
  
  const ext = filename.toLowerCase();
  
  // Проверка за точно съвпадение с разширение
  for (const [extension, lang] of Object.entries(EXTENSION_MAP)) {
    if (ext.endsWith(extension)) {
      return lang;
    }
  }
  
  return undefined;
}

/**
 * Опит за детекция на език по съдържанието на кода
 * @param code - Код за анализ
 * @returns Разпознатият език или undefined
 */
export function detectLanguageByContent(code: string): Lang | undefined {
  if (!code || code.trim().length === 0) return undefined;
  
  const trimmed = code.trim();
  
  // HTML - проверка за DOCTYPE или HTML тагове
  if (trimmed.includes('<!DOCTYPE') || 
      /<html[\s>]/i.test(trimmed) ||
      /<head[\s>]/i.test(trimmed) ||
      /<body[\s>]/i.test(trimmed)) {
    return 'html';
  }
  
  // XML - проверка за XML декларация
  if (trimmed.startsWith('<?xml')) {
    return 'xml';
  }
  
  // JSON - проверка за валиден JSON синтаксис
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }
  
  // Python - проверка за Python-специфични ключови думи
  if (/^(def|class|import|from)\s+/m.test(trimmed) ||
      /:\s*$/m.test(trimmed)) {
    return 'python';
  }
  
  // PHP - проверка за PHP тагове
  if (trimmed.includes('<?php')) {
    return 'php';
  }
  
  // SQL - проверка за SQL ключови думи
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s+/im.test(trimmed)) {
    return 'sql';
  }
  
  // Ruby - проверка за Ruby специфични неща
  if (/^(def|class|module|require)\s+/m.test(trimmed) ||
      trimmed.includes('puts ') ||
      /=begin[\s\S]*=end/m.test(trimmed)) {
    return 'ruby';
  }
  
  // Java - проверка за Java специфични патърни
  if (/^(public|private|protected)\s+(class|interface|enum)/m.test(trimmed) ||
      trimmed.includes('System.out.println')) {
    return 'java';
  }
  
  // C# - проверка за C# специфични неща
  if (trimmed.includes('using System;') ||
      /namespace\s+\w+/m.test(trimmed)) {
    return 'csharp';
  }
  
  // Go - проверка за Go специфични keywords
  if (/^package\s+\w+/m.test(trimmed) ||
      /^func\s+\w+/m.test(trimmed) ||
      trimmed.includes('fmt.Println')) {
    return 'go';
  }
  
  // Rust - проверка за Rust keywords
  if (/^(fn|pub fn|impl|trait|mod|use)\s+/m.test(trimmed) ||
      trimmed.includes('println!')) {
    return 'rust';
  }
  
  // Swift - проверка за Swift keywords
  if (/^(func|var|let|class|struct|enum)\s+\w+/m.test(trimmed) &&
      (trimmed.includes(': ') || trimmed.includes('-> '))) {
    return 'swift';
  }
  
  // TypeScript - проверка за TypeScript типове
  if (/:\s*(string|number|boolean|any|void|never)\s*[=;,\)]/m.test(trimmed) ||
      trimmed.includes('interface ') ||
      trimmed.includes('type ')) {
    return 'typescript';
  }
  
  // JavaScript - fallback за JS синтаксис
  if (/^(function|const|let|var|class|export|import)\s+/m.test(trimmed) ||
      trimmed.includes('=>')) {
    return 'javascript';
  }
  
  // CSS - проверка за CSS селектори
  if (/[.#]?\w+\s*\{[\s\S]*\}/m.test(trimmed)) {
    return 'css';
  }
  
  return undefined;
}

/**
 * Детектира езика чрез комбиниране на методи
 * @param filename - Опционално име на файл
 * @param code - Опционално съдържание на код
 * @returns Разпознатият език или undefined
 */
export function detectLanguage(filename?: string, code?: string): Lang | undefined {
  // Първо опитваме по filename (по-надеждно)
  if (filename) {
    const langByFilename = detectLanguageByFilename(filename);
    if (langByFilename) return langByFilename;
  }
  
  // Ако няма filename или не сме успели да разпознаем, опитваме по съдържание
  if (code) {
    return detectLanguageByContent(code);
  }
  
  return undefined;
}