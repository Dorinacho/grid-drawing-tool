// src/components/ControlPanel.tsx - Refactored
import React, { useState } from "react";
import { useGridActions } from "../hooks/useGridActions.ts";
import { renderSymbolSVG } from "../utils/symbols.tsx";
import { SymbolPickerModal } from "./SymbolPickerModal.tsx";

const ControlPanel: React.FC = () => {
  const {
    state,
    getText,
    handleRowsChange,
    handleColsChange,
    handleColorSelect,
    handleSymbolSelect,
    handleToggleOrientation,
    handleClearGrid,
    openExportModal,
    handleUpdateGrid,
    handleAddColor,
    handleRemoveColor,
    handleUpdateColor,
  } = useGridActions();

  // Collapse state for sections
  const [showGridControls, setShowGridControls] = useState(true);
  const [showColors, setShowColors] = useState(true);
  const [showSymbols, setShowSymbols] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);

  const handleRowsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      handleRowsChange(value);
    }
  };

  const handleColsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      handleColsChange(value);
    }
  };

  const handleColorInputChange = (index: number, newColor: string) => {
    handleUpdateColor(index, newColor);
    handleColorSelect(newColor);
  };

  return (
    <div className="flex flex-col gap-4 w-72 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 overflow-y-auto">
      {/* Grid Controls Section */}
      <div>
        <button
          onClick={() => setShowGridControls(!showGridControls)}
          className="w-full flex justify-between items-center px-3 py-2 font-semibold bg-indigo-500 text-white rounded-lg"
        >
          {getText("rows")} / {getText("columns")}
          <span>{showGridControls ? "−" : "+"}</span>
        </button>
        {showGridControls && (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{getText("rows")}</label>
              <input
                type="number"
                value={state.rows}
                onChange={handleRowsInputChange}
                min="1"
                max="50"
                className="w-16 px-2 py-1 border rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                {getText("columns")}
              </label>
              <input
                type="number"
                value={state.cols}
                onChange={handleColsInputChange}
                min="1"
                max="50"
                className="w-16 px-2 py-1 border rounded-md"
              />
            </div>
            <button
              onClick={handleUpdateGrid}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("update")}
            </button>
          </div>
        )}
      </div>

      {/* Colors Section */}
      <div>
        <button
          onClick={() => setShowColors(!showColors)}
          className="w-full flex justify-between items-center px-3 py-2 font-semibold bg-indigo-500 text-white rounded-lg"
        >
          {getText("colors")}
          <span>{showColors ? "−" : "+"}</span>
        </button>
        {showColors && (
          <div className="mt-3 flex flex-wrap gap-3">
            {state.colors.map((color, idx) => (
              <div
                key={idx}
                className="relative group flex flex-col items-center"
              >
                <button
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 rounded-lg shadow-md transition-all duration-200 ${
                    state.selectedColor === color
                      ? "ring-2 ring-indigo-500 ring-offset-1"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {state.selectedColor === color && (
                    <span className="text-white font-bold text-xs drop-shadow-lg">
                      ✓
                    </span>
                  )}
                </button>
                {state.colors.length > 1 && (
                  <button
                    onClick={() => handleRemoveColor(idx)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorInputChange(idx, e.target.value)}
                  className="mt-2 w-6 h-4 rounded cursor-pointer"
                />
              </div>
            ))}
            {state.colors.length < 12 && (
              <button
                onClick={handleAddColor}
                className="w-10 h-10 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-300"
              >
                +
              </button>
            )}
          </div>
        )}
      </div>

      {/* Symbols Section */}
      <div>
        <button
          onClick={() => setShowSymbols(!showSymbols)}
          className="w-full flex justify-between items-center px-3 py-2 font-semibold bg-purple-500 text-white rounded-lg"
        >
          {getText("symbols")}
          <span>{showSymbols ? "−" : "+"}</span>
        </button>
        {showSymbols && (
          <div className="mt-3 flex flex-col gap-3">
            {/* Current Selected Symbol */}
            <div className="flex items-center justify-between p-3 bg-white border-2 border-gray-200 rounded-lg">
              <span className="text-sm font-medium">
                {getText("selectedSymbol") || "Selected Symbol"}:
              </span>
              <div className="flex items-center gap-2">
                {state.selectedSymbol ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded">
                    {renderSymbolSVG(
                      state.selectedSymbol,
                      state.selectedColor,
                      20
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">
                    {getText("noSymbol")}
                  </span>
                )}
                <button
                  onClick={() => setShowSymbolPicker(true)}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
                >
                  {getText("choose") || "Choose"}
                </button>
              </div>
            </div>

            {/* Clear Symbol Button */}
            {state.selectedSymbol && (
              <button
                onClick={() => handleSymbolSelect(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {getText("clearSymbol") || "Clear Symbol"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="w-full flex justify-between items-center px-3 py-2 font-semibold bg-indigo-500 text-white rounded-lg"
        >
          {getText("actions")}
          <span>{showActions ? "−" : "+"}</span>
        </button>
        {showActions && (
          <div className="mt-3 flex flex-col gap-3">
            <button
              onClick={handleToggleOrientation}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("changeOrientation")}
            </button>
            <button
              onClick={openExportModal}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("exportPDF")}
            </button>
            <button
              onClick={handleClearGrid}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("clearGrid")}
            </button>
          </div>
        )}
      </div>

      {/* Symbol Picker Modal */}
      <SymbolPickerModal
        visible={showSymbolPicker}
        onClose={() => setShowSymbolPicker(false)}
        onSymbolSelect={handleSymbolSelect}
        language={state.language}
      />
    </div>
  );
};

export default ControlPanel;
