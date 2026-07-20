// 1. Базовый URL (без rewrite в прокси, летит полный путь /api/auth/login)
const BASE_URL = '/api'; 

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new ApiError(result.message || 'Ошибка сервера', response.status, result);
        }

        return result;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(error.message || 'Сетевая ошибка', 500);
    }
}

// 3. Модуль Меню с поддержкой имен из adminModule.js
export const menuApi = {
    getAll: () => request('/menu'),
    getById: (id) => request(`/menu/${id}`),
    create: (data) => request('/menu', { method: 'POST', body: data }),
    update: (id, data) => request(`/menu/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/menu/${id}`, { method: 'DELETE' }),
    
    // Алиасы для adminModule.js:
    createMenuItem: (data) => request('/menu', { method: 'POST', body: data }),
    updateMenuItem: (id, data) => request(`/menu/${id}`, { method: 'PUT', body: data }),
    deleteMenuItem: (id) => request(`/menu/${id}`, { method: 'DELETE' })
};

// 4. Модуль Акций с поддержкой имен из adminModule.js
export const promotionsApi = {
    getAll: () => request('/promotions'),
    create: (data) => request('/promotions', { method: 'POST', body: data }),
    delete: (id) => request(`/promotions/${id}`, { method: 'DELETE' }),
    
    // Алиасы для adminModule.js:
    getAllPromotions: () => request('/promotions'),
    createPromotion: (data) => request('/promotions', { method: 'POST', body: data }),
    deletePromotion: (id) => request(`/promotions/${id}`, { method: 'DELETE' })
};

// 5. Модуль Объявлений с поддержкой имен из adminModule.js
export const announcementsApi = {
    getAll: () => request('/announcements'),
    create: (data) => request('/announcements', { method: 'POST', body: data }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
    
    // Алиасы для adminModule.js:
    getCurrentAnnouncement: async () => {
        // Бэкенд возвращает массив, админка ждет один объект или null
        const list = await request('/announcements').catch(() => []);
        return list && list.length > 0 ? list[0] : null;
    },
    createAnnouncement: (text) => request('/announcements', { method: 'POST', body: { text } }),
    updateAnnouncement: (id, text) => request(`/announcements/${id}`, { method: 'PUT', body: { text } }),
    deleteAnnouncement: (id) => request(`/announcements/${id}`, { method: 'DELETE' })
};

export const announcementApi = announcementsApi;

// 6. Модуль Авторизации (Умный разбор: принимает и строку, и объект)
export const authApi = {
    login: (credentials) => {
        // Если прилетела просто строка (как из adminModule), заворачиваем в объект Passcode
        const passcode = typeof credentials === 'object' 
            ? (credentials.password || credentials.passcode || credentials.Passcode)
            : credentials;

        return request('/auth/login', { 
            method: 'POST', 
            body: { Passcode: passcode }
        });
    },
    logout: () => request('/auth/logout', { method: 'POST' }),
    check: () => request('/auth/check')
};