import { request } from "../api.js";

export const announcementsApi = {
    getAll: () => request('/announcements'),
    create: (data) => request('/announcements', { method: 'POST', body: data }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
};

export async function getAnnouncement() {
    try {
        return await request(`/announcements/current?_t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        });
    } catch (e) {
        console.error('Ошибка загрузки объявления', e);
        return null;
    }
}

// Рендер баннера на главной странице
export async function renderAnnouncementBanner() {
    // Выбираем блок объявления (подставь класс своей желтой плашки)
    const bannerElement = document.querySelector('.announcement-banner p, .announcement-bar p, .banner p'); 
    
    const announcement = await getAnnouncement();
    
    if (bannerElement && announcement && announcement.text) {
        bannerElement.textContent = announcement.text;
    }
}