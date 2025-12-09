# Testing Strategy

This document outlines the testing approach for the **GridCodeGenius** project.

## Quick Start

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Results

✅ **81 tests** across **3 test files** — all passing

## Test Structure

```
src/
├── test/
│   └── setup.ts                  # Test setup and global mocks
├── utils/
│   └── grid.test.ts              # 32 tests — Grid utilities
├── contexts/
│   └── GridContext.test.ts       # 41 tests — Reducer logic
└── components/
    └── LanguageSelector.test.tsx # 8 tests — Component behavior
```

## Tests by User Journey

Tests are organized around **user journeys** rather than just function names:

### 🎨 Grid Initialization

- Creating empty matrices with correct dimensions
- Single cell and rectangular grid handling

### 🔄 Grid Orientation Toggle

- Swapping rows/columns on transpose
- Preserving cell data during transpose
- Double toggle returning to original state

### 📐 Canvas Sizing

- Responsive dimension calculations
- Cell size bounds (15-30px)
- Horizontal/vertical orientation handling

### 🖌️ Painting Cells

- Setting cell color and symbol
- Clearing cells back to null
- Selected color/symbol updates

### 🧹 Clearing the Grid

- Resetting matrix while preserving dimensions
- Recreating empty matrix on grid update

### 📤 Export Flow

- Opening/closing export modal
- Paper size selection (A3, A4, A5)

### 🎨 Color Palette Management

- Adding/removing/updating colors
- Selected color fallback on removal
- Color validation utilities

### 🌐 Language Selection

- Switching between EN and RO
- Visual feedback for active language
- Button rendering and click handling

## Configuration

Uses **Vitest** with Astro's `getViteConfig` for seamless integration.

### Key Settings

- **Environment:** `jsdom` (browser-like testing)
- **Globals:** `true` (no need to import `describe`, `it`, `expect`)
- **Coverage:** v8 provider with text and HTML reports

## Writing Tests

### Unit Tests (Pure Functions)

```typescript
import { describe, it, expect } from 'vitest';
import { createEmptyMatrix } from './grid.ts';

describe('createEmptyMatrix', () => {
    it('creates matrix with correct dimensions', () => {
        const matrix = createEmptyMatrix(3, 4);
        expect(Object.keys(matrix)).toHaveLength(3);
    });
});
```

### Reducer Tests

```typescript
import { gridReducer, initialState } from './GridContext.tsx';

describe('SET_ROWS', () => {
    it('updates row count', () => {
        const result = gridReducer(initialState, { type: 'SET_ROWS', payload: 15 });
        expect(result.rows).toBe(15);
    });
});
```

### Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from './LanguageSelector.tsx';

it('calls onLanguageChange when button clicked', () => {
    const mockFn = vi.fn();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={mockFn} />);
    fireEvent.click(screen.getByText('RO'));
    expect(mockFn).toHaveBeenCalledWith('ro');
});
```

## Coverage Goals

| Metric     | Target |
| ---------- | ------ |
| Statements | > 70%  |
| Branches   | > 60%  |
| Functions  | > 80%  |
| Lines      | > 70%  |
