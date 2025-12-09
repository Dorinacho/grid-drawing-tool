import { useCallback } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import { previewGridToPDF } from '../utils/pdf.ts';
import type { PaperSize } from '../types/index.ts';

export const usePdfPreview = () => {
    const { state, getText } = useGrid();

    const previewPDF = useCallback(
        async (paperSize?: PaperSize) => {
            const size = paperSize || state.selectedPaperSize;

            try {
                await previewGridToPDF(
                    state.matrix,
                    state.rows,
                    state.cols,
                    state.isHorizontal,
                    size
                );
                return { success: true };
            } catch (error) {
                console.error('svg2pdf.js export failed, falling back to basic shapes:', error);
            }
        },
        [state, getText]
    );

    return { previewPDF };
};
