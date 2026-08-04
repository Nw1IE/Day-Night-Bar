import { BASE_URL } from "../api.js"

export const announcementsApi = {
    getAll: () => request('/announcements'),
    create: (data) => request('/announcements', { method: 'POST', body: data }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
};