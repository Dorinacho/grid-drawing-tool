// src/components/GridCodeGenius.tsx - Refactored
import React from "react";
import { GridProvider } from "../contexts/GridContext.tsx";
import { useGridActions } from "../hooks/useGridActions.ts";
import LanguageSelector from "./LanguageSelector.tsx";
import GridCanvas from "./GridCanvas.tsx";
import { ExportModal } from "./ExportModal.tsx";
import CollapsibleSidebar from "./CollapsibleSidebar.tsx";
import { renderSymbolSVG } from "../utils/symbols.tsx";

const GridCodeGeniusContent: React.FC = () => {
  const { 
    state, 
    getText, 
    // handleLanguageChange, 
    handleCellClick, 
    closeExportModal, 
    handleExportPDF, 
    handlePaperSizeChange 
  } = useGridActions();

  return (
    <div className="min-h-screen flex">
      {/* Collapsible Sidebar - now gets data from context */}
      <CollapsibleSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 w-full max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getText("title")}
          </h1>

          {/* Language Selector */}
          {/* <LanguageSelector
            currentLanguage={state.language}
            onLanguageChange={handleLanguageChange}
          /> */}

          {/* Current Selection Display */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-600">
                {getText("symbolColor")}:
              </span>
              <div
                className="w-6 h-6 rounded border-2 border-gray-300"
                style={{ backgroundColor: state.selectedColor }}
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-600">
                {getText("symbol")}:
              </span>
              <div className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded">
                {state.selectedSymbol ? renderSymbolSVG(state.selectedSymbol, state.selectedColor, 16) : "−"}
              </div>
            </div>
          </div>

          {/* Grid Canvas */}
          <GridCanvas
            matrix={state.matrix}
            rows={state.rows}
            cols={state.cols}
            isHorizontal={state.isHorizontal}
            // selectedColor={state.selectedColor}
            // selectedSymbol={state.selectedSymbol}
            onCellClick={handleCellClick}
            // colors={state.colors}
          />

          {/* Instructions */}
          <div className="text-center mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <p className="text-gray-600">
              <span>{getText("symbolInstructions")}</span>{" "}
              <span className="font-semibold">
                {getText("currentOrientation")}
              </span>{" "}
              <span className="font-bold text-indigo-600">
                {getText(state.isHorizontal ? "horizontal" : "vertical")}
              </span>
            </p>
          </div>

          {/* Export Modal */}
          <ExportModal
            visible={state.isExportModalOpen}
            onClose={closeExportModal}
            onExport={handleExportPDF}
            selectedPaperSize={state.selectedPaperSize}
            onSelectPaperSize={handlePaperSizeChange}
            language={state.language}
            isOpen={false}
            onPaperSizeChange={handlePaperSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

const GridCodeGenius: React.FC = () => {
  return (
    <GridProvider>
      <GridCodeGeniusContent />
    </GridProvider>
  );
};

export default GridCodeGenius;