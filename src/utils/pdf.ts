import type { GridMatrix, PaperSize, Language } from '@/types/index.ts';
import { paperSizes } from './grid.ts';
import { getText } from './language.ts';

declare global {
  interface Window {
    jspdf: {
      jsPDF: new (options?: any) => any;
    };
  }
}

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const exportGridToPDF = (
  matrix: GridMatrix,
  rows: number,
  cols: number,
  isHorizontal: boolean,
  paperSize: PaperSize,
  language: Language
): void => {
  try {
    if (!window.jspdf) {
      throw new Error('jsPDF library not loaded');
    }

    const { jsPDF } = window.jspdf;
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
    const margin = 20;
    const availableWidth = pdfWidth - (2 * margin);
    const availableHeight = pdfHeight - (2 * margin);
    
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    const cellSize = Math.min(cellWidth, cellHeight);
    
    // Center the grid
    const startX = margin + (availableWidth - (cols * cellSize)) / 2;
    const startY = margin + (availableHeight - (rows * cellSize)) / 2;
    
    // Draw grid with colors
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = startX + (j * cellSize);
        const y = startY + (i * cellSize);
        
        // Draw cell border
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(x, y, cellSize, cellSize);
        
        // Fill painted cells with their actual hex colors
        const cellValue = matrix[i]?.[j];
        if (cellValue && cellValue !== null) {
          // Convert hex color to RGB for jsPDF
          const rgb = hexToRgb(cellValue);
          if (rgb) {
            pdf.setFillColor(rgb.r, rgb.g, rgb.b);
            pdf.rect(x, y, cellSize, cellSize, 'F');
            
            // Redraw border on top of filled cell
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(x, y, cellSize, cellSize);
          }
        }
      }
    }
    
    // Add title
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    const title = getText('title', language) + ' - ' + getText('exportToPDF', language);
    pdf.text(title, pdfWidth / 2, 15, { align: 'center' });
    
    // Add grid info
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const gridInfo = `${rows} × ${cols} (${getText(isHorizontal ? 'horizontal' : 'vertical', language)})`;
    pdf.text(gridInfo, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
    
    // Save PDF with descriptive filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `grid_${rows}x${cols}_${paperSize}_${isHorizontal ? 'landscape' : 'portrait'}_${timestamp}.pdf`;
    pdf.save(filename);
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};