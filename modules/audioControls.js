const volumeIcons = {
    volHigh: './img/volume-icons/volume-high.svg',
    volHighWhite: './img/volume-icons/volume-high-white.svg',
    volLow: './img/volume-icons/volume-low.svg',
    volLowWhite: './img/volume-icons/volume-low-white.svg',
    volX: './img/volume-icons/volume-x.svg',
    volXWhite: './img/volume-icons/volume-x-white.svg',
};

export function getVolumeIcons() {
    return volumeIcons;
}

export function getIcon() {
    const icon = document.createElement('img');
    icon.classList.add('audio-control');
    icon.alt = 'Volume control icon';
    icon.src = volumeIcons.volXWhite;

    return icon;
}
export function getVolumeSlider() {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.setAttribute('id', 'volume-slider');
    slider.classList.add('display-none');
    slider.classList.add('ui-slider-range-min');
    slider.classList.add('ui-slider-handle');

    return slider;
}
export function getAudioControls(slider, icon) {
    const volumeContainer = document.createElement('div');
    volumeContainer.setAttribute('id', 'volume-container');
    volumeContainer.appendChild(slider);
    volumeContainer.appendChild(icon);
    return volumeContainer;
}

