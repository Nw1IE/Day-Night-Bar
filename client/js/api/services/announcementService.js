import { request } from "../api.js";

export const announcementsApi = {
    getAll: () => request('/announcements', { method: 'POST' }),
    create: (data) => request('/announcements', { method: 'POST', body: data }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
};

export async function getAnnouncement() {
    try {
        const response = await fetch('/api/announcements/current');
        if (!response.ok) return null;
        return await response.json();
    } 
    catch (e) {
        console.error('Ошибка загрузки объявления', e);
        return null;
    }
}
