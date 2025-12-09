import type { GridMatrix, PaperSize, Language, CellData } from '@/types/index.ts';
import { paperSizes } from './grid.ts';
import { SYMBOL_DEFINITIONS } from './symbols.tsx';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';
import { logger } from './logger.ts';
import { PDF_DEFAULTS, SYMBOL_DEFAULTS } from '../constants.ts';

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
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
    svg.setAttribute(
        'viewBox',
        `0 0 ${SYMBOL_DEFAULTS.VIEWBOX_SIZE} ${SYMBOL_DEFAULTS.VIEWBOX_SIZE}`
    );
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Create path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', SYMBOL_DEFAULTS.STROKE_WIDTH.toString());
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    // Determine if this symbol should be filled
    if (
        SYMBOL_DEFAULTS.FILLED_SYMBOLS.includes(
            symbol as (typeof SYMBOL_DEFAULTS.FILLED_SYMBOLS)[number]
        )
    ) {
        path.setAttribute('fill', color);
    } else {
        path.setAttribute('fill', 'none');
    }

    svg.appendChild(path);
    return svg;
};

// Helper function to draw symbol using svg2pdf.js
const drawSymbolInPDF = async (
    pdf: jsPDF,
    symbol: string,
    x: number,
    y: number,
    cellSize: number,
    color: string
): Promise<void> => {
    try {
        const symbolSize = cellSize * PDF_DEFAULTS.SYMBOL_SIZE_RATIO;
        const symbolX = x + (cellSize - symbolSize) / 2;
        const symbolY = y + (cellSize - symbolSize) / 2;

        logger.debug(
            'PDF',
            `Drawing symbol: ${symbol} at (${symbolX}, ${symbolY}) with size: ${symbolSize}`
        );

        // Create SVG element using your existing symbol definitions
        const svgElement = createSVGElement(symbol, color, symbolSize);

        // Add SVG to PDF using svg2pdf.js
        await pdf.svg(svgElement, {
            x: symbolX,
            y: symbolY,
            width: symbolSize,
            height: symbolSize,
        });

        logger.debug('PDF', `Successfully drew symbol: ${symbol}`);
    } catch (error) {
        logger.error(`Failed to draw symbol ${symbol}:`, error);

        // Fallback to simple shape if SVG fails
        const rgb = hexToRgb(color);
        if (rgb) {
            const centerX = x + cellSize / 2;
            const centerY = y + cellSize / 2;
            const fallbackSize = cellSize * PDF_DEFAULTS.FALLBACK_SIZE_RATIO;

            pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
            pdf.setFillColor(rgb.r, rgb.g, rgb.b);

            switch (symbol) {
                case 'circle':
                    pdf.circle(centerX, centerY, fallbackSize / 2, 'FD');
                    break;
                case 'square':
                    pdf.rect(
                        centerX - fallbackSize / 2,
                        centerY - fallbackSize / 2,
                        fallbackSize,
                        fallbackSize,
                        'FD'
                    );
                    break;
                default:
                    pdf.circle(centerX, centerY, fallbackSize / 4, 'FD');
                    break;
            }

            logger.debug('PDF', `Used fallback shape for symbol: ${symbol}`);
        }
    }
};

interface PDFGridOptions {
    matrix: GridMatrix;
    rows: number;
    cols: number;
    isHorizontal: boolean;
    paperSize: PaperSize;
}

/**
 * Creates a PDF with the grid rendered on it.
 * Shared logic extracted from exportGridToPDF and previewGridToPDF.
 */
const createGridPDF = async ({
    matrix,
    rows,
    cols,
    isHorizontal,
    paperSize,
}: PDFGridOptions): Promise<jsPDF> => {
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
        format: [pdfWidth, pdfHeight],
    });

    // Calculate cell size in PDF coordinates
    const margin = PDF_DEFAULTS.MARGIN_MM;
    const availableWidth = pdfWidth - 2 * margin;
    const availableHeight = pdfHeight - 2 * margin;

    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    const cellSize = Math.min(cellWidth, cellHeight);

    logger.debug('PDF', `Cell size: ${cellSize}mm`);

    // Center the grid
    const startX = margin + (availableWidth - cols * cellSize) / 2;
    const startY = margin + (availableHeight - rows * cellSize) / 2;

    // Draw grid background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(startX, startY, cols * cellSize, rows * cellSize, 'F');

    // Draw grid lines
    const { r, g, b } = PDF_DEFAULTS.GRID_LINE_COLOR;
    pdf.setDrawColor(r, g, b);
    pdf.setLineWidth(PDF_DEFAULTS.GRID_LINE_WIDTH);

    // Vertical lines
    for (let j = 0; j <= cols; j++) {
        const x = startX + j * cellSize;
        pdf.line(x, startY, x, startY + rows * cellSize);
    }

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
        const y = startY + i * cellSize;
        pdf.line(startX, y, startX + cols * cellSize, y);
    }

    // Draw symbols and cell backgrounds
    let symbolsDrawn = 0;
    let cellsWithColor = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = startX + j * cellSize;
            const y = startY + i * cellSize;

            // Get cell data
            const cellData = matrix[i]?.[j] as CellData | null;

            if (cellData) {
                logger.debug('PDF', `Processing cell [${i}][${j}]:`, cellData);

                // Draw cell background color if no symbol
                if (cellData.color && !cellData.symbol) {
                    const rgb = hexToRgb(cellData.color);
                    if (rgb) {
                        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
                        pdf.rect(x, y, cellSize, cellSize, 'F');
                        cellsWithColor++;
                        logger.debug('PDF', `Drew background color for cell [${i}][${j}]`);
                    }
                }

                // Add symbol if present
                if (cellData.symbol && cellData.color) {
                    logger.debug(
                        'PDF',
                        `Drawing symbol: ${cellData.symbol} with color: ${cellData.color}`
                    );
                    await drawSymbolInPDF(pdf, cellData.symbol, x, y, cellSize, cellData.color);
                    symbolsDrawn++;
                }
            }
        }
    }

    logger.debug('PDF', `Total symbols drawn: ${symbolsDrawn}`);
    logger.debug('PDF', `Total colored cells: ${cellsWithColor}`);

    return pdf;
};

export const exportGridToPDF = async (
    matrix: GridMatrix,
    rows: number,
    cols: number,
    isHorizontal: boolean,
    paperSize: PaperSize,
    _language: Language
): Promise<void> => {
    try {
        logger.log('Starting PDF export...');

        const pdf = await createGridPDF({ matrix, rows, cols, isHorizontal, paperSize });

        // Save PDF with descriptive filename
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `grid_symbols_${rows}x${cols}_${paperSize}_${isHorizontal ? 'landscape' : 'portrait'}_${timestamp}.pdf`;
        pdf.save(filename);

        logger.log('PDF export completed successfully');
    } catch (error) {
        logger.error('PDF Export Error:', error);
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
        const pdf = await createGridPDF({ matrix, rows, cols, isHorizontal, paperSize });

        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);

        // Open preview in a new tab
        window.open(blobUrl, '_blank');
    } catch (error) {
        logger.error('PDF Export Error:', error);
        throw error;
    }
};
