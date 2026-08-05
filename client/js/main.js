import { renderMenuItems, renderPromotions, updateAnnouncementUI } from './Modules/renderModule.js';
import { initPublicEvents } from './Modules/publicModule.js';
import { initErrorModal, showErrorModal } from '../components/error.js';
import { initAdmin } from './Modules/adminModule.js';
import { initSlider } from './Modules/slidebarModule.js';
import { initPersistentData } from './Modules/storageModule.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { renderAnnouncement } from '../components/announcement.js';
import { renderHero } from '../components/mainPage.js';
import { renderSlider } from '../components/slider.js';

document.addEventListener('DOMContentLoaded', function() {
    initErrorModal();
    
    // Рендерим компоненты строго по одному разу в нужном порядке
    renderHeader();
    renderAnnouncement();
    renderHero();
    renderSlider();
    renderFooter();
  

    initPersistentData();
    initSlider();

    const today = new Date().toISOString().split('T')[0];
    const promoDateInput = document.getElementById('promoDate');
    if (promoDateInput) {
        promoDateInput.min = today;
    }

    renderMenuItems('all');
    renderPromotions();
    updateAnnouncementUI();

    initPublicEvents();
    initAdmin();

    const themeBtn = document.getElementById('ChangeButton');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }
    
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }

    initSlider();
});