import { useCallback } from "react";
import { useGrid } from "../contexts/GridContext.tsx";
import { generateRandomColor, isColorInPalette } from "../utils/grid.ts";

export const useColorManagement = () => {
  const { state, dispatch } = useGrid();

  const addColor = useCallback(() => {
    if (state.colors.length < 20) {
      let newColor = generateRandomColor();
      while (isColorInPalette(newColor, state.colors)) {
        newColor = generateRandomColor();
      }
      dispatch({ type: "ADD_COLOR", payload: newColor });
    }
  }, [state.colors, dispatch]);

  const removeColor = useCallback((index: number) => {
    if (state.colors.length > 1) {
      dispatch({ type: "REMOVE_COLOR", payload: index });
    }
  }, [state.colors.length, dispatch]);

  const updateColor = useCallback((index: number, color: string) => {
    dispatch({ type: "UPDATE_COLOR", payload: { index, color } });
  }, [dispatch]);

  const setColors = useCallback((colors: string[]) => {
    dispatch({ type: "SET_COLORS", payload: colors });
  }, [dispatch]);

  return {
    colors: state.colors,
    addColor,
    removeColor,
    updateColor,
    setColors
  };
};