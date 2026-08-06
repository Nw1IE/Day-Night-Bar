let cachedPromos = [];

export function renderPromotionsSection(promos = []) {
    if (promos.length > 0) {
        cachedPromos = promos;
    }

    const container = document.getElementById('promotions-container');
    if (!container) return;

    container.innerHTML = `
        <section class="promotions" id="promotions">
            <div class="container">
                <h2 class="section-title">Акции и события</h2>
                <div class="promotion-cards" id="promotionCards">
                    ${cachedPromos.length === 0 
                        ? `<p class="empty-msg">Актуальных акций пока нет</p>` 
                        : cachedPromos.map((promo, index) => `
                            <article class="promotion-card clickable-promo-card" data-index="${index}">
                                <img src="${promo.image || './images/placeholder.jpg'}" alt="${promo.title || ''}" class="promotion-card-img">
                                <div class="promotion-content">
                                    <h3 class="promotion-title">${promo.title || ''}</h3>
                                    <p class="promotion-desc">${promo.description || ''}</p>
                                    ${promo.date ? `<p class="promo-card-date"><i class="far fa-calendar-alt"></i> Действует до: ${promo.date}</p>` : ''}
                                    <button class="promo-details-btn" data-index="${index}">Подробнее</button>
                                </div>
                            </article>
                          `).join('')}
                </div>
            </div>
        </section>
    `;

    // Инициализируем модалку и глобальный клик один раз
    ensurePromoModalAndGlobalEvents();
}

export function renderPromotionCards(promos) {
    renderPromotionsSection(promos);
}

function ensurePromoModalAndGlobalEvents() {
    // 1. Создаем модалку, если её еще нет в DOM
    if (!document.getElementById('promoModalOverlay')) {
        const modalHTML = `
            <div class="promo-modal-overlay" id="promoModalOverlay" style="display: none;">
                <div class="promo-modal-content">
                    <button class="promo-modal-close" id="promoModalClose">&times;</button>
                    <img src="" alt="" id="promoModalImg" class="promo-modal-img">
                    <div class="promo-modal-text-wrap">
                        <h3 id="promoModalTitle"></h3>
                        <p class="promo-modal-date" id="promoModalDate"></p>
                        <p id="promoModalDesc" class="promo-modal-desc"></p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const overlay = document.getElementById('promoModalOverlay');
        const closeBtn = document.getElementById('promoModalClose');

        const closeModal = () => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.style.display === 'flex') {
                closeModal();
            }
        });
    }

    // 2. Делегирование событий на контейнере карточек (работает всегда!)
    const cardsContainer = document.getElementById('promotionCards');
    if (!cardsContainer) return;

    // Убираем старый обработчик, чтобы не плодить дубли
    cardsContainer.onclick = null;

    cardsContainer.onclick = (e) => {
        const card = e.target.closest('.clickable-promo-card');
        if (!card) return;

        const index = card.getAttribute('data-index');
        const promo = cachedPromos[index];
        if (!promo) return;

        const overlay = document.getElementById('promoModalOverlay');
        const modalImg = document.getElementById('promoModalImg');
        const modalTitle = document.getElementById('promoModalTitle');
        const modalDate = document.getElementById('promoModalDate');
        const modalDesc = document.getElementById('promoModalDesc');

        if (modalImg) {
            modalImg.src = promo.image || './images/placeholder.jpg';
            modalImg.alt = promo.title || '';
        }
        if (modalTitle) modalTitle.textContent = promo.title || '';
        if (modalDate) modalDate.textContent = promo.date ? `Действует до: ${promo.date}` : '';
        if (modalDesc) modalDesc.textContent = promo.fullDescription || promo.description || '';

        if (overlay) {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };
}