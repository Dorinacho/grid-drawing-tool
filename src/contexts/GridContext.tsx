// src/contexts/GridContext.tsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { GridMatrix, PaperSize, Language, CellData } from '../types/index.ts';
import {
  createEmptyMatrix,
  transposeMatrix,
  DEFAULT_COLORS,
} from '../utils/grid.ts';
import {
  getStoredLanguage,
  setStoredLanguage,
  getText,
} from '../utils/language.ts';

// Define the shape of our grid state
interface GridState {
  // Grid configuration
  rows: number;
  cols: number;
  matrix: GridMatrix;
  isHorizontal: boolean;
  
  // Selection state
  selectedColor: string;
  selectedSymbol: string | null;
  
  // UI state
  language: Language;
  isExportModalOpen: boolean;
  selectedPaperSize: PaperSize;
  
  // Data
  colors: string[];
  symbols: string[];
}

// Define action types
type GridAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_ROWS'; payload: number }
  | { type: 'SET_COLS'; payload: number }
  | { type: 'SET_SELECTED_COLOR'; payload: string }
  | { type: 'SET_SELECTED_SYMBOL'; payload: string | null }
  | { type: 'SET_COLORS'; payload: string[] }
  | { type: 'SET_SYMBOLS'; payload: string[] }
  | { type: 'UPDATE_CELL'; payload: { row: number; col: number; data: CellData | null } }
  | { type: 'TOGGLE_ORIENTATION' }
  | { type: 'CLEAR_GRID' }
  | { type: 'UPDATE_GRID' }
  | { type: 'SET_EXPORT_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_PAPER_SIZE'; payload: PaperSize }
  | { type: 'ADD_COLOR'; payload: string }
  | { type: 'REMOVE_COLOR'; payload: number }
  | { type: 'UPDATE_COLOR'; payload: { index: number; color: string } };

// Initial state
const initialState: GridState = {
  rows: 22,
  cols: 33,
  matrix: createEmptyMatrix(22, 33),
  isHorizontal: true,
  selectedColor: DEFAULT_COLORS[0],
  selectedSymbol: null,
  language: 'ro',
  isExportModalOpen: false,
  selectedPaperSize: 'A4',
  colors: DEFAULT_COLORS.slice(0, 4),
  symbols: [],
};

// Grid reducer
const gridReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'SET_ROWS':
      return { ...state, rows: action.payload };
    
    case 'SET_COLS':
      return { ...state, cols: action.payload };
    
    case 'SET_SELECTED_COLOR':
      return { ...state, selectedColor: action.payload };
    
    case 'SET_SELECTED_SYMBOL':
      return { ...state, selectedSymbol: action.payload };
    
    case 'SET_COLORS':
      return { ...state, colors: action.payload };
    
    case 'SET_SYMBOLS':
      return { ...state, symbols: action.payload };
    
    case 'UPDATE_CELL': {
      const { row, col, data } = action.payload;
      const newMatrix = { ...state.matrix };
      if (!newMatrix[row]) {
        newMatrix[row] = new Array(state.cols).fill(null);
      }
      newMatrix[row][col] = data;
      return { ...state, matrix: newMatrix };
    }
    
    case 'TOGGLE_ORIENTATION': {
      const { newMatrix, newRows, newCols } = transposeMatrix(
        state.matrix,
        state.rows,
        state.cols
      );
      return {
        ...state,
        matrix: newMatrix,
        rows: newRows,
        cols: newCols,
        isHorizontal: !state.isHorizontal,
      };
    }
    
    case 'CLEAR_GRID':
      return {
        ...state,
        matrix: createEmptyMatrix(state.rows, state.cols),
      };
    
    case 'UPDATE_GRID':
      return {
        ...state,
        matrix: createEmptyMatrix(state.rows, state.cols),
      };
    
    case 'SET_EXPORT_MODAL_OPEN':
      return { ...state, isExportModalOpen: action.payload };
    
    case 'SET_SELECTED_PAPER_SIZE':
      return { ...state, selectedPaperSize: action.payload };
    
    case 'ADD_COLOR':
      return {
        ...state,
        colors: [...state.colors, action.payload],
      };
    
    case 'REMOVE_COLOR': {
      const newColors = state.colors.filter((_, i) => i !== action.payload);
      const removedColor = state.colors[action.payload];
      return {
        ...state,
        colors: newColors,
        selectedColor: state.selectedColor === removedColor && newColors.length > 0 
          ? newColors[0] 
          : state.selectedColor,
      };
    }
    
    case 'UPDATE_COLOR': {
      const { index, color } = action.payload;
      const newColors = [...state.colors];
      newColors[index] = color;
      return {
        ...state,
        colors: newColors,
        selectedColor: state.selectedColor === state.colors[index] ? color : state.selectedColor,
      };
    }
    
    default:
      return state;
  }
};

// Context definition
interface GridContextType {
  state: GridState;
  dispatch: React.Dispatch<GridAction>;
  // Computed values
  getText: (key: string) => string;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

// Provider component
export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gridReducer, initialState);

  // Initialize language from localStorage
  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    dispatch({ type: 'SET_LANGUAGE', payload: storedLanguage });
  }, []);

  // Memoized getText function
  const getTextMemo = useCallback((key: string) => {
    return getText(key, state.language);
  }, [state.language]);

  const contextValue: GridContextType = {
    state,
    dispatch,
    getText: getTextMemo,
  };

  return (
    <GridContext.Provider value={contextValue}>
      {children}
    </GridContext.Provider>
  );
};

// Custom hook to use grid context
export const useGrid = () => {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};