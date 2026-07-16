import { API } from '../api/api.js';

export let menuItems = [
    
];
export let promotions = [];
export let announcement = '';
export let announcementId = null;
export const ADMIN_PASSWORD_HINT = null; // пароль больше не хранится на фронте, проверяется бэком

export let isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';

export const updateMenuItems = (newItems) => { menuItems = newItems; };
export const updatePromotions = (newPromos) => { promotions = newPromos; };
export const updateAnnouncement = (newText, id = announcementId) => {
    announcement = newText;
    announcementId = id;
};
export const setAdminLoggedIn = (status) => {
    isAdminLoggedIn = status;
    sessionStorage.setItem('isAdminLoggedIn', status ? 'true' : 'false');
};

// Загружаем все данные с бэка. Возвращает true, если всё получилось.
export async function loadAllData() {
    const [menuResult, promoResult, announcementResult] = await Promise.allSettled([
        API.getMenu(),
        API.getPromotions(),
        API.getAnnouncement()
    ]);

    if (menuResult.status === 'fulfilled') menuItems = menuResult.value;
    if (promoResult.status === 'fulfilled') promotions = promoResult.value;
    if (announcementResult.status === 'fulfilled' && announcementResult.value) {
        announcement = announcementResult.value.text;
        announcementId = announcementResult.value.id;
    }

    const hadErrors = [menuResult, promoResult, announcementResult].some(r => r.status === 'rejected');
    return !hadErrors;
}
