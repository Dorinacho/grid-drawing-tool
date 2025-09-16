import React from "react";
import type { Language } from "../../types/index.ts";
import { getText } from "../../utils/language.ts";

export type ConfirmationAction = 'update' | 'clear';

interface ConfirmationModalProps {
  visible: boolean;
  action: ConfirmationAction | null;
  language: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  action,
  language,
  onConfirm,
  onCancel,
}) => {
  if (!visible || !action) return null;

  const getModalContent = () => {
    switch (action) {
      case 'update':
        return {
          title: getText("confirmUpdateTitle", language) || "Update Grid",
          message: getText("confirmUpdateMessage", language) || "Are you sure you want to update the grid? This will clear all current symbols and colors.",
          confirmText: getText("update", language) || "Update",
          confirmStyle: "bg-indigo-600 hover:bg-indigo-700",
          icon: (
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        };
      case 'clear':
        return {
          title: getText("confirmClearTitle", language) || "Clear Grid",
          message: getText("confirmClearMessage", language) || "Are you sure you want to clear the grid? This will remove all symbols and colors from all cells.",
          confirmText: getText("clearGrid", language) || "Clear",
          confirmStyle: "bg-red-600 hover:bg-red-700",
          icon: (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to proceed?",
          confirmText: "Confirm",
          confirmStyle: "bg-indigo-600 hover:bg-indigo-700",
          icon: (
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const { title, message, confirmText, confirmStyle, icon } = getModalContent();

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel}
        data-testid="confirmation-modal"
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* Header with Icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {title}
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Warning for destructive actions */}
          {(action === 'clear' || action === 'update') && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  {getText("warningMessage", language) || "This action cannot be undone."}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {getText("cancel", language)}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-md ${confirmStyle}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};