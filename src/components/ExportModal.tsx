import React from "react";
import type { ExportModalProps, PaperSize, Language } from "../types/index.ts";
import { getText } from "../utils/language.ts";

interface ExtendedExportModalProps extends ExportModalProps {
  language: Language;
  selectedPaperSize: PaperSize;
  visible: boolean;
  onSelectPaperSize: (size: PaperSize) => void;
  onClose: () => void;
  onExport: (paperSize: PaperSize) => void;
  onPreview: (paperSize: PaperSize) => void;
}

const paperSizes: { key: PaperSize; label: string; dimensions: string }[] = [
  { key: "A3", label: "A3", dimensions: "297 × 420 mm" },
  { key: "A4", label: "A4", dimensions: "210 × 297 mm" },
  { key: "A5", label: "A5", dimensions: "148 × 210 mm" },
];

export const ExportModal: React.FC<ExtendedExportModalProps> = ({
  language,
  selectedPaperSize,
  onSelectPaperSize,
  onClose,
  onExport,
  onPreview,
  visible,
}) => {
  if (!visible) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="export-modal"
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {getText("exportToPDF", language)}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Paper Size Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              {getText("selectPaperSize", language) || "Select Paper Size"}
            </h4>
            <div className="space-y-2">
              {paperSizes.map(({ key, label, dimensions }) => (
                <button
                  key={key}
                  onClick={() => onSelectPaperSize(key)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedPaperSize === key
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-sm text-gray-500">{dimensions}</div>
                    </div>
                    {selectedPaperSize === key && (
                      <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {getText("cancel", language)}
            </button>
            <button
              onClick={() => onExport(selectedPaperSize)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              {getText("exportPDF", language) || getText("ok", language)}
            </button>
             <button
              onClick={() => onPreview(selectedPaperSize)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              {getText("preview", language) || getText("ok", language)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};