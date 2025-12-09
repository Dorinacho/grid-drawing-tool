/**
 * Grid Utility Tests
 *
 * Tests for pure utility functions in grid.ts
 * These tests cover the core grid manipulation logic.
 */
import { describe, it, expect } from 'vitest';
import {
    createEmptyMatrix,
    transposeMatrix,
    calculateCanvasDimensions,
    getUsedColors,
    getUsedSymbols,
    isColorInPalette,
    generateRandomColor,
    DEFAULT_COLORS,
    paperSizes,
    A4_ASPECT_RATIO,
} from './grid.ts';
import type { GridMatrix, CellData } from '../types/index.ts';

// ============================================================================
// User Journey: Creating and Initializing a Grid
// ============================================================================
describe('Grid Initialization', () => {
    describe('createEmptyMatrix', () => {
        it('creates matrix with correct number of rows', () => {
            const matrix = createEmptyMatrix(5, 10);
            expect(Object.keys(matrix)).toHaveLength(5);
        });

        it('creates matrix with correct number of columns per row', () => {
            const matrix = createEmptyMatrix(5, 10);
            expect(matrix[0]).toHaveLength(10);
            expect(matrix[4]).toHaveLength(10);
        });

        it('initializes all cells as null', () => {
            const matrix = createEmptyMatrix(3, 3);
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    expect(matrix[row][col]).toBeNull();
                }
            }
        });

        it('handles single cell grid (1x1)', () => {
            const matrix = createEmptyMatrix(1, 1);
            expect(Object.keys(matrix)).toHaveLength(1);
            expect(matrix[0]).toHaveLength(1);
            expect(matrix[0][0]).toBeNull();
        });

        it('handles rectangular grids (more rows than cols)', () => {
            const matrix = createEmptyMatrix(10, 5);
            expect(Object.keys(matrix)).toHaveLength(10);
            expect(matrix[0]).toHaveLength(5);
        });

        it('handles rectangular grids (more cols than rows)', () => {
            const matrix = createEmptyMatrix(5, 10);
            expect(Object.keys(matrix)).toHaveLength(5);
            expect(matrix[0]).toHaveLength(10);
        });
    });
});

// ============================================================================
// User Journey: Rotating/Transposing the Grid
// ============================================================================
describe('Grid Orientation Toggle', () => {
    describe('transposeMatrix', () => {
        it('swaps rows and columns dimensions', () => {
            const matrix = createEmptyMatrix(3, 5);
            const result = transposeMatrix(matrix, 3, 5);
            expect(result.newRows).toBe(5);
            expect(result.newCols).toBe(3);
        });

        it('correctly transposes an empty matrix', () => {
            const matrix = createEmptyMatrix(2, 4);
            const result = transposeMatrix(matrix, 2, 4);
            expect(Object.keys(result.newMatrix)).toHaveLength(4);
            expect(result.newMatrix[0]).toHaveLength(2);
        });

        it('preserves cell data during transpose', () => {
            const matrix = createEmptyMatrix(2, 3);
            const cellData: CellData = { color: '#FF0000', symbol: 'X' };
            matrix[0][2] = cellData; // row 0, col 2

            const result = transposeMatrix(matrix, 2, 3);
            // After transpose, row 0, col 2 should become row 2, col 0
            expect(result.newMatrix[2][0]).toEqual(cellData);
        });

        it('handles square matrix transpose', () => {
            const matrix = createEmptyMatrix(3, 3);
            matrix[0][1] = { color: '#FF0000', symbol: 'A' };
            matrix[1][2] = { color: '#00FF00', symbol: 'B' };

            const result = transposeMatrix(matrix, 3, 3);
            expect(result.newRows).toBe(3);
            expect(result.newCols).toBe(3);
            expect(result.newMatrix[1][0]).toEqual({ color: '#FF0000', symbol: 'A' });
            expect(result.newMatrix[2][1]).toEqual({ color: '#00FF00', symbol: 'B' });
        });

        it('double transpose returns to original dimensions', () => {
            const matrix = createEmptyMatrix(3, 5);
            const first = transposeMatrix(matrix, 3, 5);
            const second = transposeMatrix(first.newMatrix, first.newRows, first.newCols);
            expect(second.newRows).toBe(3);
            expect(second.newCols).toBe(5);
        });
    });
});

// ============================================================================
// User Journey: Canvas Sizing for Display
// ============================================================================
describe('Canvas Dimension Calculations', () => {
    describe('calculateCanvasDimensions', () => {
        it('returns valid dimensions for horizontal orientation', () => {
            const result = calculateCanvasDimensions(10, 20, true);
            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
            expect(result.cellSize).toBeGreaterThanOrEqual(15);
            expect(result.cellSize).toBeLessThanOrEqual(30);
        });

        it('returns valid dimensions for vertical orientation', () => {
            const result = calculateCanvasDimensions(20, 10, false);
            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
        });

        it('cell size respects minimum bound (15px)', () => {
            // Large grid should hit minimum cell size
            const result = calculateCanvasDimensions(100, 100, true);
            expect(result.cellSize).toBeGreaterThanOrEqual(15);
        });

        it('cell size respects maximum bound (30px)', () => {
            // Small grid could hit maximum cell size
            const result = calculateCanvasDimensions(5, 5, true);
            expect(result.cellSize).toBeLessThanOrEqual(30);
        });

        it('canvas dimensions are multiples of cell size', () => {
            const result = calculateCanvasDimensions(10, 15, true);
            expect(result.width).toBe(result.cellSize * 15);
            expect(result.height).toBe(result.cellSize * 10);
        });
    });
});

// ============================================================================
// User Journey: Painting and Tracking Used Colors/Symbols
// ============================================================================
describe('Grid Content Analysis', () => {
    describe('getUsedColors', () => {
        it('returns empty array for empty matrix', () => {
            const matrix = createEmptyMatrix(3, 3);
            const colors = getUsedColors(matrix, 3, 3);
            expect(colors).toEqual([]);
        });

        it('returns unique colors from matrix', () => {
            const matrix = createEmptyMatrix(2, 2);
            matrix[0][0] = { color: '#FF0000', symbol: null };
            matrix[0][1] = { color: '#00FF00', symbol: null };
            matrix[1][0] = { color: '#FF0000', symbol: null }; // duplicate

            const colors = getUsedColors(matrix, 2, 2);
            expect(colors).toHaveLength(2);
            expect(colors).toContain('#FF0000');
            expect(colors).toContain('#00FF00');
        });

        it('ignores cells without colors', () => {
            const matrix = createEmptyMatrix(2, 2);
            matrix[0][0] = { color: '#FF0000', symbol: null };
            matrix[1][1] = { color: '', symbol: 'X' } as CellData;

            const colors = getUsedColors(matrix, 2, 2);
            expect(colors).toHaveLength(1);
            expect(colors[0]).toBe('#FF0000');
        });
    });

    describe('getUsedSymbols', () => {
        it('returns empty array for empty matrix', () => {
            const matrix = createEmptyMatrix(3, 3);
            const symbols = getUsedSymbols(matrix, 3, 3);
            expect(symbols).toEqual([]);
        });

        it('returns unique symbols from matrix', () => {
            const matrix = createEmptyMatrix(2, 2);
            matrix[0][0] = { color: '#FF0000', symbol: 'A' };
            matrix[0][1] = { color: '#00FF00', symbol: 'B' };
            matrix[1][0] = { color: '#0000FF', symbol: 'A' }; // duplicate symbol

            const symbols = getUsedSymbols(matrix, 2, 2);
            expect(symbols).toHaveLength(2);
            expect(symbols).toContain('A');
            expect(symbols).toContain('B');
        });

        it('ignores cells without symbols', () => {
            const matrix = createEmptyMatrix(2, 2);
            matrix[0][0] = { color: '#FF0000', symbol: 'X' };
            matrix[1][1] = { color: '#00FF00', symbol: null };

            const symbols = getUsedSymbols(matrix, 2, 2);
            expect(symbols).toHaveLength(1);
            expect(symbols[0]).toBe('X');
        });
    });
});

// ============================================================================
// User Journey: Managing Color Palette
// ============================================================================
describe('Color Palette Management', () => {
    describe('isColorInPalette', () => {
        it('returns true when color exists in palette', () => {
            const palette = ['#FF0000', '#00FF00', '#0000FF'];
            expect(isColorInPalette('#FF0000', palette)).toBe(true);
        });

        it('returns false when color does not exist in palette', () => {
            const palette = ['#FF0000', '#00FF00', '#0000FF'];
            expect(isColorInPalette('#FFFFFF', palette)).toBe(false);
        });

        it('is case-sensitive for hex colors', () => {
            const palette = ['#FF0000'];
            expect(isColorInPalette('#ff0000', palette)).toBe(false);
        });

        it('handles empty palette', () => {
            expect(isColorInPalette('#FF0000', [])).toBe(false);
        });
    });

    describe('generateRandomColor', () => {
        it('returns a valid hex color string', () => {
            const color = generateRandomColor();
            expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });

        it('returns a color from the predefined set', () => {
            const validColors = [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                '#DDA0DD', '#98D8C8', '#F7DC6F', '#FF8A80', '#82B1FF',
                '#B39DDB', '#A5D6A7', '#FFCC02', '#FF6E40', '#26C6DA',
                '#AB47BC', '#66BB6A', '#FFA726', '#EC407A', '#42A5F5',
            ];
            const color = generateRandomColor();
            expect(validColors).toContain(color);
        });
    });

    describe('DEFAULT_COLORS', () => {
        it('has 8 default colors', () => {
            expect(DEFAULT_COLORS).toHaveLength(8);
        });

        it('all colors are valid hex strings', () => {
            DEFAULT_COLORS.forEach(color => {
                expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
            });
        });
    });
});

// ============================================================================
// Constants and Configuration
// ============================================================================
describe('Grid Constants', () => {
    describe('A4_ASPECT_RATIO', () => {
        it('equals 297/210 (A4 dimensions in mm)', () => {
            expect(A4_ASPECT_RATIO).toBeCloseTo(297 / 210, 5);
        });
    });

    describe('paperSizes', () => {
        it('contains A3, A4, and A5 sizes', () => {
            expect(paperSizes).toHaveProperty('A3');
            expect(paperSizes).toHaveProperty('A4');
            expect(paperSizes).toHaveProperty('A5');
        });

        it('A4 has correct dimensions (297x210 mm)', () => {
            expect(paperSizes.A4).toEqual({ width: 297, height: 210 });
        });

        it('A3 is larger than A4', () => {
            expect(paperSizes.A3.width * paperSizes.A3.height)
                .toBeGreaterThan(paperSizes.A4.width * paperSizes.A4.height);
        });

        it('A4 is larger than A5', () => {
            expect(paperSizes.A4.width * paperSizes.A4.height)
                .toBeGreaterThan(paperSizes.A5.width * paperSizes.A5.height);
        });
    });
});
