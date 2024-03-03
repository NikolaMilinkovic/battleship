import Gameboard from './gameboard.js';

export default class Player {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.alreadyHitField = [];
    }

    getPlayerName(name) {
        this.name = name;
    }

    attack(cordX, cordY, gameboard) {
        if (this.alreadyHitField.some((field) => field[0] === cordX && field[1] === cordY)) return;

        this.alreadyHitField.push([cordX, cordY]);
        gameboard.receiveAttack(cordX, cordY);
    }

    randomAttack(gameboard) {
        if (this.alreadyHitField.length === 100) return;

        let cordX;
        let cordY;
        do {
            cordX = Math.floor(Math.random() * 10);
            cordY = Math.floor(Math.random() * 10);
        } while (this.alreadyHitField.some((field) => field[0] === cordX && field[1] === cordY));
        gameboard.attack(cordX, cordY);
        this.alreadyHitField.push([cordX, cordY]);
    }
}
