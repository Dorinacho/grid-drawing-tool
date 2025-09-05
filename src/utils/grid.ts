import type { GridMatrix, ColorIndex, ColorPalette, PaperSize, PaperDimensions } from '../types/index.ts';

export const A4_ASPECT_RATIO = 297 / 210;

export const colors: ColorPalette = {
  0: '#ffffff', // Empty (white)
  1: '#667eea', // Blue
  2: '#f093fb', // Pink
  3: '#4ecdc4', // Teal
  4: '#fce38a'  // Yellow
};

export const paperSizes: Record<PaperSize, PaperDimensions> = {
  A3: { width: 420, height: 297 },
  A4: { width: 297, height: 210 },
  A5: { width: 210, height: 148 }
};

export const createEmptyMatrix = (rows: number, cols: number): GridMatrix => {
  const matrix: GridMatrix = {};
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
};

export const transposeMatrix = (matrix: GridMatrix, rows: number, cols: number): { 
  newMatrix: GridMatrix; 
  newRows: number; 
  newCols: number; 
} => {
  const newMatrix: GridMatrix = {};
  const newRows = cols;
  const newCols = rows;
  
  for (let i = 0; i < newRows; i++) {
    newMatrix[i] = [];
    for (let j = 0; j < newCols; j++) {
      newMatrix[i][j] = matrix[j][i];
    }
  }
  
  return { newMatrix, newRows, newCols };
};

export const calculateCanvasDimensions = (
  rows: number, 
  cols: number, 
  isHorizontal: boolean
): { width: number; height: number; cellSize: number } => {
  const containerWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 60, 800) : 800;
  const maxHeight = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.6, 600) : 600;
  
  let canvasWidth: number, canvasHeight: number;
  
  if (isHorizontal) {
    canvasWidth = Math.min(containerWidth, cols * 25);
    canvasHeight = canvasWidth / A4_ASPECT_RATIO;
    
    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = canvasHeight * A4_ASPECT_RATIO;
    }
  } else {
    canvasHeight = Math.min(maxHeight, rows * 25);
    canvasWidth = canvasHeight / A4_ASPECT_RATIO;
    
    if (canvasWidth > containerWidth) {
      canvasWidth = containerWidth;
      canvasHeight = canvasWidth * A4_ASPECT_RATIO;
    }
  }
  
  const cellSize = Math.min(canvasWidth / cols, canvasHeight / rows);
  
  return { width: canvasWidth, height: canvasHeight, cellSize };
};