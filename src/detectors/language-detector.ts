import { Lang } from '../types';

/**
 * Mapping of file extensions to programming languages
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
 * Detects the programming language by filename or extension
 * @param filename - Filename with extension
 * @returns Detected language or undefined
 */
export function detectLanguageByFilename(filename: string): Lang | undefined {
  if (!filename) return undefined;
  
  const ext = filename.toLowerCase();
  
  // Check for exact extension match
  for (const [extension, lang] of Object.entries(EXTENSION_MAP)) {
    if (ext.endsWith(extension)) {
      return lang;
    }
  }
  
  return undefined;
}

/**
 * Attempts to detect the language by code content
 * @param code - Code to analyze
 * @returns Detected language or undefined
 */
export function detectLanguageByContent(code: string): Lang | undefined {
  if (!code || code.trim().length === 0) return undefined;
  
  const trimmed = code.trim();
  
  // HTML - check for DOCTYPE or HTML tags
  if (trimmed.includes('<!DOCTYPE') || 
      /<html[\s>]/i.test(trimmed) ||
      /<head[\s>]/i.test(trimmed) ||
      /<body[\s>]/i.test(trimmed)) {
    return 'html';
  }
  
  // XML - check for XML declaration
  if (trimmed.startsWith('<?xml')) {
    return 'xml';
  }
  
  // JSON - check for valid JSON syntax
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }
  
  // Python - check for Python-specific keywords
  if (/^(def|class|import|from)\s+/m.test(trimmed) ||
      /:\s*$/m.test(trimmed)) {
    return 'python';
  }
  
  // PHP - check for PHP tags
  if (trimmed.includes('<?php')) {
    return 'php';
  }
  
  // SQL - check for SQL keywords
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s+/im.test(trimmed)) {
    return 'sql';
  }
  
  // Ruby - check for Ruby-specific patterns
  if (/^(def|class|module|require)\s+/m.test(trimmed) ||
      trimmed.includes('puts ') ||
      /=begin[\s\S]*=end/m.test(trimmed)) {
    return 'ruby';
  }
  
  // Java - check for Java-specific patterns
  if (/^(public|private|protected)\s+(class|interface|enum)/m.test(trimmed) ||
      trimmed.includes('System.out.println')) {
    return 'java';
  }
  
  // C# - check for C#-specific patterns
  if (trimmed.includes('using System;') ||
      /namespace\s+\w+/m.test(trimmed)) {
    return 'csharp';
  }
    
// Rust - check for Rust-specific patterns
  if (/^(fn|pub fn|impl|trait|mod|use)\s+/m.test(trimmed) ||
      trimmed.includes('println!')) {
    return 'rust';
  }

  // Swift - check for Swift-specific patterns (before Go)
  if (/^(func|var|let|class|struct|enum)\s+\w+/m.test(trimmed) &&
      (trimmed.includes(': ') || trimmed.includes('-> '))) {
    return 'swift';
  }

  // Go - check for Go-specific patterns (after Swift)
  if (/^package\s+\w+/m.test(trimmed) ||
      /^func\s+\w+/m.test(trimmed) ||
      trimmed.includes('fmt.Println')) {
    return 'go';
  }
  
  // TypeScript - check for TypeScript types
  if (/:\s*(string|number|boolean|any|void|never)\s*[=;,\)]/m.test(trimmed) ||
      trimmed.includes('interface ') ||
      trimmed.includes('type ')) {
    return 'typescript';
  }
  
  // JavaScript - fallback for JS syntax
  if (/^(function|const|let|var|class|export|import)\s+/m.test(trimmed) ||
      trimmed.includes('=>')) {
    return 'javascript';
  }
  
  // CSS - check for CSS selectors
  if (/[.#]?\w+\s*\{[\s\S]*\}/m.test(trimmed)) {
    return 'css';
  }
  
  return undefined;
}

/**
 * Detects the language by combining multiple methods
 * @param filename - Optional filename
 * @param code - Optional code content
 * @returns Detected language or undefined
 */
export function detectLanguage(filename?: string, code?: string): Lang | undefined {
  // First try by filename (more reliable)
  if (filename) {
    const langByFilename = detectLanguageByFilename(filename);
    if (langByFilename) return langByFilename;
  }
  
  // If no filename or couldn't detect by filename, try by content
  if (code) {
    return detectLanguageByContent(code);
  }
  
  return undefined;
}