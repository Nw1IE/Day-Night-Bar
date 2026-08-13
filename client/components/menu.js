export function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    menuContainer.innerHTML = `
        <section id="menu" class="menu-section">
            <section class="container">
                <h2 class="section-title">Наше меню</h2>
                
                <nav class="menu-categories" aria-label="Категории меню">
                    <button class="category-btn active" data-category="all">Все</button>
                    <button class="category-btn" data-category="Коктейли">Коктейли</button>
                    <button class="category-btn" data-category="Вино">Вино</button>
                    <button class="category-btn" data-category="Пиво">Пиво</button>
                    <button class="category-btn" data-category="Закуски">Закуски</button>
                    <button class="category-btn" data-category="Основные_блюда">Основные блюда</button>
                    <button class="category-btn" data-category="Десерты">Десерты</button>
                </nav>
                
                <section class="menu-items" id="menuItems"></section>
            </section>
        </section>
    `;

    ensureModalExists();
}

function ensureModalExists() {
    let modal = document.getElementById('dishModal');
    if (modal) return;

    modal = document.createElement('dialog');
    modal.id = 'dishModal';
    modal.className = 'dish-modal';
    
    modal.innerHTML = `
        <div class="dish-modal-content">
            <button type="button" class="dish-modal-close" aria-label="Закрыть">&times;</button>
            <div class="dish-modal-media">
                <img id="modalDishImg" src="" alt="">
            </div>
            <div class="dish-modal-body">
                <div class="dish-modal-header">
                    <h3 id="modalDishTitle" class="dish-modal-title"></h3>
                    <span id="modalDishPrice" class="dish-modal-price"></span>
                </div>
                <p id="modalDishDesc" class="dish-modal-desc"></p>
            </div>
        </div>
    `;

    modal.querySelector('.dish-modal-close').addEventListener('click', () => {
        modal.close();
    });

    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            modal.close();
        }
    });

    document.body.appendChild(modal);
}

export function openDishModal(item) {
    ensureModalExists();
    const modal = document.getElementById('dishModal');
    if (!modal) return;

    document.getElementById('modalDishImg').src = item.image || './images/placeholder.jpg';
    document.getElementById('modalDishImg').alt = item.name || '';
    document.getElementById('modalDishTitle').textContent = item.name || '';
    document.getElementById('modalDishPrice').textContent = item.price ? item.price + ' ₽' : '';
    document.getElementById('modalDishDesc').textContent = item.description || '';

    modal.showModal();
}

export function renderMenuItems(items) {
    const itemsContainer = document.getElementById('menuItems');
    if (!itemsContainer) return;

    if (!items || !Array.isArray(items) || items.length === 0) {
        itemsContainer.innerHTML = `<p class="empty-msg">Список блюд пуст</p>`;
        return;
    }

    itemsContainer.innerHTML = items.map(item => `
        <article class="menu-item" 
                data-category="${item.category}"
                data-name="${encodeURIComponent(item.name || '')}"
                data-price="${item.price || ''}"
                data-desc="${encodeURIComponent(item.description || '')}"
                data-img="${item.image || './images/placeholder.jpg'}">
            
            <img src="${item.image || './images/placeholder.jpg'}" alt="${item.name || ''}" class="menu-item-thumb">
            
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3 class="menu-item-name">${item.name || ''}</h3>
                    <span class="menu-item-price">${item.price ? item.price + ' ₽' : ''}</span>
                </div>
                <p class="menu-item-desc">${item.description || ''}</p>
            </div>
        </article>
    `).join('');

    const cards = itemsContainer.querySelectorAll('.menu-item');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            openDishModal({
                name: decodeURIComponent(card.dataset.name),
                price: card.dataset.price,
                description: decodeURIComponent(card.dataset.desc),
                image: card.dataset.img
            });
        });
    });
}