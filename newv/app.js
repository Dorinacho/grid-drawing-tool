/**
 * GridCodeGenius - Complete Grid Management Application
 * 
 * This application provides:
 * - Grid initialization with A4 aspect ratio
 * - Interactive painting of grid cells
 * - Orientation toggling (transpose matrix)
 * - PDF export with paper size selection
 */

/**
 * Grid Class - Manages grid data structure and rendering with multi-color support
 */
class Grid {
    constructor(rows, cols, canvas) {
        this.rows = rows;
        this.cols = cols;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.matrix = [];
        this.cellSize = 0;
        this.isHorizontal = true;
        this.selectedColor = 1; // Default color
        
        // A4 aspect ratio (297:210 = 1.414)
        this.A4_ASPECT_RATIO = 297 / 210;
        
        // Color palette
        this.colors = {
            0: '#ffffff', // Empty (white)
            1: document.getElementById('color1') ? document.getElementById('color1').value : '#667eea',
            2: document.getElementById('color2') ? document.getElementById('color2').value : '#f093fb',
            3: document.getElementById('color3') ? document.getElementById('color3').value : '#4ecdc4',
            4: document.getElementById('color4') ? document.getElementById('color4').value : '#fce38a'
        };
        
        this.initializeMatrix();
        this.calculateDimensions();
        this.setupEventListeners();
    }

    /**
     * Initialize the grid matrix with all cells empty (0)
     */
    initializeMatrix() {
        this.matrix = [];
        for (let i = 0; i < this.rows; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = 0;
            }
        }
    }

    /**
     * Calculate canvas dimensions and cell size based on A4 aspect ratio and screen size
     */
    calculateDimensions() {
        // Get container width for responsive design
        const containerWidth = Math.min(window.innerWidth - 60, 800);
        const maxHeight = Math.min(window.innerHeight * 0.6, 600);
        
        let canvasWidth, canvasHeight;
        
        if (this.isHorizontal) {
            // Horizontal orientation (landscape)
            canvasWidth = Math.min(containerWidth, this.cols * 25);
            canvasHeight = canvasWidth / this.A4_ASPECT_RATIO;
            
            // Ensure height doesn't exceed screen
            if (canvasHeight > maxHeight) {
                canvasHeight = maxHeight;
                canvasWidth = canvasHeight * this.A4_ASPECT_RATIO;
            }
        } else {
            // Vertical orientation (portrait)
            canvasHeight = Math.min(maxHeight, this.rows * 25);
            canvasWidth = canvasHeight / this.A4_ASPECT_RATIO;
            
            // Ensure width doesn't exceed screen
            if (canvasWidth > containerWidth) {
                canvasWidth = containerWidth;
                canvasHeight = canvasWidth * this.A4_ASPECT_RATIO;
            }
        }
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        this.cellSize = Math.min(canvasWidth / this.cols, canvasHeight / this.rows);
    }

    /**
     * Setup mouse and touch event listeners for interactive painting
     */
    setupEventListeners() {
        const handleInteraction = (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            let x, y;
            
            if (e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            
            const col = Math.floor(x / this.cellSize);
            const row = Math.floor(y / this.cellSize);
            
            if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                // Toggle between empty (0) and selected color, or switch to new color
                const currentValue = this.matrix[row][col];
                this.matrix[row][col] = currentValue === this.selectedColor ? 0 : this.selectedColor;
                this.render();
            }
        };
        
        // Mouse events
        this.canvas.addEventListener('click', handleInteraction);
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', handleInteraction);
        this.canvas.addEventListener('touchmove', handleInteraction);
    }

    /**
     * Set the selected color for painting
     */
    setSelectedColor(colorIndex) {
        this.selectedColor = colorIndex;
        // Update color value from picker
        const colorInput = document.getElementById(`color${colorIndex}`);
        if (colorInput) {
            this.colors[colorIndex] = colorInput.value;
        }
    }

    /**
     * Render the grid on canvas with multiple colors
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines and cells
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const x = j * this.cellSize;
                const y = i * this.cellSize;
                const cellValue = this.matrix[i][j];
                if (cellValue !== 0) {
                    this.ctx.fillStyle = this.colors[cellValue];
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
                
                // Draw cell border
                this.ctx.strokeStyle = '#ddd';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
            }
        }
        // Calculate and display square size in mm
        let paperSize = 'A4';
        if (window.pdfExporter && window.pdfExporter.selectedPaperSize) {
            paperSize = window.pdfExporter.selectedPaperSize;
        }
        const paperSizes = {
            A3: { width: 420, height: 297 },
            A4: { width: 297, height: 210 },
            A5: { width: 210, height: 148 }
        };
        const size = paperSizes[paperSize];
        let mmPerCell;
        if (this.isHorizontal) {
            mmPerCell = size.width / this.cols;
        } else {
            mmPerCell = size.height / this.rows;
        }
        document.getElementById('squareSizeMM').textContent = mmPerCell.toFixed(2);
    }

    /**
     * Transpose the grid matrix (change orientation)
     */
    transpose() {
        const newMatrix = [];
        const newRows = this.cols;
        const newCols = this.rows;
        
        // Create transposed matrix
        for (let i = 0; i < newRows; i++) {
            newMatrix[i] = [];
            for (let j = 0; j < newCols; j++) {
                newMatrix[i][j] = this.matrix[j][i];
            }
        }
        
        // Update grid properties
        this.matrix = newMatrix;
        this.rows = newRows;
        this.cols = newCols;
        this.isHorizontal = !this.isHorizontal;
        
        this.calculateDimensions();
        this.render();
    }

    /**
     * Clear all painted cells
     */
    clear() {
        this.initializeMatrix();
        this.render();
    }

    /**
     * Update grid dimensions
     */
    updateDimensions(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.initializeMatrix();
        this.calculateDimensions();
        this.render();
    }
}

/**
 * Control Panel Class - Manages user interface controls with color selection
 */
class ControlPanel {
    constructor(grid) {
        this.grid = grid;
    }

    /**
     * Select a color for painting
     */
    selectColor(colorIndex) {
        this.grid.setSelectedColor(colorIndex);
    }

    /**
     * Toggle grid orientation
     */
    toggleOrientation() {
        this.grid.transpose();
        document.getElementById('orientationDisplay').textContent = 
            this.grid.isHorizontal ? 'Horizontal' : 'Vertical';
    }

    /**
     * Initialize grid with new dimensions
     */
    initializeGrid() {
        const rows = parseInt(document.getElementById('rows').value);
        const cols = parseInt(document.getElementById('cols').value);
        
        if (rows > 0 && cols > 0 && rows <= 50 && cols <= 50) {
            this.grid.updateDimensions(rows, cols);
        } else {
            alert('Please enter valid dimensions (1-50 for both rows and columns)');
        }
    }

    /**
     * Clear the grid
     */
    clearGrid() {
        this.grid.clear();
    }
}

/**
 * PDF Exporter Class - Handles PDF export functionality
 */
class PDFExporter {
    constructor(grid) {
        this.grid = grid;
        this.selectedPaperSize = 'A4';
        this.modal = document.getElementById('exportModal');
        
        // Paper sizes in mm
        this.paperSizes = {
            A3: { width: 420, height: 297 },
            A4: { width: 297, height: 210 },
            A5: { width: 210, height: 148 }
        };
    }

    /**
     * Show the export dialog modal
     */
    showExportDialog() {
        this.modal.style.display = 'block';
        this.updateCheckboxSelection();
    }

    /**
     * Close the export dialog modal
     */
    closeExportDialog() {
        this.modal.style.display = 'none';
    }

    /**
     * Select paper size (only one can be selected)
     */
    selectPaperSize(size) {
        this.selectedPaperSize = size;
        this.updateCheckboxSelection();
    }

    /**
     * Update checkbox visual selection
     */
    updateCheckboxSelection() {
        const checkboxes = document.querySelectorAll('input[name="paperSize"]');
        const groups = document.querySelectorAll('.checkbox-group');
        
        checkboxes.forEach((checkbox, index) => {
            const isSelected = checkbox.id === `paper${this.selectedPaperSize}`;
            checkbox.checked = isSelected;
            groups[index].classList.toggle('selected', isSelected);
        });
    }

    /**
     * Export grid to PDF with selected paper size and orientation
     */
    exportToPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const paperSize = this.paperSizes[this.selectedPaperSize];
            
            // Determine orientation based on grid state
            let pdfWidth, pdfHeight;
            if (this.grid.isHorizontal) {
                // Landscape orientation
                pdfWidth = Math.max(paperSize.width, paperSize.height);
                pdfHeight = Math.min(paperSize.width, paperSize.height);
            } else {
                // Portrait orientation
                pdfWidth = Math.min(paperSize.width, paperSize.height);
                pdfHeight = Math.max(paperSize.width, paperSize.height);
            }
            
            // Create PDF with custom dimensions
            const pdf = new jsPDF({
                orientation: this.grid.isHorizontal ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });
            
            // Calculate cell size in PDF coordinates
            const margin = 20; // 20mm margin
            const availableWidth = pdfWidth - (2 * margin);
            const availableHeight = pdfHeight - (2 * margin);
            
            const cellWidth = availableWidth / this.grid.cols;
            const cellHeight = availableHeight / this.grid.rows;
            const cellSize = Math.min(cellWidth, cellHeight);
            
            // Center the grid
            const startX = margin + (availableWidth - (this.grid.cols * cellSize)) / 2;
            const startY = margin + (availableHeight - (this.grid.rows * cellSize)) / 2;
            
            // Draw grid with colors
            for (let i = 0; i < this.grid.rows; i++) {
                for (let j = 0; j < this.grid.cols; j++) {
                    const x = startX + (j * cellSize);
                    const y = startY + (i * cellSize);
                    pdf.setDrawColor(200, 200, 200);
                    pdf.rect(x, y, cellSize, cellSize);
                    const cellValue = this.grid.matrix[i][j];
                    if (cellValue !== 0) {
                        // Use custom color from picker
                        const hex = this.grid.colors[cellValue];
                        const rgb = hexToRgb(hex);
                        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
                        pdf.rect(x, y, cellSize, cellSize, 'F');
                    }
                }
            }
            
            // Add title
            pdf.setFontSize(16);
            pdf.text('GridCodeGenius Export', pdfWidth / 2, 15, { align: 'center' });
            
            // Save PDF
            const filename = `grid_${this.selectedPaperSize}_${this.grid.isHorizontal ? 'landscape' : 'portrait'}.pdf`;
            pdf.save(filename);
            
            this.closeExportDialog();
            
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Error exporting PDF. Please try again.');
        }
    }
}

// Helper function for hex to rgb
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

/**
 * Application Initialization
 */
// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gridCanvas');
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    const grid = new Grid(rows, cols, canvas); // Default A4 proportional grid
    
    // Create global managers for easy access from HTML onclick handlers
    window.gridManager = new ControlPanel(grid);
    window.pdfExporter = new PDFExporter(grid);
    
    // Initial render
    grid.render();
    
    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('exportModal');
        if (event.target === modal) {
            window.pdfExporter.closeExportDialog();
        }
    }
});