import Ship from './ships.js';
import Gameboard from './gameboard.js';
import Player from './player.js';


// OVo ne treba da bude klasa! Promeni

export default function gameStart(playerName) {
    const player = new Player(playerName, 'player');
    const computer = new Player('Admiral Thorne Darkwater', 'computer');

    console.log(player.name);
}

