import { Tetris } from "./tetris.js";
import { convertPositionToIndex, SAD, playfieldColumns, playfieldRows } from './utilites.js'
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');
const startModal = document.querySelector('.starterModal');
const startBtn = document.querySelector('.startBtn');

let hammer;
let timeoutId;
let requestId;
let gameStarted = false;
function startAnimation() {
    if (gameStarted) return
    const animatedIcons = document.querySelectorAll('.starterModal >img');
    let randomIndex = Math.floor(Math.random() * animatedIcons.length);
    animatedIcons[randomIndex].style.animation = 'animate 5s ease-in-out infinite';
    setTimeout(() => {
        startAnimation()
    }, 400)

}
startAnimation();


startBtn.addEventListener('click', startTheGame);

function startTheGame() {
    gameStarted = true;
    startModal.style.width = '0%';
    setTimeout(() => {
        startModal.style.display = 'none';
        initKeyDown();
        initTouch();

        moveDown();
    }, 1000);

}



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


function initTouch() {
    document.addEventListener('dblclick', (e) => e.preventDefault())
    hammer = new Hammer(document.querySelector('body'));
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

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

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
    hammer.off('panstart panleft panright pandown swipedown tap')
    gameOverAnimation();
}
function gameOverAnimation() {
    const filedCells = [...cells].filter(cell => cell.classList.length > 0);
    filedCells.forEach((cell, index) => {
        setTimeout(() => cell.classList.add('hide'), i * 10);
        setTimeout(() => cell.removeAttribute('class'), i * 10 + 500);
    })
    setTimeout(drowSad, filedCells.length * 10 + 1000);
}
function drowSad() {
    const topOffSet = 5;
    for (let row = 0; row < SAD.length; row) {
        for (let column = 0; column < SAD[0].length; column++) {
            if (!SAD[row][column]) continue;
            const cellIndex = convertPositionToIndex(topOffSet + row, column);
            cells[cellIndex].classList.add('sad');
        }
    }
}
