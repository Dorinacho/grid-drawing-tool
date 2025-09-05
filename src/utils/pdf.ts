import type { GridMatrix, PaperSize, Language, ColorIndex } from '@/types/index.ts';
import { paperSizes } from './grid.ts';
import { getText } from './language.ts';

declare global {
  interface Window {
    jspdf: {
      jsPDF: new (options?: any) => any;
    };
  }
}

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
        
        // Fill painted cells with appropriate colors
        const cellValue: ColorIndex = matrix[i][j];
        if (cellValue !== 0) {
          switch(cellValue) {
            case 1:
              pdf.setFillColor(102, 126, 234); // Blue
              break;
            case 2:
              pdf.setFillColor(240, 147, 251); // Pink
              break;
            case 3:
              pdf.setFillColor(78, 205, 196); // Teal
              break;
            case 4:
              pdf.setFillColor(252, 227, 138); // Yellow
              break;
          }
          pdf.rect(x, y, cellSize, cellSize, 'F');
        }
      }
    }
    
    // Add title
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    const title = getText('title', language) + ' ' + getText('exportToPDF', language);
    pdf.text(title, pdfWidth / 2, 15, { align: 'center' });
    
    // Save PDF
    const filename = `grid_${paperSize}_${isHorizontal ? 'landscape' : 'portrait'}.pdf`;
    pdf.save(filename);
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};