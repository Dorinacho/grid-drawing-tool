import React, { useRef, useEffect, useCallback } from "react";
import type { GridCanvasProps } from "../types/index.ts";
import { calculateCanvasDimensions } from "../utils/grid.ts";
import { drawSymbolOnCanvas } from "../utils/symbols.tsx";

const GridCanvas: React.FC<GridCanvasProps> = ({
  matrix,
  rows,
  cols,
  isHorizontal,
  // selectedColor,
  // selectedSymbol,
  onCellClick,
  // colors
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, cellSize } = calculateCanvasDimensions(
      rows,
      cols,
      isHorizontal
    );

    console.log("cellSize:", cellSize);
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines and cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * cellSize;
        const y = i * cellSize;

        // Get cell data
        const cellData = matrix[i]?.[j];

        // Always draw white background for cells with symbols
        if (cellData?.symbol) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Draw cell border
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);

        // Draw symbol if present
        // console.log("Drawing cell:", i, j, cellData);
        
        if (!cellData?.symbol) {
          ctx.fillStyle = cellData?.color || "#ffffff";
          ctx.fillRect(x, y, cellSize, cellSize);
        }
        if (cellData?.symbol && cellData?.color) {
          const symbolSize = Math.floor(cellSize * 0.85); // Make symbol slightly smaller than cell
          const symbolX = x + (cellSize - symbolSize) / 2;
          const symbolY = y + (cellSize - symbolSize) / 2;

          drawSymbolOnCanvas(
            ctx,
            cellData.symbol,
            symbolX,
            symbolY,
            symbolSize,
            cellData.color
          );
        }
      }
    }
  }, [matrix, rows, cols, isHorizontal]);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
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
    },
    [rows, cols, isHorizontal, onCellClick]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
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
    },
    [rows, cols, isHorizontal, onCellClick]
  );

  useEffect(() => {
    renderGrid();
  }, [renderGrid]);

  useEffect(() => {
    const handleResize = () => {
      renderGrid();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
