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

export function initAdmin() {
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    const currentMenuItems = document.getElementById('currentMenuItems');
    const currentPromotions = document.getElementById('currentPromotions');
    const menuForm = document.getElementById('menuForm');
    const promoForm = document.getElementById('promoForm');
    const announcementForm = document.getElementById('announcementForm');

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

    const itemName = document.getElementById('itemName');
    const itemDescription = document.getElementById('itemDescription');
    const itemPrice = document.getElementById('itemPrice');
    applyValidation(itemName, 50, menuCharsRegex);
    applyValidation(itemDescription, 200, menuCharsRegex);

    const promoTitle = document.getElementById('promoTitle');
    const promoDescription = document.getElementById('promoDescription');
    const promoDateInput = document.getElementById('promoDate');
    applyValidation(promoTitle, 100);
    applyValidation(promoDescription, 500);

    if (promoDateInput) {
        const today = new Date().toISOString().split('T')[0];
        const currentYear = new Date().getFullYear();
        const lastDayOfYear = `${currentYear}-12-31`;

        promoDateInput.setAttribute('min', today);
        promoDateInput.setAttribute('max', lastDayOfYear);

        promoDateInput.addEventListener('change', function () {
            if (this.value < today) this.value = today;
            else if (this.value > lastDayOfYear) this.value = lastDayOfYear;
        });
    }

    const announcementText = document.getElementById('announcementText');
    applyValidation(announcementText, 300);

    function isFieldInvalid(value) {
        return !value || value.trim().length === 0;
    }

    function showAdminLogin() {
        if (isAdminLoggedIn) {
            showErrorModal('Вы уже авторизованы как администратор!');
            return;
        }
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
                <div class="item-list-info">
                    <h5>${item.name}</h5>
                    <p>${item.description}</p>
                    <small>Категория: ${getCategoryName(item.category)}</small>
                </div>
                <div class="item-list-price">${item.price} ₽</div>
                <div class="item-list-actions">
                    <button class="item-list-btn edit" data-id="${item.id}">Изменить</button>
                    <button class="item-list-btn delete" data-id="${item.id}">Удалить</button>
                </div>
            `;
            fragment.appendChild(itemElement);
        });
        currentMenuItems.appendChild(fragment);

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
                } catch (e) {
                    handleApiError(e, 'Не удалось удалить позицию меню.');
                }
            });
        });

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

                const submitBtn = menuForm.querySelector('.btn');
                submitBtn.textContent = 'Сохранить изменения';

                menuForm.onsubmit = async function (e) {
                    e.preventDefault();
                    if (isFieldInvalid(itemName.value) || isFieldInvalid(itemPrice.value)) {
                        return showErrorModal('Заполните обязательные поля корректно');
                    }
                    try {
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
                        showSuccess('Позиция обновлена', `Позиция "${item.name}" была успешно обновлена в меню.`);
                    } catch (err) {
                        handleApiError(err, 'Не удалось обновить позицию меню.');
                    }
                };
            });
        });
    }

    const defaultMenuSubmit = async function (e) {
        e.preventDefault();
        if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

        if (isFieldInvalid(itemName.value) || isFieldInvalid(itemPrice.value) || isFieldInvalid(itemDescription.value)) {
            return showErrorModal('Пожалуйста, заполните все поля меню');
        }

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
            showSuccess('Позиция добавлена', `Позиция "${itemName.value}" была успешно добавлена в меню.`);
        } catch (err) {
            handleApiError(err, 'Не удалось добавить позицию меню.');
        }
    };
    menuForm.onsubmit = defaultMenuSubmit;

    function renderCurrentPromotions() {
        currentPromotions.innerHTML = '';
        if (promotions.length === 0) {
            currentPromotions.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Акции отсутствуют</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        promotions.forEach(promo => {
            const el = document.createElement('div');
            el.className = 'item-list-item';
            el.innerHTML = `
                <div class="item-list-info">
                    <h5>${promo.title}</h5>
                    <p>${promo.description}</p>
                    <small>Действует до: ${formatDate(promo.date)}</small>
                </div>
                <div class="item-list-actions">
                    <button class="item-list-btn delete" data-id="${promo.id}">Удалить</button>
                </div>
            `;
            fragment.appendChild(el);
        });
        currentPromotions.appendChild(fragment);

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
                } catch (e) {
                    handleApiError(e, 'Не удалось удалить акцию.');
                }
            });
        });
    }

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
        } catch (err) {
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').focus();
            if (err instanceof ApiError && err.status === 403) {
                showErrorModal('Доступ временно заблокирован. Попробуйте позже.');
            } else {
                showErrorModal('Неверный пароль!');
            }
        }
    });

    document.getElementById('adminDashboardBtn').addEventListener('click', () => {
        if (!isAdminLoggedIn) return showAdminLogin();
        adminDashboardModal.style.display = 'flex';
        renderCurrentMenuItems();
        renderCurrentPromotions();
        renderCurrentAnnouncement();
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try { await API.logout(); } catch { /* даже если запрос не прошёл, разлогиниваем локально */ }
        setAdminLoggedIn(false);
        adminPanel.style.display = 'none';
        toggleAdminAccessButtons(false);
        showSuccess('До свидания!', 'Вы успешно вышли из админ-панели. До новых встреч!');
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
            } catch (err) {
                handleApiError(err, 'Не удалось опубликовать объявление.');
            }
        });
    }
}
