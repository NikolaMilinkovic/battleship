/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import Ship from './ships.js';

export default class Gameboard {
    constructor() {
        this.fields = [];

        // Ships
        this.ships = {
            Carrier: new Ship('Carrier'),
            Battleship: new Ship('Battleship'),
            Cruiser: new Ship('Cruiser'),
            Submarine: new Ship('Submarine'),
            Destroyer: new Ship('Destroyer'),
        };

        this.shotField = [];
        this.shipPlacementFields = [];
    }

    // Innitializes gameboard fields as objects and pushes them to this.fields arr
    init() {
        let obj = {};
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                obj = {
                    cordX: x,
                    cordY: y,
                    hasShip: false,
                    shipType: null,
                    isShot: false,
                };
                this.fields.push(obj);
            }
        }
    }

    // shipType kako bi uzeli size, clickValue > vrednost koju dobijamo kada kliknemo da drag brod
    // Div koji predstavlja brod ima u zavisnosti od duzine isti broj divova unutra, u zavisnosti od
    // toga da li smo kliknuli na pocetak ili kraj drop se gleda drugacije, ako je klik skroz levo
    // znaci da je vrednost 0, sto govori da sa leve strane ima 0 polja, ako kliknemo skroz desno
    // taj broj iznosi 4 > Za Carrier > sto znaci da imamo 4 polja sa leve strane, koristmo za racunanje
    // postavke broda kako bi prevent postavljnje van gameboard
    // Orientation > Orijentacija, moze biti x i y
    // cordX i cordY > koordinate gde je igrac probao da drop brod
    placeShip(shipType, clickValue, orientation, cordX, cordY) {
        let border;
        this.shipPlacementFields = [];
        const { size } = this.ships[shipType];
        if (orientation === 'x') border = cordX;
        if (orientation === 'y') border = cordY;
        if (clickValue > border) return console.log(false);
        const beforeClick = clickValue; // < znaci da ukoliko je 2, imamo levo dva elementa, x-1 i x-2
        const afterClick = size - clickValue; // Znaci tipa 5 - 2 = 3 elementa, ukljucujuci i click el x+0, x+1, x+2
        for (let i = beforeClick; i > 0; i--) {
            let field;
            if (orientation === 'x') {
                field = this.fields.find((obj) => obj.cordX === cordX - i && obj.cordY === cordY);
            } else {
                field = this.fields.find((obj) => obj.cordX === cordX && obj.cordY === cordY - i);
            }
            if (field.hasShip === true) {
                return 'You can not overlap ships!';
            }

            this.shipPlacementFields.push(field);
        }
        for (let i = 0; i < afterClick; i++) {
            let field;
            if (orientation === 'x') {
                field = this.fields.find((obj) => obj.cordX === cordX + i && obj.cordY === cordY);
            } else {
                field = this.fields.find((obj) => obj.cordX === cordX && obj.cordY === cordY + i);
            }
            if (field.hasShip === true) {
                return 'You can not overlap ships!';
            }

            this.shipPlacementFields.push(field);
        }

        this.shipPlacementFields.forEach((field) => {
            field.hasShip = true;
            field.shipType = shipType;
        });

        return true;
    }

    // shipPlaceRollback() {
    //     Object.keys(this.fieldHistory).every((field) => {
    //         this.fieldHistory[field].hasShip = false;
    //         this.fieldHistory[field].shipType = null;
    //     });
    // }

    receiveAttack(cordX, cordY) {
        const field = this.fields.find((obj) => obj.cordX === cordX && obj.cordY === cordY);
        if (field.hasShip === true) {
            const ship = this.ships[field.shipType];
            ship.hit();
            if (this.isAllSunk()) return 'All ships lost, game over!';
            if (ship.isSunk()) return 'Ship lost!';
            return 'hit';
        }
        field.isShot = true;
        this.shotField.push([cordX, cordY]);
        return 'miss';
    }

    // Checks if all ships are sunk
    isAllSunk() {
        if (Object.keys(this.ships).every((ship) => this.ships[ship].sunk === true)) return true;
        return false;
    }

    // Sinks all ships, just for testing
    sinkAll() {
        Object.keys(this.ships).forEach((ship) => {
            this.ships[ship].sunk = true;
        });
    }
}

const gameboard = new Gameboard();
gameboard.init();
// gameboard.placeShip('Carrier', 1, 'x', 3, 0);
console.log(gameboard.placeShip('Carrier', 3, 'x', 3, 0));
console.log(gameboard.placeShip('Submarine', 3, 'x', 3, 0));
console.log(gameboard.receiveAttack(3, 0));
console.log(gameboard.receiveAttack(2, 0));
console.log(gameboard.receiveAttack(1, 0));
console.log(gameboard.receiveAttack(0, 0));
console.log(gameboard.receiveAttack(4, 0));
console.log(gameboard.receiveAttack(5, 0));
console.log(gameboard.receiveAttack(6, 0));
console.log(gameboard.receiveAttack(7, 0));
console.log(gameboard.receiveAttack(9, 0));
console.log(`Ship hit: ${gameboard.ships.Carrier.hits} times!`);
console.log(`Ship sunk: ${gameboard.ships.Carrier.sunk}`);
console.log(gameboard.isAllSunk());
gameboard.sinkAll();
console.log(gameboard.isAllSunk());
console.log(`Ship sunk: ${gameboard.ships.Destroyer.sunk}`);
console.log(`Ship sunk: ${gameboard.ships.Submarine.sunk}`);
console.log(`Ship sunk: ${gameboard.ships.Cruiser.sunk}`);
console.log(`Ship sunk: ${gameboard.ships.Battleship.sunk}`);
console.log(gameboard.isAllSunk());

// console.log(gameboard.Battleship);
// console.log(gameboard.Cruiser);
// console.log(gameboard.fields);
// gameboard.placeShip('Destroyer', 1, 'y', 3, 1);
// module.exports = Gameboard;
