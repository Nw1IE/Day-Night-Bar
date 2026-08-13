import { request, BASE_URL } from "../api.js";

export const authApi = {
    login: (credentials) => {
        const passcode = typeof credentials === 'object' && credentials !== null
            ? (credentials.password || credentials.passcode || credentials.Passcode || '')
            : (credentials || '');

        return request('/auth/login', { 
            method: 'POST', 
            headers: {
                'X-Admin-Client-Key': window.adminClientKey || ''
            },
            body: { Passcode: passcode }
        });
    },
    logout: () => request('/auth/logout', { method: 'POST' })
};