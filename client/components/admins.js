export function initAdminModal() {
    if (document.getElementById('adminDashboardModal')) return;

    const adminContainer = document.createElement('div');
    adminContainer.innerHTML = `
        <div class="admin-login" id="adminLogin" style="display: none;">
            <div class="login-form">
                <h2><i class="fas fa-lock"></i> Вход для администратора</h2>
                <input type="password" id="adminPassword" placeholder="Введите пароль администратора" autofocus>
                <button class="btn" id="loginBtn">Войти</button>
            </div>
        </div>

        <div class="admin-panel" id="adminPanel" style="display: none;">
            <button class="admin-btn" id="adminDashboardBtn" title="Панель администратора"><i class="fas fa-edit"></i></button>
            <button class="admin-btn" id="logoutBtn" title="Выйти"><i class="fas fa-sign-out-alt"></i></button>
        </div>

        <div class="modal" id="adminDashboardModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"><i class="fas fa-tachometer-alt"></i> Панель администратора</h3>
                    <button class="close-modal" id="closeDashboardModal">&times;</button>
                </div>
                
                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="menu">Управление меню</button>
                    <button class="admin-tab" data-tab="promotions">Управление акциями</button>
                    <button class="admin-tab" data-tab="announcements">Объявления</button>
                </div>

                <div class="admin-tab-content active" id="menu-tab">
                    <h4>Добавить новую позицию в меню</h4>
                    <form class="admin-form" id="menuForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="itemName">Название</label>
                                <input type="text" id="itemName" required>
                            </div>
                            <div class="form-group">
                                <label for="itemCategory">Категория</label>
                                <select id="itemCategory" required>
                                    <option value="cocktails">Коктейли</option>
                                    <option value="wine">Вино</option>
                                    <option value="beer">Пиво</option>
                                    <option value="snacks">Закуски</option>
                                    <option value="main">Основные блюда</option>
                                    <option value="desserts">Десерты</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="itemPrice">Цена (руб.)</label>
                                <input type="number" id="itemPrice" required>
                            </div>
                            <div class="form-group">
                                <label for="itemDescription">Описание</label>
                                <textarea id="itemDescription" rows="3" required></textarea>
                            </div>
                        </div>
                        <button type="submit" class="btn">Добавить в меню</button>
                    </form>
                    
                    <div class="item-list">
                        <h4>Текущее меню</h4>
                        <div id="currentMenuItems"></div>
                    </div>
                </div>

                <div class="admin-tab-content" id="promotions-tab">
                    <h4>Добавить новую акцию</h4>
                    <form class="admin-form" id="promoForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="promoTitle">Название акции</label>
                                <input type="text" id="promoTitle" required>
                            </div>
                            <div class="form-group">
                                <label for="promoDate">Дата окончания</label>
                                <input type="date" id="promoDate" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="promoDescription">Описание акции</label>
                            <textarea id="promoDescription" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn">Добавить акцию</button>
                    </form>
                    
                    <div class="item-list">
                        <h4>Текущие акции</h4>
                        <div id="currentPromotions"></div>
                    </div>
                </div>

                <div class="admin-tab-content" id="announcements-tab">
                    <h4>Создать новое объявление</h4>
                    <form class="admin-form" id="announcementForm">
                        <div class="form-group">
                            <label for="announcementText">Текст объявления</label>
                            <textarea id="announcementText" rows="3" required placeholder="Введите текст объявления..."></textarea>
                        </div>
                        <button type="submit" class="btn">Опубликовать объявление</button>
                    </form>
                    
                    <div class="item-list">
                        <h4>Текущее объявление</h4>
                        <div id="currentAnnouncement"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(adminContainer);
}