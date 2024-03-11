/* eslint-disable max-len */
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

let attResult = '';
let hitField;
const fieldsToHit = [];
const fieldOffsets = [[0, 1], [0, -1], [1, 0], [-1, 0]];
// gameStart(playerName, playerBoard, aiGameboard)
export function playGame(playerBoard, aiBoard) {
    if (turn === 'player') {
        return 'player turn';
    }

    // If randomAttack returns value it has hit a ship
    // Take the coordinates and calculate offsets for searching
    if (attResult !== undefined && attResult !== '') {
        // Cache coordinates
        hitField = attResult;
        // Eval offset
        if (Array.isArray(hitField) && hitField.length === 2) {
            fieldOffsets.forEach((offset) => {
                const newX = hitField[0] + offset[0];
                const newY = hitField[1] + offset[1];
                if (newX >= 0 && newX <= 9 && newY >= 0 && newY <= 9) {
                    if (!playerBoard.shotField.find((obj) => obj.cordX === newX && obj.cordY === newY)) {
                    // cache offset fields
                        fieldsToHit.push([newX, newY]);
                    }
                }
            });
            attResult = '';
        }
    }
    // Try ajacent fields
    if (fieldsToHit.length > 0) {
        // Uzimamo prvu koordinatu
        let cords = fieldsToHit.shift();
        let fieldsToHitResult = '';
        fieldsToHitResult = playerBoard.receiveAttack(cords[0], cords[1]);


        while (fieldsToHitResult === false || fieldsToHitResult === 'land hit') {
            cords = fieldsToHit.shift();
            if (cords !== undefined) {
                // Runs all queued coordinates
                fieldsToHitResult = playerBoard.receiveAttack(cords[0], cords[1]);
            }
            if (cords === undefined) {
                // If no more coordinates just do a random attack
                computer.randomAttack(playerBoard, playerBoard.getShotFields());
                fieldsToHitResult = '';
                break;
            }
        }

        // If adjacent field is a hit send coordinates to attResult
        if (fieldsToHitResult === 'hit!') {
            if (fieldsToHit.length > 0) {
                attResult = [cords[0], cords[1]];
            } else {
                attResult = '';
            }
            fieldsToHitResult = '';
        }

        // IT GETS TO HERE SOMETIMES AND BREAKS WITHOUT PLAYING A FIELD
        // THERE HAS TO BE SOME CONDITION THAT I AM MISSING??
        turn = 'player';
        return '';
    }

    // This will run first in order to innitialize the attResult
    const playerShotFields = playerBoard.getShotFields();
    attResult = computer.randomAttack(playerBoard, playerShotFields);
    turn = 'player';
}


