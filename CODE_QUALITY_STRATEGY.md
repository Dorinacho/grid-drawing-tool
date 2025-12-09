# Code Quality & Maintainability Strategy

This document outlines the implementation strategy for improving code quality and maintainability in the Grid Drawing Tool project.

---

## Phase 1: Linting & Formatting Setup

### 1.1 Install ESLint with React/TypeScript Support

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

**Configuration** (`eslint.config.js`):

- Use flat config format (ESLint 9+)
- Enable `plugin:react-hooks/recommended` for React hooks rules
- Enable `plugin:jsx-a11y/recommended` for accessibility checks
- Integrate with TypeScript parser

### 1.2 Install Prettier

```bash
pnpm add -D prettier eslint-config-prettier
```

**Configuration** (`.prettierrc`):

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 100
}
```

### 1.3 Setup Git Hooks with Husky & Lint-Staged

```bash
pnpm add -D husky lint-staged
npx husky init
```

**Configuration** (`package.json`):

```json
{
    "lint-staged": {
        "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
        "*.{json,md,css}": ["prettier --write"]
    }
}
```

### 1.4 Add NPM Scripts

```json
{
    "scripts": {
        "lint": "eslint src/",
        "lint:fix": "eslint src/ --fix",
        "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
        "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\""
    }
}
```

---

## Phase 2: Clean Code Improvements

### 2.1 Remove Console Logs

| File                            | Lines                                                  | Action                               |
| ------------------------------- | ------------------------------------------------------ | ------------------------------------ |
| `src/utils/pdf.ts`              | 66, 79, 106, 120-121, 151, 190, 199, 205, 213-214, 221 | Remove or replace with debug utility |
| `src/components/GridCanvas.tsx` | 31, 59                                                 | Remove                               |

**Option A:** Remove all `console.log` statements  
**Option B:** Create a debug utility:

```typescript
// src/utils/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
    log: (...args: unknown[]) => isDev && console.log(...args),
    error: (...args: unknown[]) => console.error(...args),
    warn: (...args: unknown[]) => isDev && console.warn(...args),
};
```

### 2.2 Remove Dead Code & TODOs

| File                 | Line | Content                        | Action                 |
| -------------------- | ---- | ------------------------------ | ---------------------- |
| `GridCodeGenius.tsx` | 15   | `// TODO code cleanup`         | Address or remove      |
| `GridCodeGenius.tsx` | 16   | `// TODO export modal actions` | Implement or remove    |
| `GridCodeGenius.tsx` | 17   | `// TODO UI polish`            | Track in issue tracker |

### 2.3 Create Constants File

```typescript
// src/constants.ts
export const GRID_DEFAULTS = {
    MIN_ROWS: 1,
    MAX_ROWS: 100,
    MIN_COLS: 1,
    MAX_COLS: 100,
    DEFAULT_ROWS: 10,
    DEFAULT_COLS: 10,
} as const;

export const CANVAS_DEFAULTS = {
    MAX_WIDTH: 800,
    MAX_HEIGHT: 600,
    CELL_PADDING: 2,
} as const;

export const PDF_DEFAULTS = {
    MARGIN_MM: 10,
    SYMBOL_SIZE_RATIO: 0.8,
} as const;
```

---

## Phase 3: Type Safety Improvements

### 3.1 Fix `any` Usage

| File               | Line | Current    | Fix          |
| ------------------ | ---- | ---------- | ------------ |
| `src/utils/pdf.ts` | 54   | `pdf: any` | `pdf: jsPDF` |

```typescript
// Before
const drawSymbolInPDF = async (pdf: any, ...) => { ... }

// After
import { jsPDF } from 'jspdf';
const drawSymbolInPDF = async (pdf: jsPDF, ...) => { ... }
```

### 3.2 Verify TSConfig Settings

Ensure `tsconfig.json` has:

```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
    }
}
```

---

## Phase 4: Code Refactoring

### 4.1 Reduce PDF Logic Duplication

Extract shared logic from `exportGridToPDF` and `previewGridToPDF`:

```typescript
// src/utils/pdf.ts

// Shared helper
const createGridPDF = async (
  matrix: GridMatrix,
  rows: number,
  cols: number,
  isHorizontal: boolean,
  paperSize: PaperSize
): Promise<jsPDF> => {
  // Shared PDF creation and grid drawing logic
  const pdf = new jsPDF({ ... });
  // ... draw grid
  return pdf;
};

// Export function
export const exportGridToPDF = async (...) => {
  const pdf = await createGridPDF(matrix, rows, cols, isHorizontal, paperSize);
  pdf.save(filename);
};

// Preview function
export const previewGridToPDF = async (...) => {
  const pdf = await createGridPDF(matrix, rows, cols, isHorizontal, paperSize);
  const blobUrl = URL.createObjectURL(pdf.output('blob'));
  window.open(blobUrl, '_blank');
};
```

---

## Implementation Order

| Priority  | Phase                             | Effort    | Impact                 |
| --------- | --------------------------------- | --------- | ---------------------- |
| 🔴 High   | Phase 1.1-1.2 (ESLint + Prettier) | 1 hour    | Prevents future issues |
| 🔴 High   | Phase 3.1 (Fix `any`)             | 15 min    | Type safety            |
| 🟡 Medium | Phase 1.3 (Husky)                 | 30 min    | Enforces quality       |
| 🟡 Medium | Phase 2.1 (Console logs)          | 30 min    | Clean production code  |
| 🟢 Low    | Phase 2.3 (Constants)             | 1 hour    | Better maintainability |
| 🟢 Low    | Phase 4.1 (Refactor PDF)          | 1-2 hours | Reduces duplication    |

---

## Verification Checklist

- [ ] ESLint runs without errors: `pnpm lint`
- [ ] Prettier formats correctly: `pnpm format:check`
- [ ] Husky blocks bad commits
- [ ] No `any` types in codebase
- [ ] No `console.log` in production code
- [ ] All TODOs addressed or tracked
- [ ] Constants centralized
- [ ] Tests still pass: `pnpm test:run`
