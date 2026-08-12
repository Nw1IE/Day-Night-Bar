import { renderPromotions, updateAnnouncementUI } from './Modules/renderModule.js';
import { initPublicEvents } from './Modules/publicModule.js';
import { initErrorModal } from '../components/error.js';
import { initAdmin } from './Modules/adminModule.js';
import { initPersistentData } from './Modules/storageModule.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { renderAnnouncement } from '../components/announcement.js';
import { renderHero } from '../components/mainPage.js';
import { renderSlider } from '../components/slider.js';
import { renderMenu, renderMenuItems } from '../components/menu.js';
import { renderPromotionsSection, renderPromotionCards } from '../components/promotions.js';
import { initAdminModal } from '../components/admins.js';
import { createDeleteModalMarkup } from '../components/delete.js';

document.addEventListener('DOMContentLoaded', async function() {
    initErrorModal();
    initPersistentData();
    initAdminModal();

    renderPromotionsSection();
    renderHeader();
    renderAnnouncement();
    renderHero();
    renderSlider();
    renderMenu();
    renderFooter();

    // Загружаем данные через прокси Vite (без CORS ошибок)
    try {
        const [menuRes, promoRes] = await Promise.all([
            fetch('/api/menu'),
            fetch('/api/promotions')
        ]);

        if (menuRes.ok) {
            const serverMenu = await menuRes.json();
            const localData = JSON.parse(localStorage.getItem('menuItems'));
            const dataToRender = (Array.isArray(localData) && localData.length > 0) ? localData : serverMenu;
            renderMenuItems(dataToRender);
        }

        if (promoRes.ok) {
            const serverPromotions = await promoRes.json();
            renderPromotionCards(serverPromotions);
        }
    } catch (e) {
        console.error('Ошибка при загрузке данных с сервера:', e);
        renderMenuItems([]);
        renderPromotionCards([]);
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-item-btn') || e.target.classList.contains('delete-promo-btn')) {
            const itemId = e.target.dataset.id;

            openDeleteModal(() => {
                console.log('Удаляем элемент из админки с ID:', itemId);
            });
        }
    });

    const today = new Date().toISOString().split('T')[0];
    const promoDateInput = document.getElementById('promoDate');
    if (promoDateInput) {
        promoDateInput.min = today;
    }

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
});