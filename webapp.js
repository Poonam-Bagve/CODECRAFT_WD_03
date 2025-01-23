const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartButton = document.querySelector('.restart');
const modeSelector = document.getElementById('mode');

let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp'; // Default mode: Player vs. Player
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Handle mode change
modeSelector.addEventListener('change', (e) => {
    gameMode = e.target.value;
    restartGame();
});

// Handle cell clicks
function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = clickedCell.getAttribute('data-index');

    if (gameState[cellIndex] !== '' || !gameActive) return;

    gameState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkForWinner();

    if (gameActive && gameMode === 'pve' && currentPlayer === 'O') {
        setTimeout(aiMove, 500); // Add a delay for better user experience
    }
}

// AI Logic
function aiMove() {
    // Check for a winning move or block the player
    let move = findBestMove();

    // If no strategic move, pick a random empty cell
    if (move === null) {
        move = gameState.findIndex(cell => cell === '');
    }

    if (move !== null) {
        gameState[move] = currentPlayer;
        cells[move].textContent = currentPlayer;
        checkForWinner();
    }
}

// Find the best move for AI
function findBestMove() {
    // Check for winning or blocking moves
    for (let condition of winningConditions) {
        const [a, b, c] = condition;

        // Check if AI can win
        if (
            gameState[a] === currentPlayer &&
            gameState[b] === currentPlayer &&
            gameState[c] === ''
        )
            return c;
        if (
            gameState[a] === currentPlayer &&
            gameState[c] === currentPlayer &&
            gameState[b] === ''
        )
            return b;
        if (
            gameState[b] === currentPlayer &&
            gameState[c] === currentPlayer &&
            gameState[a] === ''
        )
            return a;

        // Check if AI needs to block the player
        const opponent = currentPlayer === 'X' ? 'O' : 'X';
        if (
            gameState[a] === opponent &&
            gameState[b] === opponent &&
            gameState[c] === ''
        )
            return c;
        if (
            gameState[a] === opponent &&
            gameState[c] === opponent &&
            gameState[b] === ''
        )
            return b;
        if (
            gameState[b] === opponent &&
            gameState[c] === opponent &&
            gameState[a] === ''
        )
            return a;
    }

    return null;
}

// Check for winner
function checkForWinner() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] !== '' &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            highlightWinner(condition);
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Highlight winning cells
function highlightWinner(condition) {
    condition.forEach(index => {
        cells[index].style.backgroundColor = '#32cd32';
    });
}

// Restart the game
function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
