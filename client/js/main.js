import { updateAnnouncementUI } from './Modules/renderModule.js';
import { initPublicEvents } from './Modules/publicModule.js';
import { initErrorModal } from '../components/error.js';
import { initAdmin } from './Modules/adminModule.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { renderAnnouncement } from '../components/announcement.js';
import { renderHero } from '../components/mainPage.js';
import { renderSlider } from '../components/slider.js';
import { renderMenu, renderMenuItems } from '../components/menu.js';
import { renderPromotionsSection, renderPromotionCards } from '../components/promotions.js';
import { initAdminModal } from '../components/admins.js';
import { createDeleteModalMarkup } from '../components/delete.js';
import { request } from '../js/api/api.js';

document.addEventListener('DOMContentLoaded', async function() {
    initErrorModal();
    initAdminModal();

    // 1. Сначала рисуем каркас страницы
    renderPromotionsSection();
    renderHeader();
    renderAnnouncement();
    renderHero();
    renderSlider();
    renderMenu();
    renderFooter();

    // 2. Загружаем данные с сервера один раз
// 2. Загружаем данные с сервера один раз через единую функцию request
    try {
        const [serverMenu, serverPromotions] = await Promise.all([
            request('/menu'),
            request('/promotions')
        ]);

        // Меню
        const localData = JSON.parse(localStorage.getItem('menuItems'));
        const dataToRender = (Array.isArray(localData) && localData.length > 0) ? localData : serverMenu;
        renderMenuItems(dataToRender);

        // Акции
        renderPromotionCards(serverPromotions);
    } 
    catch (e) {
        console.error('Ошибка при загрузке данных с сервера:', e);
        renderMenuItems([]);
        renderPromotionCards([]);
    }

    // 3. Убираем дублирующий вызов renderPromotions(), так как акции уже загружены выше через renderPromotionCards!
    updateAnnouncementUI();

    initPublicEvents();
    initAdmin();

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