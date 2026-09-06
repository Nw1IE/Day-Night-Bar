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
}

export function renderMenuItems(items) {
    const itemsContainer = document.getElementById('menuItems');
    if (!itemsContainer) return;

    if (!items || !Array.isArray(items) || items.length === 0) {
        itemsContainer.innerHTML = `<p class="empty-msg">Список блюд пуст</p>`;
        return;
    }

    itemsContainer.innerHTML = items.map(item => `
        <article class="menu-item" data-category="${item.category}">
            <section class="menu-item-content">
                <section class="menu-item-header">
                    <h3 class="menu-item-name">${item.name || ''}</h3>
                    <span class="menu-item-price">${item.price ? item.price + ' ₽' : ''}</span>
                </section>
                <p class="menu-item-desc">${item.description || ''}</p>
            </section>
        </article>
    `).join('');
}