import { menuApi } from '../api/services/menuService.js';
import { renderMenuItems } from '../../components/menu.js';

export function initPublicEvents() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const categoryButtons = document.querySelectorAll('.category-btn');

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('date');
    const commentsInput = document.getElementById('comments');

    nameInput?.addEventListener('input', function() {
        this.value = this.value.replace(/[^а-яА-ЯёЁ\s]/g, '');
        if (this.value.length > 20) {
            this.value = this.value.substring(0, 20);
        }
    });

    phoneInput?.addEventListener('input', function() {
        let inputDigits = this.value.replace(/\D/g, ''); 
        if (!inputDigits) {
            this.value = '';
            return;
        }
        if (['7', '8', '9'].indexOf(inputDigits[0]) > -1) {
            if (inputDigits[0] === '9') inputDigits = '7' + inputDigits;
            else inputDigits = '7' + inputDigits.substring(1);
        } 
        else {
            inputDigits = '7' + inputDigits;
        }
        inputDigits = inputDigits.substring(0, 11);

        let formattedNumber = '+7';
        if (inputDigits.length > 1) formattedNumber += ' (' + inputDigits.substring(1, 4);
        if (inputDigits.length >= 5) formattedNumber += ') ' + inputDigits.substring(4, 7);
        if (inputDigits.length >= 8) formattedNumber += '-' + inputDigits.substring(7, 9);
        if (inputDigits.length >= 10) formattedNumber += '-' + inputDigits.substring(9, 11);

        this.value = formattedNumber;
    });

    commentsInput?.addEventListener('input', function() {
        this.value = this.value.replace(/[^а-яА-ЯёЁ0-9+() \n]/g, '');
    });

    mobileMenuBtn?.addEventListener('click', () => navMenu?.classList.toggle('active'));
    
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => navMenu?.classList.remove('active'));
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', async () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedCategory = button.getAttribute('data-category');
            
            try {
                const localData = JSON.parse(localStorage.getItem('menuItems'));
                const menuItems = (Array.isArray(localData) && localData.length > 0) 
                    ? localData 
                    : await menuApi.getAll();

                const normalize = (str) => (str || '').replace(/[_|-]/g, ' ').trim().toLowerCase();
                const targetCategory = normalize(selectedCategory);

                const filtered = (targetCategory === 'all' || targetCategory === '') 
                    ? menuItems 
                    : menuItems.filter(item => normalize(item.category) === targetCategory);

                renderMenuItems(filtered);
            } catch (e) {
                console.error('Ошибка фильтрации меню:', e);
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}