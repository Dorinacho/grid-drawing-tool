import ro from "../translations/ro.js";
import en from "../translations/en.js";
import "./grid.js"


document.addEventListener("DOMContentLoaded", () => {
  const colorSwatches = document.querySelectorAll(".color-swatch");
  const numSquaresInRowInput = document.getElementById("numSquaresInRow");
  const createGridBtn = document.getElementById("createGridBtn");
  const squareSizeMMDisplay = document.getElementById("squareSizeMMDisplay");
  const eraserBtn = document.getElementById("eraserBtn");
  const languageSelect = document.getElementById("languageSelect");
  const pageSizeSelect = document.getElementById("pageSizeSelect");


  const gridContainer = document.getElementById("gridContainer");
  const gridContainerWidth = gridContainer.offsetWidth;
  const gridContainerHeight = gridContainer.offsetHeight;

  const defaultCellColor = "#ffffff";
  let selectedColor;
  let isEraserActive = false;
  let currentLanguage = "ro";
  let lastNumSquaresInRow = parseInt(numSquaresInRowInput.value, 10);

  const translations = {
    en,
    ro,
  };

  // Page dimensions in millimeters
  const pageMmDimensions = {
    A5: { width: 148, height: 210 },
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
  };

  let gridData = [];

  /**
   * Displays a custom message box to the user.
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
        element.textContent = translations[currentLanguage][key];
      }
    });
    updateSquareSizeDisplay(
      parseFloat(squareSizeMMDisplay.textContent.match(/[\d.]+/)) || 0
    );
  }

  /**
   * Updates the display for square size in millimeters with translated text.
   */
  function updateSquareSizeDisplay(size) {
    if (translations[currentLanguage]) {
      squareSizeMMDisplay.textContent = translations[
        currentLanguage
      ].squareSizeDisplay.replace("{size}", size.toFixed(2));
    }
  }

  /**
   * Calculates the size of each square in millimeters based on the number of squares per row.
   */
  function calculateSquareSizeMM() {
    const numSquaresInRow = parseInt(numSquaresInRowInput.value, 10);
    // Use A4 landscape dimensions by default for the grid

    return pageMmDimensions[pageSizeSelect.value].height / numSquaresInRow;
  }

  /**
   * Updates the grid container dimensions to fit the available space
   * while maintaining the aspect ratio of an A4 page in landscape.
   */
  function updateGridContainerDimensions(gridData) {
    const numSquaresInRow = parseInt(numSquaresInRowInput.value, 10);

    if (isNaN(numSquaresInRow) || numSquaresInRow < 1) {
      console.error("Invalid number of squares.");
      return;
    }

    // Calculate the size of each square in millimeters (A4 landscape)
    const squareSizeMM = calculateSquareSizeMM();

    // gridContainer.style.width = "1000px";
    gridContainer.style.maxWidth = "1000px";
    gridContainer.style.minWidth = "500px";

    // gridContainer.style.height = "1414px";
    gridContainer.style.maxHeight = "1414px";
    gridContainer.style.minHeight = `${parseInt(gridContainer.style.width) * 1.41428571429}px`;

    updateSquareSizeDisplay(squareSizeMM);


    createGrid(gridData);
  }

  /**
   * Creates a grid with squares of the specified pixel size.
   */
  function createGrid(gridData) {
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

    // const squareSizePx=parseFloat(gridContainer.style.width, 10)/100*window.innerWidth/numSquaresInRow;
    const squareSizePx = gridContainerWidth / numSquaresInRow;
    const numRows = Math.floor((gridContainerWidth * 1.414) / squareSizePx);
    // Set the CSS variable for cell size
    document.documentElement.style.setProperty(
      "--cell-size",
      `${squareSizePx}px`
    );

    // Create the grid
    gridContainer.style.gridTemplateColumns = `repeat(${numSquaresInRow}, ${squareSizePx}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, ${squareSizePx}px)`;

    
    gridData.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("grid-cell");
      cellElement.dataset.row = cell.M;
      cellElement.dataset.col = cell.N;
      cellElement.dataset.index = index;
      // Set initial background color from the object's color property, or a default.
      cellElement.style.backgroundColor = cell.color || "#ffffff";
      gridContainer.appendChild(cellElement);
    });
    // --- ADAPTED LOGIC ENDS HERE ---

    lastNumSquaresInRow = numSquaresInRow;
  }

  function createGridCells(rows, cols) {
    // Use a constant object to define the base structure of a cell.
    // This ensures all new objects start with the same default properties.
    const cellDefaults = {
      M: null,
      N: null,
      color: null,
      isFilled: false,
    };

    const gridArray = [];

    // Use a nested loop to iterate through each row and column.
    for (let m = 0; m < rows; m++) {
      for (let n = 0; n < cols; n++) {
        // Create a new object for each cell.
        // We use the spread operator (...) to create a shallow copy
        // of the cellDefaults object, so each cell is a unique instance.
        const cell = { ...cellDefaults };

        // Set the coordinates for the current cell.
        cell.M = m;
        cell.N = n;

        // Add the new cell object to the array.
        gridArray.push(cell);
      }
    }

    console.log(gridArray);
    
    return gridArray;
  }


  // Initialize selected color with the value of the first color swatch picker
  selectedColor = colorSwatches[0].value;
  colorSwatches[0].classList.add("active");

  // Event listeners for color swatches
  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("input", (event) => {
      selectedColor = event.target.value;
      isEraserActive = false;
      eraserBtn.classList.remove("active-tool");
      colorSwatches.forEach((s) => s.classList.remove("active"));
      event.target.classList.add("active");
    });

    swatch.addEventListener("click", (event) => {
      selectedColor = event.target.value;
      isEraserActive = false;
      eraserBtn.classList.remove("active-tool");
      colorSwatches.forEach((s) => s.classList.remove("active"));
      event.target.classList.add("active");
    });
  });

  // Event listener for eraser button
  eraserBtn.addEventListener("click", () => {
    isEraserActive = !isEraserActive;
    if (isEraserActive) {
      eraserBtn.classList.add("active-tool");
      colorSwatches.forEach((swatch) => swatch.classList.remove("active"));
    } else {
      eraserBtn.classList.remove("active-tool");
      colorSwatches[0].classList.add("active");
      selectedColor = colorSwatches[0].value;
    }
  });

 
  // Event listener for language select
  languageSelect.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    setLanguage();
    // updateGridContainerDimensions();
  });

  // Event listener for create grid button
  createGridBtn.addEventListener("click", async () => {
    const confirmed = await showConfirmModal(
      "Confirmă Modificarea Grilei",
      "Apăsarea 'Creează Grilă' va șterge designul curent și va genera o nouă grilă. Ești sigur(ă) că vrei să continui?"
    );
    if (confirmed) {
      updateGridContainerDimensions(gridData);
    } else {
      numSquaresInRowInput.value = lastNumSquaresInRow;
      showMessageBox("Crearea grilei a fost anulată.", "info");
    }
  });

  // Event listener for window resize
  window.addEventListener("resize", updateGridContainerDimensions);

  // Event listener for grid cell clicks
  gridContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("grid-cell")) {
      if (isEraserActive) {
        event.target.style.backgroundColor = defaultCellColor;
      } else {
        event.target.style.backgroundColor = selectedColor;
      }
    }
  });

  // Initial setup
  setLanguage();
  const squareSizePx = gridContainerWidth / lastNumSquaresInRow;
  // Create the grid with the calculated square size
  const numRows = Math.floor((gridContainerWidth * 1.414) / squareSizePx);
  gridData = createGridCells(numRows, lastNumSquaresInRow);
  updateGridContainerDimensions(gridData);
});
