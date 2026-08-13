import { request } from '../api.js';

export const promotionsApi = {
    getAll: () => request('/promotions'),
    create: (data) => request('/promotions', { method: 'POST', body: data }),
    delete: (id) => request(`/promotions/${id}`, { method: 'DELETE' }),
};