//carrusel
document.querySelectorAll('.carousel').forEach(carousel => {
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const images = carousel.querySelector('.carousel-images');
    const imageCount = images.children.length;
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        images.style.transform = `translateX(${offset}%)`;
    }

    function showNextImage() {
        currentIndex = (currentIndex < imageCount - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageCount - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', showNextImage);

    // Mover automáticamente el carrusel
    setInterval(showNextImage, 5000); // Cambia la imagen cada 3 segundos
});