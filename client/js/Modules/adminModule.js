import { formatDate, getCategoryName } from './utilsModule.js';
import { renderMenuItems, renderPromotions, updateAnnouncementUI } from './renderModule.js';
import { showErrorModal } from '../../components/error.js';
import { showSuccess } from '../../components/success.js';
import { openDeleteModal } from '../../components/delete.js';
import { request } from '../api/api.js';

export function initAdmin() {
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    const currentMenuItems = document.getElementById('currentMenuItems');
    const currentPromotions = document.getElementById('currentPromotions');
    const menuForm = document.getElementById('menuForm');
    const promoForm = document.getElementById('promoForm');
    const announcementForm = document.getElementById('announcementForm');

    let currentEditingId = null;
    let isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    
    let menuItems = [];
    let promotions = [];
    let announcement = '';

    function checkAuthStatus() {
        isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
        toggleAdminAccessButtons(isAdminLoggedIn);
    }

    async function loadAdminData() {
        try {
            const [menuRes, promoRes, annRes] = await Promise.all([
                request('/menu'),
                request('/promotions/all'),
                request('/announcements/current')
            ]);

            menuItems = menuRes;
            promotions = promoRes;
            announcement = annRes.text || '';
        } 
        catch (e) {
            console.warn('Админ-данные недоступны (требуется вход)', e);
        }
    }

    function resetMenuForm() {
        if (!menuForm) return;
        menuForm.reset();
        currentEditingId = null;

        const fileNameDisplay = document.getElementById('fileName');
        const label = document.querySelector('label[for="itemImageFile"]');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = 'Файл не выбран';
            fileNameDisplay.style.color = '#888';
        }
        if (label) {
            label.style.borderColor = '#d4af37';
            label.style.color = '#d4af37';
        }

        const submitBtn = menuForm.querySelector('.btn');
        if (submitBtn) submitBtn.textContent = 'Добавить в меню';
    }

    function toggleAdminAccessButtons(isLoggedIn) {
        const floatingAdminPanel = document.getElementById('adminPanel') || document.querySelector('.admin-floating-panel');
        
        if (floatingAdminPanel) {
            if (isLoggedIn) {
                floatingAdminPanel.style.display = 'flex';
                floatingAdminPanel.style.opacity = '1';
                floatingAdminPanel.style.pointerEvents = 'auto';
            } 
            else {
                floatingAdminPanel.style.display = 'none';
            }
        }
    }

    checkAuthStatus();

    const menuCharsRegex = /[^a-zA-Zа-яА-ЯёЁ0-9+(),%:.\s]/g;

    function applyValidation(element, maxLength, regex = null) {
        if (!element) return;
        element.addEventListener('input', function() {
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
        
        promoDateInput.addEventListener('change', function() {
            if (this.value < today) {
                this.value = today;
            } 
            else if (this.value > lastDayOfYear) {
                this.value = lastDayOfYear;
            }
        });
    }

    const announcementText = document.getElementById('announcementText');
    applyValidation(announcementText, 300);

    function isFieldInvalid(value) {
        return !value || value.trim().length === 0;
    }

    async function showAdminLogin() {
        checkAuthStatus();
        
        if (isAdminLoggedIn) {
            if (adminDashboardModal) {
                adminDashboardModal.style.display = 'flex';
                await loadAdminData();
                renderCurrentMenuItems();
                renderCurrentPromotions();
                renderCurrentAnnouncement();
            }
            return;
        }

        if (adminLogin && adminLogin.style.display === 'flex') return;

        if (adminLogin) {
            adminLogin.style.display = 'flex';
            const pwd = document.getElementById('adminPassword');
            
            if (pwd) {
                pwd.value = '';
                if (document.activeElement && typeof document.activeElement.blur === 'function') {
                    document.activeElement.blur();
                }
                setTimeout(() => {
                    pwd.focus();
                    pwd.select();
                }, 50);
            }
        }
    }

    function renderCurrentMenuItems() {
        if (!currentMenuItems) return;
        currentMenuItems.innerHTML = '';
        if (menuItems.length === 0) {
            currentMenuItems.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Меню пусто</p>';
            return;
        }
        
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
            currentMenuItems.appendChild(itemElement);
        });

        currentMenuItems.querySelectorAll('.item-list-btn.delete').forEach(button => {
            button.addEventListener('click', function() {
                if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');
                const id = parseInt(this.getAttribute('data-id'), 10);
                
                openDeleteModal(async () => {
                    try {
                        await request(`/menu/${id}`, { method: 'DELETE' });
                        
                        menuItems = menuItems.filter(item => item.id !== id);
                        renderCurrentMenuItems();
                        renderMenuItems('all');
                    } 
                    catch (err) {
                        showErrorModal('Не удалось удалить позицию с сервера.');
                    }
                });
            });
        });

        currentMenuItems.querySelectorAll('.item-list-btn.edit').forEach(button => {
            button.addEventListener('click', function() {
                if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

                const modalHeader = document.querySelector('#adminDashboardModal .modal-header');
                if (modalHeader) {
                    modalHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                const id = parseInt(this.getAttribute('data-id'), 10);
                const item = menuItems.find(i => i.id === id);
                if (item && menuForm) {
                    currentEditingId = id;
                    document.getElementById('itemName').value = item.name;
                    document.getElementById('itemCategory').value = item.category;
                    document.getElementById('itemPrice').value = item.price;
                    document.getElementById('itemDescription').value = item.description;
                    
                    const submitBtn = menuForm.querySelector('.btn');
                    if (submitBtn) submitBtn.textContent = 'Сохранить изменения';
                }
            });
        });
    }

    if (menuForm) {
        menuForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

            const editingId = currentEditingId;
            const nameVal = document.getElementById('itemName').value;
            const catVal = document.getElementById('itemCategory').value;
            const priceVal = document.getElementById('itemPrice').value;
            const descVal = document.getElementById('itemDescription').value;

            if (isFieldInvalid(nameVal) || isFieldInvalid(priceVal) || isFieldInvalid(descVal)) {
                return showErrorModal('Пожалуйста, заполните все поля меню');
            }

            try {
                const payload = {
                    name: nameVal,
                    category: catVal,
                    description: descVal,
                    price: parseFloat(priceVal)
                };

                let savedItem;
                if (editingId !== null) {
                    savedItem = await request(`/menu/${editingId}`, {
                        method: 'PUT',
                        body: payload
                    });
                    menuItems = menuItems.map(item => item.id === editingId ? savedItem : item);
                    showSuccess('Позиция обновлена', `Позиция "${nameVal}" успешно изменена.`);
                } 
                else {
                    savedItem = await request('/menu', {
                        method: 'POST',
                        body: payload
                    });
                    menuItems.push(savedItem);
                    showSuccess('Позиция добавлена', `Позиция "${savedItem.name}" добавлена в меню.`);
                }

                resetMenuForm();
                renderCurrentMenuItems();
                renderMenuItems('all');
            } catch (err) {
                showErrorModal('Не удалось отправить данные на сервер.');
            }
        });
    }

    function renderCurrentPromotions() {
        if (!currentPromotions) return;
        currentPromotions.innerHTML = '';
        if (promotions.length === 0) {
            currentPromotions.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Акции отсутствуют</p>';
            return;
        }
        
        promotions.forEach(promo => {
            const el = document.createElement('div');
            el.className = 'item-list-item';
            el.innerHTML = `
                <div class="item-list-info">
                    <h5>${promo.title}</h5>
                    <p>${promo.description}</p>
                    <small>Действует до: ${formatDate(promo.endDate)}</small>
                </div>
                <div class="item-list-actions">
                    <button class="item-list-btn delete" data-id="${promo.id}">Удалить</button>
                </div>
            `;
            currentPromotions.appendChild(el);
        });

        currentPromotions.querySelectorAll('.item-list-btn.delete').forEach(button => {
            button.addEventListener('click', function() {
                if (!isAdminLoggedIn) return;
                const id = parseInt(this.getAttribute('data-id'), 10);
                
                openDeleteModal(async () => {
                    try {
                        await request(`/promotions/${id}`, { method: 'DELETE' });

                        promotions = promotions.filter(p => p.id !== id);
                        renderCurrentPromotions();
                        renderPromotions();
                    } catch (err) {
                        showErrorModal('Не удалось удалить акцию.');
                    }
                });
            });
        });
    }

    function renderCurrentAnnouncement() {
        const announcementContainer = document.getElementById('currentAnnouncement');
        if (announcementContainer) {
            announcementContainer.innerHTML = `
                <div class="item-list-item">
                    <div class="item-list-info">
                        <h5>Текущее объявление</h5>
                        <p>${announcement || 'Нет активных объявлений'}</p>
                    </div>
                </div>`;
        }
    }

    const adminBtn = document.getElementById('adminAccessBtn');
    if (adminBtn) adminBtn.addEventListener('click', showAdminLogin);

    const adminBtnFooter = document.getElementById('adminAccessBtnFooter');
    if (adminBtnFooter) adminBtnFooter.addEventListener('click', showAdminLogin);

    const pwdInput = document.getElementById('adminPassword');
    if (pwdInput) {
        pwdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const loginBtn = document.getElementById('loginBtn');
                if (loginBtn) loginBtn.click();
            }
        });
    }
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const passcodeVal = pwdInput ? pwdInput.value : '';
            if (isFieldInvalid(passcodeVal)) {
                return showErrorModal('Введите пароль!');
            }

            try {
                await request('/auth/l1og9in_enter04', {
                    method: 'POST',
                    body: { passcode: passcodeVal }
                });

                

                isAdminLoggedIn = true;
                localStorage.setItem('isAdminLoggedIn', 'true');
                if (adminLogin) adminLogin.style.display = 'none';
                if (adminPanel) adminPanel.style.display = 'flex';

                toggleAdminAccessButtons(true);
                showSuccess('Добро пожаловать!', 'Вы успешно вошли в панель администратора.');
            } 
            catch (err) {
                console.error('Ошибка входа:', err);
                if (pwdInput) {
                    pwdInput.value = '';
                    pwdInput.focus();
                }
                showErrorModal(err.message || 'Неверный пароль или ошибка сервера!');
            }
        });
    }

    const adminDashboardBtn = document.getElementById('adminDashboardBtn');
    if (adminDashboardBtn) {
        adminDashboardBtn.addEventListener('click', async () => {
            checkAuthStatus();
            if (!isAdminLoggedIn) return showAdminLogin();
            if (adminDashboardModal) adminDashboardModal.style.display = 'flex';
            await loadAdminData();
            renderCurrentMenuItems();
            renderCurrentPromotions();
            renderCurrentAnnouncement();
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await request('/auth/logout', { method: 'POST' });
            }
            catch (e) {
                console.error(e);
            }
            isAdminLoggedIn = false;
            localStorage.removeItem('isAdminLoggedIn');
            if (adminPanel) adminPanel.style.display = 'none';
            toggleAdminAccessButtons(false);
            resetMenuForm();
            showSuccess('До свидания!', 'Вы успешно вышли из админ-панели.');
        });
    }

    const closeDashboardBtn = document.getElementById('closeDashboardModal');
    if (closeDashboardBtn) {
        closeDashboardBtn.addEventListener('click', () => {
            if (adminDashboardModal) adminDashboardModal.style.display = 'none';
            resetMenuForm();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === adminDashboardModal) {
            adminDashboardModal.style.display = 'none';
            resetMenuForm();
        }
        if (e.target === adminLogin) adminLogin.style.display = 'none';
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (adminLogin && adminLogin.style.display === 'flex') {
                adminLogin.style.display = 'none';
            }
            if (adminDashboardModal && adminDashboardModal.style.display === 'flex') {
                adminDashboardModal.style.display = 'none';
                resetMenuForm();
            }
        }
    });

    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab, .admin-tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            const targetTab = document.getElementById(`${tab.getAttribute('data-tab')}-tab`);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    if (promoForm) {
        promoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

            if (isFieldInvalid(promoTitle.value) || isFieldInvalid(promoDescription.value) || isFieldInvalid(promoDateInput.value)) {
                return showErrorModal('Пожалуйста, заполните все поля акции');
            }

            try {
                const newPromo = await request('/promotions', {
                    method: 'POST',
                    body: {
                        title: promoTitle.value,
                        description: promoDescription.value,
                        startDate: new Date().toISOString(),
                        endDate: new Date(promoDateInput.value).toISOString()
                    }
                });

                promotions.push(newPromo);
                promoForm.reset();
                renderCurrentPromotions();
                renderPromotions();
                showSuccess('Акция добавлена', 'Новая акция успешно добавлена.');
            } catch (err) {
                showErrorModal('Не удалось добавить акцию на сервер.');
            }
        });
    }

    if (announcementForm) {
        announcementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

            const text = announcementText ? announcementText.value : '';
            if (isFieldInvalid(text)) {
                return showErrorModal('Введите текст объявления');
            }

            try {
                const updatedAnn = await request('/announcements', {
                    method: 'POST',
                    body: { text }
                });

                announcement = updatedAnn.text || text;
                updateAnnouncementUI();
                announcementForm.reset();
                renderCurrentAnnouncement();
                showSuccess('Объявление опубликовано', 'Новое объявление успешно опубликовано.');
            } 
            catch (err) {
                showErrorModal('Не удалось опубликовать объявление.');
            }
        });
    }

    document.addEventListener('keydown', async (e) => {
        const isHotkey = e.ctrlKey && (e.shiftKey || e.altKey) && (e.code === 'KeyA' || e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф');

        if (isHotkey) {
            e.preventDefault();

            const isDashboardOpen = adminDashboardModal && getComputedStyle(adminDashboardModal).display !== 'none';

            checkAuthStatus();

            if (isAdminLoggedIn) { 
                if (isDashboardOpen) return;

                if (adminDashboardModal) {
                    adminDashboardModal.style.display = 'flex';
                    await loadAdminData();
                    renderCurrentMenuItems();
                    renderCurrentPromotions();
                    renderCurrentAnnouncement();
                }
                return;
            }

            showAdminLogin();
        }
    });
}