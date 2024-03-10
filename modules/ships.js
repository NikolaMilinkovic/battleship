

export default class Ship {
    constructor(type) {
        this.sunk = false;
        this.hits = 0;
        this.size = 0;
        this.type = this.evalType(type);
    }

    // Evaluates ship type and sets size & health
    evalType(type) {
        if (type === 'Carrier') {
            this.size = 5;
        }
        if (type === 'Battleship') {
            this.size = 4;
        }
        if (type === 'Cruiser') {
            this.size = 3;
        }
        if (type === 'Submarine') {
            this.size = 3;
        }
        if (type === 'Destroyer') {
            this.size = 2;
        }
        return type;
    }

    // Increases number of hits
    hit() {
        this.hits++;
    }

    // Checks if the ship is sunk
    isSunk() {
        if (this.hits === this.size) {
            this.sunk = true;
            return true;
        }
        return false;
    }

    // Returns current healt level
    getHealth() {
        console.log(`Hit: ${this.hits} / ${this.size} :Size >>> ${this.type}`);
    }
}
