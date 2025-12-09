// Symbol definitions with SVG paths
export const SYMBOL_DEFINITIONS: Record<string, string> = {
    // Shapes
    circle: 'M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z',
    square: 'M0 0h24v24H0z',
    triangle: 'M12 0l12 24H0z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',

    // Arrows
    up: 'M7 14l5-5 5 5z',
    down: 'M7 10l5 5 5-5z',
    left: 'M14 7l-5 5 5 5z',
    right: 'M10 17l5-5-5-5z',
    'up-right': 'M7 17L17 7M17 7H9M17 7v8',
    'down-left': 'M17 7L7 17M7 17h8M7 17V9',

    // Symbols
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18M6 6l12 12',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',

    // Misc
    sun: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    lightning: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    target: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zM12 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z',
    gear: 'M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5zM19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z',
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
    if (
        symbolName === 'circle' ||
        symbolName === 'square' ||
        symbolName === 'triangle' ||
        symbolName === 'diamond' ||
        symbolName === 'star' ||
        symbolName === 'heart'
    ) {
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
            <path
                d={path}
                fill={
                    symbolName === 'circle' ||
                    symbolName === 'square' ||
                    symbolName === 'triangle' ||
                    symbolName === 'diamond' ||
                    symbolName === 'star' ||
                    symbolName === 'heart'
                        ? color
                        : 'none'
                }
            />
        </svg>
    );
};
