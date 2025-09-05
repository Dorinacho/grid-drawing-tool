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
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="modal" data-testid="export-modal">
      <div className="modal-content">
        <h3>{getText("exportToPDF", language)}</h3>
        <div className="paper-selection">
          {paperSizes.map(({ key, label, dimensions }) => (
            <div
              key={key}
              className={`checkbox-group${
                selectedPaperSize === key ? " selected" : ""
              }`}
              onClick={() => onSelectPaperSize(key)}
              style={{ cursor: "pointer" }}
            >
              <input
                type="checkbox"
                id={`paper${key}`}
                name="paperSize"
                checked={selectedPaperSize === key}
                readOnly
              />
              <label htmlFor={`paper${key}`}>
                {label} ({dimensions})
              </label>
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            {getText("cancel", language)}
          </button>
          <button onClick={onExport}>{getText("ok", language)}</button>
        </div>
      </div>
    </div>
  );
};
