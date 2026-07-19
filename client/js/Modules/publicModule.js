import { initCategoryFilters } from '../../components/mainPage.js'; // Добавили еще одну пару точек
/**
 * Раньше тут же жила вся логика формы бронирования (#bookingForm, маска
 * телефона, валидация имени/даты, POST на /api/bookings, которого даже
 * нет в ТЗ/контроллерах). Блок бронирования убран из ТЗ №16 полностью —
 * секция #reservation вырезана из index.html, вся её обработка отсюда тоже.
 */
export function initPublicEvents() {
    initCategoryFilters();
}