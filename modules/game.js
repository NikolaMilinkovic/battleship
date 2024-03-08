import Ship from './ships.js';
import Gameboard from './gameboard.js';
import Player from './player.js';


// OVo ne treba da bude klasa! Promeni
export function initPlayerBoard(playerName) {
    const playerBoard = new Gameboard();
    playerBoard.init();
    return playerBoard;
}

export function gameStart(playerName) {
    const player = new Player(playerName, 'player');
    const computer = new Player('Admiral Thorne Darkwater', 'computer');


    const computerBoard = new Gameboard();
}

export function test() {
    const kek = 0;
}
