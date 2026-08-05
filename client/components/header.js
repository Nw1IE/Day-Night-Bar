export function renderHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <div class="container header-content">
            <a href="#home" class="logo"><i class="fas fa-cocktail"></i> День/ <span>Ночь</span></a>
            
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
            
            <nav>
                <ul id="navMenu">
                    <li><a href="#home"><i class="fas fa-home"></i> Главная</a></li>
                    <li><a href="#menu"><i class="fas fa-utensils"></i> Меню</a></li>
                    <li><a href="#promotions"><i class="fas fa-tags"></i> Акции</a></li>
                    <li><a href="#contacts"><i class="fas fa-map-marker-alt"></i> Контакты</a></li>
                </ul>
            </nav>
            <button id="ChangeButton" class="Change"></button>
        </div>
    `;

    // Инициализация событий для элементов шапки (например, мобильное меню)
    initHeaderEvents();
}

function initHeaderEvents() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}