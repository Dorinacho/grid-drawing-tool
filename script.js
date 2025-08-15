document.addEventListener('DOMContentLoaded', () => {
    const colorPickerInput = document.getElementById('colorPickerInput');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const numSquaresInRowInput = document.getElementById('numSquaresInRow');
    const createGridBtn = document.getElementById('createGridBtn');
    const pageDimensionSelect = document.getElementById('pageDimension');
    const squareSizeMMDisplay = document.getElementById('squareSizeMMDisplay');
    const controlPanel = document.getElementById('controlPanel');
    const eraserBtn = document.getElementById('eraserBtn');
    const gridBgColorPicker = document.getElementById('gridBgColorPicker');
    const languageSelect = document.getElementById('languageSelect');
    const exportPdfBtn = document.getElementById('exportPdfBtn'); // NEW: Get export PDF button

    const defaultCellColor = '#e2e8f0';

    let selectedColor = colorSwatches[0].dataset.color;
    let isEraserActive = false;
    let currentLanguage = 'en';

    // Define translations for different languages
    const translations = {
        en: {
            appTitle: "Color Grid App",
            currentColorLabel: "Current Color:",
            colorPalettesLabel: "Color Palettes:",
            gridBgLabel: "Grid Background:",
            squaresInRowLabel: "Squares in Row:",
            pageSizeLabel: "Page Size:",
            languageLabel: "Language:",
            eraserBtn: "Eraser",
            exportPdfBtn: "Export to PDF", // NEW: Translation for export button
            createGridBtn: "Create Grid",
            squareSizeDisplay: "Each square: {size} mm",
            validationMessage: "Please enter a number of squares per row between 1 and 100.",
            exportFileName: "ColorGrid_{page_size}_{squares_in_row}Squares.pdf" // NEW: Translation for filename
        },
        ro: {
            appTitle: "Aplicație Grilă de Culori",
            currentColorLabel: "Culoare Curentă:",
            colorPalettesLabel: "Palete de Culori:",
            gridBgLabel: "Fundal Grilă:",
            squaresInRowLabel: "Pătrate pe Rând:",
            pageSizeLabel: "Dimensiune Pagină:",
            languageLabel: "Limba:",
            eraserBtn: "Radieră",
            exportPdfBtn: "Exportă PDF", // NEW: Translation for export button
            createGridBtn: "Creează Grilă",
            squareSizeDisplay: "Fiecare pătrat: {size} mm",
            validationMessage: "Vă rugăm să introduceți un număr de pătrate pe rând între 1 și 100.",
            exportFileName: "GrilaDeCulori_{dim_pagina}_{patrate_pe_rand}Patrate.pdf" // NEW: Translation for filename
        }
    };

    /**
     * Updates the text content of elements based on the current language.
     */
    function setLanguage() {
        // Update elements with data-key
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.dataset.key;
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                // Special handling for button text which is innerText, not textContent for buttons
                if (element.tagName === 'BUTTON') {
                    element.innerText = translations[currentLanguage][key];
                } else {
                    element.textContent = translations[currentLanguage][key];
                }
            }
        });
        // Update the square size display separately as it has dynamic content
        updateSquareSizeDisplay(parseFloat(squareSizeMMDisplay.textContent.match(/[\d.]+/)) || 0);
    }

    /**
     * Updates the display for square size in millimeters with translated text.
     * @param {number} size The calculated size of the square in millimeters.
     */
    function updateSquareSizeDisplay(size) {
        if (translations[currentLanguage]) {
            squareSizeMMDisplay.textContent = translations[currentLanguage].squareSizeDisplay.replace('{size}', size.toFixed(2));
        }
    }

    colorPickerInput.value = selectedColor;
    colorSwatches[0].classList.add('active');

    const pageMillimeterDimensions = {
        'A5': { width: 148, height: 210 },
        'A4': { width: 210, height: 297 },
        'A3': { width: 297, height: 420 }
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
            gridContainer.style.overflow = 'hidden';
        } else {
            gridContainer.style.overflow = 'auto';
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
        gridContainer.innerHTML = '';
        // gridContainer.style.backgroundColor is now controlled by gridBgColorPicker
        // It will remain its default white or other CSS-defined color,
        // unless you explicitly set it to a fixed color in style.css or here.
        // Also, individual cells will have defaultCellColor initially.

        const numSquaresInRow = parseInt(numSquaresInRowInput.value, 10);

        if (isNaN(numSquaresInRow) || numSquaresInRow < 1 || numSquaresInRow > 100) {
            const messageBox = document.createElement('div');
            messageBox.className = 'fixed top-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg';
            messageBox.textContent = translations[currentLanguage].validationMessage;
            document.body.appendChild(messageBox);
            setTimeout(() => messageBox.remove(), 3000);
            return;
        }

        const effectiveContainerWidth = gridContainer.offsetWidth;
        const effectiveContainerHeight = gridContainer.offsetHeight;

        const cellSizePx = effectiveContainerWidth / numSquaresInRow;
        const cellSize = `${cellSizePx}px`;

        const numRows = Math.floor(effectiveContainerHeight / cellSizePx);

        const pixelsPerMM = 96 / 25.4;
        const cellSizeMM = (cellSizePx / pixelsPerMM);

        updateSquareSizeDisplay(cellSizeMM);

        document.documentElement.style.setProperty('--cell-size', cellSize);

        gridContainer.style.gridTemplateColumns = `repeat(${numSquaresInRow}, ${cellSize})`;
        gridContainer.style.gridTemplateRows = `repeat(${numRows}, ${cellSize})`;

        for (let i = 0; i < numSquaresInRow * numRows; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.style.backgroundColor = defaultCellColor; // Ensure cells start with the default color
            gridContainer.appendChild(cell);
        }
    }

    /**
     * Handles clicks on the grid cells to change their background color.
     * Uses event delegation on the gridContainer for efficiency.
     * @param {Event} event The click event object.
     */
    function handleCellClick(event) {
        if (event.target.classList.contains('grid-cell')) {
            if (isEraserActive) {
                event.target.style.backgroundColor = defaultCellColor;
            } else {
                event.target.style.backgroundColor = selectedColor;
            }
        }
    }

    // NEW: Function to export grid to PDF
    function exportGridToPdf() {
        // Initialize jsPDF with the selected page size and orientation
        const selectedPageType = pageDimensionSelect.value;
        const pageDim = pageMillimeterDimensions[selectedPageType];
        
        let orientation = pageDim.width > pageDim.height ? 'landscape' : 'portrait';
        const doc = new window.jspdf.jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: selectedPageType // 'a3', 'a4', 'a5' directly supported
        });

        // Get current grid data
        const gridCells = gridContainer.querySelectorAll('.grid-cell');
        const numSquaresInRow = parseInt(numSquaresInRowInput.value, 10);
        const currentGridBackgroundColor = gridBgColorPicker.value;

        // Calculate actual cell size in mm for the PDF
        const pdfPageWidth = doc.internal.pageSize.getWidth();
        const pdfPageHeight = doc.internal.pageSize.getHeight();
        const pdfCellSizeMM = pdfPageWidth / numSquaresInRow; // Cell size in MM based on PDF width
        const pdfNumRows = Math.floor(pdfPageHeight / pdfCellSizeMM); // Number of rows that fit on PDF height

        // Set the background color for the entire page first
        doc.setFillColor(currentGridBackgroundColor);
        doc.rect(0, 0, pdfPageWidth, pdfPageHeight, 'F'); // Fill entire page

        // Draw each grid cell on the PDF
        gridCells.forEach((cell, index) => {
            const row = Math.floor(index / numSquaresInRow);
            const col = index % numSquaresInRow;

            // Only draw cells that would fit within the calculated PDF rows/cols
            if (row < pdfNumRows) {
                const cellX = col * pdfCellSizeMM;
                const cellY = row * pdfCellSizeMM;
                const cellColor = cell.style.backgroundColor || defaultCellColor;

                doc.setFillColor(cellColor);
                doc.rect(cellX, cellY, pdfCellSizeMM, pdfCellSizeMM, 'F');
                // Optional: add a border to cells in PDF
                doc.setDrawColor(203, 213, 225); // Corresponds to #cbd5e1 (border color from CSS)
                doc.rect(cellX, cellY, pdfCellSizeMM, pdfCellSizeMM, 'S'); // 'S' for stroke
            }
        });

        // Add square size in mm text to PDF
        const calculatedCellSizeMM = (pdfPageWidth / numSquaresInRow);
        const text = translations[currentLanguage].squareSizeDisplay.replace('{size}', calculatedCellSizeMM.toFixed(2));
        doc.setFontSize(10); // Set font size for the text
        doc.setTextColor(55, 65, 81); // Dark gray text color
        doc.text(text, 10, pdfPageHeight - 10); // Position text at bottom-left corner with some padding

        // Save the PDF
        const fileName = translations[currentLanguage].exportFileName
            .replace('{page_size}', selectedPageType)
            .replace('{squares_in_row}', numSquaresInRow);
        doc.save(fileName);
    }

    // Event listener for the single color picker input (for painting cells)
    colorPickerInput.addEventListener('input', (event) => {
        selectedColor = event.target.value;
        isEraserActive = false;
        eraserBtn.classList.remove('active-tool');
        colorSwatches.forEach(swatch => swatch.classList.remove('active'));
    });

    // Event listeners for the color swatch boxes
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', (event) => {
            selectedColor = event.target.dataset.color;
            colorPickerInput.value = selectedColor;
            isEraserActive = false;
            eraserBtn.classList.remove('active-tool');
            colorSwatches.forEach(s => s.classList.remove('active'));
            event.target.classList.add('active');
        });
    });

    // Event listener for the Eraser button
    eraserBtn.addEventListener('click', () => {
        isEraserActive = !isEraserActive;
        if (isEraserActive) {
            eraserBtn.classList.add('active-tool');
            colorSwatches.forEach(swatch => swatch.classList.remove('active'));
        } else {
            eraserBtn.classList.remove('active-tool');
            colorSwatches[0].classList.add('active');
            selectedColor = colorSwatches[0].dataset.color;
            colorPickerInput.value = selectedColor;
        }
    });

    // Event listener for the Grid Background Color Picker
    gridBgColorPicker.addEventListener('input', (event) => {
        selectedColor = event.target.value;
        colorPickerInput.value = selectedColor;
        isEraserActive = false;
        eraserBtn.classList.remove('active-tool');
        colorSwatches.forEach(swatch => swatch.classList.remove('active'));
    });

    // NEW: Event listener for Export to PDF button
    exportPdfBtn.addEventListener('click', exportGridToPdf);

    languageSelect.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        setLanguage();
        updateGridContainerDimensions();
    });

    createGridBtn.addEventListener('click', () => {
        updateGridContainerDimensions();
    });

    pageDimensionSelect.addEventListener('change', () => {
        updateGridContainerDimensions();
    });

    gridContainer.addEventListener('click', handleCellClick);

    window.addEventListener('resize', updateGridContainerDimensions);

    // Initial grid creation when the page loads and set initial language
    updateGridContainerDimensions();
    setLanguage();
});
