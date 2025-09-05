export type Language = 'en' | 'ro';

export type ColorIndex = 0 | 1 | 2 | 3 | 4;

export type PaperSize = 'A3' | 'A4' | 'A5';

export type Orientation = 'horizontal' | 'vertical';

export interface GridMatrix {
  [row: number]: ColorIndex[];
}

export interface PaperDimensions {
  width: number;
  height: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  isHorizontal: boolean;
  selectedColor: ColorIndex;
}

export interface ColorPalette {
  [key: number]: string;
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
  selectedColor: ColorIndex;
  onCellClick: (row: number, col: number) => void;
}

export interface ControlPanelProps {
  rows: number;
  cols: number;
  selectedColor: ColorIndex;
  isHorizontal: boolean;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  onColorSelect: (color: ColorIndex) => void;
  onToggleOrientation: () => void;
  onClearGrid: () => void;
  onExportPDF: () => void;
  onUpdateGrid: () => void;
}

export interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}