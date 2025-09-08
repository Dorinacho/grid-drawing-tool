import React, { useState } from "react";
import type { ControlPanelProps, Language } from "@/types/index.ts";
import { getText } from "@/utils/language.ts";
import { generateRandomColor, isColorInPalette } from "@/utils/grid.ts";

const ControlPanel: React.FC<ControlPanelProps> = ({
  rows,
  cols,
  selectedColor,
  isHorizontal,
  language,
  onRowsChange,
  onColsChange,
  onColorSelect,
  onToggleOrientation,
  onClearGrid,
  onExportPDF,
  onUpdateGrid,
  onAddColor,
  onRemoveColor,
  colors,
  setColors,
}) => {
  // Collapse state for sections
  const [showGridControls, setShowGridControls] = useState(true);
  const [showColors, setShowColors] = useState(true);
  const [showActions, setShowActions] = useState(true);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      onRowsChange(value);
    }
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      onColsChange(value);
    }
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
    onColorSelect(newColor);
  };

  const handleAddColor = () => {
    if (colors.length < 20) {
      let newColor = generateRandomColor();
      while (isColorInPalette(newColor, colors)) {
        newColor = generateRandomColor();
      }
      onAddColor();
      setColors([...colors, newColor]);
    }
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length > 1) {
      const updatedColors = colors.filter((_, i) => i !== index);
      setColors(updatedColors);
      onRemoveColor(index);
      if (selectedColor === colors[index] && updatedColors.length > 0) {
        onColorSelect(updatedColors[0]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-72 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 overflow-y-auto">
      {/* Grid Controls Section */}
      <div>
        <button
          onClick={() => setShowGridControls(!showGridControls)}
          className="w-full flex justify-between items-center px-3 py-2 font-semibold bg-indigo-500 text-white rounded-lg"
        >
          {getText("rows", language)} / {getText("columns", language)}
          <span>{showGridControls ? "−" : "+"}</span>
        </button>
        {showGridControls && (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{getText("rows", language)}</label>
              <input
                type="number"
                value={rows}
                onChange={handleRowsChange}
                min="1"
                max="50"
                className="w-16 px-2 py-1 border rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{getText("columns", language)}</label>
              <input
                type="number"
                value={cols}
                onChange={handleColsChange}
                min="1"
                max="50"
                className="w-16 px-2 py-1 border rounded-md"
              />
            </div>
            <button
              onClick={onUpdateGrid}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("update", language)}
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
          {getText("colors", language)}
          <span>{showColors ? "−" : "+"}</span>
        </button>
        {showColors && (
          <div className="mt-3 flex flex-wrap gap-3">
            {colors.map((color, idx) => (
              <div key={idx} className="relative group flex flex-col items-center">
                <button
                  onClick={() => onColorSelect(color)}
                  className={`w-10 h-10 rounded-lg shadow-md transition-all duration-200 ${
                    selectedColor === color
                      ? "ring-2 ring-indigo-500 ring-offset-1"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <span className="text-white font-bold text-xs drop-shadow-lg">✓</span>
                  )}
                </button>
                {colors.length > 1 && (
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
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  className="mt-2 w-6 h-4 rounded cursor-pointer"
                />
              </div>
            ))}
            {colors.length < 12 && (
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

      {/* Actions Section */}
      <div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="w-full flex justify-between items-center px-3 py-2 font-semibold bg-indigo-500 text-white rounded-lg"
        >
          {getText("actions", language)}
          <span>{showActions ? "−" : "+"}</span>
        </button>
        {showActions && (
          <div className="mt-3 flex flex-col gap-3">
            <button
              onClick={onToggleOrientation}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("changeOrientation", language)}
            </button>
            <button
              onClick={onExportPDF}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("exportPDF", language)}
            </button>
            <button
              onClick={onClearGrid}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:shadow-lg"
            >
              {getText("clearGrid", language)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
