/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable prefer-destructuring */
import {
    createDiv, createPara, createInput, appendChildren, createButton, paraImg, createImg,
} from './elementBuilder.js';
import Player from './player.js';
import {
    initPlayerBoard, playGame, initAiBoard, getTurn, changeTurn, innitPlayer,
} from './game.js';
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
let playerBoard;
let playerBoardReference;
let axis = 'x';
let hasBattleStarted = false;
// Temp board field click position
let tempFieldX;
let tempFieldY;
// CANNON AUDIO
const cannon = new Audio('./audio/cannon-fire-2s.mp3');
function playCannon() {
    cannon.currentTime = 0;
    cannon.play();
}
// BTN CLICK
const btnClick = new Audio('./audio/btn-click.mp3');
function playbtnClick() {
    btnClick.currentTime = 0;
    btnClick.play();
}
// SHIP SINK JACK AUDIO
let shipSink = new Audio('./audio/ship-sunk-1.mp3');
function shipSinkPlay() {
    const rand = Math.floor(Math.random() * 7);
    shipSink = new Audio(`./audio/ship-sunk-${rand + 1}.mp3`);
    shipSink.currentTime = 0;
    shipSink.play();
}
// Ship drop audio
const shipDrop = new Audio('./audio/ship-drop.wav');
function playShipDrop() {
    shipDrop.currentTime = 0;
    shipDrop.play();
}
// Background fight music
const fightMusic = new Audio('./audio/two-steps-from-hell.mp3');
fightMusic.volume = 0.15;
fightMusic.loop = true;
// MISS AUDIO
const miss1 = new Audio('./audio/miss-1.mp3');
const miss2 = new Audio('./audio/miss-2.mp3');
function playMiss() {
    const rand = Math.floor(Math.random() * 2);
    miss1.currentTime = 0;
    miss2.currentTime = 0;
    if (rand === 1) {
        miss1.play();
    } else {
        miss2.play();
    }
}
// AI REFERENCES
const aiGameboard = initAiBoard();
let aiBoardReference;
// \AI REFERENCES
const battleAmbience = new Audio('./audio/pirate-ship-battle-ambience.mp3');
battleAmbience.volume = 0.15;
battleAmbience.loop = true;
// COMPLIMENT AUDIO ROLL
let complimentAudio = new Audio('./audio/compliment-1.mp3');
function rollCompliment() {
    const rand = Math.floor(Math.random() * 6);
    complimentAudio = new Audio(`./audio/compliment-${rand + 1}.mp3`);
    complimentAudio.currentTime = 0;
    const roll = Math.floor(Math.random() * 6);
    if (roll <= 3) complimentAudio.play();
}

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
const backgroundAudioRunning = false;
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
        complimentAudio.volume = (slider.value / 100);
        cannon.volume = (slider.value / 100) / 4;
        miss1.volume = (slider.value / 100) / 3;
        miss2.volume = (slider.value / 100) / 3;
        shipDrop.volume = (slider.value / 100);
        btnClick.volume = (slider.value / 100);
        shipSink.volume = (slider.value / 100);
        if (hasBattleStarted) {
            if (battleAmbience.paused) {
                battleAmbience.play();
                battleAmbience.volume = (slider.value / 100) / 5;
            } else {
                battleAmbience.volume = (slider.value / 100) / 5;
            }
        }
        if (hasBattleStarted) {
            if (fightMusic.paused) {
                fightMusic.play();
                fightMusic.volume = (slider.value / 100) / 3;
            } else {
                fightMusic.volume = (slider.value / 100) / 3;
            }
        }

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
        battleAmbience.volume = 0;
        fightMusic.volume = 0;
        complimentAudio.volume = 0;
        cannon.volume = 0;
        miss1.volume = 0;
        miss2.volume = 0;
        shipDrop.volume = 0;
        btnClick.volume = 0;
        shipSink.volume = 0;
        setVol(audio);
    }
});
// Handles changing the sould levels via range input for the app
slider.addEventListener('change', (event) => {
    setVol(audio);
    if (audio.volume >= 0.5) icon.src = volumeIcons.volHighWhite;
    if (audio.volume > 0 && audio.volume < 0.5) icon.src = volumeIcons.volLowWhite;
    if (audio.volume === 0) icon.src = volumeIcons.volXWhite;
    if (hasBattleStarted) {
        if (battleAmbience.paused) {
            battleAmbience.play();
            battleAmbience.volume = (slider.value / 100) / 5;
        } else {
            battleAmbience.volume = (slider.value / 100) / 5;
        }
    }
    if (hasBattleStarted) {
        if (fightMusic.paused) {
            fightMusic.play();
            fightMusic.volume = (slider.value / 100) / 3;
        } else {
            fightMusic.volume = (slider.value / 100) / 3;
        }
    }
    cannon.volume = (slider.value / 100) / 4;
    miss1.volume = (slider.value / 100) / 3;
    miss2.volume = (slider.value / 100) / 3;
    shipDrop.volume = (slider.value / 100);
    btnClick.volume = (slider.value / 100);
    shipSink.volume = (slider.value / 100);
    complimentAudio.volume = (slider.value / 100);
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
        playerName = inputName.value;
        btnPlay.disabled = true;
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
const shipsPositionedText = [
    {
        text: 'Great, that should do it, with this brilliant plan those bastards won\'t know what hit em! \nI shall inform each vessel of their position. ',
        character: 'Jolly Roger Jack',
    },
];
const shipsPositionedDialogue = [
    './audio/ships-placed-dialogue.mp3',
];
const shipsRandomizedText = [
    {
        text: 'Don\'t worry captain, I will plan out the fleet positions and set everything up for the upcoming battle. Those bastards won\'t know what hit em!',
        character: 'Jolly Roger Jack',
    },
];
const shipsRandomizedAudio = [
    './audio/ship-placed-random-dialogue.mp3',
];
const battleStartText = [
    {
        text: 'Captain! The enemy has boarded our ship! \nI will hold them off for as long as I can while you navigate our cannons to hit their main fleet. If we can sink those ships the tide of this battle will turn in our favour!',
        character: 'Jolly Roger Jack',
    },
    {
        text: 'Take control of the battle by marking the firing positions on the map. \nGood luck captain!',
        character: 'Jolly Roger Jack',
    },
];
const battleStartAudio = [
    './audio/pirate-battle-1.mp3',
    './audio/pirate-battle-2.mp3',
];

// Player fleet organization path
function planFleet() {
    const parentEl = document.getElementById('dialogue-container');
    fadeOutElements(parentEl)
        .then(() => {
            clearElChildren(parentEl);
            playerBoard = initPlayerBoard(playerName);
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
            playerBoard = initPlayerBoard(playerName);
            return getRandomizedMap(parentEl);
        })
        .then(() => {
            playAudioSequence(shipsRandomizedAudio, shipsRandomizedText, parentEl);
            parentEl.appendChild(playerBoardReference);
            playerBoardReference.classList.add('cabin-map-display');
            toShipTransition(8000); // Needs to be 8000
        })
        .catch((error) => {
            console.error('Error during dialogue box removal:', error);
        });
}

function transitionToShip(timer) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.setAttribute('id', 'to-ship-transition-screen');
            div.classList.add('fade-to-black');
            body.appendChild(div);

            setTimeout(() => {
                const text = document.createElement('p');
                text.setAttribute('id', 'following-day-text');
                text.innerHTML = 'The following day...';
                text.classList.add('zoom-fade-in-out');
                div.appendChild(text);
                setTimeout(() => {
                    resolve(div);
                }, 2500);
            }, 2500);
        }, timer);
    });
}


// Method for displaying map for ship placement
function displayMap(parentEl) {
    const pBoardContainer = document.createElement('div');
    pBoardContainer.classList.add('player-board-container');
    pBoardContainer.setAttribute('id', 'player-board-container');
    playerBoard.init();
    const grid = buildGrid();
    pBoardContainer.appendChild(grid);
    parentEl.appendChild(pBoardContainer);
    pBoardContainer.classList.add('cabin-map-display');
}
function getRandomizedMap(parentEl) {
    return new Promise((resolve, reject) => {
        const pBoardContainer = document.createElement('div');
        pBoardContainer.classList.add('player-board-container');
        pBoardContainer.setAttribute('id', 'player-board-container');
        playerBoard.init();
        playerBoard.placeShipsRandomly()
            .then(() => {
                const grid = buildGrid();
                pBoardContainer.appendChild(grid);
                playerBoardReference = pBoardContainer;
                resolve();
            })
            .catch((error) => {
                console.error('Error during dialogue box removal:', error);
                reject(error);
            });
    });
}
// Method for displaying drag & drop ships
function positionShips(parentEl) {
    const container = createDiv([], 'place-ship-container');
    const carrier = createShip(5, 'Carrier');
    const battleship = createShip(4, 'Battleship');
    const cruiser = createShip(3, 'Cruiser');
    const submarine = createShip(3, 'Submarine');
    const destroyer = createShip(2, 'Destroyer');
    const axisBtn = getAxisControl();
    appendChildren(container, [carrier, battleship, cruiser, submarine, destroyer, axisBtn]);
    parentEl.appendChild(container);
    container.classList.add('cabin-map-display');
}
function getAxisControl() {
    const btn = createButton('Axis: X', ['cabin-btn'], 'btn-toggle-axis');
    btn.addEventListener('click', () => {
        playbtnClick();
        toggleAxis();
    });
    return btn;
}
function toggleAxis() {
    const btn = document.getElementById('btn-toggle-axis');
    if (axis === 'x') {
        btn.innerHTML = 'Axis: Y';
        const ships = document.querySelectorAll('.place-ship');
        ships.forEach((ship) => {
            ship.classList.add('place-ship-y');
        });
        axis = 'y';
    } else {
        const ships = document.querySelectorAll('.place-ship');
        ships.forEach((ship) => {
            ship.classList.remove('place-ship-y');
        });
        btn.innerHTML = 'Axis: X';
        axis = 'x';
    }
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
// placeShip(shipType, clickValue, orientation, cordX, cordY);

let shipType = '';
let clickValue = '';
function setShipType(type) {
    shipType = type;
}
function setClickValue(value) {
    clickValue = value;
}
function createShip(size, type) {
    const ship = createDiv(['place-ship'], '');
    ship.setAttribute('draggable', 'true');
    for (let i = 0; i < size; i++) {
        const shipImg = getShipTypeImg(type);
        const dataField = createDiv(['place-ship-data-field', `${shipImg}`], '');
        dataField.setAttribute('clickValue', i);
        dataField.setAttribute('shipType', type);
        dataField.addEventListener('mousedown', () => {
            setClickValue(dataField.getAttribute('clickValue'));
            setShipType(dataField.getAttribute('shipType'));
        });
        ship.appendChild(dataField);
    }
    ship.addEventListener('dragstart', getDragEl);
    ship.addEventListener('dragend', dropEl);
    return ship;
}
function getShipTypeImg(type) {
    if (type === 'Carrier') {
        return 'carrier';
    }
    if (type === 'Battleship') {
        return 'battleship';
    }
    if (type === 'Cruiser') {
        return 'cruiser';
    }
    if (type === 'Submarine') {
        return 'submarine';
    }
    if (type === 'Destroyer') {
        return 'destroyer';
    }
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
        button.addEventListener('click', playbtnClick);
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

    const objList = playerBoard.fields;

    objList.forEach((obj) => {
        const field = document.createElement('div');
        field.classList.add('default-field');
        field.setAttribute('x-cord', `${obj.cordX}`);
        field.setAttribute('y-cord', `${obj.cordY}`);
        if (obj.hasShip) {
            const type = obj.shipType;
            field.classList.add('field-with-ship');
            field.classList.add(`${getShipTypeImg(type)}`);
        }
        if (obj.isShot) field.classList.add('field-shot');
        if (obj.shipType !== null) console.log('there is a ship here!');

        field.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        field.addEventListener('drop', (event) => {
            event.preventDefault();
            if (draggedEl) {
                const x = parseInt(event.target.getAttribute('x-cord'));
                const y = parseInt(event.target.getAttribute('y-cord'));
                if (playerBoard.placeShip(shipType, clickValue, axis, x, y) === true) {
                    event.target.appendChild(draggedEl);
                    updateBoard();
                    setTimeout(checkForUnplacedShips, 1000);
                    playShipDrop();
                    rollCompliment();
                }
            }
        });
        board.appendChild(field);
    });
    return board;
}

function checkForUnplacedShips() {
    const shipContainer = document.getElementById('place-ship-container');
    if (shipContainer.childNodes.length === 1) {
        const parentEl = document.getElementById('dialogue-container');
        const boardContainer = document.querySelector('.player-board-container');
        boardContainer.classList.remove('cabin-map-display');
        shipContainer.classList.remove('cabin-map-display');
        boardContainer.classList.add('cabin-map-remove');
        shipContainer.classList.add('cabin-map-remove');

        // Continues cabin dialogue
        setTimeout(() => {
            playAudioSequence(shipsPositionedDialogue, shipsPositionedText, parentEl)
                .then(() => {
                    toShipTransition(200);
                });
        }, 750);
    }
}
function updateBoard() {
    const boardContainer = document.querySelector('.player-board-container');
    clearElChildren(boardContainer);

    const newBoard = buildGrid();
    boardContainer.appendChild(newBoard);
    playerBoardReference = newBoard;
}


// Ship vector objects used for appending them to vector parent
const shipDeckVectorEls = [
    {
        id: 'vector-1',
        class: ['vector'],
        src: './img/ship-deck/sky.svg',
    },
    {
        id: 'vector-7',
        class: ['vector', 'move-cloud-2'],
        src: './img/ship-deck/cloud-2.svg',
    },
    {
        id: 'vector-4',
        class: ['vector', 'ship-sailing-3'],
        src: './img/ship-deck/ship-white-damaged-small.svg',
    },
    {
        id: 'vector-3',
        class: ['vector', 'ship-sailing-2'],
        src: './img/ship-deck/ship-damaged-small.svg',
    },
    {
        id: 'vector-2',
        class: ['vector', 'ship-sailing-1'],
        src: './img/ship-deck/ship-damaged.svg',
    },
    {
        id: 'vector-5',
        class: ['vector'],
        src: './img/ship-deck/water.svg',
    },
    {
        id: 'vector-6',
        class: ['vector', 'move-cloud-1'],
        src: './img/ship-deck/cloud-1.svg',
    },
    {
        id: 'vector-8',
        class: ['vector', 'move-cloud-cluster'],
        src: './img/ship-deck/cloud-cluster.svg',
    },
    {
        id: 'vector-9',
        class: ['vector', 'move-deck'],
        src: './img/ship-deck/deck.svg',
    },
    {
        id: 'vector-10',
        class: ['vector', 'move-deck'],
        src: './img/ship-deck/cannonball-right.svg',
    },
    {
        id: 'vector-11',
        class: ['vector', 'move-deck', 'pirate-idle'],
        src: './img/ship-deck/pirate-light.svg',
    },

];


function toShipTransition(timer) {
    const dialogueContainer = document.getElementById('dialogue-container');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            transitionToShip(timer)
                .then((div) => {
                    removePara();
                    clearElChildren(dialogueContainer);
                    setTimeout(() => {
                        div.classList.add('fade-out-2s');
                        fightMusic.volume = (slider.value / 100) / 3;
                        battleAmbience.volume = (slider.value / 100) / 5;
                        fightMusic.play();
                        battleAmbience.play();
                        hasBattleStarted = true;
                        resolve();
                    }, 300);
                })
                .then(() => {
                    appendVectors(paraContainer, shipDeckVectorEls);
                    return new Promise((innerResolve, innerReject) => {
                        setTimeout(() => {
                            playAudioSequence(battleStartAudio, battleStartText, dialogueContainer).then(() => {
                                innerResolve();
                            });
                        }, 800);
                    });
                })
                .then(() => new Promise((innerResolve, innerReject) => {
                    setTimeout(() => {
                        removeDialogueBox(dialogueContainer);
                        const pirate = document.getElementById('vector-11');

                        // Gets current element position and updates it as translate
                        const position = pirate.getBoundingClientRect();
                        const posX = position.x;
                        const posY = position.y;
                        pirate.style.transform = `translate(${posX}px, ${posY}px)`;
                        pirate.classList.add('fade-out-remove');
                        innerResolve();
                    }, 1000);
                }))
                .then(() => new Promise((innerResolve, innerReject) => {
                    setTimeout(() => {
                        clearElChildren(dialogueContainer);
                        setTimeout(() => {
                            innerResolve();
                        }, 100);
                    }, 1000);
                }))
                .then(() => new Promise((innerResolve, innerReject) => {
                    gameDisplay(playerName);
                    displayAiMap();
                    innitPlayer(playerName);
                    updatePlayerBoard(document.getElementById('player-gameboard'));
                }))
                .catch((error) => {
                    console.error('Error during dialogue box removal:', error);
                });
        }, 500);
    });
}
// Displays the boards
function gameDisplay(playerName) {
    const content = createDiv('', 'game-content');

    const playerContainer = createDiv('', 'player-container');
    const playerLabel = createPara(`Captain ${playerName} fleet`, ['gameboard-label'], '', 'h2');
    const playerShips = createDiv('', 'ships-player');
    const playerGrid = createDiv('', 'player-gameboard');
    playerGrid.appendChild(playerBoardReference);
    appendChildren(playerContainer, [playerLabel, playerShips, playerGrid]);


    const aiContainer = createDiv('', 'ai-container');
    const aiLabel = createPara('Captain Blackbeard Bones', ['gameboard-label'], '', 'h2');
    const aiShips = createDiv('', 'ships-ai');
    const aiGrid = createDiv('', 'ai-gameboard');
    aiGrid.classList.add('ai-board-container');
    appendChildren(aiContainer, [aiLabel, aiShips, aiGrid]);

    appendChildren(content, [playerContainer, aiContainer]);
    body.appendChild(content);
    content.classList.add('cabin-map-display');
}
// Method for creating and displayin the AI map
function displayAiMap() {
    const aiGrid = document.getElementById('ai-gameboard');
    aiBoardReference = buildAiGrid(aiGameboard);
    aiBoardReference.classList.add('cabin-map-display');
    aiGrid.appendChild(aiBoardReference);
}


function buildAiGrid(userGameboard) {
    const board = createDiv([], 'ai-board');

    const objList = userGameboard.fields;

    objList.forEach((obj) => {
        const field = document.createElement('div');
        field.classList.add('default-field');
        field.setAttribute('x-cord', `${obj.cordX}`);
        field.setAttribute('y-cord', `${obj.cordY}`);

        if (obj.isShot === true) {
            if (obj.hasShip) {
                field.classList.add('field-hit');
            } else {
                field.classList.add('field-miss');
            }
        }
        field.addEventListener('click', (event) => {
            const aiBoard = document.getElementById('ai-gameboard');
            if (aiBoard.classList.contains('disabled')) {
                event.preventDefault();
                return;
            }
            const turn = getTurn();
            const x = parseInt(event.target.getAttribute('x-cord'));
            const y = parseInt(event.target.getAttribute('y-cord'));
            tempFieldX = x;
            tempFieldY = y;
            if (field.classList.contains('field-miss') || field.classList.contains('field-hit') || turn !== 'player') {
                return false;
            }

            // Player turn
            let result = aiGameboard.receiveAttack(x, y);
            aiBoard.classList.add('board-disabled');
            updateAiBoard(document.getElementById('ai-gameboard'));
            // Handles player click result
            if (result === 'Ship lost!') {
                const clickX = event.clientX;
                const clickY = event.clientY;

                // Displays the ship lost message
                announceShipLost(clickX, clickY);
                shipSinkPlay();
            }
            if (result === 'Game over!') {
                alert(`Game over, ${playerName} wins!`);
            }


            // Ai turn
            changeTurn();
            playGame(playerBoard, aiGameboard);

            // Check to see if player lost
            result = playerBoard.isAllSunk();
            if (result === true) { alert('YOU LOST!'); }
            setTimeout(() => {
                updatePlayerBoard(document.getElementById('player-gameboard'));
                aiBoard.classList.remove('board-disabled');
            }, 550);
        });
        board.appendChild(field);
    });
    return board;
}

// Plays shot and miss sound upon board click
document.addEventListener('click', (event) => {
    // Has ship check
    const objList = aiGameboard.fields;
    const x = tempFieldX;
    const y = tempFieldY;
    const field = objList.find((obj) => obj.cordX === x && obj.cordY === y);

    // Parent & Target class list check
    const target = event.target;
    const parent = target.parentNode;
    if (parent && parent.id === 'ai-board') {
        if (!target.classList.contains('field-miss') && !target.classList.contains('field-hit')) {
            if (target.classList.contains('default-field')) {
                playCannon();
                if (!field.hasShip) playMiss();
            }
        }
    }
});

// Method that updates the AI board
function updateAiBoard(boardContainer) {
    clearElChildren(boardContainer);

    const newBoard = buildAiGrid(aiGameboard);
    boardContainer.appendChild(newBoard);
    aiBoardReference = newBoard;
}

// Method that updated player board
function updatePlayerBoard(parent) {
    const board = createDiv([], 'player-board');
    const objList = playerBoard.fields;

    objList.forEach((obj) => {
        const field = document.createElement('div');
        field.classList.add('default-field');
        field.setAttribute('x-cord', `${obj.cordX}`);
        field.setAttribute('y-cord', `${obj.cordY}`);

        if (obj.hasShip === true) {
            const type = obj.shipType;
            field.classList.add('field-with-ship');
            field.classList.add(`${getShipTypeImg(type)}`);
        }
        if (obj.isShot === true) {
            if (obj.hasShip) {
                const type = obj.shipType;
                field.classList.remove(`${getShipTypeImg(type)}`);
                field.classList.add('field-hit');
            } else {
                field.classList.add('field-miss');
            }
        }
        board.appendChild(field);
    });

    clearElChildren(parent);
    parent.appendChild(board);
}

// Removes all dialogue boxes from an parent element
function removeDialogueBox(parentEl) {
    const children = parentEl.children;
    for (let i = 0; i < children.length; i++) {
        children[i].classList.add('remove-dialogue-box');
    }
}
// Removes all elements with class .para
function removePara() {
    const paraEls = document.querySelectorAll('.para');
    paraEls.forEach((para) => {
        para.remove();
    });
}

// Method for appending vectors to the parent element
function appendVectors(parent, vectors) {
    vectors.forEach((vector) => {
        const src = vector.src;
        const elClass = vector.class;
        const id = vector.id;
        const img = createImg(src, elClass, id);
        parent.appendChild(img);
    });
}

// Method for display ship lost text
function announceShipLost(screenX, screenY) {
    const container = createDiv('', 'ship-lost-container');
    const para = createPara('Ship destroyed!', '', 'ship-lost-para');
    container.style.setProperty('--posX', `${screenX}px`);
    container.style.setProperty('--posY', `${screenY}px`);
    container.appendChild(para);
    container.classList.add('ship-destroyed-float');
    body.appendChild(container);

    setTimeout(() => {
        container.remove();
    }, 3000);
}
