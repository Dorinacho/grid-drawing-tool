// Color palette (immutable)

// A4 aspect ratio (immutable)
const A4_ASPECT_RATIO = 297 / 210;

/**
 * Creates a new grid state.
 */
const createGrid = (rows, cols, canvas) => {
  const ctx = canvas.getContext('2d');
  const matrix = createMatrix(rows, cols);
  const state = {
    rows,
    cols,
    canvas,
    ctx,
    matrix,
    cellSize: 0,
    isHorizontal: true,
    selectedColor: 1,
  };
  return state;
};

/**
 * Creates an empty matrix.
 */
const createMatrix = (rows, cols) => {
  return Array(rows).fill().map(() => Array(cols).fill(0));
};

/**
 * Calculates canvas dimensions and cell size.
 */
const calculateDimensions = (state) => {
  const { canvas, rows, cols, isHorizontal } = state;
  const containerWidth = Math.min(window.innerWidth - 60, 800);
  const maxHeight = Math.min(window.innerHeight * 0.6, 600);

  let canvasWidth, canvasHeight;

  if (isHorizontal) {
    // Horizontal orientation (landscape)
    canvasWidth = Math.min(containerWidth, cols * 25);
    canvasHeight = canvasWidth / A4_ASPECT_RATIO;
    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = canvasHeight * A4_ASPECT_RATIO;
    }
  } else {
    // Vertical orientation (portrait)
    canvasHeight = Math.min(maxHeight, rows * 25);
    canvasWidth = canvasHeight / A4_ASPECT_RATIO;
    if (canvasWidth > containerWidth) {
      canvasWidth = containerWidth;
      canvasHeight = canvasWidth * A4_ASPECT_RATIO;
    }
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const cellSize = Math.min(canvasWidth / cols, canvasHeight / rows);

  return { ...state, cellSize, canvasWidth, canvasHeight };
};

/**
 * Sets up event listeners for the grid.
 */
const setupEventListeners = (state) => {
  const { canvas, cellSize, matrix, selectedColor } = state;

  const handleInteraction = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < state.rows && col >= 0 && col < state.cols) {
      const newMatrix = [...matrix];
      newMatrix[row] = [...newMatrix[row]];
      newMatrix[row][col] = newMatrix[row][col] === selectedColor ? 0 : selectedColor;
      const newState = { ...state, matrix: newMatrix };
      render(newState);
    }
  };

  canvas.addEventListener('click', handleInteraction);
  canvas.addEventListener('touchstart', handleInteraction);
  canvas.addEventListener('touchmove', handleInteraction);

  window.addEventListener('resize', () => {
    const newState = calculateDimensions(state);
    render(newState);
  });
};

/**
 * Renders the grid on canvas.
 */
const render = (state) => {
  const { ctx, matrix, cellSize, rows, cols } = state;
  ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * cellSize;
      const y = i * cellSize;
      const cellValue = matrix[i][j];

      if (cellValue !== 0) {
        ctx.fillStyle = COLORS[cellValue];
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);
    }
  }
};

/**
 * Transposes the grid matrix.
 */
const transpose = (state) => {
  const { matrix, rows, cols } = state;
  const newMatrix = createMatrix(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      newMatrix[i][j] = matrix[j][i];
    }
  }

  const newState = {
    ...state,
    matrix: newMatrix,
    rows: cols,
    cols: rows,
    isHorizontal: !state.isHorizontal,
  };

  const withDimensions = calculateDimensions(newState);
  render(withDimensions);
  return withDimensions;
};

/**
 * Clears all painted cells.
 */
const clear = (state) => {
  const newMatrix = createMatrix(state.rows, state.cols);
  const newState = { ...state, matrix: newMatrix };
  render(newState);
  return newState;
};

/**
 * Updates grid dimensions.
 */
const updateDimensions = (state, newRows, newCols) => {
  const newMatrix = createMatrix(newRows, newCols);
  const newState = {
    ...state,
    rows: newRows,
    cols: newCols,
    matrix: newMatrix,
  };
  const withDimensions = calculateDimensions(newState);
  render(withDimensions);
  return withDimensions;
};

/**
 * Sets the selected color.
 */
const setSelectedColor = (state, colorIndex) => {
  return { ...state, selectedColor: colorIndex };
};

// Example usage:
// const canvas = document.getElementById('myCanvas');
// let gridState = createGrid(10, 10, canvas);
// setupEventListeners(gridState);
// render(gridState);
// gridState = setSelectedColor(gridState, 2);
// gridState = transpose(gridState);
// gridState = clear(gridState);
// gridState = updateDimensions(gridState, 15, 15);
