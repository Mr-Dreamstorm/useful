// game.js - Games Module
function loadGamesContent() {
    const section = document.getElementById('games');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-gamepad"></i>
                O'yinlar
            </div>
            
            <div class="grid-3">
                <button class="btn" id="ticTacToeBtn">
                    <i class="fas fa-times"></i> TicTacToe
                </button>
                <button class="btn" id="aimTrainerBtn">
                    <i class="fas fa-crosshairs"></i> Aim Trainer
                </button>
                <button class="btn" id="typingGameBtn">
                    <i class="fas fa-keyboard"></i> Typing Game
                </button>
            </div>
            
            <div id="gameContainer" class="preview-area" style="min-height: 400px;">
                <p>O'yinni tanlang</p>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('ticTacToeBtn').addEventListener('click', initTicTacToe);
    document.getElementById('aimTrainerBtn').addEventListener('click', initAimTrainer);
    document.getElementById('typingGameBtn').addEventListener('click', initTypingGame);
}

// ===== TIC TAC TOE =====
function initTicTacToe() {
    const container = document.getElementById('gameContainer');
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>Tic Tac Toe</h3>
            <select id="tttDifficulty">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
            </select>
            <button class="btn" id="newTicTacToe">Yangi o'yin</button>
            <div class="ttt-board" style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px; justify-content: center; margin: 20px 0;">
                ${Array(9).fill(0).map((_, i) => `<button class="ttt-cell" data-index="${i}" style="width: 100px; height: 100px; font-size: 40px; background: rgba(212,175,55,0.1); border: 2px solid #d4af37;"></button>`).join('')}
            </div>
            <div id="tttStatus" class="result-box">Sizning navbatingiz (X)</div>
        </div>
    `;
    
    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameActive = true;
    
    const cells = document.querySelectorAll('.ttt-cell');
    const status = document.getElementById('tttStatus');
    
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.dataset.index;
            if (board[index] === '' && gameActive && currentPlayer === 'X') {
                makeMove(index, 'X');
                
                if (gameActive && currentPlayer === 'O') {
                    setTimeout(makeAIMove, 500);
                }
            }
        });
    });
    
    document.getElementById('newTicTacToe').addEventListener('click', () => {
        board = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => cell.textContent = '');
        status.textContent = 'Sizning navbatingiz (X)';
    });
    
    function makeMove(index, player) {
        board[index] = player;
        cells[index].textContent = player;
        
        if (checkWinner()) {
            status.textContent = player === 'X' ? 'Siz yutdingiz! 🎉' : 'AI yutdi! 🤖';
            gameActive = false;
            return;
        }
        
        if (isBoardFull()) {
            status.textContent = 'Durang!';
            gameActive = false;
            return;
        }
        
        currentPlayer = player === 'X' ? 'O' : 'X';
        status.textContent = currentPlayer === 'X' ? 'Sizning navbatingiz (X)' : 'AI navbati...';
    }
    
    function makeAIMove() {
        if (!gameActive || currentPlayer !== 'O') return;
        
        const difficulty = document.getElementById('tttDifficulty').value;
        let move;
        
        if (difficulty === 'easy') {
            move = getRandomMove();
        } else {
            move = getBestMove();
        }
        
        if (move !== -1) {
            makeMove(move, 'O');
        }
    }
    
    function getRandomMove() {
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        
        return emptyCells[Math.floor(Math.random() * emptyCells.length)] || -1;
    }
    
    function getBestMove() {
        // Minimax algorithm for medium difficulty
        let bestScore = -Infinity;
        let bestMove = -1;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    function minimax(board, depth, isMaximizing) {
        const winner = checkWinner();
        
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (isBoardFull()) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    function checkWinner() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        
        for (let pattern of winPatterns) {
            const [a,b,c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }
    
    function isBoardFull() {
        return board.every(cell => cell !== '');
    }
}

// ===== AIM TRAINER =====
function initAimTrainer() {
    const container = document.getElementById('gameContainer');
    
    container.innerHTML = `
        <div style="text-align: center; position: relative; height: 400px; background: rgba(0,0,0,0.3); border-radius: 20px;">
            <h3>Aim Trainer</h3>
            <div style="position: absolute; top: 10px; right: 20px;">
                <span>Ball: <span id="aimScore">0</span></span>
                <span style="margin-left: 20px;">Vaqt: <span id="aimTime">30</span>s</span>
            </div>
            <div id="aimTarget" style="position: absolute; width: 50px; height: 50px; background: #d4af37; border-radius: 50%; cursor: pointer; display: none; box-shadow: 0 0 20px gold;"></div>
            <button class="btn" id="startAim" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Boshlash</button>
        </div>
    `;
    
    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let targetInterval;
    
    const startBtn = document.getElementById('startAim');
    const target = document.getElementById('aimTarget');
    const scoreDisplay = document.getElementById('aimScore');
    const timeDisplay = document.getElementById('aimTime');
    
    startBtn.addEventListener('click', startAimGame);
    target.addEventListener('click', hitTarget);
    
    function startAimGame() {
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        startBtn.style.display = 'none';
        target.style.display = 'block';
        
        gameInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endAimGame();
            }
        }, 1000);
        
        moveTarget();
        targetInterval = setInterval(moveTarget, 800);
    }
    
    function moveTarget() {
        const container = document.querySelector('.preview-area');
        const maxX = container.clientWidth - 60;
        const maxY = container.clientHeight - 100;
        
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }
    
    function hitTarget() {
        score++;
        scoreDisplay.textContent = score;
        moveTarget();
    }
    
    function endAimGame() {
        clearInterval(gameInterval);
        clearInterval(targetInterval);
        target.style.display = 'none';
        startBtn.style.display = 'block';
        startBtn.textContent = `Qayta boshlash (Ball: ${score})`;
    }
}

// ===== TYPING GAME =====
function initTypingGame() {
    const container = document.getElementById('gameContainer');
    
    const words = [
        'ramazon', 'namoz', 'roza', 'quron', 'islom',
        'arabcha', 'musulmon', 'saharlik', 'iftorlik', 'taroveh',
        'duo', 'ibodat', 'tavba', 'istiqfor', 'sadaqa'
    ];
    
    container.innerHTML = `
        <div style="text-align: center;">
            <h3>Typing Game</h3>
            <div style="font-size: 40px; margin: 30px;" id="typingWord">${words[Math.floor(Math.random() * words.length)]}</div>
            <input type="text" id="typingInput" placeholder="So'zni yozing..." style="width: 300px;">
            <button class="btn" id="checkTyping">Tekshirish</button>
            <div class="result-box" id="typingResult"></div>
            <div>Ball: <span id="typingScore">0</span></div>
            <div>Vaqt: <span id="typingTimer">60</span>s</div>
        </div>
    `;
    
    let score = 0;
    let timeLeft = 60;
    let gameActive = true;
    let timer;
    
    const wordDisplay = document.getElementById('typingWord');
    const input = document.getElementById('typingInput');
    const scoreDisplay = document.getElementById('typingScore');
    const timerDisplay = document.getElementById('typingTimer');
    
    startTypingGame();
    
    document.getElementById('checkTyping').addEventListener('click', checkTyping);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkTyping();
    });
    
    function startTypingGame() {
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endTypingGame();
            }
        }, 1000);
    }
    
    function checkTyping() {
        if (!gameActive) return;
        
        const currentWord = wordDisplay.textContent;
        const typedWord = input.value.trim().toLowerCase();
        
        if (typedWord === currentWord) {
            score++;
            scoreDisplay.textContent = score;
            input.value = '';
            wordDisplay.textContent = words[Math.floor(Math.random() * words.length)];
        } else {
            input.style.borderColor = 'red';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 500);
        }
    }
    
    function endTypingGame() {
        clearInterval(timer);
        gameActive = false;
        input.disabled = true;
        document.getElementById('typingResult').innerHTML = `
            <h3>O'yin tugadi!</h3>
            <p>Umumiy ball: ${score}</p>
        `;
    }
}
