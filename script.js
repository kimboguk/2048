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
}

function moveTiles(direction) {
    let moved = false;
    const directions = {
        'ArrowUp': { x: 0, y: -1 },
        'ArrowDown': { x: 0, y: 1 },
        'ArrowLeft': { x: -1, y: 0 },
        'ArrowRight': { x: 1, y: 0 }
    };
    const { x: dx, y: dy } = directions[direction];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            const tile = tiles[index];
            if (!tile.dataset.value) continue;

            let x = j, y = i;
            while (true) {
                const nextX = x + dx;
                const nextY = y + dy;
                if (nextX < 0 || nextX >= 4 || nextY < 0 || nextY >= 4) break;

                const nextIndex = nextY * 4 + nextX;
                const nextTile = tiles[nextIndex];
                if (!nextTile.dataset.value) {
                    nextTile.dataset.value = tile.dataset.value;
                    tile.dataset.value = '';
                    x = nextX;
                    y = nextY;
                    moved = true;
                } else if (nextTile.dataset.value === tile.dataset.value) {
                    nextTile.dataset.value *= 2;
                    score += parseInt(nextTile.dataset.value);
                    scoreElement.textContent = score;
                    bestScore = Math.max(score, bestScore);
                    bestScoreElement.textContent = bestScore;
                    localStorage.setItem('bestScore', bestScore);
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
    }
}

function checkGameOver() {
    if (tiles.some(tile => !tile.dataset.value)) return;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            const tile = tiles[index];
            if (i < 3 && tile.dataset.value === tiles[index + 4].dataset.value) return;
            if (j < 3 && tile.dataset.value === tiles[index + 1].dataset.value) return;
        }
    }

    alert('Game Over!');
    initGame();
}

document.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        moveTiles(event.key);
    }
});

newGameButton.addEventListener('click', initGame);

initGame();
