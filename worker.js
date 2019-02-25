importScripts("https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.2/chess.js");

const MINIMUM_MOVE_VALUE = -9999;

const getPieceValue = (piece) => {
    if (piece === null) {
        return 0;
    }

    const getAbsoluteValue = (piece) => {
        if (piece.type === 'p') {
            return 10;
        } else if (piece.type === 'r') {
            return 50;
        } else if (piece.type === 'n') {
            return 30;
        } else if (piece.type === 'b') {
            return 30 ;
        } else if (piece.type === 'q') {
            return 90;
        } else if (piece.type === 'k') {
            return 900;
        }
        throw "Unknown piece type: " + piece.type;
    };
    const pieceValue = getAbsoluteValue(piece)
    if (piece.color === 'w') {
        return -pieceValue;
    } else {
        return pieceValue;
    }
};

const evaluateBoard = (game) => {
    let boardValue = 0;
    for (const square of game.SQUARES){
        boardValue += getPieceValue(game.get(square))
    }
    return boardValue;
}

const getBestMove = (game) => {
    //generate all the moves for a given position
    const availableMoves = game.moves();
    console.log(availableMoves)


    let bestMoves = [];
    let bestMoveValue = MINIMUM_MOVE_VALUE;

    for (const move of availableMoves) {
        game.move(move);
        const moveValue = evaluateBoard(game);
        game.undo()
        
        if (moveValue > bestMoveValue) {
            // Clear list of best moves and add the new best move
            bestMoves = [ move ]
            bestMoveValue = moveValue;
        } else if (moveValue === bestMoveValue) {
            // If the move is as good as the best move, add it to 
            // the list of best moves.
            bestMoves.push(move)
        }
    }

    // Chose a random move among the best moves
    const bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
    console.log(`Best move: ${bestMove}`)
    console.log(`Best move value: ${bestMoveValue}`)
    return bestMove;
  }

self.addEventListener('message', function(event) {
    const fen = event.data
    const game = new Chess(fen)
    bestMove = getBestMove(game);
    self.postMessage(bestMove);
})