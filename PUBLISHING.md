# Ръководство за публикуване на npm пакета

## Стъпки за публикуване

### 1. Подготовка преди публикуване

```bash
# Уверете се, че сте влезли в npm
npm login

# Проверете дали всички тестове минават
npm test

# Създайте production build
npm run build

# Проверете какво ще бъде публикувано
npm pack --dry-run
```

### 2. Обновяване на версията

```bash
# За patch версия (1.0.0 -> 1.0.1)
npm version patch

# За minor версия (1.0.0 -> 1.1.0)
npm version minor

# За major версия (1.0.0 -> 2.0.0)
npm version major
```

### 3. Публикуване

```bash
# Публикуване на пакета
npm publish

# За scoped package (@yourusername/package)
npm publish --access public
```

### 4. След публикуване

```bash
# Проверете дали пакетът е наличен
npm view universal-comment-remover

# Push на git tags
git push && git push --tags
```

## Проверка преди публикуване

### ✅ Checklist

- [ ] Всички тестове минават (`npm test`)
- [ ] Build-ът е успешен (`npm run build`)
- [ ] `package.json` е правилно конфигуриран
- [ ] `README.md` е актуален
- [ ] `LICENSE` файлът е на място
- [ ] `.npmignore` е правилно настроен
- [ ] Версията е обновена
- [ ] Git commit-ът е направен

### Проверка на package.json

Важни полета:
```json
{
  "name": "universal-comment-remover",
  "version": "1.0.0",
  "description": "...",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "keywords": [...],
  "license": "MIT"
}
```

## Локално тестване преди публикуване

### Използване на npm link

```bash
# В директорията на пакета
npm link

# В друг тестов проект
npm link universal-comment-remover

# Тествайте пакета
```

### Тестване със symlink

```bash
# Създайте тест проект
mkdir test-project && cd test-project
npm init -y

# Инсталирайте локалния пакет
npm install ../universal-comment-remover

# Тествайте
```

## GitHub Repository Setup

### 1. Създайте GitHub repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/universal-comment-remover.git
git push -u origin main
```

### 2. Добавете GitHub Actions за CI/CD

Създайте `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## Актуализиране на пакета

### Процес за обновяване

1. Направете промените
2. Актуализирайте тестовете
3. Обновете `README.md` и `CHANGELOG.md`
4. Увеличете версията
5. Commit и push
6. Публикувайте новата версия

### Семантично версиониране

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): Нови функционалности (backwards-compatible)
- **PATCH** (0.0.1): Bug fixes (backwards-compatible)

## Полезни команди

```bash
# Проверка на npm registry
npm view universal-comment-remover

# Проверка на инсталираната версия
npm list universal-comment-remover

# Unpublish (само в рамките на 72 часа)
npm unpublish universal-comment-remover@1.0.0

# Deprecate версия
npm deprecate universal-comment-remover@1.0.0 "Use version 1.0.1 instead"
```

## Troubleshooting

### Проблем: "Package name already exists"

Решение: Променете името в `package.json` или използвайте scoped package:
```json
{
  "name": "@yourusername/universal-comment-remover"
}
```

### Проблем: "403 Forbidden"

Решение: Уверете се, че сте влезли с правилния акаунт:
```bash
npm whoami
npm logout
npm login
```

### Проблем: TypeScript definitions не се намират

Решение: Проверете че:
- `declaration: true` в `tsconfig.json`
- `types` field в `package.json` сочи към `.d.ts` файловете
- `dist/` съдържа `.d.ts` файлове

## Best Practices

1. **Semantic Versioning**: Следвайте SemVer
2. **Changelog**: Поддържайте `CHANGELOG.md`
3. **Tests**: 100% test coverage за критична функционалност
4. **Documentation**: Актуална и пълна документация
5. **Breaking Changes**: Документирайте ги ясно
6. **Deprecation**: Дайте достатъчно време преди премахване на функционалности

## Ресурси

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
