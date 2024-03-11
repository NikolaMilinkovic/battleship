/* eslint-disable no-var */

let enableParallax = true;

export function disablePara() {
    enableParallax = false;
}
export function enablePara() {
    enableParallax = true;
}

function moveBackground(e) {
    if (enableParallax !== true) return;
    const { body } = document;
    const parallaxElements = document.querySelectorAll('.para');

    const centerX = body.offsetWidth / 2;
    const centerY = body.offsetHeight / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate parallax movement for the vectors / png's
    parallaxElements.forEach((element) => {
        const factorX = element.getAttribute('data-speed-x');
        const factorY = element.getAttribute('data-speed-y');

        const translateX = (mouseX - centerX) * factorX;
        const translateY = (mouseY - centerY) * factorY;

        // Apply translation and scaling
        element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
}

(function () {
    // Turns off parallax for devices with a certain width
    if (window.matchMedia('(max-width: 600px)').matches) enableParallax = false;
    if (enableParallax) document.addEventListener('mousemove', moveBackground);
}());
