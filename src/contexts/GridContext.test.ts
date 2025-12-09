/**
 * GridContext Reducer Tests
 *
 * Tests for the gridReducer which manages all application state.
 * Organized by user journey / action type.
 */
import { describe, it, expect } from 'vitest';
import { gridReducer, initialState } from './GridContext.tsx';
import { createEmptyMatrix, DEFAULT_COLORS } from '../utils/grid.ts';

// ============================================================================
// Initial State Verification
// ============================================================================
describe('Initial State', () => {
    it('has correct default grid dimensions', () => {
        expect(initialState.rows).toBe(22);
        expect(initialState.cols).toBe(33);
    });

    it('has horizontal orientation by default', () => {
        expect(initialState.isHorizontal).toBe(true);
    });

    it('has first color selected by default', () => {
        expect(initialState.selectedColor).toBe(DEFAULT_COLORS[0]);
    });

    it('has no symbol selected by default', () => {
        expect(initialState.selectedSymbol).toBeNull();
    });

    it('has export modal closed by default', () => {
        expect(initialState.isExportModalOpen).toBe(false);
    });

    it('has A4 paper size selected by default', () => {
        expect(initialState.selectedPaperSize).toBe('A4');
    });

    it('has 4 initial colors in palette', () => {
        expect(initialState.colors).toHaveLength(4);
        expect(initialState.colors).toEqual(DEFAULT_COLORS.slice(0, 4));
    });
});

// ============================================================================
// User Journey: Changing Grid Dimensions
// ============================================================================
describe('Grid Dimension Actions', () => {
    describe('SET_ROWS', () => {
        it('updates row count', () => {
            const result = gridReducer(initialState, { type: 'SET_ROWS', payload: 15 });
            expect(result.rows).toBe(15);
        });

        it('preserves other state', () => {
            const result = gridReducer(initialState, { type: 'SET_ROWS', payload: 15 });
            expect(result.cols).toBe(initialState.cols);
            expect(result.selectedColor).toBe(initialState.selectedColor);
        });
    });

    describe('SET_COLS', () => {
        it('updates column count', () => {
            const result = gridReducer(initialState, { type: 'SET_COLS', payload: 25 });
            expect(result.cols).toBe(25);
        });

        it('preserves other state', () => {
            const result = gridReducer(initialState, { type: 'SET_COLS', payload: 25 });
            expect(result.rows).toBe(initialState.rows);
        });
    });
});

// ============================================================================
// User Journey: Painting Cells
// ============================================================================
describe('Cell Painting Actions', () => {
    describe('UPDATE_CELL', () => {
        it('sets cell data at specified position', () => {
            const cellData = { color: '#FF0000', symbol: 'X' };
            const result = gridReducer(initialState, {
                type: 'UPDATE_CELL',
                payload: { row: 5, col: 10, data: cellData },
            });
            expect(result.matrix[5][10]).toEqual(cellData);
        });

        it('creates row if it does not exist', () => {
            const state = { ...initialState, matrix: {} };
            const cellData = { color: '#FF0000', symbol: null };
            const result = gridReducer(state, {
                type: 'UPDATE_CELL',
                payload: { row: 0, col: 0, data: cellData },
            });
            expect(result.matrix[0]).toBeDefined();
            expect(result.matrix[0][0]).toEqual(cellData);
        });

        it('can clear a cell by setting data to null', () => {
            // First paint a cell
            let state = gridReducer(initialState, {
                type: 'UPDATE_CELL',
                payload: { row: 0, col: 0, data: { color: '#FF0000', symbol: null } },
            });
            // Then clear it
            state = gridReducer(state, {
                type: 'UPDATE_CELL',
                payload: { row: 0, col: 0, data: null },
            });
            expect(state.matrix[0][0]).toBeNull();
        });

        it('does not affect other cells', () => {
            let state = gridReducer(initialState, {
                type: 'UPDATE_CELL',
                payload: { row: 0, col: 0, data: { color: '#FF0000', symbol: null } },
            });
            state = gridReducer(state, {
                type: 'UPDATE_CELL',
                payload: { row: 1, col: 1, data: { color: '#00FF00', symbol: null } },
            });
            expect(state.matrix[0][0]).toEqual({ color: '#FF0000', symbol: null });
            expect(state.matrix[1][1]).toEqual({ color: '#00FF00', symbol: null });
        });
    });

    describe('SET_SELECTED_COLOR', () => {
        it('updates selected color', () => {
            const result = gridReducer(initialState, {
                type: 'SET_SELECTED_COLOR',
                payload: '#00FF00',
            });
            expect(result.selectedColor).toBe('#00FF00');
        });
    });

    describe('SET_SELECTED_SYMBOL', () => {
        it('updates selected symbol', () => {
            const result = gridReducer(initialState, {
                type: 'SET_SELECTED_SYMBOL',
                payload: 'A',
            });
            expect(result.selectedSymbol).toBe('A');
        });

        it('can set symbol to null', () => {
            let state = gridReducer(initialState, {
                type: 'SET_SELECTED_SYMBOL',
                payload: 'A',
            });
            state = gridReducer(state, {
                type: 'SET_SELECTED_SYMBOL',
                payload: null,
            });
            expect(state.selectedSymbol).toBeNull();
        });
    });
});

// ============================================================================
// User Journey: Clearing the Grid
// ============================================================================
describe('Grid Clear Actions', () => {
    describe('CLEAR_GRID', () => {
        it('resets matrix to empty', () => {
            // Paint some cells first
            let state = gridReducer(initialState, {
                type: 'UPDATE_CELL',
                payload: { row: 0, col: 0, data: { color: '#FF0000', symbol: 'X' } },
            });
            // Clear the grid
            state = gridReducer(state, { type: 'CLEAR_GRID' });
            // All cells should be null
            expect(state.matrix[0].every((cell: unknown) => cell === null)).toBe(true);
        });

        it('preserves grid dimensions', () => {
            const state = gridReducer(initialState, { type: 'CLEAR_GRID' });
            expect(state.rows).toBe(initialState.rows);
            expect(state.cols).toBe(initialState.cols);
        });
    });

    describe('UPDATE_GRID', () => {
        it('recreates empty matrix with current dimensions', () => {
            let state = { ...initialState, rows: 10, cols: 15 };
            state = gridReducer(state, { type: 'UPDATE_GRID' });
            expect(Object.keys(state.matrix)).toHaveLength(10);
            expect(state.matrix[0]).toHaveLength(15);
        });
    });
});

// ============================================================================
// User Journey: Toggling Orientation (Landscape/Portrait)
// ============================================================================
describe('Orientation Actions', () => {
    describe('TOGGLE_ORIENTATION', () => {
        it('flips isHorizontal flag', () => {
            expect(initialState.isHorizontal).toBe(true);
            const result = gridReducer(initialState, { type: 'TOGGLE_ORIENTATION' });
            expect(result.isHorizontal).toBe(false);
        });

        it('swaps rows and columns', () => {
            const state = { ...initialState, rows: 10, cols: 20 };
            const result = gridReducer(state, { type: 'TOGGLE_ORIENTATION' });
            expect(result.rows).toBe(20);
            expect(result.cols).toBe(10);
        });

        it('transposes matrix data', () => {
            let state = gridReducer(initialState, {
                type: 'UPDATE_CELL',
                payload: { row: 0, col: 5, data: { color: '#FF0000', symbol: 'X' } },
            });
            state = gridReducer(state, { type: 'TOGGLE_ORIENTATION' });
            // Cell at (0, 5) should now be at (5, 0)
            expect(state.matrix[5][0]).toEqual({ color: '#FF0000', symbol: 'X' });
        });

        it('double toggle returns to original dimensions', () => {
            let state = gridReducer(initialState, { type: 'TOGGLE_ORIENTATION' });
            state = gridReducer(state, { type: 'TOGGLE_ORIENTATION' });
            expect(state.rows).toBe(initialState.rows);
            expect(state.cols).toBe(initialState.cols);
            expect(state.isHorizontal).toBe(true);
        });
    });
});

// ============================================================================
// User Journey: Export Flow
// ============================================================================
describe('Export Actions', () => {
    describe('SET_EXPORT_MODAL_OPEN', () => {
        it('opens export modal', () => {
            const result = gridReducer(initialState, {
                type: 'SET_EXPORT_MODAL_OPEN',
                payload: true,
            });
            expect(result.isExportModalOpen).toBe(true);
        });

        it('closes export modal', () => {
            let state = gridReducer(initialState, {
                type: 'SET_EXPORT_MODAL_OPEN',
                payload: true,
            });
            state = gridReducer(state, {
                type: 'SET_EXPORT_MODAL_OPEN',
                payload: false,
            });
            expect(state.isExportModalOpen).toBe(false);
        });
    });

    describe('SET_SELECTED_PAPER_SIZE', () => {
        it('updates paper size to A3', () => {
            const result = gridReducer(initialState, {
                type: 'SET_SELECTED_PAPER_SIZE',
                payload: 'A3',
            });
            expect(result.selectedPaperSize).toBe('A3');
        });

        it('updates paper size to A5', () => {
            const result = gridReducer(initialState, {
                type: 'SET_SELECTED_PAPER_SIZE',
                payload: 'A5',
            });
            expect(result.selectedPaperSize).toBe('A5');
        });
    });
});

// ============================================================================
// User Journey: Managing Color Palette
// ============================================================================
describe('Color Palette Actions', () => {
    describe('SET_COLORS', () => {
        it('replaces entire color palette', () => {
            const newColors = ['#111111', '#222222'];
            const result = gridReducer(initialState, {
                type: 'SET_COLORS',
                payload: newColors,
            });
            expect(result.colors).toEqual(newColors);
        });
    });

    describe('ADD_COLOR', () => {
        it('adds color to palette', () => {
            const result = gridReducer(initialState, {
                type: 'ADD_COLOR',
                payload: '#ABCDEF',
            });
            expect(result.colors).toContain('#ABCDEF');
            expect(result.colors).toHaveLength(initialState.colors.length + 1);
        });
    });

    describe('REMOVE_COLOR', () => {
        it('removes color at specified index', () => {
            const originalLength = initialState.colors.length;
            const removedColor = initialState.colors[0];
            const result = gridReducer(initialState, {
                type: 'REMOVE_COLOR',
                payload: 0,
            });
            expect(result.colors).toHaveLength(originalLength - 1);
            expect(result.colors).not.toContain(removedColor);
        });

        it('updates selectedColor if removed color was selected', () => {
            // Select the first color explicitly
            let state = gridReducer(initialState, {
                type: 'SET_SELECTED_COLOR',
                payload: initialState.colors[0],
            });
            // Remove the first color
            state = gridReducer(state, { type: 'REMOVE_COLOR', payload: 0 });
            // Should fallback to the new first color
            expect(state.selectedColor).toBe(state.colors[0]);
        });
    });

    describe('UPDATE_COLOR', () => {
        it('updates color at specified index', () => {
            const result = gridReducer(initialState, {
                type: 'UPDATE_COLOR',
                payload: { index: 1, color: '#FEDCBA' },
            });
            expect(result.colors[1]).toBe('#FEDCBA');
        });

        it('updates selectedColor if updated color was selected', () => {
            // Select the second color
            let state = gridReducer(initialState, {
                type: 'SET_SELECTED_COLOR',
                payload: initialState.colors[1],
            });
            // Update the second color
            state = gridReducer(state, {
                type: 'UPDATE_COLOR',
                payload: { index: 1, color: '#NEWCOL' },
            });
            expect(state.selectedColor).toBe('#NEWCOL');
        });
    });
});

// ============================================================================
// User Journey: Language Selection
// ============================================================================
describe('Language Actions', () => {
    describe('SET_LANGUAGE', () => {
        it('updates language to English', () => {
            const result = gridReducer(initialState, {
                type: 'SET_LANGUAGE',
                payload: 'en',
            });
            expect(result.language).toBe('en');
        });

        it('updates language to Romanian', () => {
            const result = gridReducer(initialState, {
                type: 'SET_LANGUAGE',
                payload: 'ro',
            });
            expect(result.language).toBe('ro');
        });
    });
});

// ============================================================================
// Edge Cases
// ============================================================================
describe('Edge Cases', () => {
    it('returns unchanged state for unknown action', () => {
        // @ts-expect-error - Testing unknown action type
        const result = gridReducer(initialState, { type: 'UNKNOWN_ACTION' });
        expect(result).toBe(initialState);
    });
});
