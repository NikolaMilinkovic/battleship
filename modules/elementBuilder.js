// Method for div creation
export function createDiv(classArr = [], id) {
    const div = document.createElement('div');

    if (id) div.setAttribute('id', `${id}`);

    if (classArr) {
        classArr.forEach((className) => {
            div.classList.add(className);
        });
    }


    return div;
}

// Method for paragrapth creation
export function createPara(text = '', classArr = [], id = '', element = 'para') {
    const para = document.createElement(element);

    para.setAttribute('id', `${id}`);
    para.innerHTML = text;

    if (classArr) {
        classArr.forEach((className) => {
            para.classList.add(className);
        });
    }

    return para;
}

// Method for input creation
export function createInput(placeholder = '', classArr = [], id = '') {
    const input = document.createElement('input');

    input.placeholder = placeholder;
    input.setAttribute('id', `${id}`);

    if (classArr) {
        classArr.forEach((className) => {
            input.classList.add(className);
        });
    }

    return input;
}

// Method for button creation
export function createButton(text = '', classArr = [], id = '') {
    const btn = document.createElement('button');
    btn.setAttribute('id', `${id}`);
    btn.innerHTML = text;

    if (classArr) {
        classArr.forEach((className) => {
            btn.classList.add(className);
        });
    }

    return btn;
}

// Method for creating a link element
export function createLink(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    return link;
}

// Method for appending children to parent element
export function appendChildren(parent, children) {
    children.forEach((child) => {
        parent.appendChild(child);
    });

    return parent;
}

// Method for adding event listener
export function addListener(id, callback, listenFor = 'click') {
    document.getElementById(id).addEventListener(listenFor, callback);
}

// Method for adding event listener
export function addThisListener(id, callback, listenFor = 'click') {
    document.getElementById(id).addEventListener(listenFor, () => {
        callback.call(this);
    });
}

export function createImg(src = '', classArr = [], id = '') {
    const img = document.createElement('img');
    img.src = src;
    img.setAttribute('id', id);
    classArr.forEach((className) => {
        img.classList.add(className);
    });

    return img;
}
{ /* <img src="./img/hero-page-svg/background.svg" alt="background" class="" data-speed-x="-0.010" data-speed-y="-0.010" id="para-1"> */ }

export function paraImg(src = '', classArr = ['para'], id = '', dataX = '', dataY = '') {
    const img = document.createElement('img');
    img.src = src;
    img.setAttribute('id', id);
    img.setAttribute('data-speed-x', dataX);
    img.setAttribute('data-speed-y', dataY);

    classArr.forEach((className) => {
        img.classList.add(className);
    });

    return img;
}
