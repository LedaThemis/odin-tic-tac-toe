const Player = (type) => {
  this.play = (position) => {
    gameBoard.updateBoard(position, type);
  };

  return {
    type,
    play,
  };
};

const gameBoard = (() => {
  let _board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  const updateBoard = (position, choice) => {
    _board = _board.map((el, i) => (i === position ? choice : el));
  };

  const getBoard = () => _board;

  return {
    updateBoard: updateBoard,
    getBoard: getBoard,
  };
})();

const displayController = (() => {
  const _createDiv = (type, index) => {
    const div = document.createElement("div");
    div.dataset.key = index;
    div.addEventListener("click", (e) => game.play(index));
    const p = document.createElement("p");
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
  return {
    render,
  };
})();

const game = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let _currentPlayer = playerX;
  displayController.render(gameBoard.getBoard());

  let finished = false;

  const getCurrentPlayer = () => _currentPlayer;
  const updateCurrentPlayer = () => {
    _currentPlayer = _currentPlayer.type === "X" ? playerO : playerX;
  };

  const play = (index) => {
    if (gameBoard.getBoard()[index] !== " ") return;
    if (finished) return;
    _currentPlayer.play(index);
    displayController.render(gameBoard.getBoard());

    if (checkIfWon(gameBoard.getBoard(), _currentPlayer.type)) {
      alert(`${_currentPlayer.type} won, congrats!`);
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
    play,
    getCurrentPlayer,
    updateCurrentPlayer,
  };
})();
