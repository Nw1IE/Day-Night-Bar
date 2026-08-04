import { menuItems, promotions, announcement } from './dataModule.js';
import { formatDate } from './utilsModule.js';

export function renderMenuItems(category) {
    const menuItemsContainer = document.getElementById('menuItems');
    menuItemsContainer.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    if (filteredItems.length === 0) {
        menuItemsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: rgba(255, 255, 255, 0.7);">Позиции в этой категории пока отсутствуют</p>';
        return;
    }
    
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
        menuItemsContainer.appendChild(menuItem);
    });
}

export function renderPromotions() {
    const promotionCardsContainer = document.getElementById('promotionCards');
    promotionCardsContainer.innerHTML = '';
    
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
        promotionCardsContainer.appendChild(promoCard);
    });
}

export function updateAnnouncementUI() {
    document.getElementById('announcement').textContent = announcement;
}