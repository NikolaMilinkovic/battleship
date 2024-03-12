/* eslint-disable no-loop-func */
/* eslint-disable max-len */
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

    randomAttack(gameboard, boardShotFields) {
        if (this.alreadyHitField.length === 100) return;
        boardShotFields.forEach((obj) => {
            if (!this.alreadyHitField.find((field) => field[0] === obj[0] && field[1] === obj[1])) {
                this.alreadyHitField.push(obj);
            }
        });

        let cordX;
        let cordY;
        let result;
        const checkCords = () => {
            do {
                cordX = Math.floor(Math.random() * 10);
                cordY = Math.floor(Math.random() * 10);
            } while (this.alreadyHitField.find((field) => field[0] === cordX && field[1] === cordY));
        };
        checkCords();

        result = gameboard.receiveAttack(cordX, cordY);
        while (result === 'land hit' || result === false) {
            checkCords();
            result = gameboard.receiveAttack(cordX, cordY);
        }
        this.alreadyHitField.push([cordX, cordY]);

        if (result === 'hit!') {
            result = '';
            return [cordX, cordY];
        }
    }
}
