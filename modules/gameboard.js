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
        this.shipPlacementHistory = [];
    }

    // Innitializes gameboard fields as objects and pushes them to this.fields arr
    init() {
        this.fields = [];
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

    placeShipsRandomly() {
        return new Promise((resolve, reject) => {
            const shipsPlaced = {
                ship1: false,
                ship2: false,
                ship3: false,
                ship4: false,
                ship5: false,
            };
            const shipsTypes = {
                type1: 'Carrier',
                type2: 'Battleship',
                type3: 'Cruiser',
                type4: 'Submarine',
                type5: 'Destroyer',
            };
            function randomInteger(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function getOrientation() {
                const ran = randomInteger(0, 1);
                if (ran > 0) {
                    return 'x';
                }
                return 'y';
            }
            for (let i = 0; i < 5; i++) {
                let shipPlaced = false;
                while (!shipsPlaced[`ship${i + 1}`]) {
                    const orientation = getOrientation();
                    const x = randomInteger(0, 9);
                    const y = randomInteger(0, 9);
                    shipPlaced = this.placeShip(shipsTypes[`type${i + 1}`], 0, orientation, x, y);
                    if (shipPlaced) {
                        shipsPlaced[`ship${i + 1}`] = true;
                    }
                }
            }

            resolve();
        });
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
        if (orientation === 'x') border = cordY;
        if (orientation === 'y') border = cordX;
        if (clickValue > border) return console.log(`Border is: ${border} and click value is: ${clickValue}`);
        const beforeClick = clickValue; // < znaci da ukoliko je 2, imamo levo dva elementa, x-1 i x-2
        const afterClick = size - clickValue; // Znaci tipa 5 - 2 = 3 elementa, ukljucujuci i click el x+0, x+1, x+2
        for (let i = beforeClick; i > 0; i--) {
            let field;
            if (orientation === 'y') {
                field = this.fields.find((obj) => obj.cordX === cordX - i && obj.cordY === cordY);
            } else {
                field = this.fields.find((obj) => obj.cordX === cordX && obj.cordY === cordY - i);
            }
            if (!field) return false;
            if (field.hasShip === true) {
                return false;
            }

            this.shipPlacementFields.push(field);
        }
        for (let i = 0; i < afterClick; i++) {
            let field;
            if (orientation === 'y') {
                field = this.fields.find((obj) => obj.cordX === cordX + i && obj.cordY === cordY);
            } else {
                field = this.fields.find((obj) => obj.cordX === cordX && obj.cordY === cordY + i);
            }
            if (!field) return false;
            if (field.hasShip === true) {
                return false;
            }

            this.shipPlacementFields.push(field);
        }

        this.shipPlacementFields.forEach((field) => {
            field.hasShip = true;
            field.shipType = shipType;

            const updateField = this.fields.find((obj) => obj.cordX === field.cordX && obj.cordY === field.cordY);
            if (updateField) {
                updateField.hasShip = true;
                updateField.shipType = shipType;
            }
        });

        this.shipPlacementHistory.push(this.fields);
        return true;
    }

    receiveAttack(cordX, cordY) {
        const field = this.fields.find((obj) => obj.cordX === cordX && obj.cordY === cordY);
        if (field.hasShip === true) {
            field.isShot = true;
            const ship = this.ships[field.shipType];
            ship.hit();
            if (this.isAllSunk()) return console.log('All ships lost, game over!');
            if (ship.isSunk()) return console.log('Ship lost!');
            return 'hit';
        }
        field.isShot = true;
        this.shotField.push([cordX, cordY]);
        console.log(field);
    }

    // Checks if all ships are sunk
    isAllSunk() {
        if (Object.keys(this.ships).every((ship) => this.ships[ship].isSunk())) return true;
        return false;
    }

    // Sinks all ships, just for testing
    sinkAll() {
        Object.keys(this.ships).forEach((ship) => {
            this.ships[ship].sunk = true;
        });
    }
}
