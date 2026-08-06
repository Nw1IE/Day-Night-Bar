export function renderHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <section class="container header-content">
            <a href="#home" class="logo"><i class="fas fa-cocktail"></i> День/<span>Ночь</span></a>
            
            <nav>
                <ul id="navMenu">
                    <li><a href="#home"><i class="fas fa-home"></i> Главная</a></li>
                    <li><a href="#menu"><i class="fas fa-utensils"></i> Меню</a></li>
                    <li><a href="#promotions"><i class="fas fa-tags"></i> Акции</a></li>
                    <li><a href="#footer-container"><i class="fas fa-map-marker-alt"></i> Контакты</a></li>
                </ul>
            </nav>

            <div class="header-right">
                <button id="ChangeButton" class="Change" aria-label="Сменить тему"></button>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Меню">
                    <i class="fas fa-bars"></i>
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
            } else {
                navMenu.style.display = 'flex';
                mobileMenuBtn.classList.add('active');
            }
        };

        navMenu.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                navMenu.style.display = 'none';
                mobileMenuBtn.classList.remove('active');
            };
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.style.display = 'none';
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}