export function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    menuContainer.innerHTML = `
        <section id="menu" class="menu-section">
            <section class="container">
                <h2 class="section-title">Наше меню</h2>

                <nav class="menu-categories" role="tablist" aria-label="Категории меню">
                    <button class="category-btn active" role="tab" aria-selected="true" aria-pressed="true" data-category="all" title="Показать всё меню">Все</button>
                    <button class="category-btn" role="tab" aria-selected="false" aria-pressed="false" data-category="Коктейли" title="Показать авторские коктейли">Коктейли</button>
                    <button class="category-btn" role="tab" aria-selected="false" aria-pressed="false" data-category="Вино" title="Показать винную карту">Вино</button>
                    <button class="category-btn" role="tab" aria-selected="false" aria-pressed="false" data-category="Пиво" title="Показать пенные напитки">Пиво</button>
                    <button class="category-btn" role="tab" aria-selected="false" aria-pressed="false" data-category="Закуски" title="Показать закуски">Закуски</button>
                    <button class="category-btn" role="tab" aria-selected="false" aria-pressed="false" data-category="Основные_блюда" title="Показать основные горячие блюда">Основные блюда</button>
                    <button class="category-btn" role="tab" aria-selected="false" aria-pressed="false" data-category="Десерты" title="Показать десерты">Десерты</button>
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