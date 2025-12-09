import { useCallback } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import type { PaperSize } from '../types/index.ts';

export const useExportModal = () => {
    const { state, dispatch } = useGrid();

    const openModal = useCallback(() => {
        dispatch({ type: 'SET_EXPORT_MODAL_OPEN', payload: true });
    }, [dispatch]);

    const closeModal = useCallback(() => {
        dispatch({ type: 'SET_EXPORT_MODAL_OPEN', payload: false });
    }, [dispatch]);

    const setPaperSize = useCallback(
        (size: PaperSize) => {
            dispatch({ type: 'SET_SELECTED_PAPER_SIZE', payload: size });
        },
        [dispatch]
    );

    return {
        isOpen: state.isExportModalOpen,
        selectedPaperSize: state.selectedPaperSize,
        openModal,
        closeModal,
        setPaperSize,
    };
};
