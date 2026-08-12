const STORAGE_KEYS = {
    MENU: 'bar_data_menu',
    PROMOS: 'bar_data_promotions',
    ANNOUNCEMENT: 'bar_data_announcement'
};

export const initPersistentData = () => {
    // Данные теперь подтягиваются с бэкенда через слой API, 
    // поэтому локальная инициализация из старых моков больше не требуется.
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