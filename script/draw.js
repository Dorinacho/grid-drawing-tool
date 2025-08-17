document.addEventListener("DOMContentLoaded", () => {
  const colorSwatches = document.querySelectorAll(".color-swatch"); // These are now the color picker inputs
  const numSquaresInRowInput = document.getElementById("numSquaresInRow");
  const createGridBtn = document.getElementById("createGridBtn");
  const pageDimensionSelect = document.getElementById("pageDimension");
  const squareSizeMMDisplay = document.getElementById("squareSizeMMDisplay");
  const controlPanel = document.getElementById("controlPanel");
  const eraserBtn = document.getElementById("eraserBtn");
  const languageSelect = document.getElementById("languageSelect");
  const backToHomeBtn = document.getElementById('backToHomeBtn');

  const defaultCellColor = "#ffffff"; // Default color for individual cells when created or erased

  let selectedColor; // Holds the color selected for painting cells
  let isEraserActive = false;
  let currentLanguage = "ro";
  let lastNumSquaresInRow = parseInt(numSquaresInRowInput.value, 10); // Stores the last applied 'Squares in Row' value

  // Define translations for different languages
  const translations = {
    en: {
      appTitle: "Color Grid App",
      backToHomeBtn: "Back",
      confirmGoBackTitle: "Discard Progress?",
      confirmGoBackMessage: "Going back to the home page will erase all your drawing progress. Are you sure you want to proceed?",
      adjustSelectedColorLabel: "Selected Colors:",
      colorPalettesLabel: "Color Palettes:",
      squaresInRowLabel: "Squares in Row:",
      pageSizeLabel: "Page Size:",
      languageLabel: "Language:",
      eraserBtn: "Eraser",
      exportPdfBtn: "Export to PDF",
      createGridBtn: "Create Grid",
      squareSizeDisplay: "Each square: {size} mm",
      validationMessage:
        "Please enter a number of squares per row between 1 and 100.",
      exportFileName: "ColorGrid_{page_size}_{squares_in_row}Squares.pdf",
      confirmChangeTitle: "Confirm Grid Change",
      confirmChangeMessage:
        "Clicking 'Create Grid' will erase your current design and generate a new grid. Are you sure you want to proceed?", // Updated message
      confirmYes: "Yes",
      confirmNo: "No",
      changeCancelled: "Grid creation cancelled.", // Updated feedback message
    },
    ro: {
      appTitle: "Aplicație Grilă de Culori",
      backToHomeBtn: "Înapoi",
      confirmGoBackTitle: "Renunți la Progres?",
      confirmGoBackMessage: "Revenirea la pagina principală va șterge tot progresul de desen. Ești sigur(ă) că vrei să continui?",
      adjustSelectedColorLabel: "Culoarile Selectate:",
      colorPalettesLabel: "Palete de Culori:",
      squaresInRowLabel: "Pătrate pe Rând:",
      pageSizeLabel: "Dimensiune Pagină:",
      languageLabel: "Limba:",
      eraserBtn: "Radieră",
      exportPdfBtn: "Exportă PDF",
      createGridBtn: "Creează Grilă",
      squareSizeDisplay: "Fiecare pătrat: {size} mm",
      validationMessage:
        "Vă rugăm să introduceți un număr de pătrate pe rând între 1 și 100.",
      exportFileName: "GrilaDeCulori_{dim_pagina}_{patrate_pe_rand}Patrate.pdf",
      confirmChangeTitle: "Confirmă Modificarea Grilei",
      confirmChangeMessage:
        "Apăsarea 'Creează Grilă' va șterge designul curent și va genera o nouă grilă. Ești sigur(ă) că vrei să continui?", // Updated message
      confirmYes: "Da",
      confirmNo: "Nu",
      changeCancelled: "Crearea grilei a fost anulată.", // Updated feedback message
    },
  };

  /**
   * Displays a custom message box to the user.
   * @param {string} message The message to display.
   * @param {string} type The type of message ('error' or 'info').
   * @param {number} duration The duration in ms to show the message (optional).
   */
  function showMessageBox(message, type, duration = 3000) {
    const messageBox = document.createElement("div");
    messageBox.className = `fixed top-4 px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
      type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
    }`;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    setTimeout(() => messageBox.remove(), duration);
  }

  /**
   * Displays a custom confirmation modal.
   * @param {string} title The title of the confirmation.
   * @param {string} message The confirmation message.
   * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise.
   */
  function showConfirmModal(title, message) {
    return new Promise((resolve) => {
      const modalOverlay = document.createElement("div");
      modalOverlay.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

      const modalContent = document.createElement("div");
      modalContent.className =
        "bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center";

      const modalTitle = document.createElement("h3");
      modalTitle.className = "text-xl font-semibold mb-4 text-gray-800";
      modalTitle.textContent = title;

      const modalMessage = document.createElement("p");
      modalMessage.className = "text-gray-700 mb-6";
      modalMessage.textContent = message;

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "flex justify-around space-x-4";

      const yesButton = document.createElement("button");
      yesButton.className =
        "px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-200";
      yesButton.textContent = translations[currentLanguage].confirmYes;

      const noButton = document.createElement("button");
      noButton.className =
        "px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition duration-200";
      noButton.textContent = translations[currentLanguage].confirmNo;

      yesButton.addEventListener("click", () => {
        modalOverlay.remove();
        resolve(true);
      });

      noButton.addEventListener("click", () => {
        modalOverlay.remove();
        resolve(false);
      });

      buttonContainer.appendChild(yesButton);
      buttonContainer.appendChild(noButton);
      modalContent.appendChild(modalTitle);
      modalContent.appendChild(modalMessage);
      modalContent.appendChild(buttonContainer);
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
    });
  }

  /**
   * Updates the text content of elements based on the current language.
   */
  function setLanguage() {
    const elements = document.querySelectorAll("[data-key]");
    elements.forEach((element) => {
      const key = element.dataset.key;
      if (translations[currentLanguage] && translations[currentLanguage][key]) {
        // Special handling for buttons and options to set textContent
        if (element.tagName === "BUTTON" || element.tagName === "OPTION") {
          element.textContent = translations[currentLanguage][key];
        } else {
          // For all other elements with data-key
          element.textContent = translations[currentLanguage][key];
        }
      }
    });
    // Update the square size display separately as it has dynamic content
    updateSquareSizeDisplay(
      parseFloat(squareSizeMMDisplay.textContent.match(/[\d.]+/)) || 0
    );
  }

  /**
   * Updates the display for square size in millimeters with translated text.
   * @param {number} size The calculated size of the square in millimeters.
   */
  function updateSquareSizeDisplay(size) {
    if (translations[currentLanguage]) {
      squareSizeMMDisplay.textContent = translations[
        currentLanguage
      ].squareSizeDisplay.replace("{size}", size.toFixed(2));
    }
  }

  // Initialize selected color with the value of the first color swatch picker
  selectedColor = colorSwatches[0].value;
  colorSwatches[0].classList.add("active"); // Set the first swatch as active by default

  const pageMillimeterDimensions = {
    A5: { width: 148, height: 210 },
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
  };

  /**
   * Updates the fixed dimensions of the grid container.
   * The grid's width is set to match the control panel's width.
   * The grid's height is calculated to maintain the selected page's aspect ratio.
   * It also controls the overflow behavior based on screen width.
   */
  function updateGridContainerDimensions() {
    const selectedPageDimension = pageDimensionSelect.value;
    const controlPanelWidth = controlPanel.offsetWidth;

    const selectedPage = pageMillimeterDimensions[selectedPageDimension];
    if (!selectedPage) {
      console.error("Invalid page dimension selected.");
      return;
    }

    const aspectRatio = selectedPage.height / selectedPage.width;

    gridContainer.style.width = `${controlPanelWidth}px`;
    gridContainer.style.height = `${controlPanelWidth * aspectRatio}px`;

    if (window.innerWidth > 1200) {
      gridContainer.style.overflow = "hidden";
    } else {
      gridContainer.style.overflow = "auto";
    }

    createGrid();
  }

  /**
   * Creates a grid using the specified number of squares per row.
   * The size of each square is calculated to fit an integer number of squares
   * horizontally within the container's width.
   * It also calculates and displays the square size in millimeters.
   */
  function createGrid() {
    gridContainer.innerHTML = "";
    const numSquaresInRow = parseInt(numSquaresInRowInput.value, 10);

    if (
      isNaN(numSquaresInRow) ||
      numSquaresInRow < 1 ||
      numSquaresInRow > 100
    ) {
      showMessageBox(translations[currentLanguage].validationMessage, "error");
      return;
    }

    const effectiveContainerWidth = gridContainer.offsetWidth;
    const effectiveContainerHeight = gridContainer.offsetHeight;

    const cellSizePx = effectiveContainerWidth / numSquaresInRow;
    const cellSize = `${cellSizePx}px`;

    const numRows = Math.floor(effectiveContainerHeight / cellSizePx);

    const pixelsPerMM = 96 / 25.4;
    const cellSizeMM = cellSizePx / pixelsPerMM;

    updateSquareSizeDisplay(cellSizeMM);

    document.documentElement.style.setProperty("--cell-size", cellSize);

    gridContainer.style.gridTemplateColumns = `repeat(${numSquaresInRow}, ${cellSize})`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, ${cellSize})`;

    for (let i = 0; i < numSquaresInRow * numRows; i++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.style.backgroundColor = defaultCellColor; // Cells start with default color
      gridContainer.appendChild(cell);
    }
    lastNumSquaresInRow = numSquaresInRow; // Update last known value after grid creation
  }

  /**
   * Handles clicks on the grid cells to change their background color.
   * Uses event delegation on the gridContainer for efficiency.
   * @param {Event} event The click event object.
   */
  function handleCellClick(event) {
    if (event.target.classList.contains("grid-cell")) {
      if (isEraserActive) {
        event.target.style.backgroundColor = defaultCellColor;
      } else {
        event.target.style.backgroundColor = selectedColor;
      }
    }
  }

  // Function to export grid to PDF
  function exportGridToPdf() {
    const selectedPageType = pageDimensionSelect.value;
    const pageDim = pageMillimeterDimensions[selectedPageType];

    let orientation = pageDim.width > pageDim.height ? "landscape" : "portrait";
    const doc = new window.jspdf.jsPDF({
      orientation: orientation,
      unit: "mm",
      format: selectedPageType,
    });

    const gridCells = gridContainer.querySelectorAll(".grid-cell");
    const numSquaresInRow = parseInt(numSquaresInRowInput.value, 10);

    const pdfPageWidth = doc.internal.pageSize.getWidth();
    const pdfPageHeight = doc.internal.pageSize.getHeight();
    const pdfCellSizeMM = pdfPageWidth / numSquaresInRow;
    const pdfNumRows = Math.floor(pdfPageHeight / pdfCellSizeMM);

    doc.setFillColor(currentGridBackgroundColor); // Set PDF background
    doc.rect(0, 0, pdfPageWidth, pdfPageHeight, "F");

    gridCells.forEach((cell, index) => {
      const row = Math.floor(index / numSquaresInRow);
      const col = index % numSquaresInRow;

      if (row < pdfNumRows) {
        const cellX = col * pdfCellSizeMM;
        const cellY = row * pdfCellSizeMM;
        const cellColor = cell.style.backgroundColor || defaultCellColor;

        doc.setFillColor(cellColor);
        doc.rect(cellX, cellY, pdfCellSizeMM, pdfCellSizeMM, "F");
        doc.setDrawColor(203, 213, 225);
        doc.rect(cellX, cellY, pdfCellSizeMM, pdfCellSizeMM, "S");
      }
    });

    const calculatedCellSizeMM = pdfPageWidth / numSquaresInRow;
    const text = translations[currentLanguage].squareSizeDisplay.replace(
      "{size}",
      calculatedCellSizeMM.toFixed(2)
    );
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(text, 10, pdfPageHeight - 10);

    const fileName = translations[currentLanguage].exportFileName
      .replace("{page_size}", selectedPageType)
      .replace("{squares_in_row}", numSquaresInRow);
    doc.save(fileName);
  }

  // MODIFIED: Event listeners for the color swatch inputs (now full pickers)
  colorSwatches.forEach((swatch) => {
    // Handle input event (when color is changed via picker)
    swatch.addEventListener("input", (event) => {
      selectedColor = event.target.value; // Update selected color to the new value
      isEraserActive = false;
      eraserBtn.classList.remove("active-tool");
      // Remove 'active' class from all swatches
      colorSwatches.forEach((s) => s.classList.remove("active"));
      // Add 'active' class to the one whose color was changed
      event.target.classList.add("active");
    });

    // Handle click event (to activate if color wasn't changed)
    swatch.addEventListener("click", (event) => {
      selectedColor = event.target.value; // Use the current value of the picker
      isEraserActive = false;
      eraserBtn.classList.remove("active-tool");
      colorSwatches.forEach((s) => s.classList.remove("active"));
      event.target.classList.add("active");
    });
  });

  eraserBtn.addEventListener("click", () => {
    isEraserActive = !isEraserActive;
    if (isEraserActive) {
      eraserBtn.classList.add("active-tool");
      colorSwatches.forEach((swatch) => swatch.classList.remove("active"));
    } else {
      eraserBtn.classList.remove("active-tool");
      // When eraser is deactivated, default back to the first swatch's color
      colorSwatches[0].classList.add("active");
      selectedColor = colorSwatches[0].value;
    }
  });

  exportPdfBtn.addEventListener("click", exportGridToPdf);

  languageSelect.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    setLanguage();
    updateGridContainerDimensions();
  });

  // MODIFIED: Event listener for the "Create Grid" button click - always shows confirmation
  createGridBtn.addEventListener("click", async () => {
    const confirmed = await showConfirmModal(
      translations[currentLanguage].confirmChangeTitle,
      translations[currentLanguage].confirmChangeMessage
    );

    if (confirmed) {
      updateGridContainerDimensions(); // This will call createGrid()
    } else {
      // If not confirmed, revert the input value if it was changed
      numSquaresInRowInput.value = lastNumSquaresInRow;
      showMessageBox(translations[currentLanguage].changeCancelled, "info");
    }
  });

  backToHomeBtn.addEventListener("click", async () => {
    const confirmed = await showConfirmModal(
      translations[currentLanguage].confirmGoBackTitle,
      translations[currentLanguage].confirmGoBackMessage
    );

    if (confirmed) {
      window.location.href = "index.html"; // Navigate to home page
    }
  });

  pageDimensionSelect.addEventListener("change", () => {
    updateGridContainerDimensions();
  });

  gridContainer.addEventListener("click", handleCellClick);

  window.addEventListener("resize", updateGridContainerDimensions);

  // Initial setup: set language, then create grid
  setLanguage();
  updateGridContainerDimensions(); // This will call createGrid()
});
