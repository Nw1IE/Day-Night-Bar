import { request } from "../api.js";

export const menuApi = {
    getAll: () => request('/menu'),
    getById: (id) => request(`/menu/${id}`),
    create: (data) => request('/menu', { method: 'POST', body: data }),
    update: (id, data) => request(`/menu/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/menu/${id}`, { method: 'DELETE' }),
};