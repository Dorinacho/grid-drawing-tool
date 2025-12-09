// Symbol definitions with SVG paths - SINGLE SOURCE OF TRUTH
// All symbol paths are defined here and used by both the canvas, PDF export, and picker modal

/**
 * Symbol category definitions with names for grouping
 */
export const SYMBOL_CATEGORIES = {
    custom: {
        name: 'custom',
        symbols: [
            'cross',
            'cross_double',
            'cross_big_plus',
            'backstitch',
            'running_dotted',
            'stem_stitch',
            'vertical_bar',
            'zigzag_compact',
            'wave',
            'teeth_small',
            'diamond',
            'diamond_filled',
            'diamond_column',
            'star8',
            'rosette',
            'leaf_simple',
            'vine_angular',
            'vine_chain',
            'wheat_spike',
            'staircase_steps',
            'column_of_rhombs',
            'corner_square_L',
            'center_line',
            'margin_line',
            'symmetry_marker',
        ],
    },
    shapes: {
        name: 'shapes',
        symbols: [
            'circle',
            'square',
            'square_filled',
            'square_outline',
            'triangle',
            'star',
            'heart',
        ],
    },
    arrows: {
        name: 'arrows',
        symbols: ['up', 'down', 'left', 'right', 'up-right', 'down-left'],
    },
    symbols: {
        name: 'symbols',
        symbols: ['check', 'x', 'plus', 'minus'],
    },
    misc: {
        name: 'misc',
        symbols: ['sun', 'moon', 'lightning', 'flower', 'target', 'gear'],
    },
} as const;

export type SymbolCategoryKey = keyof typeof SYMBOL_CATEGORIES;

/**
 * Master symbol definitions - all SVG paths in one place
 */
export const SYMBOL_DEFINITIONS: Record<string, string> = {
    // === SHAPES (forme de bază) ===
    circle: 'M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z',
    square: 'M0 0h24v24H0z',
    square_filled: 'M6 6h12v12H6z',
    square_outline: 'M4 4h16v16H4z',
    triangle: 'M12 0l12 24H0z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',

    // === CRUCI ȘI VARIANTE ===
    cross: 'M3 3L21 21M21 3L3 21',
    cross_double: 'M4 4L20 20M20 4L4 20M7 7L17 17M17 7L7 17',
    cross_big_plus: 'M10 0h4v24h-4zM0 10h24v4H0z',

    // === CUSĂTURI LINIARE / CONTURURI ===
    backstitch: 'M2 12h20', // linie continuă
    running_dotted: 'M2 12h4M8 12h4M14 12h4M20 12h2', // linii întrerupte (puncte/segmente)
    stem_stitch: 'M2 18L6 12L10 18L14 12L18 18L22 12', // oblic repetat

    // === BARE / UMPLERI ===
    vertical_bar: 'M11 2h2v20h-2z',

    // === ZIG-ZAG / UNDĂ / DINȚI DE LUP ===
    zigzag_compact: 'M2 6L6 18L10 6L14 18L18 6L22 18',
    wave: 'M2 12c4-6 8 6 12-6 4 12 8-6 12 6', // curbă stilizată (folosește stroke)
    teeth_small: 'M2 18L6 12L10 18L14 12L18 18L22 12', // dinți de lup / zigzag mai mic

    // === ROMBURI / DIAMANTE ===
    diamond: 'M12 4L20 12L12 20L4 12Z',
    diamond_filled: 'M12 4L20 12L12 20L4 12Z',
    diamond_column: 'M12 4L16 8L12 12L8 8Z M12 12L16 16L12 20L8 16Z', // două romburi în coloană

    // === STEA / ROZETĂ / MOTIVE SOLARE ===
    star8: 'M12 2L14.5 8.5L21 10L16.5 14.5L17.5 21L12 17.5L6.5 21L7.5 14.5L3 10L9.5 8.5Z',
    rosette: 'M12 6l1.4 3.2L17 10l-3 2.2L15.3 16L12 13.5L8.7 16L9 12.2L6 10l3.6-0.8L12 6Z',

    // === FORME VEGETALE (VREJ, FRUNZĂ, SPIC) ===
    leaf_simple: 'M4 12c2-6 8-8 12-6c-4 2-8 6-12 12z', // frunză stilizată
    vine_angular: 'M4 20L4 16L8 16L8 12L12 12L12 8L16 8L16 4', // vrej cu unghiuri
    vine_chain: 'M3 12a3 3 0 0 1 6 0a3 3 0 0 1 6 0a3 3 0 0 1 6 0', // lanț de bucle (rotunjit)
    wheat_spike: 'M12 2v20M12 6l-3 3M12 10l3 3M12 14l-3 3M12 18l3 3', // spic stilizat

    // === MOTIVE REGIONALE / ARANJAMENTE ===
    staircase_steps: 'M4 20h4v-4h4v-4h4v-4h4', // "scara" Maramureș
    column_of_rhombs: 'M12 4L16 8L12 12L8 8Z M12 12L16 16L12 20L8 16Z', // coloana de romburi
    corner_square_L: 'M4 4h8v4H8v8H4z', // colț de pătrat (L)

    // === MARCAJE AUXILIARE ===
    center_line: 'M12 2v20',
    margin_line: 'M2 22h20',
    symmetry_marker: 'M9 12l4-3v6z', // săgeată/triunghi pentru marcaj simetrie

    // === ARROWS ===
    up: 'M7 14l5-5 5 5z',
    down: 'M7 10l5 5 5-5z',
    left: 'M14 7l-5 5 5 5z',
    right: 'M10 17l5-5-5-5z',
    'up-right': 'M7 17L17 7M17 7H9M17 7v8',
    'down-left': 'M17 7L7 17M7 17h8M7 17V9',

    // === SYMBOLS ===
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18M6 6l12 12',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',

    // === MISC ===
    sun: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    lightning: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    flower: 'M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM12 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM12 16a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM5 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM19 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3z',
    target: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zM12 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z',
    gear: 'M12 1L9 4l-1.42 1.42L4 9l1.42 1.42L9 14l1.42 1.42L14 19l1.42-1.42L19 14l-1.42-1.42L14 9l-1.42-1.42L9 4z',
};

/**
 * Symbols that should be filled (not just stroked)
 */
export const FILLED_SYMBOLS = [
    'circle',
    'square',
    'square_filled',
    'triangle',
    'star',
    'heart',
    'diamond',
    'diamond_filled',
    'symmetry_marker',
] as const;

/**
 * Get the SVG path for a symbol by name
 */
export const getSymbolPath = (symbolName: string): string | undefined => {
    return SYMBOL_DEFINITIONS[symbolName];
};

/**
 * Check if a symbol should be filled
 */
export const isFilledSymbol = (symbolName: string): boolean => {
    return FILLED_SYMBOLS.includes(symbolName as (typeof FILLED_SYMBOLS)[number]);
};

// Function to create SVG path for canvas rendering
export const drawSymbolOnCanvas = (
    ctx: CanvasRenderingContext2D,
    symbolName: string,
    x: number,
    y: number,
    size: number,
    color: string
): void => {
    const path = SYMBOL_DEFINITIONS[symbolName];
    if (!path) return;

    // Save current context state
    ctx.save();

    // Set up transform to center the symbol and scale to fit
    const scale = size / 24; // SVG viewBox is 24x24
    ctx.translate(x + size / 2, y + size / 2);
    ctx.scale(scale, scale);
    ctx.translate(-12, -12); // Center the 24x24 viewBox

    // Set fill color
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Parse and draw the SVG path
    const path2D = new Path2D(path);

    // For filled shapes
    if (isFilledSymbol(symbolName)) {
        ctx.fill(path2D);
    } else {
        // For outline shapes
        ctx.stroke(path2D);
    }

    // Restore context state
    ctx.restore();
};

// Helper function to create React SVG component
export const renderSymbolSVG = (
    symbolName: string,
    color: string,
    size: number = 24
): JSX.Element => {
    const path = SYMBOL_DEFINITIONS[symbolName];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={path} fill={isFilledSymbol(symbolName) ? color : 'none'} />
        </svg>
    );
};
