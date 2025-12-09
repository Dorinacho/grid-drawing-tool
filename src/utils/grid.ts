import type { GridMatrix, PaperSize, PaperDimensions } from '../types/index.ts';

export const A4_ASPECT_RATIO = 297 / 210;

export const paperSizes: Record<PaperSize, PaperDimensions> = {
    A3: { width: 420, height: 297 },
    A4: { width: 297, height: 210 },
    A5: { width: 210, height: 148 },
};

// Default colors - can be extended dynamically
export const DEFAULT_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
];

export const createEmptyMatrix = (rows: number, cols: number): GridMatrix => {
    const matrix: GridMatrix = {};
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(null);
    }
    return matrix;
};

export const transposeMatrix = (
    matrix: GridMatrix,
    currentRows: number,
    currentCols: number
): { newMatrix: GridMatrix; newRows: number; newCols: number } => {
    const newMatrix: GridMatrix = {};
    const newRows = currentCols;
    const newCols = currentRows;

    // Initialize new matrix
    for (let i = 0; i < newRows; i++) {
        newMatrix[i] = new Array(newCols).fill(null);
    }

    // Transpose the matrix
    for (let i = 0; i < currentRows; i++) {
        for (let j = 0; j < currentCols; j++) {
            const cellData = matrix[i]?.[j] || null;
            if (newMatrix[j]) {
                newMatrix[j][i] = cellData;
            }
        }
    }

    return { newMatrix, newRows, newCols };
};

export const calculateCanvasDimensions = (
    rows: number,
    cols: number,
    isHorizontal: boolean
): { width: number; height: number; cellSize: number } => {
    let maxCanvasWidth: number;
    let maxCanvasHeight: number;
    const maxWidth = 1000; // Max canvas width
    const maxHeight = maxWidth * 1.41; // Max canvas height
    if (isHorizontal) {
        maxCanvasWidth = Math.min(maxWidth, window.innerWidth * 0.9);
        maxCanvasHeight = Math.min(maxHeight, window.innerHeight * 0.6);
    } else {
        maxCanvasWidth = Math.min(maxHeight, window.innerWidth * 0.9);
        maxCanvasHeight = Math.min(maxWidth, window.innerHeight * 0.6);
    }

    const cellSizeByWidth = maxCanvasWidth / cols;
    const cellSizeByHeight = maxCanvasHeight / rows;
    const cellSize = Math.max(
        15,
        Math.min(30, Math.floor(Math.min(cellSizeByWidth, cellSizeByHeight)))
    );

    return {
        width: cols * cellSize,
        height: rows * cellSize,
        cellSize,
    };
};

// Utility function to get unique symbol colors used in the matrix
export const getUsedColors = (matrix: GridMatrix, rows: number, cols: number): string[] => {
    const usedColors = new Set<string>();

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cellData = matrix[i]?.[j];
            if (cellData?.color) {
                usedColors.add(cellData.color);
            }
        }
    }

    return Array.from(usedColors);
};

// Utility function to get unique symbols used in the matrix
export const getUsedSymbols = (matrix: GridMatrix, rows: number, cols: number): string[] => {
    const usedSymbols = new Set<string>();

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cellData = matrix[i]?.[j];
            if (cellData?.symbol) {
                usedSymbols.add(cellData.symbol);
            }
        }
    }

    return Array.from(usedSymbols);
};

// Utility function to generate a random color
export const generateRandomColor = (): string => {
    const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEAA7',
        '#DDA0DD',
        '#98D8C8',
        '#F7DC6F',
        '#FF8A80',
        '#82B1FF',
        '#B39DDB',
        '#A5D6A7',
        '#FFCC02',
        '#FF6E40',
        '#26C6DA',
        '#AB47BC',
        '#66BB6A',
        '#FFA726',
        '#EC407A',
        '#42A5F5',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Utility function to check if a color is already in the palette
export const isColorInPalette = (color: string, palette: string[]): boolean => {
    return palette.includes(color);
};
