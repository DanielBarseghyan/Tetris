import {
   getRandomElement,
   playfieldRows,
   playfieldColumns,
   tetrominoNames,
   tetrominos,
   rotateMatrix
} from "./utilites.js";
export class Tetris {
   constructor() {
      this.playfield;
      this.tetromino;
      this.isGameOver = false;
      this.init();
   }
   init() {
      this.generatePlayfield();
      this.generateTetramino();
   }
   generatePlayfield() {
      this.playfield = new Array(playfieldRows).fill()
         .map(() => new Array(playfieldColumns).fill(0));
   }
   generateTetramino() {
      const name = getRandomElement(tetrominoNames);
      const matrix = tetrominos[name];
      const column = playfieldColumns / 2 - Math.floor(matrix.length / 2);
      const row = -2;
      this.tetromino = {
         name,
         matrix,
         row,
         column,
         ghostColumn: column,
         ghostRow: row,
      }
      this.calculateGhostPosition();
   }

   dropTetrominoDown() {
      this.tetromino.row = this.tetromino.ghostRow;
      this.placeTetromino();
   }

   moveTetrominoDown() {
      this.tetromino.row += 1;
      if (!this.isValid()) {
         this.tetromino.row -= 1;
         this.placeTetromino();
      }
   }
   moveTetrominoLeft() {
      this.tetromino.column -= 1;
      if (!this.isValid()) {
         this.tetromino.column += 1
      } else { this.calculateGhostPosition() }
   }
   moveTetrominoRight() {
      this.tetromino.column += 1;
      if (!this.isValid()) {
         this.tetromino.column -= 1
      } else { this.calculateGhostPosition() }
   }
   rotateTetromino() {
      const oldMatrix = this.tetromino.matrix;
      const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
      this.tetromino.matrix = rotatedMatrix;
      if (!this.isValid()) {
         this.tetromino.matrix = oldMatrix;
      } else { this.calculateGhostPosition() }
   }
   isValid() {
      const matrixSize = this.tetromino.matrix.length;
      for (let row = 0; row < matrixSize; row++) {
         for (let column = 0; column < matrixSize; column++) {
            if (!this.tetromino.matrix[row][column]) continue
            if (this.isOutsideofGameBoard(row, column)) return false;
            if (this.isCollides(row, column)) return false;
         }
      }
      return true;
   }
   isOutsideofGameBoard(row, column) {
      return this.tetromino.column + column < 0 ||
         this.tetromino.column + column >= playfieldColumns ||
         this.tetromino.row + row >= this.playfield.length

   }

   placeTetromino() {
      const matrixSize = this.tetromino.matrix.length;
      for (let row = 0; row < matrixSize; row++) {
         for (let column = 0; column < matrixSize; column++) {
            if (!this.tetromino.matrix[row][column]) continue;
            if (this.isOutsideofTopBoard(row)) {
               this.isGameOver = true;
               return;
            }
            this.playfield[this.tetromino.row + row][this.tetromino.column + column] = this.tetromino.name;
         }
      }
      this.processFilledRows();
      this.generateTetramino();
   }

   isOutsideofTopBoard(row) {
      return this.tetromino.row + row < 0;
   }


   processFilledRows() {
      const filledLines = this.findFilledRows();
      this.removeFilledRows(filledLines);
   }

   findFilledRows() {
      const filledRows = [];
      for (let row = 0; row < playfieldRows; row++) {
         if (this.playfield[row].every(cell => Boolean(cell))) {
            filledRows.push(row);
         }
      }
      return filledRows;
   }

   removeFilledRows(filledRows) {
      filledRows.forEach(row => {
         this.dropRowsAbove(row);
      });

   }

   dropRowsAbove(rowToDelete) {
      for (let row = rowToDelete; row > 0; row--) {
         this.playfield[row] = this.playfield[row - 1]
      }
      this.playfield[0] = new Array(playfieldColumns).fill(0)
      let scor = document.querySelector('.scor > span');
      scor.innerHTML = +scor.innerHTML + 100;
   }

   isCollides(row, column) {
      return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column]
   }

   calculateGhostPosition() {
      const tetrominoRow = this.tetromino.row;
      this.tetromino.row++;
      while (this.isValid()) {
         this.tetromino.row++;
      }
      this.tetromino.ghostRow = this.tetromino.row - 1;
      this.tetromino.ghostColumn = this.tetromino.column;
      this.tetromino.row = tetrominoRow;
   }
}