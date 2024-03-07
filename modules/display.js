/* eslint-disable operator-linebreak */
/* eslint-disable prefer-destructuring */
import {
    createDiv, createPara, createInput, appendChildren, createButton, paraImg,
} from './elementBuilder.js';
import Player from './player.js';
import gameStart from './game.js';
import { enablePara, disablePara } from './para.js';
import {
    getVolumeSlider, getIcon, getAudioControls, getVolumeIcons,
} from './audioControls.js';

const { body } = document;
const form = document.getElementById('form');
const formContainer = document.getElementById('form-container');
const paraContainer = document.getElementById('parallax-container');
const btnPlay = document.getElementById('btn-play');
const inputName = document.getElementById('input-player');
btnPlay.addEventListener('click', play);
let draggedEl;
let playerName;

// Prevents the form default behvaiour
form.addEventListener('submit', preventDefault);
function preventDefault(event) {
    event.preventDefault();
}
// End of prevent default code

// ================================[AUDIO CONTROLS]================================
// Night ambience sound
let audio = new Audio('./audio/night-ambience.mp3');
audio.loop = true;
audio.volume = 0.5;
let cachedAudioVolume = audio.volume;
let isAudioRunning = false;
let inCabin = false;
const volumeIcons = getVolumeIcons();
const icon = getIcon();
const slider = getVolumeSlider();
slider.value = 0;
const audioControls = getAudioControls(slider, icon);

function playAudio() {
    audio.play();
}
function pauseAudio(audioEl) {
    let volume = slider.value / 100;
    let timer = 0;
    for (let i = 0; i < volume / 0.1; i++) {
        setTimeout(() => {
            volume -= 0.1;
            audioEl.volume = volume;
        }, timer);
        timer += 600;
    }
    if (volume <= 0) audio.pause();
}

// Handles Muting and Unmuting the sound for application
icon.addEventListener('click', () => {
    if (icon.src.toString().includes(volumeIcons.volX.slice(1)) ||
        icon.src.toString().includes(volumeIcons.volXWhite.slice(1))) {
        audio.volume = cachedAudioVolume;
        slider.value = cachedAudioVolume * 100;
        if (audio.volume >= 0.5) icon.src = volumeIcons.volHighWhite;
        if (audio.volume > 0 && audio.volume < 0.5) icon.src = volumeIcons.volLowWhite;
        if (isAudioRunning === false && inCabin === false) {
            playAudio();
            isAudioRunning = true;
        }
    } else {
        icon.src = volumeIcons.volXWhite;
        cachedAudioVolume = audio.volume;
        audio.volume = 0;
        slider.value = 0;
        setVol(audio);
    }
});
// Handles changing the sould levels via range input for the app
slider.addEventListener('change', (event) => {
    setVol(audio);
    if (audio.volume >= 0.5) icon.src = volumeIcons.volHighWhite;
    if (audio.volume > 0 && audio.volume < 0.5) icon.src = volumeIcons.volLowWhite;
    if (audio.volume === 0) icon.src = volumeIcons.volXWhite;
});
// Handles displaying volume input slider
audioControls.addEventListener('mouseenter', () => {
    slider.classList.add('slider-show');
    slider.classList.remove('display-none');
});
// Handles hiding volume input slider
audioControls.addEventListener('mouseleave', () => {
    slider.classList.remove('slider-show');
    slider.classList.add('display-none');
});
// Method for setting the current audio track volume to the slider value
function setVol(audioEl) {
    audioEl.volume = slider.value / 100;
}
body.appendChild(audioControls);
// ================================[\AUDIO CONTROLS]================================


// ================================[TRANSITION INTO SHIP CABIN]================================
// Welcome screen logic & transition into game
function play(event) {
    if (event.type === 'click' || event.type === 'Enter') {
        preventDefault(event);
        if (!checkNameInput()) return;
        disablePara();
        transitionPage();
        pauseAudio(audio);
        audio.loop = false;
        inCabin = true;
    }
}

function checkNameInput() {
    if (!inputName.value) {
        inputName.placeholder = 'Please enter your name.';
        return false;
    }
    return true;
}

// Handles transitioning from welcome page into ship cabin page
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

// Handles displaying ship cabin page
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

    // Adds bottle and pirate idle animations
    setTimeout(() => {
        const pirate = document.getElementById('para-cabin-4');
        const bottle = document.getElementById('para-cabin-2');
        pirate.classList.add('pirate-idle');
        bottle.classList.add('bottle-rolling');
    }, 2900);

    // Starts dialogue
    setTimeout(() => {
        body.appendChild(createDiv(['ship-cabin-dialogue-container'], 'dialogue-container'));
        startCabinDialogue();
    }, 3500);
}
// ================================[\TRANSITION INTO SHIP CABIN]================================


// ================================[SHIP CABIN DIALOGUE LOGIC]================================
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
const positionFleetBtns = [
    {
        text: 'Plan fleet positions',
        classes: ['cabin-btn'],
        id: 'btn-organize-fleet',
        clickMethod: planFleet,
    },
    {
        text: 'Let Jack plan the positions',
        classes: ['cabin-btn'],
        id: 'btn-randomize-fleet',
        clickMethod: randomizeFleet,
    },
];

// Player fleet organization path
function planFleet() {
    const parentEl = document.getElementById('dialogue-container');
    fadeOutElements(parentEl)
        .then(() => {
            clearElChildren(parentEl);
            displayMap(parentEl);
            positionShips(parentEl);
        })
        .catch((error) => {
            console.error('Error during dialogue box removal:', error);
        });
}

// Randomize path
function randomizeFleet() {
    const parentEl = document.getElementById('dialogue-container');
    fadeOutElements(parentEl)
        .then(() => {
            clearElChildren(parentEl);
        })
        .catch((error) => {
            console.error('Error during dialogue box removal:', error);
        });
}

// Method for displaying map for ship placement
function displayMap(parentEl) {
    const grid = buildGrid();
    parentEl.appendChild(grid);
    grid.classList.add('cabin-map-display');
}
// Method for displaying drag & drop ships
function positionShips(parentEl) {
    const container = createDiv([], 'place-ship-container');
    const carrier = createShip(5, 'Carrier');
    const battleship = createShip(4, 'Battleship');
    const cruiser = createShip(3, 'Cruiser');
    const submarine = createShip(3, 'Submarine');
    const destroyer = createShip(2, 'Destroyer');
    appendChildren(container, [carrier, battleship, cruiser, submarine, destroyer]);
    parentEl.appendChild(container);
    container.classList.add('cabin-map-display');
}

// Method for handling cabin dialogue,
// Takes dialogue and text information and sends it to respective handling methods
function startCabinDialogue() {
    const parentEl = document.getElementById('dialogue-container');
    playAudioSequence(greetDialogues, greetText, parentEl)
        .then(() => {
            getDialogueBtns(parentEl, positionFleetBtns);
        })
        .catch((error) => {
            console.error('Error during audio playback:', error);
        });
}
// GENERAL method for playing audio files in sequence
function playAudioSequence(audioFiles, textFiles, parentEl) {
    return new Promise((resolve, reject) => {
        let i = 0;
        function playNextAudio() {
            audio = new Audio(audioFiles[i]);
            setVol(audio);
            getDialogueBox(parentEl, textFiles[i]);
            audio.addEventListener('ended', () => {
                i++;
                if (i < audioFiles.length) {
                    playNextAudio();
                } else {
                    resolve();
                }
            });
            audio.play();
        }
        playNextAudio();
    });
}
// ================================[\SHIP CABIN DIALOGUE LOGIC]================================


// =============================[ DRAG AND DROP LOGIC ]=============================
function createShip(size, type) {
    const ship = createDiv(['place-ship'], '');
    ship.setAttribute('draggable', 'true');
    for (let i = 0; i < size; i++) {
        const dataField = createDiv(['place-ship-data-field'], '');
        dataField.setAttribute('clickValue', i);
        dataField.setAttribute('shipType', type);
        dataField.addEventListener('mousedown', () => {
            console.log(dataField.getAttribute('clickValue'));
            console.log(dataField.getAttribute('shipType'));
        });
        ship.appendChild(dataField);
    }
    ship.addEventListener('dragstart', getDragEl);
    ship.addEventListener('dragend', dropEl);
    return ship;
}

function getDragEl() {
    draggedEl = event.target;
}
function dropEl() {
    draggedEl = null;
}
// =============================[ \DRAG AND DROP LOGIC ]=============================


// ==========================[DISPLAY DIALOGUE BOXES GENERAL METHODS]==========================
// Fades out all children elements and display:none them
function fadeOutElements(parentEl) {
    return new Promise((resolve, reject) => {
        const children = parentEl.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.add('fade-out');
        }
        setTimeout(() => resolve(), 1000);
    });
}
// Displays dialogue box and calls for printText method
function getDialogueBox(parentEl, textFile) {
    const box = createDiv(['dialogue-blob'], '');
    const charName = createPara('', ['char-name-label'], '', 'para');
    const para = createPara('', ['dialogue-box-text'], '', 'para');
    box.appendChild(charName);
    box.appendChild(para);
    parentEl.appendChild(box);
    printText(para, charName, textFile);
}
// Prints out text in the dialogue box
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

// Method for displaying buttons in dialogue box
// btnAttributes is an object with all button data
function getDialogueBtns(parentEl, btnAttributes) {
    const box = createDiv(['dialogue-blob', 'dialogue-btns'], '');
    btnAttributes.forEach((btn) => {
        const button = createButton(btn.text, btn.classes, btn.id);
        button.addEventListener('click', btn.clickMethod);
        box.appendChild(button);
    });

    parentEl.appendChild(box);
}
// ==========================[\DISPLAY DIALOGUE BOXES GENERAL METHODS]==========================


// ==========================[OTHER GENERAL METHODS]==========================
function clearDisplay() {
    while (paraContainer.firstChild) {
        paraContainer.firstChild.remove();
    }
}
function clearElChildren(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}
// ==========================[\OTHER GENERAL METHODS]==========================


function buildGrid() {
    const board = createDiv([], 'player-board');
    for (let y = 9; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
            const field = document.createElement('div');
            field.classList.add('default-field');
            field.setAttribute('x-cord', `${x}`);
            field.setAttribute('y-cord', `${y}`);

            field.addEventListener('dragover', (event) => {
                event.preventDefault();
            });
            field.addEventListener('drop', (event) => {
                event.preventDefault();
                if (draggedEl) {
                    event.target.appendChild(draggedEl);
                }
            });
            board.appendChild(field);
        }
    }
    return board;
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


