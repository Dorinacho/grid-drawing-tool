import { useCallback } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import { exportGridToPDF } from '../utils/pdf.ts';
import type { PaperSize } from '../types/index.ts';

export const usePdfExport = () => {
    const { state, getText } = useGrid();

    const exportToPDF = useCallback(
        async (paperSize?: PaperSize) => {
            const size = paperSize || state.selectedPaperSize;

            try {
                await exportGridToPDF(
                    state.matrix,
                    state.rows,
                    state.cols,
                    state.isHorizontal,
                    size,
                    state.language
                );
                return { success: true };
            } catch (error) {
                console.error('svg2pdf.js export failed, falling back to basic shapes:', error);
            }
        },
        [state, getText]
    );

    return { exportToPDF };
};
