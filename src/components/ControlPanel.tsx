import React from 'react';
import type { ControlPanelProps, ColorIndex, Language } from '@/types/index.ts';
import { getText } from '@/utils/language.ts';

interface ExtendedControlPanelProps extends ControlPanelProps {
  language: Language;
}


const ControlPanel: React.FC<ExtendedControlPanelProps> = ({
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
  onUpdateGrid
}) => {
  const colorOptions: { value: ColorIndex; bgClass: string }[] = [
    { value: 1, bgClass: 'bg-indigo-500' },
    { value: 2, bgClass: 'bg-pink-400' },
    { value: 3, bgClass: 'bg-teal-400' },
    { value: 4, bgClass: 'bg-yellow-300' }
  ];

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

  return (
    <div className="flex flex-col gap-3 mb-6 max-w-2xl">
      {/* First Row: Grid Controls and Color Picker */}
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Grid Dimensions */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-md min-w-[200px]">
          <label className="font-semibold text-gray-700 text-sm whitespace-nowrap">
            {getText('rows', language)}
          </label>
          <input
            type="number"
            value={rows}
            onChange={handleRowsChange}
            min="1"
            max="50"
            className="w-14 px-2 py-1 text-center text-sm border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
          />
          
          <label className="font-semibold text-gray-700 text-sm whitespace-nowrap ml-2">
            {getText('columns', language)}
          </label>
          <input
            type="number"
            value={cols}
            onChange={handleColsChange}
            min="1"
            max="50"
            className="w-14 px-2 py-1 text-center text-sm border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
          />
          
          <button
            onClick={onUpdateGrid}
            className="ml-2 px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {getText('update', language)}
          </button>
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-md">
          <label className="font-semibold text-gray-700 text-sm whitespace-nowrap">
            {getText('color', language)}
          </label>
          {colorOptions.map(({ value, bgClass }) => (
            <button
              key={value}
              onClick={() => onColorSelect(value)}
              className={`
                w-10 h-10 rounded-full transition-all duration-300 shadow-md
                ${bgClass}
                ${selectedColor === value 
                  ? 'scale-110 ring-4 ring-gray-800 shadow-lg' 
                  : 'hover:scale-105 hover:shadow-lg'
                }
              `}
            >
              {selectedColor === value && (
                <span className="text-white font-bold text-lg drop-shadow-md">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Second Row: Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onToggleOrientation}
          className="px-6 py-3 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
        >
          {getText('changeOrientation', language)}
        </button>
        
        <button
          onClick={onExportPDF}
          className="px-6 py-3 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
        >
          {getText('exportPDF', language)}
        </button>
        
        <button
          onClick={onClearGrid}
          className="px-6 py-3 font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
        >
          {getText('clearGrid', language)}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;