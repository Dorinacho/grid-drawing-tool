import React, { useState, useCallback, useEffect } from 'react';
import type { GridMatrix, ColorIndex, PaperSize, Language } from '../types/index.ts';
import { createEmptyMatrix, transposeMatrix } from '../utils/grid.ts';
import { getStoredLanguage, setStoredLanguage, getText } from '../utils/language.ts';
import { exportGridToPDF } from '@/utils/pdf.ts';
import LanguageSelector from './LanguageSelector.tsx';
import ControlPanel from './ControlPanel.tsx';
import GridCanvas from './GridCanvas.tsx';
import { ExportModal } from './ExportModal.tsx';

const GridCodeGenius: React.FC = () => {
  // State management
  const [language, setLanguage] = useState<Language>('en');
  const [rows, setRows] = useState<number>(10);
  const [cols, setCols] = useState<number>(14);
  const [matrix, setMatrix] = useState<GridMatrix>(() => createEmptyMatrix(10, 14));
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<ColorIndex>(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [selectedPaperSize, setSelectedPaperSize] = useState<PaperSize>('A4');

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
  const handleCellClick = useCallback((row: number, col: number) => {
    setMatrix(prevMatrix => {
      const newMatrix = { ...prevMatrix };
      if (!newMatrix[row]) {
        newMatrix[row] = [];
      }
      const currentValue = newMatrix[row][col] || 0;
      newMatrix[row][col] = currentValue === selectedColor ? 0 : selectedColor;
      return newMatrix;
    });
  }, [selectedColor]);

  // Handle orientation toggle
  const handleToggleOrientation = useCallback(() => {
    const { newMatrix, newRows, newCols } = transposeMatrix(matrix, rows, cols);
    setMatrix(newMatrix);
    setRows(newRows);
    setCols(newCols);
    setIsHorizontal(prev => !prev);
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
      alert(getText('validationError', language));
    }
  }, [rows, cols, language]);

  // Handle PDF export
  const handleExportPDF = useCallback((paperSize: PaperSize) => {
    try {
      exportGridToPDF(matrix, rows, cols, isHorizontal, paperSize, language);
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert(getText('exportError', language));
    }
  }, [matrix, rows, cols, isHorizontal, language]);

  // Handle rows change
  const handleRowsChange = useCallback((newRows: number) => {
    setRows(newRows);
  }, []);

  // Handle columns change
  const handleColsChange = useCallback((newCols: number) => {
    setCols(newCols);
  }, []);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 w-full max-w-6xl">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {getText('title', language)}
        </h1>

        {/* Language Selector */}
        <LanguageSelector 
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />

        {/* Control Panel */}
        <div className="flex justify-center mb-6">
          <ControlPanel
            rows={rows}
            cols={cols}
            selectedColor={selectedColor}
            isHorizontal={isHorizontal}
            language={language}
            onRowsChange={handleRowsChange}
            onColsChange={handleColsChange}
            onColorSelect={setSelectedColor}
            onToggleOrientation={handleToggleOrientation}
            onClearGrid={handleClearGrid}
            onExportPDF={() => setIsExportModalOpen(true)}
            onUpdateGrid={handleUpdateGrid}
          />
        </div>

        {/* Grid Canvas */}
        <GridCanvas
          matrix={matrix}
          rows={rows}
          cols={cols}
          isHorizontal={isHorizontal}
          selectedColor={selectedColor}
          onCellClick={handleCellClick}
        />

        {/* Instructions */}
        <div className="text-center mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
          <p className="text-gray-600">
            <span>{getText('instructions', language)}</span>{' '}
            <span className="font-semibold">{getText('currentOrientation', language)}</span>{' '}
            <span className="font-bold text-indigo-600">
              {getText(isHorizontal ? 'horizontal' : 'vertical', language)}
            </span>
          </p>
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExportPDF}
          selectedPaperSize={selectedPaperSize}
          onPaperSizeChange={setSelectedPaperSize}
          language={language}
        />
      </div>
    </div>
  );
};

export default GridCodeGenius;