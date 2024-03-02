import {
    createDiv, createPara, createInput, appendChildren, createButton,
} from './elementBuilder.js';

const { body } = document;
const content = document.getElementById('content');
const display = createDiv('', 'content');
const playerContainer = createDiv('', 'player-container');
const AiContainer = createDiv('', 'ai-container');
const playerInputContainer = createDiv('', 'player-input-container');


function getPlayer() {
    console.log('running getPlayer');
    const inputContainer = createDiv('', 'input-container');
    const header = createPara('Enter your name', '', 'input-header', 'para');
    const input = createInput('Cpt. Jack Sparrow?', '', 'input-player');
    const btn = createButton('Play', '', 'btn-play');
    appendChildren(inputContainer, [header, input, btn]);
    appendChildren(playerInputContainer, [inputContainer]);
    body.appendChild(playerInputContainer);
}
getPlayer();
