import { updateMenuItems, updatePromotions, updateAnnouncement } from './dataModule.js';

const STORAGE_KEYS = {
    MENU: 'bar_data_menu',
    PROMOS: 'bar_data_promotions',
    ANNOUNCEMENT: 'bar_data_announcement'
};

export const initPersistentData = () => {
    try {
        const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
        const savedPromos = localStorage.getItem(STORAGE_KEYS.PROMOS);
        const savedAnn = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT);

        if (savedMenu) updateMenuItems(JSON.parse(savedMenu));
        if (savedPromos) updatePromotions(JSON.parse(savedPromos));
        if (savedAnn) updateAnnouncement(savedAnn);
    } 
    catch (e) {
        console.error("Ошибка при загрузке данных из LocalStorage:", e);
    }
};

export const saveMenuToStorage = (menuItems) => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
};

export const savePromosToStorage = (promotions) => {
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promotions));
};

export const saveAnnouncementToStorage = (announcement) => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, announcement);
};