const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

// 画布缩放
context.scale(BLOCK_SIZE, BLOCK_SIZE);

// 方块形状
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
];

// 初始化游戏区域
const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// 当前方块
let piece = {
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    position: { x: 3, y: 0 }
};

// 绘制方块
function drawPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'cyan';
                context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1);
            }
        });
    });
}

// 绘制游戏区域
function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'blue';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

// 清除画布
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// 更新游戏状态
function update() {
    clearCanvas();
    drawBoard();
    drawPiece();
    dropPiece();
}

// 方块下落
function dropPiece() {
    piece.position.y++;
    if (checkCollision()) {
        piece.position.y--;
        solidifyPiece();
        removeFullRows();
        spawnPiece();
    }
}

// 检查碰撞
function checkCollision() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (
                piece.shape[y][x] &&
                (board[piece.position.y + y] && board[piece.position.y + y][piece.position.x + x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

// 固化方块
function solidifyPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[piece.position.y + y][piece.position.x + x] = 1;
            }
        });
    });
}

// 移除满行
function removeFullRows() {
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(cell => cell === 1)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

// 生成新方块
function spawnPiece() {
    piece = {
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        position: { x: 3, y: 0 }
    };
    if (checkCollision()) {
        alert('Game Over!');
        board.forEach(row => row.fill(0));
    }
}

// 键盘控制
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        piece.position.x--;
        if (checkCollision()) piece.position.x++;
    }
    if (event.key === 'ArrowRight') {
        piece.position.x++;
        if (checkCollision()) piece.position.x--;
    }
    if (event.key === 'ArrowDown') {
        piece.position.y++;
        if (checkCollision()) piece.position.y--;
    }
    if (event.key === 'ArrowUp') {
        const rotated = rotatePiece(piece.shape);
        if (!checkCollision(rotated)) {
            piece.shape = rotated;
        }
    }
});

// 旋转方块
function rotatePiece(shape) {
    const N = shape.length;
    const rotated = Array.from({ length: N }, () => Array(N).fill(0));
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            rotated[x][N - 1 - y] = shape[y][x];
        }
    }
    return rotated;
}

// 游戏循环
setInterval(update, 500);