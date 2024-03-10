import Ship from './ships.js';
import Gameboard from './gameboard.js';
import Player from './player.js';

let turn = 'player';
let player;
let computer;
let result;
let winner;

// Method for innitializing player board
export function initPlayerBoard(playerName) {
    const playerBoard = new Gameboard();
    playerBoard.init();
    playerBoard.placeIslands(2);
    playerBoard.placeMines(5);

    return playerBoard;
}

// Method for innitializing AI board
export function initAiBoard() {
    const aiGameboard = new Gameboard();
    aiGameboard.init();
    aiGameboard.placeIslands(2);
    aiGameboard.placeMines(5);
    aiGameboard.placeShipsRandomly();

    return aiGameboard;
}

export function getTurn() {
    return turn;
}
export function changeTurn() {
    if (turn === 'player') {
        turn = 'computer';
    } else {
        turn = 'player';
    }
}

export function innitPlayer(playerName) {
    player = new Player(playerName, 'player');
    computer = new Player('Admiral Thorne Darkwater', 'computer');
}

// gameStart(playerName, playerBoard, aiGameboard)
export function playGame(playerBoard, aiBoard, playerBoardContainer, aiBoardContiner) {
    if (turn === 'player') {
    } else {
        computer.randomAttack(playerBoard);

        if (playerBoard.isAllSunk()) {
            winner = 'Admiral Thorne Darkwater';
        }

        turn = 'player';
    }

    // alert(`Winner is ${winner}!`);
}


