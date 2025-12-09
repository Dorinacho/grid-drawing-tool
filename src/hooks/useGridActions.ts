import { useGrid } from '../contexts/GridContext.tsx';
import { useConfirmationModal } from './useConfirmationModal.ts';
import { useGridOperations } from './useGridOperations.ts';
import { useGridSelection } from './useGridSelection.ts';
import { useColorManagement } from './useColorManagement.ts';
import { useExportModal } from './useExportModal.ts';
import { usePdfExport } from './usePdfExport.ts';
import { usePdfPreview } from './usePdfPreview.ts';

export const useGridActions = () => {
    const { state, getText } = useGrid();
    const modal = useConfirmationModal();
    const gridOps = useGridOperations();
    const selection = useGridSelection();
    const colors = useColorManagement();
    const exportModal = useExportModal();
    const pdfExport = usePdfExport();
    const pdfPreview = usePdfPreview();

    return {
        // State
        state,
        getText,

        // Confirmation modal (renamed for clarity in components)
        confirmationVisible: modal.visible,
        confirmationAction: modal.action,
        showConfirmation: modal.show,
        hideConfirmation: modal.hide,
        handleConfirm: modal.confirm,

        // Grid operations
        ...gridOps,

        // Selection
        ...selection,

        // Colors
        ...colors,

        // Export
        ...exportModal,
        ...pdfExport,
        ...pdfPreview,
    };
};
