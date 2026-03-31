// Хранение данных
const menuItems = [
    { id: 1, name: "Мохито классический", category: "cocktails", price: 550, description: "Классический коктейль с белым ромом, свежей мятой, лаймом и содовой" },
    { id: 2, name: "Негрони", category: "cocktails", price: 650, description: "Итальянский коктейль с джином, красным вермутом и кампари" },
    { id: 3, name: "Маргарита", category: "cocktails", price: 600, description: "Коктейль с текилой, лаймовым соком и апельсиновым ликером, солью по краю бокала" },
    { id: 4, name: "Кьянти Классико", category: "wine", price: 420, description: "Итальянское красное вино из региона Тоскана, бокал" },
    { id: 5, name: "Шардоне", category: "wine", price: 480, description: "Белое вино из Бургундии, бокал" },
    { id: 6, name: "Пино Нуар", category: "wine", price: 520, description: "Красное вино с тонким ароматом, бокал" },
    { id: 7, name: "IPA крафтовое", category: "beer", price: 350, description: "Крафтовое пиво с насыщенным хмелевым вкусом, 0.5 л" },
    { id: 8, name: "Пшеничное пиво", category: "beer", price: 320, description: "Светлое пшеничное пиво с цитрусовыми нотами, 0.5 л" },
    { id: 9, name: "Сырное ассорти", category: "snacks", price: 1200, description: "Ассорти из европейских сыров, грецкие орехи, мед, груша" },
    { id: 10, name: "Брускетты", category: "snacks", price: 480, description: "Тосты с томатами, базиликом, моцареллой и оливковым маслом" },
    { id: 11, name: "Стейк Рибай", category: "main", price: 2200, description: "Стейк из мраморной говядины с овощами гриль и соусом пеперони" },
    { id: 12, name: "Тирамису", category: "desserts", price: 650, description: "Классический итальянский десерт с кофе и маскарпоне" }
];

        let promotions = [
            { id: 1, title: "Счастливые часы", description: "Скидка 20% на все коктейли с 18:00 до 21:00 каждый день", date: "2023-12-31" },
            { id: 2, title: "Вино вторникам", description: "По вторникам бутылка вина со скидкой 30% при заказе от двух блюд", date: "2023-12-25" },
            { id: 3, title: "День рождения", description: "Именинникам бесплатный десерт и бутылка просекко при заказе от 5000 руб.", date: "2023-12-31" },
            { id: 4, title: "Бизнес-ланч", description: "С понедельника по пятницу с 12:00 до 16:00 специальное меню за 990 руб.", date: "2023-11-30" }
        ];

        let announcement = "🎉 Счастливые часы! Скидка 20% на все коктейли с 18:00 до 21:00 каждый день!";
        
        // Пароль администратора
        const ADMIN_PASSWORD = "1";
        let isAdminLoggedIn = false;

        // Доп-элементы
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        const menuItemsContainer = document.getElementById('menuItems');
        const promotionCardsContainer = document.getElementById('promotionCards');
        const bookingForm = document.getElementById('bookingForm');
        const categoryButtons = document.querySelectorAll('.category-btn');
        const announcementContainer = document.getElementById('announcement');
        
        // Элементы администрирования
        const adminAccessBtn = document.getElementById('adminAccessBtn');
        const adminAccessBtnFooter = document.getElementById('adminAccessBtnFooter');
        const adminLogin = document.getElementById('adminLogin');
        const adminPanel = document.getElementById('adminPanel');
        const adminPasswordInput = document.getElementById('adminPassword');
        const loginBtn = document.getElementById('loginBtn');
        const adminDashboardBtn = document.getElementById('adminDashboardBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminDashboardModal = document.getElementById('adminDashboardModal');
        const closeDashboardModal = document.getElementById('closeDashboardModal');
        
        // Вкладки администратора
        const adminTabs = document.querySelectorAll('.admin-tab');
        const adminTabContents = document.querySelectorAll('.admin-tab-content');
        
        // Формы администратора
        const menuForm = document.getElementById('menuForm');
        const promoForm = document.getElementById('promoForm');
        const announcementForm = document.getElementById('announcementForm');
        
        // Контейнеры контента администратора
        const currentMenuItems = document.getElementById('currentMenuItems');
        const currentPromotions = document.getElementById('currentPromotions');
        const currentAnnouncement = document.getElementById('currentAnnouncement');

        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            // Установите минимальную дату бронирования на сегодня.
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').min = today;
            
            // Установите минимальную дату начала акций на сегодня.
            document.getElementById('promoDate').min = today;
            
            // Загрузить исходные данные
            renderMenuItems('all');
            renderPromotions();
            updateAnnouncement();
            
            //Настройте обработчики событий.
            setupEventListeners();
            
            // Установить объявление
            announcementContainer.textContent = announcement;
        });

        // Настройте обработчики событий.
        function setupEventListeners() {
            // Переключение мобильного меню
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Мобильное меню закрывается при нажатии на ссылку.
            document.querySelectorAll('nav ul li a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });

            // Фильтрация категорий меню
            categoryButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Удалить класс "активный" со всех кнопок
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    // Добавьте класс "активный" к нажатой кнопке.
                    button.classList.add('active');
                    // Фильтровать пункты меню
                    const category = button.getAttribute('data-category');
                    renderMenuItems(category);
                });
            });

            // Отправка формы бронирования
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const phone = document.getElementById('phone').value;
                const date = document.getElementById('date').value;
                const time = document.getElementById('time').value;
                const guests = document.getElementById('guests').value;
                const table = document.getElementById('table').value;
                const comments = document.getElementById('comments').value;
                
                // Простая проверка
                if (!name || !phone || !date || !time || !guests) {
                    alert('Пожалуйста, заполните все обязательные поля');
                    return;
                }
                
                // В реальном приложении это означало бы отправку данных на сервер.
                alert(`Спасибо, ${name}! Ваш столик забронирован на ${date} в ${time} для ${guests}. Мы свяжемся с вами по телефону ${phone} для подтверждения.`);
                
                // Сбросить форму
                bookingForm.reset();
                document.getElementById('date').min = new Date().toISOString().split('T')[0];
            });

            // Кнопки доступа администратора
            adminAccessBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showAdminLogin();
            });
            
            adminAccessBtnFooter.addEventListener('click', (e) => {
                e.preventDefault();
                showAdminLogin();
            });

            //Вход администратора
            loginBtn.addEventListener('click', () => {
                const password = adminPasswordInput.value;
                
                if (password === ADMIN_PASSWORD) {
                    isAdminLoggedIn = true;
                    adminLogin.style.display = 'none';
                    adminPanel.style.display = 'flex';
                    alert('Вы успешно вошли в панель администратора!');
                } else {
                    alert('Неверный пароль! Попробуйте снова.');
                }
            });

            // Панель администратора
            adminDashboardBtn.addEventListener('click', () => {
                if (!isAdminLoggedIn) {
                    showAdminLogin();
                    return;
                }
                
                adminDashboardModal.style.display = 'flex';
                renderCurrentMenuItems();
                renderCurrentPromotions();
                renderCurrentAnnouncement();
            });

            //Выход из системы
            logoutBtn.addEventListener('click', () => {
                isAdminLoggedIn = false;
                adminPanel.style.display = 'none';
                alert('Вы вышли из панели администратора.');
            });

            // Закрыть модальное окно панели управления
            closeDashboardModal.addEventListener('click', () => {
                adminDashboardModal.style.display = 'none';
            });

            // Закрывать модальное окно при щелчке вне его границ
            window.addEventListener('click', (e) => {
                if (e.target === adminDashboardModal) {
                    adminDashboardModal.style.display = 'none';
                }
                if (e.target === adminLogin) {
                    adminLogin.style.display = 'none';
                }
            });

            // переключение вкладок администратора
            adminTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    
                    // Удалите класс "active" со всех вкладок и содержимого.
                    adminTabs.forEach(t => t.classList.remove('active'));
                    adminTabContents.forEach(content => content.classList.remove('active'));
                    
                    // Добавьте класс "активный" к нажатой вкладке и соответствующему содержимому.
                    tab.classList.add('active');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });

            // Отправка форм администратором
            menuForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!isAdminLoggedIn) {
                    alert('Для выполнения этого действия необходимо войти в панель администратора.');
                    return;
                }
                
                const itemName = document.getElementById('itemName').value;
                const itemCategory = document.getElementById('itemCategory').value;
                const itemPrice = document.getElementById('itemPrice').value;
                const itemDescription = document.getElementById('itemDescription').value;
                
                // Добавить новый пункт меню
                const newItem = {
                    id: menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1,
                    name: itemName,
                    category: itemCategory,
                    price: parseInt(itemPrice),
                    description: itemDescription
                };
                
                menuItems.push(newItem);
                
                // Сбросить форму
                menuForm.reset();
                
                // Обновление дисплеев
                renderCurrentMenuItems();
                renderMenuItems('all');
                
                // При необходимости обновите кнопку активной категории.
                categoryButtons.forEach(btn => {
                    if (btn.getAttribute('data-category') === itemCategory) {
                        btn.click();
                    }
                });
                
                alert('Позиция успешно добавлена в меню!');
            });

            promoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!isAdminLoggedIn) {
                    alert('Для выполнения этого действия необходимо войти в панель администратора.');
                    return;
                }
                
                const promoTitle = document.getElementById('promoTitle').value;
                const promoDescription = document.getElementById('promoDescription').value;
                const promoDate = document.getElementById('promoDate').value;
                
                // Добавить новую акцию
                const newPromo = {
                    id: promotions.length > 0 ? Math.max(...promotions.map(promo => promo.id)) + 1 : 1,
                    title: promoTitle,
                    description: promoDescription,
                    date: promoDate
                };
                
                promotions.push(newPromo);
                
                // Сбросить форму
                promoForm.reset();
                document.getElementById('promoDate').min = new Date().toISOString().split('T')[0];
                
                // Обновление дисплеев
                renderCurrentPromotions();
                renderPromotions();
                
                alert('Акция успешно добавлена!');
            });

            announcementForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!isAdminLoggedIn) {
                    alert('Для выполнения этого действия необходимо войти в панель администратора.');
                    return;
                }
                
                const text = document.getElementById('announcementText').value;
                
                if (text.trim()) {
                    announcement = text;
                    announcementContainer.textContent = announcement;
                    document.getElementById('announcementText').value = '';
                    renderCurrentAnnouncement();
                    alert('Объявление успешно опубликовано!');
                }
            });

            // Плавная прокрутка для якорных ссылок
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        // Показать логин администратора
        function showAdminLogin() {
            adminLogin.style.display = 'flex';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }

        // Рендеринг пунктов меню
        function renderMenuItems(category) {
            menuItemsContainer.innerHTML = '';
            
            const filteredItems = category === 'all' 
                ? menuItems 
                : menuItems.filter(item => item.category === category);
            
            if (filteredItems.length === 0) {
                menuItemsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: rgba(255, 255, 255, 0.7);">Позиции в этой категории пока отсутствуют</p>';
                return;
            }
            
            filteredItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <div class="menu-item-content">
                        <div class="menu-item-header">
                            <div class="menu-item-name">${item.name}</div>
                            <div class="menu-item-price">${item.price} ₽</div>
                        </div>
                        <div class="menu-item-desc">${item.description}</div>
                    </div>
                `;
                menuItemsContainer.appendChild(menuItem);
            });
        }

        // Рендеринг рекламных акций
        function renderPromotions() {
            promotionCardsContainer.innerHTML = '';
            
            promotions.forEach(promo => {
                const promoCard = document.createElement('div');
                promoCard.className = 'promotion-card';
                promoCard.innerHTML = `
                    <div class="promotion-content">
                        <div class="promotion-title">${promo.title}</div>
                        <div class="promotion-date"><i class="far fa-calendar-alt"></i> Действует до: ${formatDate(promo.date)}</div>
                        <p>${promo.description}</p>
                    </div>
                `;
                promotionCardsContainer.appendChild(promoCard);
            });
        }

        // Отображение текущих пунктов меню в панели администратора
        function renderCurrentMenuItems() {
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
            
            // Добавьте обработчики событий к кнопкам удаления.
            document.querySelectorAll('.item-list-btn.delete').forEach(button => {
                button.addEventListener('click', function() {
                    if (!isAdminLoggedIn) {
                        alert('Для выполнения этого действия необходимо войти в панель администратора.');
                        return;
                    }
                    
                    const id = parseInt(this.getAttribute('data-id'));
                    if (confirm('Вы уверены, что хотите удалить эту позицию из меню?')) {
                        menuItems = menuItems.filter(item => item.id !== id);
                        renderCurrentMenuItems();
                        renderMenuItems('all');
                        alert('Позиция удалена из меню!');
                    }
                });
            });
            
            // Добавьте обработчики событий к кнопкам редактирования.
            document.querySelectorAll('.item-list-btn.edit').forEach(button => {
                button.addEventListener('click', function() {
                    if (!isAdminLoggedIn) {
                        alert('Для выполнения этого действия необходимо войти в панель администратора.');
                        return;
                    }
                    
                    const id = parseInt(this.getAttribute('data-id'));
                    const item = menuItems.find(item => item.id === id);
                    
                    if (item) {
                        document.getElementById('itemName').value = item.name;
                        document.getElementById('itemCategory').value = item.category;
                        document.getElementById('itemPrice').value = item.price;
                        document.getElementById('itemDescription').value = item.description;
                        
                        // Измените текст кнопки на «Сохранить изменения».
                        const submitButton = menuForm.querySelector('.btn');
                        submitButton.textContent = 'Сохранить изменения';
                        
                        // Изменить поведение отправки формы: вместо добавления теперь выполнять обновление.
                        menuForm.onsubmit = function(e) {
                            e.preventDefault();
                            
                            item.name = document.getElementById('itemName').value;
                            item.category = document.getElementById('itemCategory').value;
                            item.price = parseInt(document.getElementById('itemPrice').value);
                            item.description = document.getElementById('itemDescription').value;
                            
                            // Сбросить форму
                            menuForm.reset();
                            submitButton.textContent = 'Добавить в меню';
                            
                            // Восстановить исходное поведение отправки формы.
                            menuForm.onsubmit = function(e) {
                                e.preventDefault();
                                menuForm.dispatchEvent(new Event('submit'));
                            };
                            
                            // Обновление дисплеев
                            renderCurrentMenuItems();
                            renderMenuItems('all');
                            
                            alert('Позиция успешно обновлена!');
                        };
                    }
                });
            });
        }

        // Отображение текущих акций в панели администратора.
        function renderCurrentPromotions() {
            currentPromotions.innerHTML = '';
            
            if (promotions.length === 0) {
                currentPromotions.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">Акции отсутствуют</p>';
                return;
            }
            
            promotions.forEach(promo => {
                const promoElement = document.createElement('div');
                promoElement.className = 'item-list-item';
                promoElement.innerHTML = `
                    <div class="item-list-info">
                        <h5>${promo.title}</h5>
                        <p>${promo.description}</p>
                        <small>Действует до: ${formatDate(promo.date)}</small>
                    </div>
                    <div class="item-list-actions">
                        <button class="item-list-btn delete" data-id="${promo.id}">Удалить</button>
                    </div>
                `;
                currentPromotions.appendChild(promoElement);
            });
            
            // Добавьте обработчики событий к кнопкам удаления.
            document.querySelectorAll('#currentPromotions .item-list-btn.delete').forEach(button => {
                button.addEventListener('click', function() {
                    if (!isAdminLoggedIn) {
                        alert('Для выполнения этого действия необходимо войти в панель администратора.');
                        return;
                    }
                    
                    const id = parseInt(this.getAttribute('data-id'));
                    if (confirm('Вы уверены, что хотите удалить эту акцию?')) {
                        promotions = promotions.filter(promo => promo.id !== id);
                        renderCurrentPromotions();
                        renderPromotions();
                        alert('Акция удалена!');
                    }
                });
            });
        }

        // Отобразить текущее объявление в панели администратора
        function renderCurrentAnnouncement() {
            currentAnnouncement.innerHTML = '';
            
            const announcementElement = document.createElement('div');
            announcementElement.className = 'item-list-item';
            announcementElement.innerHTML = `
                <div class="item-list-info">
                    <h5>Текущее объявление</h5>
                    <p>${announcement}</p>
                </div>
            `;
            currentAnnouncement.appendChild(announcementElement);
        }

        // Обновите объявление на странице.
        function updateAnnouncement() {
            announcementContainer.textContent = announcement;
        }

        // Вспомогательная функция для форматирования даты
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        }

        //Вспомогательная функция для получения названия категории
        function getCategoryName(categoryKey) {
            const categories = {
                'cocktails': 'Коктейли',
                'wine': 'Вино',
                'beer': 'Пиво',
                'snacks': 'Закуски',
                'main': 'Основные блюда',
                'desserts': 'Десерты'
            };
            return categories[categoryKey] || categoryKey;
        }