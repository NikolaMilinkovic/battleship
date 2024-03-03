
const Ship = require('./ships');

describe('evalType', () => {
    it('Check size and health based on type', () => {
        const ship = new Ship('Carrier');
        expect(ship.type).toBe('Carrier');
        expect(ship.size).toBe(5);
    });
    it('Check size and health based on type', () => {
        const ship = new Ship('Destroyer');
        expect(ship.type).toBe('Destroyer');
        expect(ship.size).toBe(2);
    });
});
