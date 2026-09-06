let cachedPromos = [];

export function renderPromotionsSection(promos = []) {
    cachedPromos = promos || [];
    
    const container = document.getElementById('promotions-container');
    if (!container) {
        console.error('ОШИБКА: #promotions-container не найден!');
        return;
    }

    if (cachedPromos.length === 0) {
        container.innerHTML = `
            <section class="promotions" id="promotions">
                <div class="container">
                    <h2 class="section-title">Акции и события</h2>
                    <div class="promotion-cards" id="promotionCards">
                        <p class="empty-msg">Актуальных акций пока нет</p>
                    </div>
                </div>
            </section>
        `;
        return;
    }

    container.innerHTML = `
        <section class="promotions" id="promotions">
            <div class="container">
                <h2 class="section-title">Акции и события</h2>
                <div class="promotion-cards" id="promotionCards">
                    ${cachedPromos.map((promo) => {
                        return `
                            <article class="promotion-card">
                                <div class="promotion-content">
                                    <h3 class="promotion-title">${promo.title || ''}</h3>
                                    <p class="promotion-desc">${promo.description || ''}</p>
                                    ${promo.endDate ? `<p class="promo-card-date"><i class="far fa-calendar-alt"></i> Действует до: ${promo.endDate}</p>` : ''}
                                </div>
                            </article>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
    `;
}

export function renderPromotionCards(promos) {
    renderPromotionsSection(promos);
}