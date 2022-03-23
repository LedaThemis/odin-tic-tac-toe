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
  const _createDiv = (type) => {
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = type;
    div.appendChild(p);
    return div;
  };

  const render = (board) => {
    const gameContainer = document.querySelector("#game-container");
    gameContainer.replaceChildren();

    for (let i = 0; i < board.length; i++) {
      gameContainer.appendChild(_createDiv(board[i]));
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

  const getCurrentPlayer = () => _currentPlayer;
  const updateCurrentPlayer = () => {
    _currentPlayer = _currentPlayer.type === "X" ? playerO : playerX;
  };

  const play = () => {};

  return {
    getCurrentPlayer,
    updateCurrentPlayer,
  };
})();

displayController.render(gameBoard.getBoard());
