/**
 * Centralized constants for the Grid Drawing Tool
 */

// Grid dimension constraints
export const GRID_DEFAULTS = {
    MIN_ROWS: 1,
    MAX_ROWS: 100,
    MIN_COLS: 1,
    MAX_COLS: 100,
    DEFAULT_ROWS: 10,
    DEFAULT_COLS: 10,
} as const;

// Canvas rendering constants
export const CANVAS_DEFAULTS = {
    MAX_WIDTH: 800,
    MAX_HEIGHT: 600,
    CELL_PADDING: 2,
    MIN_CELL_SIZE: 10,
    MAX_CELL_SIZE: 100,
} as const;

// PDF export constants
export const PDF_DEFAULTS = {
    MARGIN_MM: 10,
    SYMBOL_SIZE_RATIO: 0.8,
    FALLBACK_SIZE_RATIO: 0.4,
    GRID_LINE_WIDTH: 0.1,
    GRID_LINE_COLOR: { r: 200, g: 200, b: 200 },
} as const;

// Symbol rendering constants
export const SYMBOL_DEFAULTS = {
    STROKE_WIDTH: 2,
    VIEWBOX_SIZE: 24,
    FILLED_SYMBOLS: ['circle', 'square', 'triangle', 'diamond', 'star', 'heart'] as const,
} as const;

// Color defaults
export const COLOR_DEFAULTS = {
    BACKGROUND: '#FFFFFF',
    GRID_LINE: '#C8C8C8',
    DEFAULT_SYMBOL: '#000000',
} as const;
