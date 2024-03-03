import {
    createDiv, createPara, createInput, appendChildren, createButton,
} from './elementBuilder.js';
import Player from './player.js';
import gameStart from './game.js';

const { body } = document;

const playerInputContainer = createDiv('', 'player-input-container');
const btnPlay = document.getElementById('btn-play');
btnPlay.addEventListener('click', play);
document.getElementById('form').addEventListener('submit', preventDefault);
let playerName;

function preventDefault(event) {
    event.preventDefault();
}

function play() {
    const input = document.getElementById('input-player');
    gameStart(input.value);
    playerName = input.value;
    clearDisplay();
    gameDisplay();
}

function getPlayer() {
    const inputContainer = createDiv('', 'input-container');
    const header = createPara('Enter your name', '', 'input-header', 'para');
    const input = createInput('Cpt. Jack Sparrow?', '', 'input-player');
    const btn = createButton('Play', '', 'btn-play');
    btn.addEventListener('click', btnPlay);
    appendChildren(inputContainer, [header, input, btn]);
    appendChildren(playerInputContainer, [inputContainer]);
    body.appendChild(playerInputContainer);
}

// getPlayer();

function clearDisplay() {
    while (body.firstChild) {
        body.firstChild.remove();
    }
}

function gameDisplay() {
    const content = createDiv('', 'content');
    const playerContainer = createDiv('', 'player-container');
    const playerLabel = createPara(`${playerName}`, '', '', 'h2');
    const playerShips = createDiv('', 'ships-player');
    const playerGrid = createDiv('', 'grid-player');
    appendChildren(playerContainer, [playerLabel, playerShips, playerGrid]);


    const aiContainer = createDiv('', 'ai-container');
    const aiLabel = createPara('Admiral Thorne Darkwater', '', '', 'h2');
    const aiShips = createDiv('', 'ships-ai');
    const aiGrid = createDiv('', 'grid-ai');
    appendChildren(aiContainer, [aiLabel, aiShips, aiGrid]);

    appendChildren(content, [playerContainer, aiContainer]);
    body.appendChild(content);
}


