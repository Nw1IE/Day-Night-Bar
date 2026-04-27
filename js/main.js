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

    document.addEventListener('keydown', (event) => {

    if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        event.preventDefault();
        
        const loginDiv = document.querySelector('#adminLogin');
        console.log("Попытка открыть админку. Найден элемент:", loginDiv);

        if (loginDiv) {
            loginDiv.style.display = 'flex'; 
            loginDiv.style.position = 'fixed';
            loginDiv.style.zIndex = '10000';
            // Добавим принудительную видимость для теста
            loginDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
        } else {
            alert("Ошибка: Элемент #adminLogin не найден в HTML!");
        }
    }
});
});