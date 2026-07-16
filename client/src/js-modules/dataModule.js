import { API } from '../api/api.js';

export let menuItems = [
    { id: 1, name: "Мохито классический", category: "cocktails", price: 550, description: "Классический коктейль с белым ромом, свежей мятой, лаймом и содовой" },
    { id: 2, name: "Негрони", category: "cocktails", price: 650, description: "Итальянский коктейль с джином, красным вермутом и кампари" },
    { id: 3, name: "Маргарита", category: "cocktails", price: 600, description: "Коктейль с текилой, лаймовым соком и апельсиновым ликером, солью по краю бокала" },
    { id: 4, name: "Кьянти Классико", category: "wine", price: 420, description: "Итальянское красное вино из региона Тоскана, бокал" },
    { id: 5, name: "Шардоне", category: "wine", price: 480, description: "Белое вино из Бургундии, бокал" },
    { id: 6, name: "Пино Нуар", category: "wine", price: 520, description: "Красное вино с тонким ароматом, бокал" },
    { id: 7, name: "IPA крафтовое", category: "beer", price: 350, description: "Крафтовое пиво с насыщенным хмелевым вкусом, 0.5 л" },
    { id: 8, name: "Пшеничное пиво", category: "beer", price: 320, description: "Светлое пшеничное пиво с цитрусовыми нотами, 0.5 л" },
    { id: 9, name: "Сырное ассорти", category: "snacks", price: 1200, description: "Ассорти из европейских сыров, грецкие орехи, мед, груша" },
    { id: 10, name: "Брускетты", category: "snacks", price: 480, description: "Тосты с томатами, базиликом, моцареллой и оливковым маслом" },
    { id: 11, name: "Стейк Рибай", category: "main", price: 2200, description: "Стейк из мраморной говядины с овощами гриль и соусом пеперони" },
    { id: 12, name: "Тирамису", category: "desserts", price: 650, description: "Классический итальянский десерт с кофе и маскарпоне" }
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
