import { renderMenuItems } from './renderModule.js';

export function initPublicEvents() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const bookingForm = document.getElementById('bookingForm');

    mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderMenuItems(button.getAttribute('data-category'));
        });
    });

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        
        if (!name || !phone || !date || !time || !guests) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        alert(`Спасибо, ${name}! Ваш столик забронирован на ${date} в ${time} для ${guests}. Мы свяжемся с вами по телефону ${phone} для подтверждения.`);
        bookingForm.reset();
        document.getElementById('date').min = new Date().toISOString().split('T')[0];
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