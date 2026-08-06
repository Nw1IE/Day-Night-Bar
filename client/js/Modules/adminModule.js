import { 
    menuItems, promotions, announcement, ADMIN_PASSWORD, isAdminLoggedIn, 
    updateMenuItems, updatePromotions, updateAnnouncement, setAdminLoggedIn 
} from './dataModule.js';
import { formatDate, getCategoryName } from './utilsModule.js';
import { renderMenuItems, renderPromotions, updateAnnouncementUI } from './renderModule.js';
import { saveMenuToStorage, savePromosToStorage, saveAnnouncementToStorage } from './storageModule.js';
import { showErrorModal } from '../../components/error.js';
import { showSuccess } from '../../components/success.js';
import { initAdminModal } from '../../components/admins.js';
import { openDeleteModal } from '../../components/delete.js';

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

    function resetMenuForm() {
        if (!menuForm) return;
        menuForm.reset();
        currentEditingId = null;
        const submitBtn = menuForm.querySelector('.btn');
        if (submitBtn) submitBtn.textContent = 'Добавить в меню';
    }

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

    if (isAdminLoggedIn) toggleAdminAccessButtons(true);

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
            } else if (this.value > lastDayOfYear) {
                this.value = lastDayOfYear;
            }
        });
    }

    const announcementText = document.getElementById('announcementText');
    applyValidation(announcementText, 300);

    function isFieldInvalid(value) {
        return !value || value.trim().length === 0;
    }

    function showAdminLogin() {
        if (isAdminLoggedIn) {
            showErrorModal('Вы уже авторизованы в системе!');
            if (adminDashboardModal && adminDashboardModal.style.display !== 'flex') {
                adminDashboardModal.style.display = 'flex';
                renderCurrentMenuItems();
                renderCurrentPromotions();
                renderCurrentAnnouncement();
            }
            return;
        }

        if (adminLogin && adminLogin.style.display === 'flex') {
            return;
        }

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
                
                openDeleteModal(() => {
                    const updated = menuItems.filter(item => item.id !== id);
                    updateMenuItems(updated);
                    saveMenuToStorage(updated);
                    renderCurrentMenuItems();
                    renderMenuItems('all');
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
                    document.getElementById('itemImage').value = item.image || ''; 
                    
                    const submitBtn = menuForm.querySelector('.btn');
                    if (submitBtn) submitBtn.textContent = 'Сохранить изменения';
                }
            });
        });
    }

    if (menuForm) {
        menuForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

            const nameVal = document.getElementById('itemName').value;
            const catVal = document.getElementById('itemCategory').value;
            const priceVal = document.getElementById('itemPrice').value;
            const descVal = document.getElementById('itemDescription').value;
            const imageVal = document.getElementById('itemImage').value || './images/placeholder.jpg'; 

            if (isFieldInvalid(nameVal) || isFieldInvalid(priceVal) || isFieldInvalid(descVal)) {
                return showErrorModal('Пожалуйста, заполните все поля меню');
            }

            if (currentEditingId !== null) {
                const updatedList = menuItems.map(item => {
                    if (item.id === currentEditingId) {
                        return {
                            ...item,
                            name: nameVal,
                            category: catVal,
                            price: parseInt(priceVal, 10),
                            description: descVal,
                            image: imageVal
                        };
                    }
                    return item;
                });
                updateMenuItems(updatedList);
                saveMenuToStorage(updatedList);
                showSuccess('Позиция обновлена', `Позиция "${nameVal}" успешно изменена.`);
            } else {
                const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
                const newItem = {
                    id: newId,
                    name: nameVal,
                    category: catVal,
                    price: parseInt(priceVal, 10),
                    description: descVal,
                    image: imageVal
                };
                const updatedList = [...menuItems, newItem];
                updateMenuItems(updatedList);
                saveMenuToStorage(updatedList);
                showSuccess('Позиция добавлена', `Позиция "${newItem.name}" добавлена в меню.`);
            }

            resetMenuForm();
            renderCurrentMenuItems();
            renderMenuItems('all');
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
                    <small>Действует до: ${formatDate(promo.date)}</small>
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
                
                openDeleteModal(() => {
                    const updated = promotions.filter(p => p.id !== id);
                    updatePromotions(updated);
                    savePromosToStorage(updated);
                    renderCurrentPromotions();
                    renderPromotions();
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
                        <p>${announcement}</p>
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
        loginBtn.addEventListener('click', () => {
            if (pwdInput && pwdInput.value === ADMIN_PASSWORD) {
                setAdminLoggedIn(true);
                if (adminLogin) adminLogin.style.display = 'none';
                if (adminPanel) adminPanel.style.display = 'flex';

                toggleAdminAccessButtons(true);
                showSuccess('Добро пожаловать!', 'Вы успешно вошли в панель администратора.');
            } else {
                if (pwdInput) {
                    pwdInput.value = '';
                    pwdInput.focus();
                }
                showErrorModal('Неверный пароль!');
            }
        });
    }

    const adminDashboardBtn = document.getElementById('adminDashboardBtn');
    if (adminDashboardBtn) {
        adminDashboardBtn.addEventListener('click', () => {
            if (!isAdminLoggedIn) return showAdminLogin();
            if (adminDashboardModal) adminDashboardModal.style.display = 'flex';
            renderCurrentMenuItems();
            renderCurrentPromotions();
            renderCurrentAnnouncement();
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            setAdminLoggedIn(false);
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

        // Абсолютно надежный перехват Enter для модалки удаления
        if (e.key === 'Enter') {
            const allElements = document.querySelectorAll('div, section');
            for (const el of allElements) {
                const style = getComputedStyle(el);
                // Проверяем, что элемент видим и похож на модальное окно
                if ((style.display === 'flex' || style.display === 'block') && style.visibility !== 'hidden') {
                    // Проверяем текст внутри элемента, чтобы точно убедиться, что это модалка удаления
                    if (el.textContent.includes('Удалить позицию?')) {
                        const buttons = el.querySelectorAll('button, .btn');
                        for (const btn of buttons) {
                            if (btn.textContent.trim() === 'Удалить') {
                                e.preventDefault();
                                e.stopPropagation();
                                btn.click();
                                return;
                            }
                        }
                    }
                }
            }
        }
    }, true);

    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab, .admin-tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            const targetTab = document.getElementById(`${tab.getAttribute('data-tab')}-tab`);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

            if (isFieldInvalid(promoTitle.value) || isFieldInvalid(promoDescription.value) || isFieldInvalid(promoDateInput.value)) {
                return showErrorModal('Пожалуйста, заполните все поля акции');
            }

            const newPromo = {
                id: promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1,
                title: promoTitle.value,
                description: promoDescription.value,
                date: promoDateInput.value
            };

            const updatedPromos = [...promotions, newPromo];
            updatePromotions(updatedPromos);
            savePromosToStorage(updatedPromos);
            promoForm.reset();
            renderCurrentPromotions();
            renderPromotions();
            showSuccess('Акция добавлена', 'Новая акция успешно добавлена.');
        });
    }

    if (announcementForm) {
        announcementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!isAdminLoggedIn) return showErrorModal('Требуется авторизация.');

            const text = announcementText ? announcementText.value : '';
            if (isFieldInvalid(text)) {
                return showErrorModal('Введите текст объявления');
            }

            updateAnnouncement(text);
            saveAnnouncementToStorage(text);
            updateAnnouncementUI();
            announcementForm.reset();
            renderCurrentAnnouncement();
            showSuccess('Объявление опубликовано', 'Новое объявление успешно опубликовано.');
        });
    }

    document.addEventListener('keydown', (e) => {
        const isHotkey = e.ctrlKey && (e.shiftKey || e.altKey) && (e.code === 'KeyA' || e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф');

        if (isHotkey) {
            e.preventDefault();

            const isPanelVisible = adminPanel && getComputedStyle(adminPanel).display !== 'none';
            const isDashboardOpen = adminDashboardModal && getComputedStyle(adminDashboardModal).display !== 'none';

            if (isAdminLoggedIn || isPanelVisible) {
                if (isDashboardOpen) {
                    return;
                }

                if (adminDashboardModal) {
                    adminDashboardModal.style.display = 'flex';
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