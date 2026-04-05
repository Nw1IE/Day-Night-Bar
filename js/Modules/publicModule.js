import { renderMenuItems } from './renderModule.js';

export function initPublicEvents() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const bookingForm = document.getElementById('bookingForm');

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('date');
    const commentsInput = document.getElementById('comments');


    nameInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^а-яА-ЯёЁ\s]/g, '');
        if (this.value.length > 20) {
            this.value = this.value.substring(0, 20);
        }
    });

    phoneInput.addEventListener('input', function(e) {
        let inputDigits = this.value.replace(/\D/g, ''); 

        if (!inputDigits) {
            this.value = '';
            return;
        }

        if (['7', '8', '9'].indexOf(inputDigits[0]) > -1) {
            if (inputDigits[0] === '9') inputDigits = '7' + inputDigits;
            else inputDigits = '7' + inputDigits.substring(1);
        } else {
            inputDigits = '7' + inputDigits;
        }

        inputDigits = inputDigits.substring(0, 11);

        let formattedNumber = '+7';
        if (inputDigits.length > 1) {
            formattedNumber += ' (' + inputDigits.substring(1, 4);
        }
        if (inputDigits.length >= 5) {
            formattedNumber += ') ' + inputDigits.substring(4, 7);
        }
        if (inputDigits.length >= 8) {
            formattedNumber += '-' + inputDigits.substring(7, 9);
        }
        if (inputDigits.length >= 10) {
            formattedNumber += '-' + inputDigits.substring(9, 11);
        }

        this.value = formattedNumber;
    });

    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    dateInput.addEventListener('change', function() {
        if (this.value < today) {
            this.value = today;
        }
    });

    commentsInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^а-яА-ЯёЁ0-9+() \n]/g, '');
    });


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

        const rawPhoneDigits = phone.replace(/\D/g, '');
        if (rawPhoneDigits.length !== 11) {
            alert('Пожалуйста, введите корректный номер телефона.');
            phoneInput.focus();
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