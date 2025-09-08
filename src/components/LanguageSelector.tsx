import React from 'react';
import type { LanguageSelectorProps, Language } from '@/types/index.ts';

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ro', label: 'RO' }
  ];

  return (
    <div className="flex justify-center gap-2 mb-6">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onLanguageChange(code)}
          className={[
            "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 min-w-[50px]",
            "border-2 border-indigo-500",
            currentLanguage === code
              ? "bg-indigo-500 text-white shadow-md hover:bg-indigo-600 hover:shadow-lg"
              : "bg-transparent text-indigo-600 hover:bg-indigo-50 hover:-translate-y-0.5"
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;