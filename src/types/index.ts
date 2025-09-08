export type Language = 'en' | 'ro';

export type PaperSize = 'A3' | 'A4' | 'A5';

export type Orientation = 'horizontal' | 'vertical';

// Changed: Now the matrix stores color hex values directly, or null for empty cells
export interface GridMatrix {
  [row: number]: (string | null)[];
}

export interface PaperDimensions {
  width: number;
  height: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  isHorizontal: boolean;
  selectedColor: string; // Changed: Now uses hex color string
}

export interface Translations {
  [lang: string]: {
    [key: string]: string;
  };
}

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (paperSize: PaperSize) => void;
  selectedPaperSize: PaperSize;
  onPaperSizeChange: (size: PaperSize) => void;
}

export interface GridCanvasProps {
  matrix: GridMatrix;
  rows: number;
  cols: number;
  isHorizontal: boolean;
  selectedColor: string; // Changed: Now uses hex color string
  onCellClick: (row: number, col: number) => void;
  colors: string[]; // Added: Array of available colors
}

export interface ControlPanelProps {
  rows: number;
  cols: number;
  selectedColor: string; // Changed: Now uses hex color string
  isHorizontal: boolean;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  onColorSelect: (color: string) => void; // Changed: Now uses hex color string
  onToggleOrientation: () => void;
  onClearGrid: () => void;
  onExportPDF: () => void;
  onUpdateGrid: () => void;
  onAddColor: () => void; // Added: Function to add new colors
  onRemoveColor: (index: number) => void; // Added: Function to remove colors
  language: Language;
  colors: string[]; // Changed: Array of hex color strings
  setColors: (colors: string[]) => void;
}

export interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}