document.addEventListener("DOMContentLoaded", () => {
  let currentLanguage = "ro"; // Default to Romanian

  const translations = {
    en: {
      homeTitle: "Grid Drawing Tool - Home",
      appBrand: "Grid Drawing Tool",
      navHome: "Home",
      navDraw: "Draw",
      mainTitle: "Unleash Your Creativity <br> with Pixel-Perfect Precision",
      mainDescription:
        "Our Grid Drawing Tool helps you create stunning grid-based designs with customizable colors, page sizes, and export options. Get started now!",
      startButton: "Start Drawing",
      footerText: "&copy; 2024 Grid Drawing Tool. All rights reserved.",
    },
    ro: {
      homeTitle: "Instrument de Desen Grilă - Acasă",
      appBrand: "Instrument de Desen Grilă",
      navHome: "Acasă",
      navDraw: "Desenează",
      mainTitle: "Dezlănțuie-ți Creativitatea <br> cu Precizie Pixel-Perfectă",
      mainDescription:
        "Instrumentul nostru de Desen Grilă te ajută să creezi desene uimitoare bazate pe grile, cu culori personalizabile, dimensiuni de pagină și opțiuni de export. Începe acum!",
      startButton: "Începe să Desenezi",
      footerText:
        "&copy; 2024 Instrument de Desen Grilă. Toate drepturile rezervate.",
    },
  };

  /**
   * Updates the text content of elements based on the current language.
   */
  function setLanguage() {
    // Update document title separately
    document.title = translations[currentLanguage].homeTitle;

    const elements = document.querySelectorAll("[data-key]");
    elements.forEach((element) => {
      const key = element.dataset.key;
      if (translations[currentLanguage] && translations[currentLanguage][key]) {
        // For mainTitle, innerHTML is needed due to <br> tag
        if (key === "mainTitle") {
          element.innerHTML = translations[currentLanguage][key];
        } else {
          element.textContent = translations[currentLanguage][key];
        }
      }
    });
  }

  // Set the language when the page loads
  setLanguage();
});
