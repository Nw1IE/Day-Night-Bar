import { request } from "../api.js";

export const announcementsApi = {
    getAll: () => request('/announcements'),
    create: (data) => request('/announcements', { method: 'POST', body: data }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
};

export async function getAnnouncement() {
    try {
        return await request('/announcements/current');
    } catch (e) {
        console.error('Ошибка загрузки объявления', e);
        return null;
    }
}