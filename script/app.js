import {
  createGrid,
  render,
  setSelectedColor,
  transpose,
  clear,
  updateDimensions,
} from "./grid.js";

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gridCanvas");

  let gridState = createGrid(10, 10, canvas);
  setupEventListeners(gridState);
  render(gridState);
  gridState = setSelectedColor(gridState, 2);
  gridState = transpose(gridState);
  gridState = clear(gridState);
  gridState = updateDimensions(gridState, 15, 15);
});
