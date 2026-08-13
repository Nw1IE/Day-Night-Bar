import { getMenuItems } from '../api/services/menuService.js';
import { promotionsApi } from '../api/services/promotionService.js';
import { announcementsApi, getAnnouncement } from '../api/services/announcementService.js';
import { formatDate } from './utilsModule.js';
import { openDishModal } from '../../components/menu.js';

export async function renderMenuItems(category = 'all') {
    const menuItemsContainer = document.getElementById('menuItems');
    if (!menuItemsContainer) return;

    menuItemsContainer.innerHTML = '';
    
    try {
        const menuItems = await getMenuItems();
        
        const filteredItems = category === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === category);
        
        if (filteredItems.length === 0) {
            menuItemsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: rgba(255, 255, 255, 0.7);">Позиции в этой категории пока отсутствуют</p>';
            return;
        }
        
        filteredItems.forEach(item => {
            const menuItem = document.createElement('article');
            menuItem.className = 'menu-item';
            menuItem.style.cursor = 'pointer';
            
            menuItem.innerHTML = `
                <img src="${item.image || './images/placeholder.jpg'}" alt="${item.name}" class="menu-item-thumb">
                <section class="menu-item-content">
                    <section class="menu-item-header">
                        <h3 class="menu-item-name">${item.name}</h3>
                        <span class="menu-item-price">${item.price} ₽</span>
                    </section>
                    <p class="menu-item-desc">${item.description}</p>
                </section>
            `;

            menuItem.addEventListener('click', () => {
                openDishModal(item);
            });

            menuItemsContainer.appendChild(menuItem);
        });
    } 
    catch (error) {
        console.error('Ошибка загрузки меню с сервера:', error);
        menuItemsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #ff6b6b;">Не удалось загрузить меню</p>';
    }
}

export async function renderPromotions() {
    const promotionCardsContainer = document.getElementById('promotionCards');
    if (!promotionCardsContainer) return;
    
    promotionCardsContainer.innerHTML = '';
    
    try {
        const promotions = await promotionsApi.getAll();        
        promotions.forEach(promo => {
            const promoCard = document.createElement('article');
            promoCard.className = 'promotion-card';
            promoCard.innerHTML = `
                <section class="promotion-content">
                    <h3 class="promotion-title">${promo.title}</h3>
                    <time class="promotion-date"><i class="far fa-calendar-alt"></i> Действует до: ${formatDate(promo.date)}</time>
                    <p>${promo.description}</p>
                </section>
            `;
            promotionCardsContainer.appendChild(promoCard);
        });
    } catch (error) {
        console.error('Ошибка загрузки акций с сервера:', error);
    }
}

export async function updateAnnouncementUI() {
    const el = document.getElementById('announcement');
    if (!el) return;
    
    try {
        const announcementData = await getAnnouncement();
        el.textContent = typeof announcementData === 'string' ? announcementData : (announcementData?.text || announcementData?.content || '');
    } catch (error) {
        console.error('Ошибка загрузки объявления с сервера:', error);
    }
}