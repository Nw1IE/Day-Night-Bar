let currentIndex = 0; 
let totalSlides = 0;
let autoSlideInterval = null;
let isTransitioning = false;
let transitionSafetyTimer = null;
let keydownHandler = null;

export function renderSlider() {
    const sliderContainer = document.getElementById('slider-container');
    if (!sliderContainer) return;

    sliderContainer.innerHTML = `
        <section class="cocktail-slider-section">
            <section class="container">
                <section class="slider-header">
                    <h2 class="section-title">Наши шедевры</h2>
                    <section class="slider-nav">
                        <button class="nav-btn prev" id="prevBtn" aria-label="Предыдущий слайд"><i class="fas fa-chevron-left"></i></button>
                        <button class="nav-btn next" id="nextBtn" aria-label="Следующий слайд"><i class="fas fa-chevron-right"></i></button>
                    </section>
                </section>
                
                <section class="slider-container" style="overflow: hidden; width: 100%; touch-action: pan-y;">
                    <section class="slider-track" id="sliderTrack" style="display: flex; cursor: grab; user-select: none;">
                        <article class="slide">
                            <img src="./images/1.jpg" width="300" height="400" alt="Мартини" fetchpriority="high" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Мартини</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/2.jpg" width="300" height="400" alt="Апероль Спритц" fetchpriority="high" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Апероль Спритц</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/3.jpg" width="300" height="400" alt="Виски" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Виски</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/4.jpg" width="300" height="400" alt="Уиски Сауэр" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Уиски Сауэр</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/5.jpg" width="300" height="400" alt="Космополитен" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Космополитен</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/6.jpg" width="300" height="400" alt="Экзотический Мартини" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Экзотический Мартини</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/7.jpg" width="300" height="400" alt="Космополитен" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Космополитен</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/8.jpg" width="300" height="400" alt="Яблочный Мартини" decoding="async" draggable="false">
                            <section class="slide-info"><h3>Яблочный Мартини</h3></section>
                        </article>
                    </section>
                </section>
            </section>
        </section>
    `;

    preloadRemainingImages();
    initSlider(); 
}

function preloadRemainingImages() {
    for (let i = 3; i <= 8; i++) {
        const img = new Image();
        img.src = `./images/${i}.jpg`;
    }
}

function getSlideDimensions() {
    const sliderTrack = document.getElementById('sliderTrack');
    const slides = sliderTrack ? sliderTrack.querySelectorAll('.slide') : [];
    if (!slides.length) return { slideWidth: 300, gap: 20 };
    const targetSlide = slides[0];
    const slideWidth = targetSlide.getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(sliderTrack);
    const gap = parseFloat(computedStyle.gap) || parseFloat(computedStyle.columnGap) || 0;
    return { slideWidth, gap };
}

export function initSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderContainer = document.getElementById('slider-container');

    let slides = sliderTrack ? sliderTrack.querySelectorAll('.slide') : [];
    if (!slides.length || !sliderTrack) return;

    totalSlides = slides.length;
    currentIndex = 0; 
    updatePosition(false);

    if (nextBtn) {
        nextBtn.onclick = () => {
            if (isTransitioning) return;
            nextSlide();
            resetAutoSlide(sliderContainer);
        };
    }

    if (prevBtn) {
        prevBtn.onclick = () => {
            if (isTransitioning) return;
            prevSlide();
            resetAutoSlide(sliderContainer);
        };
    }

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    sliderTrack.addEventListener('pointerdown', (e) => {
        if (isTransitioning) return;
        isDragging = true;
        startX = e.clientX;

        clearInterval(autoSlideInterval);
        sliderTrack.style.transition = 'none';
        sliderTrack.style.cursor = 'grabbing';

        const { slideWidth, gap } = getSlideDimensions();
        prevTranslate = -currentIndex * (slideWidth + gap);

        try {
            sliderTrack.setPointerCapture(e.pointerId);
        } catch (err) {}
    });

    sliderTrack.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const deltaX = currentX - startX;
        currentTranslate = prevTranslate + deltaX;
        
        sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    });

    sliderTrack.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        sliderTrack.style.cursor = 'grab';
        
        try {
            sliderTrack.releasePointerCapture(e.pointerId);
        } catch (err) {}

        const movedBy = currentTranslate - prevTranslate;
        const { slideWidth, gap } = getSlideDimensions();
        const threshold = (slideWidth + gap) / 4; 

        if (movedBy < -threshold && currentIndex < getMaxIndex()) {
            currentIndex++;
        } else if (movedBy > threshold && currentIndex > 0) {
            currentIndex--;
        }

        updatePosition(true);
        resetAutoSlide(sliderContainer);
    });

    sliderTrack.addEventListener('pointercancel', (e) => {
        if (!isDragging) return;
        isDragging = false;
        sliderTrack.style.cursor = 'grab';
        try {
            sliderTrack.releasePointerCapture(e.pointerId);
        } catch (err) {}
        updatePosition(true);
        resetAutoSlide(sliderContainer);
    });

    if (keydownHandler) {
        window.removeEventListener('keydown', keydownHandler);
    }

    keydownHandler = (e) => {
        const rect = sliderContainer?.getBoundingClientRect();
        const isInViewport = rect && rect.top < window.innerHeight && rect.bottom >= 0;
        if (!isInViewport) return;

        if (e.key === 'ArrowRight') {
            if (isTransitioning) return;
            nextSlide();
            resetAutoSlide(sliderContainer);
        } 
        else if (e.key === 'ArrowLeft') {
            if (isTransitioning) return;
            prevSlide();
            resetAutoSlide(sliderContainer);
        }
    };
    window.addEventListener('keydown', keydownHandler);

    window.addEventListener('resize', () => updatePosition(false));
    startAutoSlide(sliderContainer);
}

// Вычисляем максимальный индекс так, чтобы последний слайд ровно доходил до правого края контейнера
function getMaxIndex() {
    const sliderViewport = document.querySelector('.slider-container');
    if (!sliderViewport) return totalSlides - 1;
    const { slideWidth, gap } = getSlideDimensions();
    const visibleWidth = sliderViewport.clientWidth;
    
    let maxVisibleCount = 0;
    let accumulatedWidth = 0;
    
    while (maxVisibleCount < totalSlides) {
        accumulatedWidth += slideWidth;
        if (accumulatedWidth > visibleWidth) break;
        maxVisibleCount++;
        accumulatedWidth += gap;
    }
    
    return Math.max(0, totalSlides - Math.max(1, maxVisibleCount));
}

function updatePosition(withAnimation = true) {
    const sliderTrack = document.getElementById('sliderTrack');
    const slides = sliderTrack ? sliderTrack.querySelectorAll('.slide') : [];
    if (!sliderTrack || !slides.length) return;

    const { slideWidth, gap } = getSlideDimensions();
    const maxIdx = getMaxIndex();
    
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    const offset = currentIndex * (slideWidth + gap);

    sliderTrack.style.transition = withAnimation ? 'transform 0.4s ease-in-out' : 'none';
    sliderTrack.style.transform = `translateX(-${offset}px)`;
}

function beginTransition() {
    isTransitioning = true;
    clearTimeout(transitionSafetyTimer);
    transitionSafetyTimer = setTimeout(() => {
        isTransitioning = false;
    }, 450);
}

function nextSlide() {
    const maxIdx = getMaxIndex();
    if (isTransitioning || currentIndex >= maxIdx) return;
    beginTransition();
    currentIndex++;
    updatePosition(true);
}

function prevSlide() {
    if (isTransitioning || currentIndex <= 0) return;
    beginTransition();
    currentIndex--;
    updatePosition(true);
}

function startAutoSlide(sliderContainer) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        if (sliderContainer && sliderContainer.matches(':hover')) return;
        
        const maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
            nextSlide();
        } else {
            currentIndex = 0; 
            updatePosition(true);
        }
    }, 3000);
}

function resetAutoSlide(sliderContainer) {
    startAutoSlide(sliderContainer);
}