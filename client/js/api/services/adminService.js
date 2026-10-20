import { request, BASE_URL } from "../api.js";

export const AdminApi = {
    // announcement
    getCurrentAnnouncement: async () => {
        try {
            return await request('/announcements/current');
        } 
        catch {
            return null;
        }
    },
    createAnnouncement: (text) => request('/announcements', { method: 'POST', body: { text } }),
    updateAnnouncement: (id, text) => request(`/announcements/${id}`, { method: 'PATCH', body: { text } }),
    deleteAnnouncement: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),

    // menu
    createMenuItem: (data) => request('/menu', { method: 'POST', body: data }),
    updateMenuItem: (id, data) => request(`/menu/${id}`, { method: 'PUT', body: data }),
    deleteMenuItem: (id) => request(`/menu/${id}`, { method: 'DELETE' }),

    // promotions
    getAllPromotions: () => request('/promotions/all'),
    createPromotion: (data) => request('/promotions', { method: 'POST', body: data }),
    deletePromotion: (id) => request(`/promotions/${id}`, { method: 'DELETE' })
};
