import { Tetris } from "./tetris.js";
import { convertPositionToIndex, playfieldColumns, playfieldRows } from './utilites.js'
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');

let hammer;
let timeoutId;
let requestId;

initKeyDown();
initTouch();



moveDown();

function initKeyDown() {
    document.addEventListener('keydown', onKeyDown)
}
function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowDown':
            moveDown()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowRight':
            moveRight()
            break;
        case 'ArrowUp':
            rotate();
            break;
        case ' ':
            dropDown();
            break;
        default:
            break;
    }
}
function dropDown() {
    tetris.dropTetrominoDown();
    drow();
    stopLoop();
    startLoop();
    if (tetris.isGameOver) {
        gameOver();
    }
}
function moveDown() {
    tetris.moveTetrominoDown();
    drow();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) {
        gameOver();
    }
}
function moveLeft() {
    tetris.moveTetrominoLeft();
    drow();
}
function moveRight() {
    tetris.moveTetrominoRight();
    drow();
}
function rotate() {
    tetris.rotateTetromino();
    drow();
}

function startLoop() {
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
}

function stopLoop() {
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
}


function drow() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drowTetromino();
    drowPlayfield();
    drowGhostTetromino();
}

function drowPlayfield() {
    for (let row = 0; row < playfieldRows; row++) {
        for (let column = 0; column < playfieldColumns; column++) {
            if (!tetris.playfield[row][column]) continue;
            const name = tetris.playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name)
        }
    }
}

function drowTetromino() {
    const name = tetris.tetromino.name;
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.row + row < 0) continue;
            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column)
            cells[cellIndex].classList.add(name);
        }
    }
}

function drowGhostTetromino() {
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.ghostRow + row < 0) continue;
            const cellIndex = convertPositionToIndex(tetris.tetromino.ghostRow + row, tetris.tetromino.ghostColumn + column);
            cells[cellIndex].classList.add('ghost');
        }
    }
}

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
    hammer.off('panstart panleft panright pandown swipedown tap')
    gameOverAnimation();
}
function initTouch() {
    document.addEventListener('dblclick', (e) => e.preventDefault())
    hammer = new Hammer(document.querySelector('body'));
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL});
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL});

    const threshHold = 30;
    let deltaX = 0;
    let deltaY = 0;
    hammer.on('panstart', () => {
        deltaX = 0;
        deltaY = 0;
    });
    hammer.on('panleft', (e) => {
        if (Math.abs(e.deltaX - deltaX) > threshHold) {
            moveLeft();
            deltaX = e.deltaX;
            deltaY = e.deltaY;
        }
    })
    hammer.on('panright', (e) => {
        if (Math.abs(e.deltaX - deltaX) > threshHold) {
            moveRight();
            deltaX = e.deltaX;
            deltaY = e.deltaY;
        }
    })
    hammer.on('pandown', (e) => {
        if (Math.abs(e.deltaY - deltaY) > threshHold) {
            moveDown();
            deltaX = e.deltaX;
            deltaY = e.deltaY;
        }
    })
    hammer.on('swipedown', (e) => {
        dropDown();
    });
    hammer.on('tap', () => {
        rotate();
    })
}
function gameOverAnimation(){
    // todo
}