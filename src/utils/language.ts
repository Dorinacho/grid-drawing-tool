import type { Language, Translations } from "@/types/index.ts";

export const translations: Translations = {
  en: {
    title: "GridCodeGenius",
    rows: "Rows:",
    columns: "Columns:",
    update: "Update",
    colors: "Colors:",
    symbols: "Symbols:",
    changeOrientation: "Change Orientation",
    exportPDF: "Export to PDF",
    clearGrid: "Clear Grid",
    instructions:
      "Click on grid cells to paint/unpaint them with selected color and symbol.",
    symbolInstructions:
      "Click on grid cells to add colored symbols on white background.",
    currentOrientation: "Current orientation:",
    horizontal: "Horizontal",
    vertical: "Vertical",
    exportToPDF: "Export to PDF",
    cancel: "Cancel",
    ok: "OK",
    validationError:
      "Please enter valid dimensions (1-50 for both rows and columns)",
    exportError: "Error exporting PDF. Please try again.",
    actions: "Actions",
    selectPaperSize: "Select Paper Size",
    noSymbol: "None",
    selectedSymbol: "Selected Symbol",
    choose: "Choose",
    clearSymbol: "Clear Symbol",
    selectSymbol: "Select Symbol",
    symbolColor: "Symbol Color",
    symbol: "Symbol",
    shapes: "Shapes",
    arrows: "Arrows",
    misc: "Misc",
    preview: "Preview PDF",
  },
  ro: {
    title: "GridCodeGenius",
    rows: "Rânduri:",
    columns: "Coloane:",
    update: "Actualizează",
    colors: "Culori:",
    symbols: "Simboluri:",
    changeOrientation: "Schimbă Orientarea",
    exportPDF: "Exportă în PDF",
    clearGrid: "Șterge Grila",
    instructions:
      "Faceți clic pe celulele grilei pentru a le colora/decolora cu culoarea și simbolul selectate.",
    symbolInstructions:
      "Faceți clic pe celulele grilei pentru a adăuga simboluri colorate pe fundal alb.",
    currentOrientation: "Orientarea curentă:",
    horizontal: "Orizontală",
    vertical: "Verticală",
    exportToPDF: "Exportă în PDF",
    cancel: "Anulează",
    ok: "OK",
    validationError:
      "Vă rugăm să introduceți dimensiuni valide (1-50 pentru rânduri și coloane)",
    exportError: "Eroare la exportarea PDF. Vă rugăm să încercați din nou.",
    actions: "Acțiuni",
    selectPaperSize: "Selectează Mărimea Hârtiei",
    noSymbol: "Fără",
    selectedSymbol: "Simbolul Selectat",
    choose: "Alege",
    clearSymbol: "Șterge Simbolul",
    selectSymbol: "Selectează Simbolul",
    symbolColor: "Culoarea Simbolului",
    symbol: "Simbol",
    shapes: "Forme",
    arrows: "Săgeți",
    misc: "Diverse",
    preview: "Previzualizare PDF",
  },
};

export const getText = (key: string, language: Language): string => {
  return translations[language]?.[key] || translations["en"][key] || key;
};

export const getStoredLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("gridcodegenius-language") as Language;
    return stored && translations[stored] ? stored : "ro";
  }
  return "ro";
};

export const setStoredLanguage = (language: Language): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("gridcodegenius-language", language);
  }
};
