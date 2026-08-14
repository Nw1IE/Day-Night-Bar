import { request, BASE_URL } from "../api.js";

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH;
const ADMIN_CLIENT_KEY = import.meta.env.VITE_ADMIN_CLIENT_KEY;

export const authApi = {
    login: (credentials) => {
        const passcode = typeof credentials === 'object' && credentials !== null
            ? (credentials.password || credentials.passcode || credentials.Passcode || '')
            : (credentials || '');

        return request(`/auth/${GATEWAY_PATH}`, { 
            method: 'POST',
            headers: {
                'X-Admin-Client-Key': ADMIN_CLIENT_KEY
            },
            body: { Passcode: passcode }
        });
    },
    logout: () => request('/auth/logout', { method: 'POST', credentials: 'include' }),
}