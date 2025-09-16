import React from "react";
import type { Language } from "../types/index.ts";
import { getText } from "../utils/language.ts";

interface SymbolPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSymbolSelect: (symbol: string) => void;
  language: Language;
}

// Predefined symbol categories with SVG paths
const SYMBOL_CATEGORIES = {
  shapes: {
    name: "shapes",
    symbols: [
      {
        name: "circle",
        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
      },
      { name: "square", path: "M3 3h18v18H3z" },
      { name: "triangle", path: "M12 2l9 20H3z" },
      {
        name: "star",
        path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      },
      {
        name: "heart",
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      },
    ],
  },
  arrows: {
    name: "arrows",
    symbols: [
      { name: "up", path: "M7 14l5-5 5 5z" },
      { name: "down", path: "M7 10l5 5 5-5z" },
      { name: "left", path: "M14 7l-5 5 5 5z" },
      { name: "right", path: "M10 17l5-5-5-5z" },
      { name: "up-right", path: "M7 17L17 7M17 7H9M17 7v8" },
      { name: "down-left", path: "M17 7L7 17M7 17h8M7 17V9" },
    ],
  },
  symbols: {
    name: "symbols",
    symbols: [
      { name: "check", path: "M20 6L9 17l-5-5" },
      { name: "x", path: "M18 6L6 18M6 6l12 12" },
      { name: "plus", path: "M12 5v14M5 12h14" },
      { name: "minus", path: "M5 12h14" },
    ],
  },
  misc: {
    name: "misc",
    symbols: [
      {
        name: "sun",
        path: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z",
      },
      { name: "moon", path: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" },
      { name: "lightning", path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
      {
        name: "flower",
        path: "M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM12 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM12 16a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM5 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM19 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3z",
      },
      {
        name: "target",
        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zM12 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z",
      },
      {
        name: "gear",
        path: "M12 1L9 4l-1.42 1.42L4 9l1.42 1.42L9 14l1.42 1.42L14 19l1.42-1.42L19 14l-1.42-1.42L14 9l-1.42-1.42L9 4z",
      },
    ],
  },
};

type SymbolCategroyKey = keyof typeof SYMBOL_CATEGORIES;

export const SymbolPickerModal: React.FC<SymbolPickerModalProps> = ({
  visible,
  onClose,
  onSymbolSelect,
  language,
}) => {
  const [activeCategory, setActiveCategory] =
    React.useState<SymbolCategroyKey>("shapes");

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            {getText("selectSymbol", language) || "Select Symbol"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex h-96">
          {/* Category Sidebar */}
          <div className="w-32 border-r border-gray-200 bg-gray-50">
            {Object.entries(SYMBOL_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as SymbolCategroyKey)}
                className={`w-full p-3 text-left text-sm font-medium transition-colors capitalize ${
                  activeCategory === key
                    ? "bg-indigo-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {getText(category.name, language) || category.name}
              </button>
            ))}
          </div>

          {/* Symbol Grid */}
          <div className="flex-1 p-6">
            <div className="flex flex-wrap gap-3">
              {SYMBOL_CATEGORIES[activeCategory]?.symbols.map(
                (symbol, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSymbolSelect(symbol.name);
                      onClose();
                    }}
                    className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
                    title={symbol.name}
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={symbol.path}
                      />
                    </svg>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {getText("cancel", language)}
          </button>
        </div>
      </div>
    </div>
  );
};
