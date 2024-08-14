const gridContainer = document.getElementById('grid-container');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const newGameButton = document.getElementById('new-game-button');

let tiles;
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

function initGame() {
    score = 0;
    scoreElement.textContent = score;
    bestScoreElement.textContent = bestScore;

    tiles = Array.from(gridContainer.getElementsByClassName('grid-tile'));
    tiles.forEach(tile => tile.dataset.value = '');

    addRandomTile();
    addRandomTile();
}

function addRandomTile() {
    const emptyTiles = tiles.filter(tile => !tile.dataset.value);
    if (emptyTiles.length === 0) return;
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    randomTile.dataset.value = Math.random() > 0.1 ? 2 : 4;
    renderTiles();
}

function renderTiles() {
    tiles.forEach(tile => {
        const value = tile.dataset.value;
        tile.textContent = value ? value : '';
        tile.className = 'grid-tile';
        if (value) tile.classList.add(`tile-${value}`);
    });
}

function moveTiles(direction) {
    let moved = false;

    const traverseOrder = {
        'ArrowUp':    { row: [0, 1, 2, 3], col: [0, 1, 2, 3] },
        'ArrowDown':  { row: [3, 2, 1, 0], col: [0, 1, 2, 3] },
        'ArrowLeft':  { row: [0, 1, 2, 3], col: [0, 1, 2, 3] },
        'ArrowRight': { row: [0, 1, 2, 3], col: [3, 2, 1, 0] }
    };

    const { row: rowOrder, col: colOrder } = traverseOrder[direction];

    for (let r of rowOrder) {
        for (let c of colOrder) {
            const tile = tiles[r * 4 + c];
            const value = tile.dataset.value;
            if (!value) continue;

            let nextR = r, nextC = c;

            while (true) {
                const moveR = direction === 'ArrowUp' ? nextR - 1 : direction === 'ArrowDown' ? nextR + 1 : nextR;
                const moveC = direction === 'ArrowLeft' ? nextC - 1 : direction === 'ArrowRight' ? nextC + 1 : nextC;

                if (moveR < 0 || moveR > 3 || moveC < 0 || moveC > 3) break;

                const nextTile = tiles[moveR * 4 + moveC];
                const nextValue = nextTile.dataset.value;

                if (!nextValue) {
                    nextTile.dataset.value = value;
                    tile.dataset.value = '';
                    nextR = moveR;
                    nextC = moveC;
                    moved = true;
                } else if (nextValue === value) {
                    nextTile.dataset.value = parseInt(value) * 2;
                    score += parseInt(nextTile.dataset.value);
                    tile.dataset.value = '';
                    moved = true;
                    break;
                } else {
                    break;
                }
            }
        }
    }

    if (moved) {
        addRandomTile();
        checkGameOver();
        renderTiles();
    }
}

function checkGameOver() {
    const emptyTiles = tiles.filter(tile => !tile.dataset.value);
    if (emptyTiles.length > 0) return;

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const currentTile = tiles[r * 4 + c];
            const currentValue = currentTile.dataset.value;

           
