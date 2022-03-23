const Player = (type) => {
  this.play = (position) => {
    gameBoard.updateBoard(position, type);
  };

  return {
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

displayController.render(gameBoard.getBoard());
