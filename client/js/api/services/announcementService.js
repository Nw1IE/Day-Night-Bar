import { request } from "../api.js";

export const announcementsApi = {
    getCurrent: () => request('/announcements/current'),
    create: (data) => request('/announcements', { method: 'POST', body: data }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
};

export async function getAnnouncement() {
    try {
        return await request('/announcements/current');
    } 
    catch (e) {
        // Если объявления нет (404) или сервер недоступен, возвращаем null
        return null;
    }
}
