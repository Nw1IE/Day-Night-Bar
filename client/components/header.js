/**
 * Хедер: бургер-меню + переключатель темы.
 *
 * Фикс мобильной темы: раньше #ChangeButton стоял в .header-content рядом
 * с бургером и на узких экранах вылезал за пределы шапки. Теперь в DOM два
 * узла с классом .Change — #ChangeButtonDesktop (виден только на desktop,
 * там же где раньше) и #ChangeButtonMobile (лежит внутри #navMenu, виден
 * только когда открыт бургер на мобилке). Какой из них виден — решает CSS
 * media query, а не JS. Оба слушают клик одинаково, состояние темы общее
 * (синхронизируется через localStorage).
 */
export function initHeader() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const themeButtons = document.querySelectorAll('.Change');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        });

        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });

        // Enter/Space на бургере — как обычный клик (доступность + бонус-пункт про клавиши)
        mobileMenuBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileMenuBtn.click();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.focus();
            }
        });
    }

    if (themeButtons.length) {
        const applyTheme = (isLight) => {
            document.body.classList.toggle('light-theme', isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        };

        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                applyTheme(!document.body.classList.contains('light-theme'));
            });
        });

        if (localStorage.getItem('theme') === 'light') {
            applyTheme(true);
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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