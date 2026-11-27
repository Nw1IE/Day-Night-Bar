import { imageApi } from "../js/api/services/imageService.js";

export function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <section class="footer-wrapper" style="padding-bottom: 1px;">
            <div class="container">
                <div class="footer-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; align-items: start;">
                    <div class="footer-section">
                        <h3>День / Ночь</h3>
                        <p style="font-size: 1.2rem; line-height: 1.5; margin-bottom: 20px;">Элитный бар в центре города с авторскими коктейлями и изысканной кухней. Место, где рождаются впечатления.</p>
                        <div class="social-icons">
                            <a href="https://max.ru/join/60fU0xcnTe71N0qXPIUnQasK6-zqJxQw1x2peKOTLOM" target="_blank" rel="noopener" title="Присоединиться к нам в мессенджере Max"><img src="${imageApi.getImageUrl('Max.jpg')}" height="45" width="45" alt="Мессенджер Max бара День / Ночь"></a>
                            <a href="https://t.me/+7Oql1LJggm8yZmZi" target="_blank" rel="noopener" title="Официальный Telegram-канал бара День / Ночь"><img src="${imageApi.getImageUrl('telegram.jpg')}" height="45" width="45" alt="Telegram-канал бара День / Ночь"></a>
                            <a href="https://vk.com/club228933906" target="_blank" rel="noopener" title="Официальное сообщество ВКонтакте бара День / Ночь"><img src="${imageApi.getImageUrl('vk.jpg')}" height="50" width="50" alt="Сообщество ВКонтакте бара День / Ночь"></a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Контакты</h3>
                        <p style="margin-bottom: 15px;">
                            <a href="https://yandex.ru/maps/29397/berezovskyi/house/ulitsa_akademika_korolyova_8a/YkkYcQNpSUUFQFtsfXVxcX5qYA==/" target="_blank" rel="noopener" class="footer-link" title="Посмотреть адрес бара на Яндекс Картах" style="font-size: 1.2rem; font-weight: 500; line-height: 1.4;">
                                <i class="fas fa-map-marker-alt" aria-hidden="true"></i> ул. Академика Королёва, 8А, Берёзовский
                            </a>
                        </p>
                        <p style="margin-bottom: 15px;">
                            <a href="tel:+79221477081" class="footer-link" title="Позвонить в бар: +7 (922) 147-70-81" style="font-size: 1.2rem; font-weight: 500;">
                                <i class="fas fa-phone" aria-hidden="true"></i> +7 (922) 147-70-81
                            </a>
                        </p>
                        <p style="margin-bottom: 15px;">
                            <a href="mailto:walentina.com18@mail.ru" class="footer-link" title="Написать нам на электронную почту" style="font-size: 1.2rem; font-weight: 500;">
                                <i class="fas fa-envelope" aria-hidden="true"></i> walentina.com18@mail.ru
                            </a>
                        </p> 
                    </div>
                    
                    <div class="footer-section">
                        <h3>Быстрые ссылки</h3>
                        <p style="margin-bottom: 12px;"><a href="#home" title="Перейти на главную" style="font-size: 1.2rem;"><i class="fas fa-chevron-right" aria-hidden="true"></i> Главная</a></p>
                        <p style="margin-bottom: 12px;"><a href="#menu" title="Перейти к меню бара" style="font-size: 1.2rem;"><i class="fas fa-chevron-right" aria-hidden="true"></i> Меню</a></p>
                        <p style="margin-bottom: 12px;"><a href="#promotions" title="Перейти к акциям и событиям" style="font-size: 1.2rem;"><i class="fas fa-chevron-right" aria-hidden="true"></i> Акции</a></p>
                        <p style="margin-bottom: 12px;"><a href="#faq" title="Часто задаваемые вопросы" style="font-size: 1.2rem;"><i class="fas fa-chevron-right" aria-hidden="true"></i> FAQ</a></p>
                    </div>
                </div>
            </div>
        </section>
    `;
}