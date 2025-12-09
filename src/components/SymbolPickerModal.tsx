import React from 'react';
import type { Language } from '../types/index.ts';
import { getText } from '../utils/language.ts';
import {
    SYMBOL_CATEGORIES,
    SYMBOL_DEFINITIONS,
    type SymbolCategoryKey,
} from '../utils/symbols.tsx';

interface SymbolPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSymbolSelect: (symbol: string) => void;
    language: Language;
}

export const SymbolPickerModal: React.FC<SymbolPickerModalProps> = ({
    visible,
    onClose,
    onSymbolSelect,
    language,
}) => {
    const [activeCategory, setActiveCategory] = React.useState<SymbolCategoryKey>('shapes');

    if (!visible) return null;

    const currentCategory = SYMBOL_CATEGORIES[activeCategory];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">
                        {getText('selectSymbol', language) || 'Select Symbol'}
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
                                onClick={() => setActiveCategory(key as SymbolCategoryKey)}
                                className={`w-full p-3 text-left text-sm font-medium transition-colors capitalize ${
                                    activeCategory === key
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {getText(category.name, language) || category.name}
                            </button>
                        ))}
                    </div>

                    {/* Symbol Grid */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="flex flex-wrap gap-3">
                            {currentCategory.symbols.map((symbolName) => {
                                const path = SYMBOL_DEFINITIONS[symbolName];
                                if (!path) return null;

                                return (
                                    <button
                                        key={symbolName}
                                        onClick={() => {
                                            onSymbolSelect(symbolName);
                                            onClose();
                                        }}
                                        className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
                                        title={symbolName}
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
                                                d={path}
                                            />
                                        </svg>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {getText('cancel', language)}
                    </button>
                </div>
            </div>
        </div>
    );
};
