import type { GridMatrix, PaperSize, Language, CellData } from '@/types/index.ts';
import { paperSizes } from './grid.ts';
import { getText } from './language.ts';
import { SYMBOL_DEFINITIONS } from './symbols.tsx';

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

// Helper function to draw shapes using jsPDF's correct API
const drawSymbolInPDF = (
  pdf: any,
  symbol: string,
  x: number,
  y: number,
  cellSize: number,
  color: { r: number; g: number; b: number }
): void => {
  const centerX = x + cellSize / 2;
  const centerY = y + cellSize / 2;
  const symbolSize = cellSize * 0.8; // Use more of the cell space
  
  pdf.setDrawColor(color.r, color.g, color.b);
  pdf.setFillColor(color.r, color.g, color.b);
  pdf.setLineWidth(Math.max(0.5, cellSize * 0.02));

  switch (symbol) {
    case 'circle':
      pdf.circle(centerX, centerY, symbolSize / 2, 'FD');
      break;
      
    case 'square':
      const squareSize = symbolSize * 0.9;
      pdf.rect(centerX - squareSize/2, centerY - squareSize/2, squareSize, squareSize, 'FD');
      break;
      
    case 'triangle':
      // Draw triangle using lines
      const triangleHeight = symbolSize * 0.8;
      const triangleBase = symbolSize * 0.9;
      const topX = centerX;
      const topY = centerY - triangleHeight/2;
      const leftX = centerX - triangleBase/2;
      const leftY = centerY + triangleHeight/2;
      const rightX = centerX + triangleBase/2;
      const rightY = centerY + triangleHeight/2;
      
      pdf.triangle(topX, topY, leftX, leftY, rightX, rightY, 'FD');
      break;
      
    case 'diamond':
      // Draw diamond using lines
      const diamondSize = symbolSize * 0.8;
      const points = [
        [centerX, centerY - diamondSize/2], // top
        [centerX + diamondSize/2, centerY], // right
        [centerX, centerY + diamondSize/2], // bottom
        [centerX - diamondSize/2, centerY]  // left
      ];
      
      // Draw diamond as connected lines
      pdf.lines(points.map((point, i) => {
        const nextPoint = points[(i + 1) % points.length];
        return [nextPoint[0] - point[0], nextPoint[1] - point[1]];
      }), centerX, centerY - diamondSize/2, [1, 1], 'FD');
      break;
      
    case 'star':
      // Draw star using path
      const starRadius = symbolSize / 2;
      const innerRadius = starRadius * 0.4;
      const starPoints:any[] = [];
      
      for (let i = 0; i < 10; i++) {
        const angle = (i * 36 - 90) * Math.PI / 180;
        const radius = i % 2 === 0 ? starRadius : innerRadius;
        starPoints.push([
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        ]);
      }
      
      // Draw star as series of lines
      const starLines = starPoints.map((point, i) => {
        if (i === 0) return [0, 0];
        const prevPoint = starPoints[i - 1];
        return [point[0] - prevPoint[0], point[1] - prevPoint[1]];
      });
      
      pdf.lines(starLines.slice(1), starPoints[0][0], starPoints[0][1], [1, 1], 'FD');
      break;
      
    case 'heart':
      // Simplified heart as two circles and a triangle
      const heartSize = symbolSize * 0.6;
      const circleRadius = heartSize * 0.25;
      const leftCircleX = centerX - heartSize * 0.2;
      const rightCircleX = centerX + heartSize * 0.2;
      const circleY = centerY - heartSize * 0.1;
      
      // Draw two circles for top of heart
      pdf.circle(leftCircleX, circleY, circleRadius, 'FD');
      pdf.circle(rightCircleX, circleY, circleRadius, 'FD');
      
      // Draw triangle for bottom of heart
      const bottomY = centerY + heartSize * 0.3;
      pdf.triangle(leftCircleX - circleRadius, circleY, 
                  rightCircleX + circleRadius, circleY, 
                  centerX, bottomY, 'FD');
      break;
      
    case 'up':
    case 'down':
    case 'left':
    case 'right':
      // Draw arrows as triangles
      const arrowSize = symbolSize * 0.7;
      let arrowPoints: number[][];
      
      switch (symbol) {
        case 'up':
          arrowPoints = [
            [centerX, centerY - arrowSize/2],
            [centerX - arrowSize/2, centerY + arrowSize/2],
            [centerX + arrowSize/2, centerY + arrowSize/2]
          ];
          break;
        case 'down':
          arrowPoints = [
            [centerX, centerY + arrowSize/2],
            [centerX - arrowSize/2, centerY - arrowSize/2],
            [centerX + arrowSize/2, centerY - arrowSize/2]
          ];
          break;
        case 'left':
          arrowPoints = [
            [centerX - arrowSize/2, centerY],
            [centerX + arrowSize/2, centerY - arrowSize/2],
            [centerX + arrowSize/2, centerY + arrowSize/2]
          ];
          break;
        case 'right':
          arrowPoints = [
            [centerX + arrowSize/2, centerY],
            [centerX - arrowSize/2, centerY - arrowSize/2],
            [centerX - arrowSize/2, centerY + arrowSize/2]
          ];
          break;
        default:
          arrowPoints = [];
      }
      
      if (arrowPoints.length === 3) {
        pdf.triangle(arrowPoints[0][0], arrowPoints[0][1],
                    arrowPoints[1][0], arrowPoints[1][1],
                    arrowPoints[2][0], arrowPoints[2][1], 'FD');
      }
      break;
      
    case 'check':
      // Draw checkmark as lines
      pdf.setLineWidth(Math.max(1, cellSize * 0.08));
      const checkSize = symbolSize * 0.6;
      const checkStartX = centerX - checkSize * 0.3;
      const checkStartY = centerY;
      const checkMidX = centerX - checkSize * 0.1;
      const checkMidY = centerY + checkSize * 0.2;
      const checkEndX = centerX + checkSize * 0.4;
      const checkEndY = centerY - checkSize * 0.3;
      
      pdf.line(checkStartX, checkStartY, checkMidX, checkMidY);
      pdf.line(checkMidX, checkMidY, checkEndX, checkEndY);
      break;
      
    case 'x':
      // Draw X as two lines
      pdf.setLineWidth(Math.max(1, cellSize * 0.08));
      const xSize = symbolSize * 0.6;
      pdf.line(centerX - xSize/2, centerY - xSize/2, centerX + xSize/2, centerY + xSize/2);
      pdf.line(centerX - xSize/2, centerY + xSize/2, centerX + xSize/2, centerY - xSize/2);
      break;
      
    case 'plus':
      // Draw plus as two lines
      pdf.setLineWidth(Math.max(1, cellSize * 0.08));
      const plusSize = symbolSize * 0.6;
      pdf.line(centerX, centerY - plusSize/2, centerX, centerY + plusSize/2);
      pdf.line(centerX - plusSize/2, centerY, centerX + plusSize/2, centerY);
      break;
      
    case 'minus':
      // Draw minus as one line
      pdf.setLineWidth(Math.max(1, cellSize * 0.08));
      const minusSize = symbolSize * 0.6;
      pdf.line(centerX - minusSize/2, centerY, centerX + minusSize/2, centerY);
      break;
      
    default:
      // Fallback: draw a filled circle
      pdf.circle(centerX, centerY, symbolSize / 4, 'FD');
      break;
  }
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
    const margin = 10;
    const availableWidth = pdfWidth - (2 * margin);
    const availableHeight = pdfHeight - (2 * margin);
    
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    const cellSize = Math.min(cellWidth, cellHeight);
    
    // Center the grid
    const startX = margin + (availableWidth - (cols * cellSize)) / 2;
    const startY = margin + (availableHeight - (rows * cellSize)) / 2;
    
    // Draw grid with symbols
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = startX + (j * cellSize);
        const y = startY + (i * cellSize);
        
        // Get cell data
        const cellData = matrix[i]?.[j] as CellData | null;
        
        // Fill cells with white background if they contain symbols
        if (cellData?.symbol) {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(x, y, cellSize, cellSize, 'F');
        }
        
        // Draw cell border
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.1);
        pdf.rect(x, y, cellSize, cellSize, 'S');
        
        // Add symbol if present
        if (cellData?.symbol && cellData?.color) {
          const rgb = hexToRgb(cellData.color);
          if (rgb) {
            drawSymbolInPDF(pdf, cellData.symbol, x, y, cellSize, rgb);
          }
        }
      }
    }
    
    // Add title
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    // const title = getText('title', language) + ' - ' + getText('exportToPDF', language);
    // pdf.text(title, pdfWidth / 2, 15, { align: 'center' });
    
    // Add grid info
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    // TODO - check if it has padding from the grid
    // const gridInfo = `${rows} × ${cols} (${getText(isHorizontal ? 'horizontal' : 'vertical', language)})`;
    // pdf.text(gridInfo, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
    
    // Save PDF with descriptive filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `grid_symbols_${rows}x${cols}_${paperSize}_${isHorizontal ? 'landscape' : 'portrait'}_${timestamp}.pdf`;
    pdf.save(filename);
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};