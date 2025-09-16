import type { GridMatrix, PaperSize, Language, CellData } from '@/types/index.ts';
import { paperSizes } from './grid.ts';
import { getText } from './language.ts';
import { SYMBOL_DEFINITIONS } from './symbols.tsx';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Helper function to create SVG element from your symbol definitions
const createSVGElement = (symbol: string, color: string, size: number): SVGSVGElement => {
  const pathData = SYMBOL_DEFINITIONS[symbol];
  if (!pathData) {
    throw new Error(`Symbol ${symbol} not found in SYMBOL_DEFINITIONS`);
  }

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  // Create path element
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  // Determine if this symbol should be filled (same logic as your canvas renderer)
  const filledSymbols = ['circle', 'square', 'triangle', 'diamond', 'star', 'heart'];
  if (filledSymbols.includes(symbol)) {
    path.setAttribute('fill', color);
  } else {
    path.setAttribute('fill', 'none');
  }

  svg.appendChild(path);
  return svg;
};

// Helper function to draw symbol using svg2pdf.js
const drawSymbolInPDF = async (
  pdf: any,
  symbol: string,
  x: number,
  y: number,
  cellSize: number,
  color: string
): Promise<void> => {
  try {
    const symbolSize = cellSize * 0.8;
    const symbolX = x + (cellSize - symbolSize) / 2;
    const symbolY = y + (cellSize - symbolSize) / 2;
    
    console.log(`Drawing symbol: ${symbol} at (${symbolX}, ${symbolY}) with size: ${symbolSize}`);
    
    // Create SVG element using your existing symbol definitions
    const svgElement = createSVGElement(symbol, color, symbolSize);
    
    // Add SVG to PDF using svg2pdf.js
    await pdf.svg(svgElement, {
      x: symbolX,
      y: symbolY,
      width: symbolSize,
      height: symbolSize
    });
    
    console.log(`Successfully drew symbol: ${symbol}`);
    
  } catch (error) {
    console.error(`Failed to draw symbol ${symbol}:`, error);
    
    // Fallback to simple shape if SVG fails
    const rgb = hexToRgb(color);
    if (rgb) {
      const centerX = x + cellSize / 2;
      const centerY = y + cellSize / 2;
      const fallbackSize = cellSize * 0.4;
      
      pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
      pdf.setFillColor(rgb.r, rgb.g, rgb.b);
      
      switch (symbol) {
        case 'circle':
          pdf.circle(centerX, centerY, fallbackSize / 2, 'FD');
          break;
        case 'square':
          pdf.rect(centerX - fallbackSize/2, centerY - fallbackSize/2, fallbackSize, fallbackSize, 'FD');
          break;
        default:
          pdf.circle(centerX, centerY, fallbackSize / 4, 'FD');
          break;
      }
      
      console.log(`Used fallback shape for symbol: ${symbol}`);
    }
  }
};

export const exportGridToPDF = async (
  matrix: GridMatrix,
  rows: number,
  cols: number,
  isHorizontal: boolean,
  paperSize: PaperSize,
  language: Language
): Promise<void> => {
  try {
    console.log('Starting PDF export with svg2pdf.js...');
    console.log('Matrix:', matrix);
    
    const paper = paperSizes[paperSize];
    
    // Determine orientation based on grid state
    let pdfWidth: number, pdfHeight: number;
    if (isHorizontal) {
      pdfWidth = Math.max(paper.width, paper.height);
      pdfHeight = Math.min(paper.width, paper.height);
    } else {
      pdfWidth = Math.min(paper.width, paper.height);
      pdfHeight = Math.max(paper.width, paper.height);
    }
    
    // Create PDF with custom dimensions
    const pdf = new jsPDF({
      orientation: isHorizontal ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    
    // Calculate cell size in PDF coordinates
    const margin = 10;
    const availableWidth = pdfWidth - (2 * margin);
    const availableHeight = pdfHeight - (2 * margin);
    
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    const cellSize = Math.min(cellWidth, cellHeight);
    
    console.log(`Cell size: ${cellSize}mm`);
    
    // Center the grid
    const startX = margin + (availableWidth - (cols * cellSize)) / 2;
    const startY = margin + (availableHeight - (rows * cellSize)) / 2;
    
    // Draw grid background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(startX, startY, cols * cellSize, rows * cellSize, 'F');
    
    // Draw grid lines
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.1);
    
    // Vertical lines
    for (let j = 0; j <= cols; j++) {
      const x = startX + (j * cellSize);
      pdf.line(x, startY, x, startY + (rows * cellSize));
    }
    
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = startY + (i * cellSize);
      pdf.line(startX, y, startX + (cols * cellSize), y);
    }
    
    // Draw symbols and cell backgrounds
    let symbolsDrawn = 0;
    let cellsWithColor = 0;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = startX + (j * cellSize);
        const y = startY + (i * cellSize);
        
        // Get cell data
        const cellData = matrix[i]?.[j] as CellData | null;
        
        if (cellData) {
          console.log(`Processing cell [${i}][${j}]:`, cellData);
          
          // Draw cell background color if no symbol
          if (cellData.color && !cellData.symbol) {
            const rgb = hexToRgb(cellData.color);
            if (rgb) {
              pdf.setFillColor(rgb.r, rgb.g, rgb.b);
              pdf.rect(x, y, cellSize, cellSize, 'F');
              cellsWithColor++;
              console.log(`Drew background color for cell [${i}][${j}]`);
            }
          }
          
          // Add symbol if present
          if (cellData.symbol && cellData.color) {
            console.log(`Drawing symbol: ${cellData.symbol} with color: ${cellData.color}`);
            await drawSymbolInPDF(pdf, cellData.symbol, x, y, cellSize, cellData.color);
            symbolsDrawn++;
          }
        }
      }
    }
    
    console.log(`Total symbols drawn: ${symbolsDrawn}`);
    console.log(`Total colored cells: ${cellsWithColor}`);
    
    // Save PDF with descriptive filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `grid_symbols_${rows}x${cols}_${paperSize}_${isHorizontal ? 'landscape' : 'portrait'}_${timestamp}.pdf`;
    pdf.save(filename);
    
    console.log('PDF export completed successfully');
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};

export const previewGridToPDF = async (
  matrix: GridMatrix,
  rows: number,
  cols: number,
  isHorizontal: boolean,
  paperSize: PaperSize
): Promise<void> => {
  try {
    const paper = paperSizes[paperSize];

    // Determine orientation based on grid state
    let pdfWidth: number, pdfHeight: number;
    if (isHorizontal) {
      pdfWidth = Math.max(paper.width, paper.height);
      pdfHeight = Math.min(paper.width, paper.height);
    } else {
      pdfWidth = Math.min(paper.width, paper.height);
      pdfHeight = Math.max(paper.width, paper.height);
    }

    // Create PDF with custom dimensions
    const pdf = new jsPDF({
      orientation: isHorizontal ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    // Calculate cell size in PDF coordinates
    const margin = 10;
    const availableWidth = pdfWidth - 2 * margin;
    const availableHeight = pdfHeight - 2 * margin;

    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    const cellSize = Math.min(cellWidth, cellHeight);

    // Center the grid
    const startX = margin + (availableWidth - cols * cellSize) / 2;
    const startY = margin + (availableHeight - rows * cellSize) / 2;

    // Draw grid background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(startX, startY, cols * cellSize, rows * cellSize, 'F');
    
    // Draw grid lines
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.1);
    
    // Vertical lines
    for (let j = 0; j <= cols; j++) {
      const x = startX + (j * cellSize);
      pdf.line(x, startY, x, startY + (rows * cellSize));
    }
    
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = startY + (i * cellSize);
      pdf.line(startX, y, startX + (cols * cellSize), y);
    }

    // Draw symbols and cell backgrounds
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = startX + j * cellSize;
        const y = startY + i * cellSize;

        // Get cell data
        const cellData = matrix[i]?.[j] as CellData | null;

        // Draw cell background color if no symbol
        if (cellData?.color && !cellData?.symbol) {
          const rgb = hexToRgb(cellData.color);
          if (rgb) {
            pdf.setFillColor(rgb.r, rgb.g, rgb.b);
            pdf.rect(x, y, cellSize, cellSize, 'F');
          }
        }

        // Add symbol if present
        if (cellData?.symbol && cellData?.color) {
          await drawSymbolInPDF(pdf, cellData.symbol, x, y, cellSize, cellData.color);
        }
      }
    }

    const pdfBlob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Open preview in a new tab
    window.open(blobUrl, "_blank");
  } catch (error) {
    console.error("PDF Export Error:", error);
    throw error;
  }
};
