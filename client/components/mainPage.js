import { menuApi, promotionsApi, announcementApi, ApiError } from '../js/api/api.js';// Если папка api лежит прямо в client, а не в js, тогда оставь как было: '../api/api.js'

import { formatDate, getCategoryName } from '../js/Modules/utilsModule.js';// Если utilsModule лежит внутри папки Modules, то путь будет: '../js/Modules/utilsModule.js'

import { showErrorModal } from './error.js';

// Кэш в памяти — чтобы фильтр по категориям не дёргал сеть на каждый клик.
let cachedMenuItems = [];

function renderEmptyState(container, text) {
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: rgba(255, 255, 255, 0.7);">${text}</p>`;
}

export function renderMenuItems(category = 'all', items = cachedMenuItems) {
    const menuItemsContainer = document.getElementById('menuItems');
    if (!menuItemsContainer) return;
    menuItemsContainer.innerHTML = '';

    const filteredItems = category === 'all'
        ? items
        : items.filter(item => item.category === category);

    if (filteredItems.length === 0) {
        renderEmptyState(menuItemsContainer, 'Позиции в этой категории пока отсутствуют');
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <div class="menu-item-name">${escapeHtml(item.name)}</div>
                    <div class="menu-item-price">${escapeHtml(item.price)} ₽</div>
                </div>
                <div class="menu-item-desc">${escapeHtml(item.description)}</div>
                <small class="menu-item-category">${escapeHtml(getCategoryName(item.category))}</small>
            </div>
        `;
        fragment.appendChild(menuItem);
    });
    menuItemsContainer.appendChild(fragment);
}

export function renderPromotions(promotions) {
    const promotionCardsContainer = document.getElementById('promotionCards');
    if (!promotionCardsContainer) return;
    promotionCardsContainer.innerHTML = '';

    if (!promotions || promotions.length === 0) {
        renderEmptyState(promotionCardsContainer, 'Акций пока нет');
        return;
    }

    const fragment = document.createDocumentFragment();
    promotions.forEach(promo => {
        const promoCard = document.createElement('div');
        promoCard.className = 'promotion-card';
        promoCard.innerHTML = `
            <div class="promotion-content">
                <div class="promotion-title">${escapeHtml(promo.title)}</div>
                <div class="promotion-date"><i class="far fa-calendar-alt"></i> Действует до: ${escapeHtml(formatDate(promo.endDate))}</div>
                <p>${escapeHtml(promo.description)}</p>
            </div>
        `;
        fragment.appendChild(promoCard);
    });
    promotionCardsContainer.appendChild(fragment);
}

export function renderAnnouncement(announcement) {
    const el = document.getElementById('announcement');
    if (!el) return;
    if (!announcement) {
        el.style.display = 'none';
        return;
    }
    el.style.display = '';
    el.textContent = announcement.text; // textContent — экранирование не нужно, XSS тут в принципе невозможен
}

export function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderMenuItems(button.getAttribute('data-category'));
        });

        // Бонус: Enter/Space активирует категорию как клик
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}

/**
 * Грузит меню/акции/объявление с сервера и рендерит всё разом.
 * Вызывается один раз при старте приложения.
 */
export async function loadAndRenderPublicData() {
    try {
        const [menuItems, promotions, announcement] = await Promise.all([
            menuApi.getMenuItems(),
            promotionsApi.getActivePromotions(),
            announcementsApi.getCurrentAnnouncement()
        ]);

        cachedMenuItems = menuItems;
        renderMenuItems('all', cachedMenuItems);
        renderPromotions(promotions);
        renderAnnouncement(announcement);
    } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Не удалось загрузить данные с сервера.';
        showErrorModal(message);
        renderMenuItems('all', []);
        renderPromotions([]);
    }
}

export function getCachedMenuItems() {
    return cachedMenuItems;
}

// Функция-мост для админки, которая умеет переключать категорию
export function changeMenuCategoryElement(category) {
    const targetButton = document.querySelector(`.category-btn[data-category="${category}"]`);
    if (targetButton) {
        targetButton.click(); // Имитируем клик по кнопке категории
    } else {
        // Если кнопки нет, просто перерендерим данные для этой категории
        renderMenuItems(category);
    }
}