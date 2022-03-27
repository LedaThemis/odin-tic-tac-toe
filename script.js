const Player = (name, type) => {
  let _AI = false;
  let _name = name;
  this.setName = (newName) => {
    _name = newName;
  };
  this.getName = () => {
    return _name;
  };

  this.play = (position) => {
    gameBoard.updateBoard(position, type);
  };

  this.makeAI = () => {
    _AI = true;
  };

  this.makeHuman = () => {
    _AI = false;
  };

  this.isAI = () => _AI;
  return {
    setName,
    getName,
    type,
    play,
    makeAI,
    makeHuman,
    isAI,
  };
};

const gameBoard = (() => {
  let _initialBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  let _board = [..._initialBoard];

  const updateBoard = (position, choice) => {
    _board = _board.map((el, i) => (i === position ? choice : el));
  };

  const getBoard = () => _board;
  const clearBoard = () => {
    _board = [..._initialBoard];
  };

  return {
    updateBoard,
    getBoard,
    clearBoard,
  };
})();

const displayController = (() => {
  const _createDiv = (type, index) => {
    const div = document.createElement("div");
    div.dataset.key = index;
    div.addEventListener("click", (e) => game.play(index));
    const p = document.createElement("p");
    p.classList.add("x-or-o");
    p.textContent = type;
    div.appendChild(p);
    return div;
  };

  const render = (board) => {
    const gameContainer = document.querySelector("#game-container");
    gameContainer.replaceChildren();

    for (let i = 0; i < board.length; i++) {
      gameContainer.appendChild(_createDiv(board[i], i));
    }
  };

  const updatePlayerDisplay = (p1, p2) => {
    const players = document.querySelector("#players");
    players.textContent = `${p1} vs ${p2}!`;
  };

  const displayResult = (result) => {
    const players = document.querySelector("#result-display");
    players.textContent = result;
  };

  const clearDisplayResult = () => {
    const players = document.querySelector("#result-display");
    players.textContent = "";
  };

  const hideForm = () => {
    form = document.querySelector("#form");
    form.style.display = "none";
  };
  const showForm = () => {
    form = document.querySelector("#form");
    form.style.display = "";
  };

  return {
    clearDisplayResult,
    displayResult,
    showForm,
    hideForm,
    updatePlayerDisplay,
    render,
  };
})();

const game = (() => {
  const playerX = Player("Player 1", "X");
  const playerO = Player("Player 2", "O");
  let _currentPlayer = playerX;

  let finished = false;
  let started = false;

  displayController.render(gameBoard.getBoard());

  const updatePlayers = (firstPlayerName, secondPlayerName) => {
    playerX.setName(firstPlayerName);
    playerO.setName(secondPlayerName);

    displayController.updatePlayerDisplay(playerX.getName(), playerO.getName());
  };

  const getCurrentPlayer = () => _currentPlayer;
  const updateCurrentPlayer = () => {
    _currentPlayer = _currentPlayer.type === "X" ? playerO : playerX;

    if (_currentPlayer.isAI()) {
      play(computerEngine.play(gameBoard.getBoard()));
    }
  };

  const start = (e) => {
    const statusElement = document.querySelector("#game-status");
    statusElement.textContent = "STATUS: STARTED";
    started = true;
  };

  const restart = (e) => {
    start();
    gameBoard.clearBoard();
    displayController.render(gameBoard.getBoard());
    displayController.clearDisplayResult();
    finished = false;
    _currentPlayer = playerX;
  };

  const play = (index) => {
    if (gameBoard.getBoard()[index] !== " ") return;
    if (finished) return;
    if (!started) return;

    _currentPlayer.play(index);
    displayController.render(gameBoard.getBoard());

    if (checkIfWon(gameBoard.getBoard(), _currentPlayer.type)) {
      displayController.displayResult(
        `${_currentPlayer.getName()} won, congrats!`
      );
      finished = true;
      return;
    }
    if (gameBoard.getBoard().every((e) => e !== " ")) {
      displayController.displayResult(`It's a tie, well played!`);
      finished = true;
      return;
    }
    updateCurrentPlayer();
  };

  const handlePlayAI = (e) => {
    if (e.target.checked) {
      playerO.makeAI();
      if (_currentPlayer.isAI()) {
        play(computerEngine.play(gameBoard.getBoard()));
      }
    } else {
      playerO.makeHuman();
    }
  };

  const checkIfWon = (board, type) => {
    const equal = (e) => e === type;
    const multipleEqual = (i, j, k) =>
      equal(board[i]) && equal(board[j]) && equal(board[k]);

    for (let i = 0; i < board.length; i += 3) {
      if (multipleEqual(i, i + 1, i + 2)) return true;
    }
    for (let i = 0; i < board.length; i++) {
      if (multipleEqual(i, i + 3, i + 6)) return true;
    }

    if (multipleEqual(0, 4, 8)) return true;
    if (multipleEqual(2, 4, 6)) return true;

    return false;
  };

  return {
    start,
    restart,
    updatePlayers,
    play,
    getCurrentPlayer,
    updateCurrentPlayer,
    handlePlayAI,
    checkIfWon,
  };
})();

const preGame = (() => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector("#form"));
    const firstPlayer = formData.get("player1");
    const secondPlayer = formData.get("player2");

    displayController.hideForm();
    game.updatePlayers(firstPlayer, secondPlayer);
  };

  return {
    handleSubmit,
  };
})();

const computerEngine = (() => {
  const _values = {
    Win: 8,
    "Block Win": 7,
    Fork: 6,
    "Block Fork": 5,
    Center: 4,
    "Opposite Corner": 3,
    Corner: 2,
    Side: 1,
  };
  const _aboutToWin = [
    [0, 1],
    [1, 2],
    [3, 4],
    [4, 5],
    [6, 7],
    [7, 8],
    [0, 4],
    [4, 8],
    [2, 4],
    [4, 6],
    [0, 2],
    [3, 5],
    [6, 8],
    [0, 8],
    [2, 6],
  ];

  const play = (board) => {
    let noAnswer = true;
    let randomIndex = null;
    while (noAnswer) {
      randomIndex = _getRandomIndex(board.length);
      if (board[randomIndex] === " ") {
        noAnswer = false;
        break;
      }
    }

    return findBestMove(board);
  };

  const findBestMove = (board) => {
    let bestMove;
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] !== " ") continue;
      const computedBoard = _computeBoard(board, i, "O");

      const score = minimax(computedBoard, 0, false);

      console.log(score);
      if (score > bestScore) {
        bestMove = i;
        bestScore = score;
      }
    }
    return bestMove;
  };

  const minimax = (board, depth, maximizingPlayer) => {
    if (game.checkIfWon(board, "X")) {
      return -10 + depth;
    } else if (game.checkIfWon(board, "O")) {
      return 10 - depth;
    } else if (board.every((e) => e !== " ")) {
      return 0;
    }

    const possiblePositions = [];
    board.forEach((e, i) => (e === " " ? possiblePositions.push(i) : null));
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const pos of possiblePositions) {
        const childBoard = _computeBoard(board, pos, "O");
        const val = minimax(childBoard, depth + 1, false);

        maxEval = Math.max(val, maxEval);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const pos of possiblePositions) {
        const childBoard = _computeBoard(board, pos, "X");
        const val = minimax(childBoard, depth + 1, true);

        minEval = Math.min(val, minEval);
      }
      return minEval;
    }
  };

  const _getRemainingMoves = (board) => board.filter((e) => e === " ").length;
  const _getRandomIndex = (length) => Math.floor(Math.random() * length);
  const _computeBoard = (board, position, type) =>
    board.map((el, i) => (i === position ? type : el));

  return {
    play,
  };
})();

const button = document.querySelector("#submit-player-names");
button.addEventListener("click", (e) => preGame.handleSubmit(e));

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", game.start);

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", game.restart);

const playAI = document.querySelector("#play-vs-ai");
playAI.addEventListener("click", game.handlePlayAI);
