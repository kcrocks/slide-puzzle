document.addEventListener('DOMContentLoaded', () => {
    console.log('Puzzle version 4');
    const gameContainer = document.getElementById('game-container');
    const size = 4; // 4x4 puzzle
    const tiles = [];
    const solvedState = Array.from({ length: size * size }, (_, i) => i === (size * size - 1) ? '' : i + 1);

    // Create and shuffle tiles
    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = i + 1;
        tiles.push(tile);
    }
    tiles[tiles.length - 1].innerText = ''; // Empty tile
    shuffle(tiles);

    // Append tiles to the game container
    tiles.forEach(tile => gameContainer.appendChild(tile));

    // Add event listener for tile click
    gameContainer.addEventListener('click', (e) => {
        if (e.target.className === 'tile') {
            moveTile(e.target);
            checkWin();
        }
    });

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function moveTile(tile) {
        const emptyTile = tiles.find(t => t.innerText === '');
        const tileIndex = tiles.indexOf(tile);
        const emptyIndex = tiles.indexOf(emptyTile);

        const isValidMove = 
            (tileIndex - 1 === emptyIndex && tileIndex % size !== 0) ||  // Left
            (tileIndex + 1 === emptyIndex && (tileIndex + 1) % size !== 0) ||  // Right
            (tileIndex - size === emptyIndex) ||  // Up
            (tileIndex + size === emptyIndex);   // Down

        if (isValidMove) {
            [tiles[tileIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[tileIndex]];
            gameContainer.innerHTML = '';
            tiles.forEach(t => gameContainer.appendChild(t));
        }
    }

    function checkWin() {
        const currentState = tiles.map(tile => tile.innerText || '');
        const isSolved = currentState.join('') === solvedState.join('');

        tiles.forEach((tile, index) => {
            const correctValue = solvedState[index];
            if (isSolved) {
                tile.classList.add('correct');
            } else {
                tile.classList.remove('correct');
            }
        });

        if (isSolved) {
            console.log('Puzzle solved!');
        }
    }
});
