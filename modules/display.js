import {
    createDiv, createPara, createInput, appendChildren, createButton, paraImg,
} from './elementBuilder.js';
import Player from './player.js';
import gameStart from './game.js';
import { enablePara, disablePara } from './para.js';

const { body } = document;
const form = document.getElementById('form');
const formContainer = document.getElementById('form-container');
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
    formContainer.classList.add('transition-form-container');
    for (let i = 1; i < 11; i++) {
        const el = document.getElementById(`para-${i}`);
        el.classList.add(`transition-para-${i}`);
    }
    body.classList.add('sunrise-background-color');
    setTimeout(clearDisplay, 2700);
    setTimeout(displayShipCabin, 2720);
}

function displayShipCabin() {
    const paraEls = [];
    const imgArr = [
        { src: './img/pirate-cabin/background.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/floor-bottle.svg', x: 0.01, y: 0.005 },
        { src: './img/pirate-cabin/globe.svg', x: 0, y: 0 },
        { src: './img/pirate-cabin/pirate.svg', x: 0.015, y: 0 },
    ];
    for (let i = 1; i <= imgArr.length; i++) {
        const img = paraImg(imgArr[i - 1].src, ['para', 'display-none'], `para-cabin-${i}`, imgArr[i - 1].x, imgArr[i - 1].y);
        paraEls.push(img);
    }

    appendChildren(paraContainer, paraEls);
    paraEls.forEach((paraEl) => {
        paraEl.classList.add('cabin-fade-in-transition');
        paraEl.classList.remove('display-none');
    });

    setTimeout(() => {
        const pirate = document.getElementById('para-cabin-4');
        const bottle = document.getElementById('para-cabin-2');
        pirate.classList.add('pirate-idle');
        bottle.classList.add('bottle-rolling');
    }, 2900);
    setTimeout(() => {
        body.appendChild(createDiv(['ship-cabin-dialogue-container'], 'dialogue-container'));
        const parentEl = document.getElementById('dialogue-container');
        playAudioSequence(greetDialogues, greetText, parentEl);
    }, 3500);
}

function getDialogueBox(parentEl, textFile) {
    const box = createDiv(['dialogue-blob'], '');
    const charName = createPara('', ['char-name-label'], '', 'para');
    const para = createPara('', ['dialogue-box-text'], '', 'para');
    box.appendChild(charName);
    box.appendChild(para);
    parentEl.appendChild(box);
    printText(para, charName, textFile);
}
function printText(para, charName, textFile) {
    const text = [...textFile.text];

    let delay = 0;
    charName.innerHTML += `${textFile.character}<br>`;
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            if (text[i] === '\n') {
                para.innerHTML += '<br>';
            }
            para.innerHTML += text[i];
        }, delay);
        delay += 35;
    }
}
const greetText = [
    {
        text: 'Good mornin captain. \nThe fleet of captain Blackbeard Bones has been spotted to have entered the bay.\nAt this point our encounter is inevitable!',
        character: 'Jolly Roger Jack',
    },
    {
        text: 'Abandon ship! Abandon ship!',
        character: 'Scaredy Parrot Pete',
    },
    {
        text: 'Shut it you cowardly chicken! \nAs I was saying, we should prepare our fleet for battle, would you like to plan out our fleet positions now?',
        character: 'Jolly Roger Jack',
    },
];

const greetDialogues = [
    './audio/pirate-greet-1.mp3',
    './audio/parrot-abandon.mp3',
    './audio/pirate-greet-2.mp3',
];

// Method for playing audio files in sequence
function playAudioSequence(audioFiles, textFiles, parentEl) {
    let i = 0;
    function playNextAudio() {
        const audio = new Audio(audioFiles[i]);
        getDialogueBox(parentEl, textFiles[i]);
        audio.addEventListener('ended', () => {
            i++;
            if (i < audioFiles.length) {
                playNextAudio();
            }
        });
        audio.play();
    }

    playNextAudio();
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


