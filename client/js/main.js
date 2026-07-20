import { initHeader } from '../components/header.js';
import { loadAndRenderPublicData } from '../components/mainPage.js';
import { initPublicEvents } from './Modules/publicModule.js'; // Одна точка!
import { initAdmin } from './Modules/adminModule.js';         // Одна точка!
import { initSlider } from './Modules/slidebarModule.js';       // Одна точка!

function safeInit(name, fn) {
    try {
        fn();
    } catch (err) {
        console.error(`[main.js] Ошибка при инициализации "${name}":`, err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    safeInit('header', initHeader);
    safeInit('publicEvents', initPublicEvents);
    safeInit('admin', initAdmin);
    safeInit('slider', initSlider);

    try {
        await loadAndRenderPublicData(); // тянет меню/акции/объявление с бэкенда
    } catch (err) {
        console.error('[main.js] Ошибка при загрузке данных с сервера:', err);
    }
    await loadAndRenderPublicData();

    // Секретная комбинация для открытия формы входа в админку (как и было)
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