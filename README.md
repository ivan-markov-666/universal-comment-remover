# Universal Comment Remover

🚀 Универсален инструмент за премахване на коментари от код на множество програмни езици, разработен с TypeScript.

## ✨ Възможности

- 🌐 **Поддръжка на 18+ езика**: JavaScript, TypeScript, Python, Java, C#, C, C++, Ruby, PHP, Go, Rust, Swift, HTML, CSS, SQL, YAML, JSON, XML
- 🔍 **Автоматично разпознаване на език** по файлово разширение или съдържание
- 📝 **Запазване на лицензионни коментари** (опционално)
- 🔒 **Типова безопасност** с пълна TypeScript поддръжка
- ⚡ **Висока производителност** с минимални зависимости
- 🧪 **Dry-run режим** за предварителен преглед
- 📦 **Лесна интеграция** в Node.js и TypeScript проекти

## 📦 Инсталация

```bash
npm install universal-comment-remover
```

## 🚀 Бърз старт

### TypeScript

```typescript
import { removeComments } from 'universal-comment-remover';

const code = `
// This is a comment
const hello = () => {
  console.log("Hello World"); // Inline comment
};
`;

const result = removeComments(code, { language: 'javascript' });
console.log(result.code);
// Изход:
// const hello = () => {
//   console.log("Hello World");
// };
```

### JavaScript (CommonJS)

```javascript
const { removeComments } = require('universal-comment-remover');

const code = '# Python comment\nprint("Hello")';
const result = removeComments(code, { language: 'python' });
console.log(result.code); // print("Hello")
```

### JavaScript (ES Modules)

```javascript
import { removeComments } from 'universal-comment-remover';

const result = removeComments(myCode, { filename: 'script.js' });
```

## 📖 API Документация

### `removeComments(code: string, options?: RemoveOptions): RemoveResult`

Главна функция за премахване на коментари.

#### Параметри

- **`code`** (string): Входен код за обработка
- **`options`** (RemoveOptions, опционално): Опции за настройка

#### RemoveOptions

```typescript
interface RemoveOptions {
  language?: Lang;              // Явно указване на език
  filename?: string;            // Име на файл за автоматично разпознаване
  preserveLicense?: boolean;    // Запазване на лицензионни коментари (default: false)
  dryRun?: boolean;            // Режим за тестване без промяна (default: false)
  keepEmptyLines?: boolean;    // Запазване на празни редове (default: false)
}
```

#### RemoveResult

```typescript
interface RemoveResult {
  code: string;                 // Обработеният код
  removedCount: number;         // Брой премахнати коментари
  detectedLanguage?: Lang;      // Автоматично разпознатият език
}
```

#### Поддържани езици (Lang)

```typescript
type Lang = 
  | "javascript" | "typescript" | "python" | "ruby" 
  | "java" | "csharp" | "c" | "cpp"
  | "html" | "css" | "sql" | "yaml"
  | "json" | "xml" | "php" | "go" 
  | "rust" | "swift";
```

## 🎯 Примери за употреба

### Автоматично разпознаване на език

```typescript
import { removeComments } from 'universal-comment-remover';

// По име на файл
const result1 = removeComments(code, { filename: 'script.py' });
console.log(result1.detectedLanguage); // "python"

// По съдържание
const htmlCode = '<!DOCTYPE html><!-- Comment --><html></html>';
const result2 = removeComments(htmlCode);
console.log(result2.detectedLanguage); // "html"
```

### Запазване на лицензионни коментари

```typescript
const code = `
/*! MIT License - Copyright (c) 2024 */
// Regular comment
const x = 5;
`;

const result = removeComments(code, {
  language: 'javascript',
  preserveLicense: true
});

console.log(result.code);
// Изход:
// /*! MIT License - Copyright (c) 2024 */
// const x = 5;
```

### Dry-run режим

```typescript
const code = '// Comment\nconst x = 5;';

const result = removeComments(code, {
  language: 'javascript',
  dryRun: true
});

console.log(result.code === code); // true (кодът не е променен)
console.log(result.removedCount);  // 1 (колко коментари биха били премахнати)
```

### Работа с различни езици

#### Python

```typescript
const pythonCode = `
# This is a comment
def hello():
    """Docstring"""
    print("Hello")  # Inline comment
`;

const result = removeComments(pythonCode, { language: 'python' });
```

#### Java

```typescript
const javaCode = `
// Single line comment
/* Multi-line
   comment */
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello"); // Inline
    }
}
`;

const result = removeComments(javaCode, { language: 'java' });
```

#### HTML

```typescript
const htmlCode = `
<!-- This is a comment -->
<div class="container">
  <!-- Another comment -->
  <p>Content</p>
</div>
`;

const result = removeComments(htmlCode, { language: 'html' });
```

#### SQL

```typescript
const sqlCode = `
-- Single line comment
/* Multi-line
   comment */
SELECT * FROM users;
`;

const result = removeComments(sqlCode, { language: 'sql' });
```

## 🔧 CLI употреба (идея за бъдеща версия)

```bash
# Премахване на коментари от файл
ucr input.js -o output.js

# С автоматично разпознаване
ucr src/**/*.ts --preserve-license

# Dry-run режим
ucr script.py --dry-run
```

## 🧪 Тестване

```bash
# Изпълнение на тестове
npm test

# Тестове с coverage
npm test -- --coverage

# Watch режим
npm test -- --watch
```

## 🏗️ Разработка

```bash
# Клониране на репото
git clone https://github.com/yourusername/universal-comment-remover.git
cd universal-comment-remover

# Инсталация на dependencies
npm install

# Build
npm run build

# Watch режим за разработка
npm run dev
```

## 📁 Структура на проекта

```
universal-comment-remover/
├── src/
│   ├── index.ts              # Главен entry point
│   ├── types.ts              # TypeScript типове
│   ├── detectors/            # Детектори за език
│   │   └── language-detector.ts
│   └── removers/             # Специфични removers за езици
│       ├── javascript-remover.ts
│       ├── python-remover.ts
│       ├── css-html-remover.ts
│       ├── sql-remover.ts
│       ├── c-style-remover.ts
│       └── other-remover.ts
├── test/                     # Тестове
├── dist/                     # Компилирани файлове (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🤝 Принос

Приносът е добре дошъл! Моля следвайте тези стъпки:

1. Fork на репото
2. Създайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit на промените (`git commit -m 'Add amazing feature'`)
4. Push към branch (`git push origin feature/amazing-feature`)
5. Отворете Pull Request

## 📝 Лиценз

MIT License - вижте [LICENSE](LICENSE) файла за детайли.

## 🙏 Признания

- [strip-comments](https://github.com/jonschlinkert/strip-comments) - за JavaScript коментари
- [strip-json-comments](https://github.com/sindresorhus/strip-json-comments) - за JSON коментари

## 📞 Контакт

- GitHub: [yourusername](https://github.com/yourusername)
- Issues: [github.com/yourusername/universal-comment-remover/issues](https://github.com/yourusername/universal-comment-remover/issues)

## 🗺️ Roadmap

- [ ] CLI инструмент
- [ ] Поддръжка на повече езици (Kotlin, Scala, Haskell)
- [ ] Плъгини за редактори (VS Code, IntelliJ)
- [ ] GitHub Action за автоматично премахване на коментари
- [ ] Stream API за обработка на големи файлове
- [ ] Конфигурационни файлове (.ucremoverrc)

---

⭐ Ако този проект ви е полезен, дайте му звезда на GitHub!
