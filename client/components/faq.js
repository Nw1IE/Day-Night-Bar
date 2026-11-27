export function renderFaq() {
    const faqContainer = document.getElementById('faq-container');
    if (!faqContainer) return;

    faqContainer.innerHTML = `
        <section class="faq-section" id="faq">
            <div class="container">
                <h2 class="section-title">Часто задаваемые вопросы</h2>
                <div class="faq-accordion" id="faqAccordion">
                    <article class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Как забронировать столик?</span>
                            <i class="fas fa-chevron-down faq-icon" aria-hidden="true"></i>
                        </button>
                        <div class="faq-answer">
                            <p>Забронировать столик можно по телефону <a href="tel:+79221477081">+7 (922) 147-70-81</a> или написав нам в <a href="https://vk.com/club228933906" target="_blank" rel="noopener noreferrer">сообщество ВКонтакте</a>. Рекомендуем бронировать столы заранее на вечер пятницы и субботы.</p>
                        </div>
                    </article>

                    <article class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Какой режим работы у бара?</span>
                            <i class="fas fa-chevron-down faq-icon" aria-hidden="true"></i>
                        </button>
                        <div class="faq-answer">
                            <p>Мы открыты ежедневно. В будние дни и воскресенье ждём вас с 12:00 до 02:00, а в пятницу и субботу — с 12:00 до 04:00 для ярких ночных впечатлений.</p>
                        </div>
                    </article>

                    <article class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Есть ли безалкогольные напитки и полноценная кухня?</span>
                            <i class="fas fa-chevron-down faq-icon" aria-hidden="true"></i>
                        </button>
                        <div class="faq-answer">
                            <p>Да, в «День / Ночь» представлена авторская коктейльная карта, крафтовые лимонады, безалкогольные напитки, а также полноценная кухня: холодные и горячие закуски, сочные бургеры, основные блюда и десерты.</p>
                        </div>
                    </article>

                    <article class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Действуют ли скидки для именинников?</span>
                            <i class="fas fa-chevron-down faq-icon" aria-hidden="true"></i>
                        </button>
                        <div class="faq-answer">
                            <p>Да! Именинникам предоставляется праздничная скидка 10% на весь чек непосредственно в день рождения и 3 дня после него при предъявлении паспорта или водительского удостоверения.</p>
                        </div>
                    </article>

                    <article class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>Где вы находитесь и есть ли парковка?</span>
                            <i class="fas fa-chevron-down faq-icon" aria-hidden="true"></i>
                        </button>
                        <div class="faq-answer">
                            <p>Наш адрес: г. Берёзовский, ул. Академика Королёва, 8А. Рядом со зданием бара находится удобная бесплатная парковка для гостей.</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    `;

    initFaqEvents();
}

function initFaqEvents() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isCurrentlyActive = item.classList.contains('active');

            // Закрываем другие пункты для эффекта аккуратного аккордеона
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Переключаем текущий
            if (isCurrentlyActive) {
                item.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}
