import { renderMenuItems, renderPromotions, updateAnnouncementUI } from './Modules/renderModule.js';
import { initPublicEvents } from './Modules/publicModule.js';
import { initAdmin } from './Modules/adminModule.js';
import { initSlider } from './Modules/slidebarModule.js';
import { initPersistentData } from './Modules/storageModule.js';

document.addEventListener('DOMContentLoaded', function() {
    initPersistentData();

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

    initSlider();
});