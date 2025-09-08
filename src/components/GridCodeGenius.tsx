import React, { useState, useCallback, useEffect } from "react";
import type { GridMatrix, PaperSize, Language } from "../types/index.ts";
import {
  createEmptyMatrix,
  transposeMatrix,
  DEFAULT_COLORS,
} from "../utils/grid.ts";
import {
  getStoredLanguage,
  setStoredLanguage,
  getText,
} from "../utils/language.ts";
import { exportGridToPDF } from "@/utils/pdf.ts";
import LanguageSelector from "./LanguageSelector.tsx";
import ControlPanel from "./ControlPanel.tsx";
import GridCanvas from "./GridCanvas.tsx";
import { ExportModal } from "./ExportModal.tsx";
import CollapsibleSidebar from "./CollapsibleSidebar.tsx";

const GridCodeGenius: React.FC = () => {
  // State management
  const [language, setLanguage] = useState<Language>("ro");
  const [rows, setRows] = useState<number>(22);
  const [cols, setCols] = useState<number>(33);
  const [matrix, setMatrix] = useState<GridMatrix>(() =>
    createEmptyMatrix(22, 33)
  );
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLORS[0]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [selectedPaperSize, setSelectedPaperSize] = useState<PaperSize>("A4");
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS.slice(0, 4)); // Start with 4 colors

  // Initialize language from localStorage on component mount
  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setLanguage(storedLanguage);
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    setStoredLanguage(newLanguage);
  }, []);

  // Handle grid cell click
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setMatrix((prevMatrix) => {
        const newMatrix = { ...prevMatrix };
        if (!newMatrix[row]) {
          newMatrix[row] = new Array(cols).fill(null);
        }
        const currentValue = newMatrix[row][col];
        // Toggle: if cell has the selected color, clear it; otherwise, set it to selected color
        newMatrix[row][col] =
          currentValue === selectedColor ? null : selectedColor;
        return newMatrix;
      });
    },
    [selectedColor, cols]
  );

  // Handle orientation toggle
  const handleToggleOrientation = useCallback(() => {
    const { newMatrix, newRows, newCols } = transposeMatrix(matrix, rows, cols);
    setMatrix(newMatrix);
    setRows(newRows);
    setCols(newCols);
    setIsHorizontal((prev) => !prev);
  }, [matrix, rows, cols]);

  // Handle grid clear
  const handleClearGrid = useCallback(() => {
    setMatrix(createEmptyMatrix(rows, cols));
  }, [rows, cols]);

  // Handle grid update
  const handleUpdateGrid = useCallback(() => {
    if (rows > 0 && cols > 0 && rows <= 50 && cols <= 50) {
      setMatrix(createEmptyMatrix(rows, cols));
    } else {
      alert(getText("validationError", language));
    }
  }, [rows, cols, language]);

  // Handle PDF export
  const handleExportPDF = useCallback(
    (paperSize: PaperSize) => {
      try {
        exportGridToPDF(matrix, rows, cols, isHorizontal, paperSize, language);
        setIsExportModalOpen(false);
      } catch (error) {
        console.error("Export failed:", error);
        alert(getText("exportError", language));
      }
    },
    [matrix, rows, cols, isHorizontal, language]
  );

  // Handle rows change
  const handleRowsChange = useCallback((newRows: number) => {
    setRows(newRows);
  }, []);

  // Handle columns change
  const handleColsChange = useCallback((newCols: number) => {
    setCols(newCols);
  }, []);

  // Handle color selection
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  // Handle adding new color
  const handleAddColor = useCallback(() => {
    // This function is called from ControlPanel, the actual logic is handled there
  }, []);

  // Handle removing color
  const handleRemoveColor = useCallback(
    (index: number) => {
      // If the removed color was selected, select the first available color
      const removedColor = colors[index];
      if (selectedColor === removedColor && colors.length > 1) {
        const remainingColors = colors.filter((_, i) => i !== index);
        setSelectedColor(remainingColors[0]);
      }
    },
    [colors, selectedColor]
  );

  return (
    <div className="min-h-screen flex">
      {/* Collapsible Sidebar */}
      <CollapsibleSidebar
        rows={rows}
        cols={cols}
        selectedColor={selectedColor}
        isHorizontal={isHorizontal}
        language={language}
        onRowsChange={handleRowsChange}
        onColsChange={handleColsChange}
        onColorSelect={handleColorSelect}
        onToggleOrientation={handleToggleOrientation}
        onClearGrid={handleClearGrid}
        onExportPDF={() => setIsExportModalOpen(true)}
        onUpdateGrid={handleUpdateGrid}
        onAddColor={handleAddColor}
        onRemoveColor={handleRemoveColor}
        colors={colors}
        setColors={setColors}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 w-full max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getText("title", language)}
          </h1>

          {/* Language Selector */}
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />

          {/* Grid Canvas */}
          <GridCanvas
            matrix={matrix}
            rows={rows}
            cols={cols}
            isHorizontal={isHorizontal}
            selectedColor={selectedColor}
            onCellClick={handleCellClick}
            colors={colors}
          />

          {/* Instructions */}
          <div className="text-center mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <p className="text-gray-600">
              <span>{getText("instructions", language)}</span>{" "}
              <span className="font-semibold">
                {getText("currentOrientation", language)}
              </span>{" "}
              <span className="font-bold text-indigo-600">
                {getText(isHorizontal ? "horizontal" : "vertical", language)}
              </span>
            </p>
          </div>

          {/* Export Modal */}
          <ExportModal
            visible={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            onExport={handleExportPDF}
            selectedPaperSize={selectedPaperSize}
            onSelectPaperSize={setSelectedPaperSize}
            language={language}
            isOpen={false}
            onPaperSizeChange={setSelectedPaperSize}
          />
        </div>
      </div>
    </div>
  );
};

export default GridCodeGenius;
