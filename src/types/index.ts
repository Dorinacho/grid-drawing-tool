export type Language = 'en' | 'ro';

export type PaperSize = 'A3' | 'A4' | 'A5';

export type Orientation = 'horizontal' | 'vertical';

// Updated: Cell can now contain color, symbol, or both
export interface CellData {
    color: string | null;
    symbol: string | null;
}

// Updated: Matrix stores CellData objects instead of just colors
export interface GridMatrix {
    [row: number]: (CellData | null)[];
}

export interface PaperDimensions {
    width: number;
    height: number;
}

export interface GridConfig {
    rows: number;
    cols: number;
    isHorizontal: boolean;
    selectedColor: string;
    selectedSymbol: string | null; // Added: Selected symbol
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
    // selectedColor: string;
    // selectedSymbol: string | null; // Added: Selected symbol
    onCellClick: (row: number, col: number) => void;
    // colors: string[];
    // symbols: string[]; // Added: Available symbols
}

export interface ControlPanelProps {
    rows: number;
    cols: number;
    selectedColor: string;
    selectedSymbol: string | null; // Added: Selected symbol
    isHorizontal: boolean;
    onRowsChange: (rows: number) => void;
    onColsChange: (cols: number) => void;
    onColorSelect: (color: string) => void;
    onSymbolSelect: (symbol: string | null) => void; // Added: Symbol selection
    onToggleOrientation: () => void;
    onClearGrid: () => void;
    onExportPDF: () => void;
    onUpdateGrid: () => void;
    onAddColor: () => void;
    onRemoveColor: (index: number) => void;
    onAddSymbol: () => void; // Added: Add symbol function
    onRemoveSymbol: (index: number) => void; // Added: Remove symbol function
    language: Language;
    colors: string[];
    symbols: string[]; // Added: Available symbols
    setColors: (colors: string[]) => void;
    setSymbols: (symbols: string[]) => void; // Added: Set symbols function
}

export interface LanguageSelectorProps {
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
}
