import { useGrid } from "../contexts/GridContext.tsx";
import { useConfirmationModal } from "./useConfirmationModal.ts";
import { useGridOperations } from "./useGridOperations.ts";
import { useGridSelection } from "./useGridSelection.ts";
import { useColorManagement } from "./useColorManagement.ts";
import { useExportModal } from "./useExportModal.ts";
import { usePdfExport } from "./usePdfExport.ts";
import type { PaperSize } from "@/types/index.ts";
import { usePdfPreview } from "./usePdfPreview.ts";

export const useGridActions = () => {
  const { state, getText } = useGrid();
  const confirmationModal = useConfirmationModal();
  const gridOperations = useGridOperations();
  const gridSelection = useGridSelection();
  const colorManagement = useColorManagement();
  const exportModal = useExportModal();
  const pdfExport = usePdfExport();
  const pdfPreview = usePdfPreview();

  // Combined export handler
  // const handleExportPDF = async (paperSize?: PaperSize) => {
  //   const result = await pdfExport.exportToPDF(paperSize);
  //   if (result?.success) {
  //     exportModal.closeModal();
  //   }
  //   // if (result?.error)
  //   else {
  //     console.error("PDF export failed:", result);
  //     // alert(result.error);
  //   }
  // };

  return {
    // State
    state,
    getText,

    // Confirmation modal
    ...confirmationModal,

    // Grid operations
    ...gridOperations,

    // Grid selection
    ...gridSelection,

    // Color management
    ...colorManagement,

    // Export
    ...exportModal,
    ...pdfExport,
    ...pdfPreview
    // handleExportPDF,
  };
};

// // src/hooks/useGridActions.ts
// import { useCallback } from "react";
// import { useGrid } from "../contexts/GridContext.tsx";
// import type { PaperSize, Language, CellData } from "../types/index.ts";
// import { generateRandomColor, isColorInPalette } from "../utils/grid.ts";
// import { exportGridToPDF, previewGridToPDF } from "../utils/pdf.ts";

// export const useGridActions = () => {
//   const { state, dispatch, getText } = useGrid();

//   // Language actions
//   //   const handleLanguageChange = useCallback((newLanguage: Language) => {
//   //     dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
//   //     setStoredLanguage(newLanguage);
//   //   }, [dispatch]);

//   // Grid dimension actions
//   const handleRowsChange = useCallback(
//     (rows: number) => {
//       dispatch({ type: "SET_ROWS", payload: rows });
//     },
//     [dispatch]
//   );

//   const handleColsChange = useCallback(
//     (cols: number) => {
//       dispatch({ type: "SET_COLS", payload: cols });
//     },
//     [dispatch]
//   );

//   // Selection actions
//   const handleColorSelect = useCallback(
//     (color: string) => {
//       dispatch({ type: "SET_SELECTED_COLOR", payload: color });
//     },
//     [dispatch]
//   );

//   const handleSymbolSelect = useCallback(
//     (symbol: string | null) => {
//       dispatch({ type: "SET_SELECTED_SYMBOL", payload: symbol });
//     },
//     [dispatch]
//   );

//   // Cell interaction
//   const handleCellClick = useCallback(
//     (row: number, col: number) => {
//       const currentCell = state.matrix[row]?.[col];
//       let newCellData: CellData | null = null;

//       if (!currentCell) {
//         // Empty cell - add symbol with selected color if both are selected
//         if (state.selectedSymbol) {
//           newCellData = {
//             symbol: state.selectedSymbol,
//             color: state.selectedColor,
//           };
//         } else {
//           newCellData = {
//             symbol: null,
//             color: state.selectedColor,
//           };
//         }
//       } else {
//         // Cell has content - check if it matches current selection
//         const hasSelectedSymbol = currentCell.symbol === state.selectedSymbol;
//         const hasSelectedColor = currentCell.color === state.selectedColor;

//         if (hasSelectedSymbol && hasSelectedColor) {
//           // Exact match - clear cell
//           newCellData = null;
//         } else if (hasSelectedSymbol) {
//           // Same symbol, different color - update color
//           newCellData = {
//             symbol: state.selectedSymbol,
//             color: state.selectedColor,
//           };
//         } else if (state.selectedSymbol) {
//           // Different symbol - replace with new symbol and color
//           newCellData = {
//             symbol: state.selectedSymbol,
//             color: state.selectedColor,
//           };
//         } else {
//           // No symbol selected - clear cell
//           newCellData = null;
//         }
//       }

//       dispatch({
//         type: "UPDATE_CELL",
//         payload: { row, col, data: newCellData },
//       });
//     },
//     [state.matrix, state.selectedSymbol, state.selectedColor, dispatch]
//   );

//   // Grid actions
//   const handleToggleOrientation = useCallback(() => {
//     dispatch({ type: "TOGGLE_ORIENTATION" });
//   }, [dispatch]);

//   const handleClearGrid = useCallback(() => {
//     dispatch({ type: "CLEAR_GRID" });
//   }, [dispatch]);

//   const handleUpdateGrid = useCallback(() => {
//     if (
//       state.rows > 0 &&
//       state.cols > 0 &&
//       state.rows <= 100 &&
//       state.cols <= 100
//     ) {
//       dispatch({ type: "UPDATE_GRID" });
//     } else {
//       alert(getText("validationError"));
//     }
//   }, [state.rows, state.cols, dispatch, getText]);

//   // Export actions - Updated to handle async PDF generation with svg2pdf.js
//   const handleExportPDF = useCallback(
//     async (paperSize?: PaperSize) => {
//       const size = paperSize || state.selectedPaperSize;
//       try {
//         // Try to use svg2pdf.js with your existing SVG paths
//         await exportGridToPDF(
//           state.matrix,
//           state.rows,
//           state.cols,
//           state.isHorizontal,
//           size,
//           state.language
//         );
//         dispatch({ type: "SET_EXPORT_MODAL_OPEN", payload: false });
//       } catch (error) {
//         console.error(
//           "svg2pdf.js export failed, falling back to basic shapes:",
//           error
//         );
//       }
//     },
//     [state, dispatch, getText]
//   );

//   const handlePreviewPDF = useCallback(
//     async (paperSize?: PaperSize) => {
//       const size = paperSize || state.selectedPaperSize;
//       try {
//         // Try to use svg2pdf.js with your existing SVG paths
//         await previewGridToPDF(
//           state.matrix,
//           state.rows,
//           state.cols,
//           state.isHorizontal,
//           size
//         );
//         // dispatch({ type: "SET_EXPORT_MODAL_OPEN", payload: false });
//       } catch (error) {
//         console.error(
//           "svg2pdf.js export failed, falling back to basic shapes:",
//           error
//         );
//       }
//     },
//     [state, dispatch, getText]
//   );

//   const openExportModal = useCallback(() => {
//     dispatch({ type: "SET_EXPORT_MODAL_OPEN", payload: true });
//   }, [dispatch]);

//   const closeExportModal = useCallback(() => {
//     dispatch({ type: "SET_EXPORT_MODAL_OPEN", payload: false });
//   }, [dispatch]);

//   const handlePaperSizeChange = useCallback(
//     (size: PaperSize) => {
//       dispatch({ type: "SET_SELECTED_PAPER_SIZE", payload: size });
//     },
//     [dispatch]
//   );

//   // Color management actions
//   const handleAddColor = useCallback(() => {
//     if (state.colors.length < 20) {
//       let newColor = generateRandomColor();
//       while (isColorInPalette(newColor, state.colors)) {
//         newColor = generateRandomColor();
//       }
//       dispatch({ type: "ADD_COLOR", payload: newColor });
//     }
//   }, [state.colors, dispatch]);

//   const handleRemoveColor = useCallback(
//     (index: number) => {
//       if (state.colors.length > 1) {
//         dispatch({ type: "REMOVE_COLOR", payload: index });
//       }
//     },
//     [state.colors.length, dispatch]
//   );

//   const handleUpdateColor = useCallback(
//     (index: number, color: string) => {
//       dispatch({ type: "UPDATE_COLOR", payload: { index, color } });
//     },
//     [dispatch]
//   );

//   // Color and symbol setters
//   const setColors = useCallback(
//     (colors: string[]) => {
//       dispatch({ type: "SET_COLORS", payload: colors });
//     },
//     [dispatch]
//   );

//   const setSymbols = useCallback(
//     (symbols: string[]) => {
//       dispatch({ type: "SET_SYMBOLS", payload: symbols });
//     },
//     [dispatch]
//   );

//   return {
//     // State access
//     state,
//     getText,

//     // Language actions
//     // handleLanguageChange,

//     // Grid actions
//     handleRowsChange,
//     handleColsChange,
//     handleUpdateGrid,
//     handleToggleOrientation,
//     handleClearGrid,

//     // Selection actions
//     handleColorSelect,
//     handleSymbolSelect,
//     handleCellClick,

//     // Export actions
//     handleExportPDF,
//     handlePreviewPDF,
//     openExportModal,
//     closeExportModal,
//     handlePaperSizeChange,

//     // Color management
//     handleAddColor,
//     handleRemoveColor,
//     handleUpdateColor,
//     setColors,
//     setSymbols,
//   };
// };
