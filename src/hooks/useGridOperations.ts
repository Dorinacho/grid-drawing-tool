import { useCallback } from 'react';
import { useGrid } from '../contexts/GridContext.tsx';
import { useConfirmationModal } from '../hooks/useConfirmationModal.ts';

export const useGridOperations = () => {
    const { state, dispatch, getText } = useGrid();
    const { showConfirmation } = useConfirmationModal();

    const updateGrid = useCallback(() => {
        if (state.rows > 0 && state.cols > 0 && state.rows <= 50 && state.cols <= 50) {
            const performUpdate = () => {
                dispatch({ type: 'UPDATE_GRID' });
            };
            showConfirmation('update', performUpdate);
        } else {
            alert(getText('validationError'));
        }
    }, [state.rows, state.cols, dispatch, getText, showConfirmation]);

    const clearGrid = useCallback(() => {
        const performClear = () => {
            dispatch({ type: 'CLEAR_GRID' });
        };
        showConfirmation('clear', performClear);
    }, [dispatch, showConfirmation]);

    const toggleOrientation = useCallback(() => {
        dispatch({ type: 'TOGGLE_ORIENTATION' });
    }, [dispatch]);

    const updateRows = useCallback(
        (rows: number) => {
            dispatch({ type: 'SET_ROWS', payload: rows });
        },
        [dispatch]
    );

    const updateCols = useCallback(
        (cols: number) => {
            dispatch({ type: 'SET_COLS', payload: cols });
        },
        [dispatch]
    );

    return {
        updateGrid,
        clearGrid,
        toggleOrientation,
        updateRows,
        updateCols,
    };
};
