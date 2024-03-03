const Gameboard = require('./gameboard');
/* eslint-disable no-undef */


describe('Test gameboard init', () => {
    it('Check correct creation & innitialization of objects', () => {
        const gameboard = new Gameboard();
        gameboard.init();
        expect(gameboard.fields.length).toBe(100);
        expect(gameboard.fields[0].hasShip).toBe(false);
        expect(gameboard.fields[0].isShot).toBe(false);
        let indexes = gameboard.outBoundIndexes;

        while (indexes > 0) {
            expect(gameboard.fields[indexes[0]].hasShip).toBe(false);
            expect(gameboard.fields[indexes[0]].isShot).toBe(false);
            expect(gameboard.fields[indexes[0]].inBound).toBe(false);

            indexes = indexes.slice(1);
        }
    });
});

describe('Test place ship', () => {
    it('Check correct creation & innitialization of objects', () => {
        const gameboard = new Gameboard();
        gameboard.init();
    });
});

it('Test receiveAttack method', () => {
    const gameboard = new Gameboard();
    gameboard.init();
    gameboard.placeShip('Carrier', 1, 'x', 3, 0);
    expect(gameboard.receiveAttack(3, 0)).toBe('hit');
    expect(gameboard.Carrier.hits).toBe(1);
    expect(gameboard.receiveAttack(cordX, cordY)).toBe();
    // receiveAttack(cordX, cordY)
});


// receiveAttack(cordX, cordY) {
//     const field = this.fields.find((obj) => obj.cordX === cordX && obj.cordY === cordY);
//     if (field.hasShip === true) {
//         const ship = this.ships[field.shipType];
//         ship.hit();
//         return 'hit'
//     } else {
//         field.isShot = true;
//         return 'miss';
//     }
// }
