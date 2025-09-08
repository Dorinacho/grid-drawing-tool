import React, { useRef, useEffect, useCallback } from 'react';
import type { GridCanvasProps } from '../types/index.ts';
import { calculateCanvasDimensions } from '../utils/grid.ts';

const GridCanvas: React.FC<GridCanvasProps> = ({
  matrix,
  rows,
  cols,
  isHorizontal,
  selectedColor,
  onCellClick,
  colors
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, cellSize } = calculateCanvasDimensions(rows, cols, isHorizontal);
    
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines and cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * cellSize;
        const y = i * cellSize;

        // Draw cell background
        const cellValue = matrix[i]?.[j];
        if (cellValue && cellValue !== null) {
          ctx.fillStyle = cellValue; // Use the hex color directly
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Draw cell border
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }, [matrix, rows, cols, isHorizontal]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { cellSize } = calculateCanvasDimensions(rows, cols, isHorizontal);
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onCellClick(row, col);
    }
  }, [rows, cols, isHorizontal, onCellClick]);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || event.touches.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;

    const { cellSize } = calculateCanvasDimensions(rows, cols, isHorizontal);
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onCellClick(row, col);
    }
  }, [rows, cols, isHorizontal, onCellClick]);

  useEffect(() => {
    renderGrid();
  }, [renderGrid]);

  useEffect(() => {
    const handleResize = () => {
      renderGrid();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderGrid]);

  return (
    <div className="flex justify-center mb-6 bg-white rounded-2xl p-4 shadow-inner">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        className="border-2 border-gray-300 rounded-xl cursor-crosshair transition-colors hover:border-indigo-500 max-w-full h-auto"
      />
    </div>
  );
};

export default GridCanvas;