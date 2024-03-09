import Ship from './ships.js';
import Gameboard from './gameboard.js';
import Player from './player.js';


// Method for innitializing player board
export function initPlayerBoard(playerName) {
    const playerBoard = new Gameboard();
    playerBoard.init();
    return playerBoard;
}

// MEthod for innitializing AI board
export function initAiBoard() {
    const aiGameboard = new Gameboard();
    aiGameboard.init();
    aiGameboard.placeShipsRandomly();
    return aiGameboard;
}

export function gameStart(playerName) {
    const player = new Player(playerName, 'player');
    const computer = new Player('Admiral Thorne Darkwater', 'computer');


    const computerBoard = new Gameboard();
}
