import { renderMenuItems, renderPromotions, updateAnnouncementUI } from './Modules/renderModule.js';
import { initPublicEvents } from './Modules/publicModule.js';
import { initAdmin } from './Modules/adminModule.js';

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    document.getElementById('promoDate').min = today;

    renderMenuItems('all');
    renderPromotions();
    updateAnnouncementUI();

    initPublicEvents();
    initAdmin();

    const themeBtn = document.getElementById('ChangeButton');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
    
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }

    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let position = 0;
    const slideWidth = 330;
    
    const updateSlider = () => {
        const maxScroll = -(track.children.length - 3) * slideWidth;
        if (position > 0) position = 0;
        if (position < maxScroll) position = maxScroll;
        
        track.style.transform = `translateX(${position}px)`;
    };

    nextBtn.addEventListener('click', () => {
        position -= slideWidth;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        position += slideWidth;
        updateSlider();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            position -= slideWidth;
            updateSlider();
        } else if (e.key === 'ArrowLeft') {
            position += slideWidth;
            updateSlider();
        }
    });
});

