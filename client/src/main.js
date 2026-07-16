import './css/style.css';

import { loadAllData } from './js-modules/dataModule.js';
import { renderMenuItems, renderPromotions, updateAnnouncementUI, initCategoryFilters } from './components/mainPage.js';
import { initHeader } from './components/header.js';
import { initAdmin } from './js-modules/adminModule.js';
import { initSlider } from './js-modules/slidebarModule.js';
import { showErrorModal } from './components/error.js';

document.addEventListener('DOMContentLoaded', async function () {
    initHeader();
    initCategoryFilters();
    initAdmin();
    initSlider();

    const ok = await loadAllData();
    renderMenuItems('all');
    renderPromotions();
    updateAnnouncementUI();

    if (!ok) {
        showErrorModal('Не удалось загрузить часть данных с сервера. Проверьте, запущен ли бэкенд.');
    }

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
            event.preventDefault();
            const loginDiv = document.querySelector('#adminLogin');
            loginDiv.style.display = 'flex';
            loginDiv.style.position = 'fixed';
            loginDiv.style.zIndex = '10000';
            loginDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
        }
    });
});
