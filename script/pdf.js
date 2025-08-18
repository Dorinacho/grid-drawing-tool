import ro from "../translations/ro.js";
import en from "../translations/en.js";

const translations = {
  en,
  ro,
};
let currentLanguage = "ro";
const exportPdfBtn = document.getElementById("exportPdfBtn");

// Page dimensions in millimeters
const pageMmDimensions = {
  A5: { width: 148, height: 210 },
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 },
};

async function exportGridToPdf() {
  const selectedPaperSize = await promptForPaperSize();
  if (!selectedPaperSize) {
    return; // Exit if the user canceled
  }

  const selectedPage = pageMmDimensions[selectedPaperSize];
  const numSquaresInRow = parseInt(numSquaresInRowInput.value, 10);

  // Determine orientation based on the selected paper size
  const orientation =
    selectedPage.width > selectedPage.height ? "landscape" : "portrait";

  const doc = new window.jspdf.jsPDF({
    orientation: orientation,
    unit: "mm",
    format: [selectedPage.width, selectedPage.height],
  });

  const gridCells = gridContainer.querySelectorAll(".grid-cell");
  const squareSizeMM = selectedPage.width / numSquaresInRow;
  const pdfNumRows = Math.floor(selectedPage.height / squareSizeMM);

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, selectedPage.width, selectedPage.height, "F");

  gridCells.forEach((cell, index) => {
    const row = Math.floor(index / numSquaresInRow);
    const col = index % numSquaresInRow;
    if (row < pdfNumRows) {
      const cellX = col * squareSizeMM;
      const cellY = row * squareSizeMM;
      const cellColor = cell.style.backgroundColor || defaultCellColor;
      const rgbColor = hexToRgb(cellColor);
      doc.setFillColor(rgbColor.r, rgbColor.g, rgbColor.b);
      doc.rect(cellX, cellY, squareSizeMM, squareSizeMM, "F");
      doc.setDrawColor(203, 213, 225);
      doc.rect(cellX, cellY, squareSizeMM, squareSizeMM, "S");
    }
  });

  const fileName = translations[currentLanguage].exportFileName.replace(
    "{squares_in_row}",
    numSquaresInRow
  );
  doc.save(fileName);
}

// Event listener for export PDF button
exportPdfBtn.addEventListener("click", exportGridToPdf);

/**
 * Prompts the user to select a paper size for PDF export using checkboxes.
 * @returns {Promise<string|null>} A promise that resolves to the selected paper size or null if canceled.
 */
function promptForPaperSize() {
  return new Promise((resolve) => {
    const modalOverlay = document.createElement("div");
    modalOverlay.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

    const modalContent = document.createElement("div");
    modalContent.className =
      "bg-white p-6 rounded-lg shadow-xl max-w-sm w-full";

    const modalTitle = document.createElement("h3");
    modalTitle.className = "text-xl font-semibold mb-4 text-gray-800";
    modalTitle.textContent = translations[currentLanguage].selectPaperSize;

    // Create checkboxes for paper sizes
    const paperSizeOptions = ["A3", "A4", "A5"];
    let selectedSize = "A4"; // Default selection

    paperSizeOptions.forEach((size) => {
      const container = document.createElement("div");
      container.className = "flex items-center mb-2";

      const checkbox = document.createElement("input");
      checkbox.type = "radio";
      checkbox.name = "paperSize";
      checkbox.id = `paperSize-${size}`;
      checkbox.value = size;
      checkbox.className = "mr-2 h-4 w-4";
      if (size === "A4") checkbox.checked = true; // Default to A4

      const label = document.createElement("label");
      label.htmlFor = `paperSize-${size}`;
      label.textContent = size;

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedSize = size;
        }
      });

      container.appendChild(checkbox);
      container.appendChild(label);
      modalContent.appendChild(container);
    });

    // Add OK and Cancel buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-end gap-2 mt-6";

    const cancelButton = document.createElement("button");
    cancelButton.className =
      "px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition duration-200";
    cancelButton.textContent = translations[currentLanguage].confirmNo;
    cancelButton.addEventListener("click", () => {
      modalOverlay.remove();
      resolve(null); // Resolve with null if canceled
    });

    const okButton = document.createElement("button");
    okButton.className =
      "px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-200";
    okButton.textContent = translations[currentLanguage].confirmYes;
    okButton.addEventListener("click", () => {
      modalOverlay.remove();
      resolve(selectedSize); // Resolve with the selected size
    });

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(okButton);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(buttonContainer);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
  });
}
