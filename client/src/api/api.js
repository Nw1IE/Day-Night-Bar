const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5101';
const ADMIN_CLIENT_KEY = import.meta.env.VITE_ADMIN_CLIENT_KEY || '';

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
    let response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            credentials: 'include', // нужно, чтобы уходила/приходила httpOnly-кука AdminAuth
            headers: {
                ...(body ? { 'Content-Type': 'application/json' } : {}),
                ...(auth ? { 'X-Admin-Client-Key': ADMIN_CLIENT_KEY } : {}),
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined
        });
    } catch (networkError) {
        throw new ApiError('Не удалось связаться с сервером. Проверьте, запущен ли бэкенд.', 0);
    }

    if (response.status === 204) return null;

    let data = null;
    const text = await response.text();
    if (text) {
        try { data = JSON.parse(text); } catch { data = text; }
    }

    if (!response.ok) {
        const message = (data && (data.message || data.error))
            || `Ошибка запроса (${response.status})`;
        throw new ApiError(message, response.status);
    }

    return data;
}

// ---------- Категории меню: фронтовые ключи <-> enum на бэке ----------
export const CATEGORY_MAP = {
    cocktails: 'Коктейли',
    wine: 'Вино',
    beer: 'Пиво',
    snacks: 'Закуски',
    main: 'Основные_блюда',
    desserts: 'Десерты'
};
export const CATEGORY_MAP_REVERSE = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([key, value]) => [value, key])
);

function mapMenuItemFromApi(item) {
    return { ...item, category: CATEGORY_MAP_REVERSE[item.category] || item.category };
}

export const API = {
    // ---------- Auth ----------
    async login(passcode) {
        return request('/api/auth/login', { method: 'POST', body: { Passcode: passcode }, auth: true });
    },
    async logout() {
        return request('/api/auth/logout', { method: 'POST' });
    },

    // ---------- Menu ----------
    async getMenu() {
        const items = await request('/api/menu');
        return (items || []).map(mapMenuItemFromApi);
    },
    async createMenuItem({ name, category, description, price }) {
        return request('/api/menu', {
            method: 'POST',
            body: { Name: name, Category: CATEGORY_MAP[category] || category, Description: description, Price: price }
        });
    },
    async updateMenuItem(id, { name, category, description, price }) {
        return request(`/api/menu/${id}`, {
            method: 'PUT',
            body: { Name: name, Category: CATEGORY_MAP[category] || category, Description: description, Price: price }
        });
    },
    async deleteMenuItem(id) {
        return request(`/api/menu/${id}`, { method: 'DELETE' });
    },

    // ---------- Promotions ----------
    async getPromotions() {
        const promos = await request('/api/promotions');
        return (promos || []).map(p => ({ id: p.id, title: p.title, description: p.description, date: p.endDate }));
    },
    async createPromotion({ title, description, startDate, endDate }) {
        return request('/api/promotions', {
            method: 'POST',
            body: { Title: title, Description: description, StartDate: startDate, EndDate: endDate }
        });
    },
    async deletePromotion(id) {
        return request(`/api/promotions/${id}`, { method: 'DELETE' });
    },

    // ---------- Announcement ----------
    async getAnnouncement() {
        try {
            return await request('/api/announcements/current');
        } catch (e) {
            if (e.status === 404) return null;
            throw e;
        }
    },
    async createAnnouncement(text) {
        return request('/api/announcements', { method: 'POST', body: { Text: text } });
    },
    async updateAnnouncement(id, text) {
        return request(`/api/announcements/${id}`, { method: 'PATCH', body: { Text: text } });
    }
};

export { ApiError };
