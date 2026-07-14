export const initSlider = () => {
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!track || !prevBtn || !nextBtn) return;

    const originalSlides = Array.from(track.children);
    const slideWidth = 330; 
    const visibleSlides = 3;
    let isTransitioning = false;

    const firstClones = originalSlides.slice(0, visibleSlides).map(s => s.cloneNode(true));
    const lastClones = originalSlides.slice(-visibleSlides).map(s => s.cloneNode(true));

    firstClones.forEach(clone => track.appendChild(clone));
    lastClones.reverse().forEach(clone => track.prepend(clone));

    const allSlides = Array.from(track.children);

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img) {
                    img.style.opacity = '1';
                }
            }
        });
    }, { 
        root: track.parentElement, 
        rootMargin: '0px 500px',
        threshold: 0.01 
    });

    allSlides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease-in-out';
            } else {
                img.style.opacity = '1';
            }
        }
        imageObserver.observe(slide);
    });

    let position = -slideWidth * visibleSlides;
    track.style.transition = 'none';
    track.style.transform = `translateX(${position}px)`;

    const move = (direction) => {
        if (isTransitioning) return;
        
        isTransitioning = true;
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        if (direction === 'next') {
            position -= slideWidth;
        } else {
            position += slideWidth;
        }
        
        track.style.transform = `translateX(${position}px)`;
    };

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        const totalOriginal = originalSlides.length;

        if (Math.abs(position) >= slideWidth * (totalOriginal + visibleSlides)) {
            track.style.transition = 'none';
            position = -slideWidth * visibleSlides;
            track.style.transform = `translateX(${position}px)`;
        }

        if (position >= 0) {
            track.style.transition = 'none';
            position = -slideWidth * totalOriginal;
            track.style.transform = `translateX(${position}px)`;
        }
    });

    nextBtn.addEventListener('click', () => move('next'));
    prevBtn.addEventListener('click', () => move('prev'));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') move('next');
        if (e.key === 'ArrowLeft') move('prev');
    });
};