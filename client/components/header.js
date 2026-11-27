export function renderHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <section class="container header-content">
            <a href="#home" class="logo" title="Бар День / Ночь в Берёзовском — на главную"><i class="fas fa-cocktail" aria-hidden="true"></i> День/<span>Ночь</span></a>
            
            <nav role="navigation" aria-label="Основное меню сайта">
                <ul id="navMenu">
                    <li><a href="#home" title="Главная страница"><i class="fas fa-home" aria-hidden="true"></i> Главная</a></li>
                    <li><a href="#menu" title="Меню бара: коктейли, напитки, кухня"><i class="fas fa-utensils" aria-hidden="true"></i> Меню</a></li>
                    <li><a href="#promotions" title="Акции и специальные предложения"><i class="fas fa-tags" aria-hidden="true"></i> Акции</a></li>
                    <li><a href="#faq" title="Часто задаваемые вопросы о баре"><i class="fas fa-question-circle" aria-hidden="true"></i> FAQ</a></li>
                    <li><a href="#footer-container" title="Контакты, адрес и режим работы"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Контакты</a></li>
                </ul>
            </nav>

            <div class="header-right">
                <button id="ChangeButton" class="Change" aria-label="Сменить тему оформления (светлая/тёмная)" title="Сменить тему оформления"></button>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Открыть или закрыть главное меню" aria-expanded="false" title="Меню">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </div>
        </section>
    `;

    initHeaderEvents();
}

function initHeaderEvents() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.style.cursor = 'pointer';
        
        mobileMenuBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = navMenu.style.display === 'flex';
            
            if (isOpen) {
                navMenu.style.display = 'none';
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            } else {
                navMenu.style.display = 'flex';
                mobileMenuBtn.classList.add('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
        };

        navMenu.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                navMenu.style.display = 'none';
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            };
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.style.display = 'none';
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const logoCocktailIcon = document.querySelector('.logo i.fa-cocktail');
    if (logoCocktailIcon) {
        let clickCount = 0;
        let timer = null;

        logoCocktailIcon.addEventListener('click', (e) => {
            if (window.innerWidth > 768) return;

            e.preventDefault();
            e.stopPropagation();

            clickCount++;
            clearTimeout(timer);

            if (clickCount >= 6) {
                clickCount = 0;
                
                const adminLoginModal = document.getElementById('adminLogin');
                const adminPanel = document.getElementById('adminPanel');
                
                const isAlreadyLoggedIn = adminPanel && getComputedStyle(adminPanel).display !== 'none';

                if (isAlreadyLoggedIn) {
                    adminPanel.style.setProperty('display', 'flex', 'important');
                } 
                else if (adminLoginModal) {
                    adminLoginModal.style.setProperty('display', 'flex', 'important');
                    const pwd = document.getElementById('adminPassword');
                    if (pwd) pwd.focus();
                }
            } 
            else {
                timer = setTimeout(() => {
                    clickCount = 0;
                }, 1500);
            }
        });
    }
}