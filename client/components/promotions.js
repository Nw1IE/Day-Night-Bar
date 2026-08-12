let cachedPromos = [];
const promosMap = new Map();

export function renderPromotionsSection(promos = []) {
    cachedPromos = promos || [];
    promosMap.clear();
    
    const container = document.getElementById('promotions-container');
    if (!container) {
        console.error('❌ ОШИБКА: Контейнер #promotions-container не найден!');
        return;
    }

    injectStylesIfNeeded();
    ensureModalExistsInDOM();

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
                    ${cachedPromos.map((promo, index) => {
                        const promoId = String(promo.id !== undefined ? promo.id : index);
                        promosMap.set(promoId, promo);

                        return `
                            <article class="promotion-card clickable-promo-card" data-promo-id="${promoId}">
                                <div class="promotion-content">
                                    <h3 class="promotion-title">${promo.title || ''}</h3>
                                    <p class="promotion-desc">${promo.description || ''}</p>
                                    ${promo.date ? `<p class="promo-card-date"><i class="far fa-calendar-alt"></i> Действует до: ${promo.date}</p>` : ''}
                                    <button class="promo-details-btn">Подробнее</button>
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

document.addEventListener('click', (e) => {
    const card = e.target.closest('.promotion-card') || e.target.closest('.clickable-promo-card');
    if (!card) return;

    let promo = null;
    const promoId = card.getAttribute('data-promo-id');

    if (promoId && promosMap.has(promoId)) {
        promo = promosMap.get(promoId);
    } 

    if (!promo && cachedPromos.length > 0) {
        const allCards = Array.from(document.querySelectorAll('.promotion-card, .clickable-promo-card'));
        const index = allCards.indexOf(card);
        if (index !== -1 && cachedPromos[index]) {
            promo = cachedPromos[index];
        }
    }

    if (!promo) {
        const titleEl = card.querySelector('h1, h2, h3, h4, .promotion-title, [class*="title"]');
        const descEl = card.querySelector('p, .promotion-desc, [class*="desc"], [class*="text"]');
        const dateEl = card.querySelector('[class*="date"], time');

        promo = {
            title: titleEl ? titleEl.textContent.trim() : 'Акция',
            description: descEl ? descEl.textContent.trim() : '',
            fullDescription: descEl ? descEl.textContent.trim() : '',
            date: dateEl ? dateEl.textContent.replace('Действует до:', '').trim() : ''
        };
    }

    openPromoModal(promo);
});

function openPromoModal(promo) {
    const overlay = document.getElementById('promoModalOverlay');
    const modalTitle = document.getElementById('promoModalTitle');
    const modalDate = document.getElementById('promoModalDate');
    const modalDesc = document.getElementById('promoModalDesc');

    if (!overlay) return;
    
    if (modalTitle) modalTitle.textContent = promo.title || '';
    
    if (modalDate) {
        const rawDate = promo.date || '';
        const cleanDate = rawDate.replace(/Действует до:\s*/gi, '').trim();
        modalDate.textContent = cleanDate ? `Действует до: ${cleanDate}` : '';
        modalDate.style.display = cleanDate ? 'block' : 'none';
    }

    if (modalDesc) modalDesc.textContent = promo.fullDescription || promo.description || '';

    overlay.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0, 0, 0, 0.85) !important; z-index: 999999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 20px !important;';
    document.body.style.overflow = 'hidden';
}

function injectStylesIfNeeded() {
    if (document.getElementById('promo-modal-injected-styles')) return;
    const style = document.createElement('style');
    style.id = 'promo-modal-injected-styles';
    style.textContent = `
        .promotion-card, .clickable-promo-card, .clickable-promo-card * {
            pointer-events: auto !important;
            cursor: pointer !important;
        }
        .promo-modal-overlay { 
            position: fixed !important; top: 0 !important; left: 0 !important; 
            width: 100vw !important; height: 100vh !important; 
            background: rgba(0, 0, 0, 0.85) !important; z-index: 999999 !important; 
            display: none !important; align-items: center !important; justify-content: center !important; padding: 20px !important; 
        }
        .promo-modal-content { 
            background: #1a1a1a !important; border: 1px solid #d4af37 !important; 
            border-radius: 12px !important; max-width: 600px !important; width: 100% !important; 
            max-height: 90vh !important; overflow-y: auto !important; padding: 25px !important; 
            color: #fff !important; position: relative !important; box-shadow: 0 15px 35px rgba(0,0,0,0.7) !important;
        }
        .promo-modal-close { 
            position: absolute !important; top: 15px !important; right: 15px !important; 
            background: rgba(0,0,0,0.6) !important; border: none !important; color: #fff !important; 
            font-size: 24px !important; width: 35px !important; height: 35px !important; 
            border-radius: 50% !important; cursor: pointer !important; display: flex !important; 
            align-items: center !important; justify-content: center !important;
        }
        .promo-modal-close:hover { background: #d4af37 !important; color: #000 !important; }
    `;
    document.head.appendChild(style);
}

function ensureModalExistsInDOM() {
    if (document.getElementById('promoModalOverlay')) return;
    
    const modalHTML = `
        <div class="promo-modal-overlay" id="promoModalOverlay">
            <div class="promo-modal-content">
                <button class="promo-modal-close" id="promoModalCloseBtn">&times;</button>
                <h3 id="promoModalTitle" style="margin-top: 0; margin-bottom: 10px;"></h3>
                <p id="promoModalDate" style="color: #aaa; font-size: 14px; margin-bottom: 15px;"></p>
                <p id="promoModalDesc" style="line-height: 1.6;"></p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('promoModalOverlay');
    const closeBtn = document.getElementById('promoModalCloseBtn');

    const closeModal = () => {
        overlay.style.setProperty('display', 'none', 'important');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}