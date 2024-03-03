(function () {
    const parallaxElements = document.querySelectorAll('.para');
    const { body } = document;

    document.addEventListener('mousemove', moveBackground);

    // Turns off parallax for device with certain width
    if (window.matchMedia('(max-width: 600px)').matches) {
        return false;
    }
    function moveBackground(e) {
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
}());
