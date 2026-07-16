import { menuItems, promotions, announcement } from '../js-modules/dataModule.js';
import { formatDate } from '../js-modules/utilsModule.js';

export function renderMenuItems(category) {
    const menuItemsContainer = document.getElementById('menuItems');
    if (!menuItemsContainer) return;
    menuItemsContainer.innerHTML = '';

    const filteredItems = category === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === category);

    if (filteredItems.length === 0) {
        menuItemsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: rgba(255, 255, 255, 0.7);">Позиции в этой категории пока отсутствуют</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">${item.price} ₽</div>
                </div>
                <div class="menu-item-desc">${item.description}</div>
            </div>
        `;
        fragment.appendChild(menuItem);
    });
    menuItemsContainer.appendChild(fragment);
}

export function renderPromotions() {
    const promotionCardsContainer = document.getElementById('promotionCards');
    if (!promotionCardsContainer) return;
    promotionCardsContainer.innerHTML = '';

    if (promotions.length === 0) {
        promotionCardsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: rgba(255, 255, 255, 0.7);">Акций пока нет</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    promotions.forEach(promo => {
        const promoCard = document.createElement('div');
        promoCard.className = 'promotion-card';
        promoCard.innerHTML = `
            <div class="promotion-content">
                <div class="promotion-title">${promo.title}</div>
                <div class="promotion-date"><i class="far fa-calendar-alt"></i> Действует до: ${formatDate(promo.date)}</div>
                <p>${promo.description}</p>
            </div>
        `;
        fragment.appendChild(promoCard);
    });
    promotionCardsContainer.appendChild(fragment);
}

export function updateAnnouncementUI() {
    const el = document.getElementById('announcement');
    if (!el) return;
    if (!announcement) {
        el.style.display = 'none';
        return;
    }
    el.style.display = '';
    el.textContent = announcement;
}

export function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderMenuItems(button.getAttribute('data-category'));
        });
    });
}
