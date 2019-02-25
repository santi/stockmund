const AI_PLAYS_AS = 'b'

let board,
  game = new Chess(),
  worker =  new Worker('js/worker.js'),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');

worker.addEventListener('message', event => {
  const bestMove = event.data
  game.move(bestMove);
  updateBoard()
  updateStatus();
})

const moveAI = () => {
  console.log("moveAI")
  worker.postMessage(game.fen());
}


// do not pick up pieces if the game is over
// only pick up pieces for the side to move
const onDragStart = function(source, piece, position, orientation) {
  console.log("onDragStart")
  if (game.game_over() === true ||
      game.turn() === AI_PLAYS_AS){
    return false;
  }
};

const onDrop = function(source, target) {
  console.log("onDrop")
  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen
  });

  // illegal move
  if (move === null){
    console.log("Illegal move")
    return 'snapback';
  } 
  updateStatus();
};

const updateBoard = () => {
  board.position(game.fen());
}

// update the board position after the piece snap 
// for castling, en passant, pawn promotion
const onSnapEnd = function() {
  console.log("onSnapEnd")
  updateBoard()
  moveAI();
};

const updateStatus = function() {
  console.log("updateStatus")
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

const cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};
board = ChessBoard('chessboard', cfg);

updateStatus();