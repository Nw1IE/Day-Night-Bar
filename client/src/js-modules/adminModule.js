<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
import {
    menuItems, promotions, announcement, announcementId, isAdminLoggedIn,
    updateMenuItems, updatePromotions, updateAnnouncement, setAdminLoggedIn
} from './dataModule.js';
import { getCategoryName } from './utilsModule.js';
import { formatDate } from './utilsModule.js';
import { renderMenuItems, renderPromotions, updateAnnouncementUI } from '../components/mainPage.js';
import { showErrorModal } from '../components/error.js';
import { showSuccess } from '../components/success.js';
import { API, ApiError } from '../api/api.js';
=======
import { menuApi, promotionsApi, announcementsApi, authApi, ApiError } from '../api/api.js'; 
// Если папка api лежит в корне client, путь должен быть: '../../api/api.js'

import { getCategoryName } from './utilsModule.js'; 
// Если utilsModule лежит в этой же папке Modules. Если он уровнем выше (в js/), то оставь: '../utilsModule.js'

import { changeMenuCategoryElement, getCachedMenuItems, loadAndRenderPublicData } from '../../components/mainPage.js';
// Исправили букву m в mainPage.js и добавили ../, чтобы подняться выше

import { showErrorModal } from '../../components/error.js';
import { showSuccess } from '../../components/success.js';

/**
 * Реальная защита PUT/POST/PATCH/DELETE — на сервере (.RequireAuthorization()
 * + HttpOnly JWT-кука). Этот флаг — только чтобы не рисовать админку тому,
 * кто её не открывал, UI-удобство, а не security-граница.
 */
const ADMIN_UI_FLAG = 'admin_ui_logged_in';
let currentAnnouncementId = null;

function isAdminUiUnlocked() {
    return sessionStorage.getItem(ADMIN_UI_FLAG) === '1';
}

function setAdminUiUnlocked(value) {
    if (value) sessionStorage.setItem(ADMIN_UI_FLAG, '1');
    else sessionStorage.removeItem(ADMIN_UI_FLAG);
}

function handleApiError(err, fallback) {
    const message = err instanceof ApiError ? err.message : fallback;
    showErrorModal(message);
}
>>>>>>> Stashed changes:client/js/Modules/adminModule.js

export function initAdmin() {
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    const currentMenuItemsEl = document.getElementById('currentMenuItems');
    const currentPromotionsEl = document.getElementById('currentPromotions');
    const currentAnnouncementEl = document.getElementById('currentAnnouncement');
    const menuForm = document.getElementById('menuForm');
    const promoForm = document.getElementById('promoForm');
    const announcementForm = document.getElementById('announcementForm');
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js

    function toggleAdminAccessButtons(disable) {
        const loginButtons = [
            document.getElementById('adminAccessBtn'),
            document.getElementById('adminAccessBtnFooter')
        ];

        loginButtons.forEach(btn => {
            if (btn) {
                btn.style.opacity = disable ? '0.5' : '1';
                btn.style.pointerEvents = disable ? 'none' : 'auto';
                btn.title = disable ? 'Администратор уже вошел в систему' : 'Вход в панель управления';
            }
        });
    }

    if (isAdminLoggedIn) {
        toggleAdminAccessButtons(true);
        if (adminPanel) adminPanel.style.display = 'flex';
    }

    function handleApiError(error, fallbackMessage) {
        if (error instanceof ApiError && error.status === 401) {
            setAdminLoggedIn(false);
            if (adminPanel) adminPanel.style.display = 'none';
            toggleAdminAccessButtons(false);
            showErrorModal('Сессия администратора истекла. Пожалуйста, войдите снова.');
            return;
        }
        showErrorModal(error?.message || fallbackMessage);
    }

    const menuCharsRegex = /[^a-zA-Zа-яА-ЯёЁ0-9+(),%:.\s]/g;

    function applyValidation(element, maxLength, regex = null) {
        if (!element) return;
        element.addEventListener('input', function () {
            if (regex) {
                this.value = this.value.replace(regex, '');
            }
            if (this.value.length > maxLength) {
                this.value = this.value.substring(0, maxLength);
            }
        });
    }
=======
    const adminPasswordInput = document.getElementById('adminPassword');
>>>>>>> Stashed changes:client/js/Modules/adminModule.js

    const itemName = document.getElementById('itemName');
    const itemCategory = document.getElementById('itemCategory');
    const itemPrice = document.getElementById('itemPrice');
    const itemDescription = document.getElementById('itemDescription');

    const promoTitle = document.getElementById('promoTitle');
    const promoDescription = document.getElementById('promoDescription');
    const promoDateInput = document.getElementById('promoDate');

    const announcementText = document.getElementById('announcementText');

    const menuCharsRegex = /[^a-zA-Zа-яА-ЯёЁ0-9+(),%:.\s]/g;
    function applyValidation(element, maxLength, regex = null) {
        if (!element) return;
        element.addEventListener('input', function () {
            if (regex) this.value = this.value.replace(regex, '');
            if (this.value.length > maxLength) this.value = this.value.substring(0, maxLength);
        });
    }
    applyValidation(itemName, 50, menuCharsRegex);
    applyValidation(itemDescription, 200, menuCharsRegex);
    applyValidation(promoTitle, 100);
    applyValidation(promoDescription, 500);
    applyValidation(announcementText, 300);

    if (promoDateInput) {
        const today = new Date().toISOString().split('T')[0];
        const currentYear = new Date().getFullYear();
        const lastDayOfYear = `${currentYear}-12-31`;
        promoDateInput.setAttribute('min', today);
        promoDateInput.setAttribute('max', lastDayOfYear);
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js

=======
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
        promoDateInput.addEventListener('change', function () {
            if (this.value < today) this.value = today;
            else if (this.value > lastDayOfYear) this.value = lastDayOfYear;
        });
    }

    function isFieldInvalid(value) {
        return !value || value.trim().length === 0;
    }

    // ---------- MENU ----------

    async function renderCurrentMenuItems() {
        const items = getCachedMenuItems();
        currentMenuItemsEl.innerHTML = '';
        if (items.length === 0) {
            currentMenuItemsEl.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Меню пусто</p>';
            return;
        }
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
        adminLogin.style.display = 'flex';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }

    function renderCurrentMenuItems() {
        currentMenuItems.innerHTML = '';
        if (menuItems.length === 0) {
            currentMenuItems.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Меню пусто</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        menuItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-list-item';
            itemElement.innerHTML = `
=======

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'item-list-item';
            el.innerHTML = `
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
                <div class="item-list-info">
                    <h5>${escapeHtml(item.name)}</h5>
                    <p>${escapeHtml(item.description)}</p>
                    <small>Категория: ${escapeHtml(getCategoryName(item.category))}</small>
                </div>
                <div class="item-list-price">${escapeHtml(item.price)} ₽</div>
                <div class="item-list-actions">
                    <button class="item-list-btn edit" data-id="${item.id}">Изменить</button>
                    <button class="item-list-btn delete" data-id="${item.id}">Удалить</button>
                </div>
            `;
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
            fragment.appendChild(itemElement);
=======
            currentMenuItemsEl.appendChild(el);
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
        });
        currentMenuItems.appendChild(fragment);

<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
        currentMenuItems.querySelectorAll('.item-list-btn.delete').forEach(button => {
            button.addEventListener('click', async function () {
                if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');
                const id = parseInt(this.getAttribute('data-id'));
                if (!confirm('Удалить эту позицию?')) return;
                try {
                    await API.deleteMenuItem(id);
                    updateMenuItems(menuItems.filter(item => item.id !== id));
                    renderCurrentMenuItems();
                    renderMenuItems('all');
                } 
                catch (e) {
                    handleApiError(e, 'Не удалось удалить позицию меню.');
=======
        currentMenuItemsEl.querySelectorAll('.item-list-btn.delete').forEach(button => {
            button.addEventListener('click', async function () {
                const id = parseInt(this.getAttribute('data-id'), 10);
                if (!confirm('Удалить эту позицию?')) return;
                try {
                    await menuApi.deleteMenuItem(id);
                    await refreshMenuData();
                    showSuccess('Позиция удалена', 'Позиция была удалена из меню.');
                } catch (err) {
                    handleApiError(err, 'Не удалось удалить позицию меню.');
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
                }
            });
        });

<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
        currentMenuItems.querySelectorAll('.item-list-btn.edit').forEach(button => {
            button.addEventListener('click', function () {
                if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

                const modalHeader = document.querySelector('#adminDashboardModal .modal-header');
                if (modalHeader) modalHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });

                const id = parseInt(this.getAttribute('data-id'));
                const item = menuItems.find(i => i.id === id);
                if (!item) return;

                document.getElementById('itemName').value = item.name;
                document.getElementById('itemCategory').value = item.category;
                document.getElementById('itemPrice').value = item.price;
                document.getElementById('itemDescription').value = item.description;
=======
        currentMenuItemsEl.querySelectorAll('.item-list-btn.edit').forEach(button => {
            button.addEventListener('click', function () {
                const modalHeader = document.querySelector('#adminDashboardModal .modal-header');
                if (modalHeader) modalHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });

                const id = parseInt(this.getAttribute('data-id'), 10);
                const item = items.find(i => i.id === id);
                if (!item) return;

                itemName.value = item.name;
                itemCategory.value = item.category;
                itemPrice.value = item.price;
                itemDescription.value = item.description;
>>>>>>> Stashed changes:client/js/Modules/adminModule.js

                const submitBtn = menuForm.querySelector('.btn');
                submitBtn.textContent = 'Сохранить изменения';

                menuForm.onsubmit = async function (e) {
                    e.preventDefault();
                    if (isFieldInvalid(itemName.value) || isFieldInvalid(itemPrice.value)) {
                        return showErrorModal('Заполните обязательные поля корректно');
                    }
                    try {
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
                        await API.updateMenuItem(id, {
                            name: itemName.value,
                            category: document.getElementById('itemCategory').value,
                            price: parseInt(itemPrice.value),
                            description: itemDescription.value
                        });
                        item.name = itemName.value;
                        item.category = document.getElementById('itemCategory').value;
                        item.price = parseInt(itemPrice.value);
                        item.description = itemDescription.value;

                        menuForm.reset();
                        submitBtn.textContent = 'Добавить в меню';
                        menuForm.onsubmit = defaultMenuSubmit;

                        renderCurrentMenuItems();
                        renderMenuItems('all');
=======
                        await menuApi.updateMenuItem(id, {
                            name: itemName.value,
                            category: itemCategory.value,
                            price: parseFloat(itemPrice.value),
                            description: itemDescription.value
                        });
                        menuForm.reset();
                        submitBtn.textContent = 'Добавить в меню';
                        menuForm.onsubmit = defaultMenuSubmit;
                        await refreshMenuData();
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
                        showSuccess('Позиция обновлена', `Позиция "${item.name}" была успешно обновлена в меню.`);
                    } 
                    catch (err) {
                        handleApiError(err, 'Не удалось обновить позицию меню.');
                    }
                };
            });
        });
    }

    const defaultMenuSubmit = async function (e) {
        e.preventDefault();
        if (isFieldInvalid(itemName.value) || isFieldInvalid(itemPrice.value) || isFieldInvalid(itemDescription.value)) {
            return showErrorModal('Пожалуйста, заполните все поля меню');
        }
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js

        try {
            const created = await API.createMenuItem({
                name: itemName.value,
                category: document.getElementById('itemCategory').value,
                price: parseInt(itemPrice.value),
                description: itemDescription.value
            });

            updateMenuItems([...menuItems, {
                id: created.id,
                name: itemName.value,
                category: document.getElementById('itemCategory').value,
                price: parseInt(itemPrice.value),
                description: itemDescription.value
            }]);

            menuForm.reset();
            renderCurrentMenuItems();
            renderMenuItems('all');
=======
        try {
            await menuApi.createMenuItem({
                name: itemName.value,
                category: itemCategory.value,
                price: parseFloat(itemPrice.value),
                description: itemDescription.value
            });
            menuForm.reset();
            await refreshMenuData();
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
            showSuccess('Позиция добавлена', `Позиция "${itemName.value}" была успешно добавлена в меню.`);
        } 
        catch (err) {
            handleApiError(err, 'Не удалось добавить позицию меню.');
        }
    };
    if (menuForm) menuForm.onsubmit = defaultMenuSubmit;

    async function refreshMenuData() {
        await loadAndRenderPublicData(); // обновит и публичный список, и кэш
        await renderCurrentMenuItems();
    }

    // ---------- PROMOTIONS ----------

    async function renderCurrentPromotions() {
        let promotions;
        try {
            promotions = await promotionsApi.getAllPromotions();
        } catch (err) {
            handleApiError(err, 'Не удалось загрузить список акций.');
            return;
        }

        currentPromotionsEl.innerHTML = '';
        if (promotions.length === 0) {
            currentPromotionsEl.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Акции отсутствуют</p>';
            return;
        }

<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
    function renderCurrentPromotions() {
        currentPromotions.innerHTML = '';
        if (promotions.length === 0) {
            currentPromotions.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Акции отсутствуют</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
=======
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
        promotions.forEach(promo => {
            const el = document.createElement('div');
            el.className = 'item-list-item';
            el.innerHTML = `
                <div class="item-list-info">
                    <h5>${escapeHtml(promo.title)}</h5>
                    <p>${escapeHtml(promo.description)}</p>
                    <small>До: ${escapeHtml(new Date(promo.endDate).toLocaleDateString('ru-RU'))}</small>
                </div>
                <div class="item-list-actions">
                    <button class="item-list-btn delete" data-id="${promo.id}">Удалить</button>
                </div>
            `;
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
            fragment.appendChild(el);
=======
            currentPromotionsEl.appendChild(el);
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
        });
        currentPromotions.appendChild(fragment);

<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
        currentPromotions.querySelectorAll('.item-list-btn.delete').forEach(button => {
            button.addEventListener('click', async function () {
                if (!isAdminLoggedIn) return;
                const id = parseInt(this.getAttribute('data-id'));
                if (!confirm('Удалить эту акцию?')) return;
                try {
                    await API.deletePromotion(id);
                    updatePromotions(promotions.filter(p => p.id !== id));
                    renderCurrentPromotions();
                    renderPromotions();
                } 
                catch (e) {
                    handleApiError(e, 'Не удалось удалить акцию.');
=======
        currentPromotionsEl.querySelectorAll('.item-list-btn.delete').forEach(button => {
            button.addEventListener('click', async function () {
                const id = parseInt(this.getAttribute('data-id'), 10);
                if (!confirm('Удалить эту акцию?')) return;
                try {
                    await promotionsApi.deletePromotion(id);
                    await renderCurrentPromotions();
                    await loadAndRenderPublicData();
                    showSuccess('Акция удалена', 'Акция была удалена.');
                } catch (err) {
                    handleApiError(err, 'Не удалось удалить акцию.');
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
                }
            });
        });
    }

<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
    function renderCurrentAnnouncement() {
        document.getElementById('currentAnnouncement').innerHTML = `
            <div class="item-list-item">
                <div class="item-list-info">
                    <h5>Текущее объявление</h5><p>${announcement || 'Объявление не опубликовано'}</p>
                </div>
            </div>`;
    }

    const adminBtn = document.getElementById('adminAccessBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => { adminLogin.style.display = 'flex'; });
    }

    document.getElementById('loginBtn').addEventListener('click', async () => {
        const passcode = document.getElementById('adminPassword').value;
        try {
            await API.login(passcode);
            setAdminLoggedIn(true);
            adminLogin.style.display = 'none';
            adminPanel.style.display = 'flex';
            toggleAdminAccessButtons(true);
            showSuccess('Добро пожаловать, администратор!', 'Вы успешно вошли в админ-панель. Теперь вы можете управлять меню, акциями и объявлениями.');
        } 
        catch (err) {
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').focus();
            if (err instanceof ApiError && err.status === 403) {
                showErrorModal('Доступ временно заблокирован. Попробуйте позже.');
            } 
            else {
                showErrorModal('Неверный пароль!');
            }
=======
    if (promoForm) {
        promoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isFieldInvalid(promoTitle.value) || isFieldInvalid(promoDescription.value) || isFieldInvalid(promoDateInput.value)) {
                return showErrorModal('Пожалуйста, заполните все поля акции');
            }
            try {
                await promotionsApi.createPromotion({
                    title: promoTitle.value,
                    description: promoDescription.value,
                    startDate: new Date().toISOString(),
                    endDate: new Date(promoDateInput.value).toISOString()
                });
                promoForm.reset();
                await renderCurrentPromotions();
                await loadAndRenderPublicData();
                showSuccess('Акция добавлена', 'Новая акция была успешно добавлена.');
            } catch (err) {
                handleApiError(err, 'Не удалось добавить акцию.');
            }
        });
    }

    // ---------- ANNOUNCEMENT ----------

    async function renderCurrentAnnouncement() {
        let announcement;
        try {
            announcement = await announcementsApi.getCurrentAnnouncement();
        } catch (err) {
            handleApiError(err, 'Не удалось загрузить объявление.');
            return;
        }

        currentAnnouncementId = announcement ? announcement.id : null;
        currentAnnouncementEl.innerHTML = announcement
            ? `<div class="item-list-item"><div class="item-list-info"><h5>Текущее объявление</h5><p>${escapeHtml(announcement.text)}</p></div>
               <div class="item-list-actions"><button class="item-list-btn delete" id="deleteAnnouncementBtn">Удалить</button></div></div>`
            : '<p style="color: rgba(255, 255, 255, 0.7);">Активных объявлений нет</p>';

        const deleteBtn = document.getElementById('deleteAnnouncementBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                if (!confirm('Удалить объявление?')) return;
                try {
                    await announcementsApi.deleteAnnouncement(currentAnnouncementId);
                    await renderCurrentAnnouncement();
                    await loadAndRenderPublicData();
                    showSuccess('Объявление удалено', 'Объявление было удалено.');
                } catch (err) {
                    handleApiError(err, 'Не удалось удалить объявление.');
                }
            });
        }
    }

    if (announcementForm) {
        announcementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = announcementText.value;
            if (isFieldInvalid(text)) return showErrorModal('Введите текст объявления');

            try {
                if (currentAnnouncementId) {
                    await announcementsApi.updateAnnouncement(currentAnnouncementId, text);
                } else {
                    await announcementsApi.createAnnouncement(text);
                }
                announcementForm.reset();
                await renderCurrentAnnouncement();
                await loadAndRenderPublicData();
                showSuccess('Объявление опубликовано', 'Объявление было успешно опубликовано на сайте.');
            } catch (err) {
                handleApiError(err, 'Не удалось опубликовать объявление.');
            }
        });
    }

    // ---------- AUTH ----------

    function showAdminLogin() {
        adminLogin.style.display = 'flex';
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
    }

    async function performLogin() {
        try {
            await authApi.login(adminPasswordInput.value);
            setAdminUiUnlocked(true);
            adminLogin.style.display = 'none';
            adminPanel.style.display = 'flex';
            showSuccess('Добро пожаловать, администратор!', 'Вы успешно вошли в админ-панель.');
        } catch (err) {
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
            handleApiError(err, 'Неверный пароль или сервер недоступен.');
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
        }
    }

    document.getElementById('loginBtn').addEventListener('click', performLogin);
    adminPasswordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); performLogin(); }
    });

    document.getElementById('adminDashboardBtn').addEventListener('click', async () => {
        if (!isAdminUiUnlocked()) return showAdminLogin();
        adminDashboardModal.style.display = 'flex';
        await renderCurrentMenuItems();
        await renderCurrentPromotions();
        await renderCurrentAnnouncement();
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
        try { await API.logout(); } catch { /* даже если запрос не прошёл, разлогиниваем локально */ }
        setAdminLoggedIn(false);
        adminPanel.style.display = 'none';
        toggleAdminAccessButtons(false);
        showSuccess('До свидания!', 'Вы успешно вышли из админ-панели. До новых встреч!');
=======
        try {
            await authApi.logout();
        } finally {
            setAdminUiUnlocked(false);
            adminPanel.style.display = 'none';
            showSuccess('До свидания!', 'Вы успешно вышли из админ-панели.');
        }
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
    });

    document.getElementById('closeDashboardModal').addEventListener('click', () => adminDashboardModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === adminDashboardModal) adminDashboardModal.style.display = 'none';
        if (e.target === adminLogin) adminLogin.style.display = 'none';
    });

    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab, .admin-tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.getAttribute('data-tab')}-tab`).classList.add('active');
        });
    });

<<<<<<< Updated upstream:client/src/js-modules/adminModule.js
    promoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

        if (isFieldInvalid(promoTitle.value) || isFieldInvalid(promoDescription.value) || isFieldInvalid(promoDateInput.value)) {
            return showErrorModal('Пожалуйста, заполните все поля акции');
        }

        try {
            const startDate = new Date().toISOString();
            const endDate = new Date(`${promoDateInput.value}T23:59:59`).toISOString();
            const created = await API.createPromotion({
                title: promoTitle.value,
                description: promoDescription.value,
                startDate,
                endDate
            });

            updatePromotions([...promotions, {
                id: created.id,
                title: promoTitle.value,
                description: promoDescription.value,
                date: promoDateInput.value
            }]);

            promoForm.reset();
            renderCurrentPromotions();
            renderPromotions();
            showSuccess('Акция добавлена', 'Новая акция была успешно добавлена.');
        } catch (err) {
            handleApiError(err, 'Не удалось добавить акцию.');
        }
    });

    if (announcementForm) {
        announcementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

            const text = announcementText.value;
            if (isFieldInvalid(text)) return showErrorModal('Введите текст объявления');

            try {
                const result = announcementId
                    ? await API.updateAnnouncement(announcementId, text)
                    : await API.createAnnouncement(text);

                updateAnnouncement(result.text, result.id);
                updateAnnouncementUI();
                announcementForm.reset();
                renderCurrentAnnouncement();
                showSuccess('Объявление опубликовано', 'Новое объявление было успешно опубликовано на сайте.');
            } 
            catch (err) {
                handleApiError(err, 'Не удалось опубликовать объявление.');
            }
        });
    }
}
=======
    if (isAdminUiUnlocked()) {
        adminPanel.style.display = 'flex';
    }
}
>>>>>>> Stashed changes:client/js/Modules/adminModule.js
