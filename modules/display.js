import {
    createDiv, createPara, createInput, appendChildren, createButton, paraImg,
} from './elementBuilder.js';
import Player from './player.js';
import gameStart from './game.js';
import { enablePara, disablePara } from './para.js';

const { body } = document;
const form = document.getElementById('form');
const paraContainer = document.getElementById('parallax-container');
const playerInputContainer = createDiv('', 'player-input-container');
const btnPlay = document.getElementById('btn-play');
const inputName = document.getElementById('input-player');
btnPlay.addEventListener('click', play);


let playerName;

// Prevents the form default behvaiour
form.addEventListener('submit', preventDefault);
function preventDefault(event) {
    event.preventDefault();
}
// End of prevent default code


// Welcome screen logic & transition into game
function play(event) {
    console.log('play called');
    if (event.type === 'click' || event.type === 'Enter') {
        preventDefault(event);
        if (!checkNameInput()) return;
        disablePara();
        transitionPage();
    }
}

function checkNameInput() {
    if (!inputName.value) {
        inputName.placeholder = 'Please enter your name.';
        return false;
    }
    return true;
}

function transitionPage() {
    const ship = document.getElementById('para-10');
    const position = ship.getBoundingClientRect();
    const posX = position.x;
    const posY = position.y;
    ship.style.setProperty('--ship-pos-x', `${posX}px`);
    ship.style.setProperty('--ship-pos-y', `${posY}px`);
    form.classList.add('transition-form-container');
    for (let i = 1; i < 11; i++) {
        const el = document.getElementById(`para-${i}`);
        el.classList.add(`transition-para-${i}`);
    }
    setTimeout(clearDisplay, 2700);
    setTimeout(displayShipCabin, 2720);
}

function displayShipCabin() {
    const paraEls = [];
    const imgArr = [
        { src: './img/pirate-cabin/background.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/barrels-left.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/table-shadow.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/table.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/chair.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/chest.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/boards.svg', x: 0, y: 0 },
    ];
    for (let i = 1; i < 8; i++) {
        const img = paraImg(imgArr[i - 1].src, ['para'], `para-cabin-${i + 1}`, imgArr[i - 1].x, imgArr[i - 1].y);
        paraEls.push(img);
    }

    appendChildren(paraContainer, paraEls);
}
// Welcome screen logic & transition into game
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
    while (paraContainer.firstChild) {
        paraContainer.firstChild.remove();
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


