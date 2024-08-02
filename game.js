document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const size = 4; // 4x4 puzzle
    const tiles = [];
    const solvedState = Array.from({ length: size * size }, (_, i) => i === (size * size - 1) ? '' : i + 1);

    function initializeGame() {
        console.log("Initializing game...");
        // Create and shuffle tiles
        for (let i = 0; i < size * size; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.innerText = i + 1;
            tiles.push(tile);
        }
        tiles[tiles.length - 1].innerText = ''; // Empty tile
        
        // Shuffle and check for solvability
        shuffleAndCheckSolvability();
    }

    function shuffleAndCheckSolvability() {
        console.log("Shuffling and checking solvability...");
        let solvable = false;
        while (!solvable) {
            shuffle(tiles);
            if (isSolvable(tiles)) {
                solvable = true;
                console.log("Puzzle is solvable.");
            } else {
                console.log("Puzzle is not solvable. Shuffling again...");
            }
        }
        // Append tiles to the game container
        gameContainer.innerHTML = '';
        tiles.forEach(tile => gameContainer.appendChild(tile));
        console.log("Tiles appended to the container.");
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isSolvable(tiles) {
        const flatTiles = tiles.map(tile => tile.innerText || '');
        const inversions = countInversions(flatTiles);

        // For a 4x4 grid, a puzzle is solvable if the number of inversions is even
        console.log("Number of inversions: ", inversions);
        return inversions % 2 === 0;
    }

    function countInversions(array) {
        let count = 0;
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] === '') continue;
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] === '') continue;
                if (parseInt(array[i], 10) > parseInt(array[j], 10)) {
                    count++;
                }
            }
        }
        return count;
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
            // Use requestAnimationFrame to check win after screen update
            requestAnimationFrame(() => checkWin());
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

    // Initialize the game
    initializeGame();

    // Add event listener for tile click
    gameContainer.addEventListener('click', (e) => {
        if (e.target.className === 'tile') {
            moveTile(e.target);
        }
    });
});
