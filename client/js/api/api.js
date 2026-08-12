export const BASE_URL = '/api';

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    options.credentials = options.credentials || 'include';

    // Автоматически добавляем заголовок с ключом и Content-Type ко всем запросам
    options.headers = {
        'Content-Type': 'application/json',
        'X-Admin-Client-Key': 'FallbackKeyMakeSureItsLongEnough123!',
        ...options.headers
    };

    if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new ApiError(result.message || result.error || 'Ошибка сервера', response.status, result);
        }
        return result;
    } 
    catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(error.message || 'Сетевая ошибка', 500);
    }
}