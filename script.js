const Player = (name, type) => {
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

  return {
    setName,
    getName,
    type,
    play,
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
    console.log(_board);
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

  const hideForm = () => {
    form = document.querySelector("#form");
    form.style.display = "none";
  };
  const showForm = () => {
    form = document.querySelector("#form");
    form.style.display = "";
  };

  return { showForm, hideForm, updatePlayerDisplay, render };
})();

const game = (() => {
  const playerX = Player("Player 1", "X");
  const playerO = Player("Player 2", "O");
  let _currentPlayer = playerX;
  displayController.render(gameBoard.getBoard());

  const updatePlayers = (firstPlayerName, secondPlayerName) => {
    playerX.setName(firstPlayerName);
    playerO.setName(secondPlayerName);
  };

  let finished = false;
  let started = false;

  const getCurrentPlayer = () => _currentPlayer;
  const updateCurrentPlayer = () => {
    _currentPlayer = _currentPlayer.type === "X" ? playerO : playerX;
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
    finished = false;
  };

  const play = (index) => {
    if (gameBoard.getBoard()[index] !== " ") return;
    if (finished) return;
    if (!started) return;

    _currentPlayer.play(index);
    displayController.render(gameBoard.getBoard());

    if (checkIfWon(gameBoard.getBoard(), _currentPlayer.type)) {
      alert(`${_currentPlayer.getName()} won, congrats!`);
      finished = true;
      return;
    }
    if (gameBoard.getBoard().every((e) => e !== " ")) {
      alert(`It's a tie, well played!`);
      finished = true;
      return;
    }
    updateCurrentPlayer();
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
  };
})();

const preGame = (() => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector("#form"));
    const firstPlayer = formData.get("player1");
    const secondPlayer = formData.get("player2");

    displayController.updatePlayerDisplay(firstPlayer, secondPlayer);
    displayController.hideForm();
    game.updatePlayers(firstPlayer, secondPlayer);
  };

  return {
    handleSubmit,
  };
})();
const button = document.querySelector("#submit-player-names");
button.addEventListener("click", (e) => preGame.handleSubmit(e));

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", game.start);

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", game.restart);
