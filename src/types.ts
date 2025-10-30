/**
 * Поддържани програмни езици
 */
export type Lang = 
  | "javascript" 
  | "typescript" 
  | "python" 
  | "ruby" 
  | "java" 
  | "csharp" 
  | "c" 
  | "cpp"
  | "html" 
  | "css" 
  | "sql" 
  | "yaml"
  | "json"
  | "xml"
  | "php"
  | "go"
  | "rust"
  | "swift";

/**
 * Опции за премахване на коментари
 */
export interface RemoveOptions {
  /**
   * Езикът на кода (ако не е указан, ще се опита автоматично разпознаване)
   */
  language?: Lang;
  
  /**
   * Име на файл за автоматично разпознаване на езика
   */
  filename?: string;
  
  /**
   * Запазване на лицензионни коментари (започващи с /*! или //**)
   */
  preserveLicense?: boolean;
  
  /**
   * Dry run режим - не променя кода, само връща какво би било премахнато
   */
  dryRun?: boolean;
  
  /**
   * Запазване на празни редове където са били коментарите
   */
  keepEmptyLines?: boolean;
}

/**
 * Резултат от премахване на коментари
 */
export interface RemoveResult {
  /**
   * Обработеният код
   */
  code: string;
  
  /**
   * Брой премахнати коментари
   */
  removedCount: number;
  
  /**
   * Разпознатият език
   */
  detectedLanguage?: Lang;
}
