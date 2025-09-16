import { useCallback } from "react";
import { useGrid } from "../contexts/GridContext.tsx";
import type { CellData } from "../types/index.ts";

export const useGridSelection = () => {
  const { state, dispatch } = useGrid();

  const selectColor = useCallback((color: string) => {
    dispatch({ type: "SET_SELECTED_COLOR", payload: color });
  }, [dispatch]);

  const selectSymbol = useCallback((symbol: string | null) => {
    dispatch({ type: "SET_SELECTED_SYMBOL", payload: symbol });
  }, [dispatch]);

  const handleCellClick = useCallback((row: number, col: number) => {
    const currentCell = state.matrix[row]?.[col];
    let newCellData: CellData | null = null;

    if (!currentCell) {
      if (state.selectedSymbol) {
        newCellData = {
          symbol: state.selectedSymbol,
          color: state.selectedColor,
        };
      } else {
        newCellData = {
          symbol: null,
          color: state.selectedColor,
        };
      }
    } else {
      const hasSelectedSymbol = currentCell.symbol === state.selectedSymbol;
      const hasSelectedColor = currentCell.color === state.selectedColor;

      if (hasSelectedSymbol && hasSelectedColor) {
        newCellData = null;
      } else if (hasSelectedSymbol) {
        newCellData = {
          symbol: state.selectedSymbol,
          color: state.selectedColor,
        };
      } else if (state.selectedSymbol) {
        newCellData = {
          symbol: state.selectedSymbol,
          color: state.selectedColor,
        };
      } else {
        newCellData = null;
      }
    }

    dispatch({
      type: "UPDATE_CELL",
      payload: { row, col, data: newCellData },
    });
  }, [state.matrix, state.selectedSymbol, state.selectedColor, dispatch]);

  return {
    selectedColor: state.selectedColor,
    selectedSymbol: state.selectedSymbol,
    selectColor,
    selectSymbol,
    handleCellClick
  };
};