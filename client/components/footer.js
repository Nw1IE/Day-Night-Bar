export function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <section class="footer-wrapper">
            <div class="container">
                <div class="footer-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; align-items: start;">
                    <div class="footer-section">
                        <h3>День / Ночь</h3>
                        <p style="font-size: 1.2rem; line-height: 1.5; margin-bottom: 20px;">Элитный бар в центре города с авторскими коктейлями и изысканной кухней. Место, где рождаются впечатления.</p>
                        <div class="social-icons">
                            <a href="https://max.ru/join/60fU0xcnTe71N0qXPIUnQasK6-zqJxQw1x2peKOTLOM" target="_blank" rel="noopener"><img src="./images/Max.jpg" height="45" width="45" alt="Max"></a>
                            <a href="https://t.me/+7Oql1LJggm8yZmZi" target="_blank" rel="noopener"><img src="./images/telegram.jpg" height="45" width="45" alt="Telegram"></a>
                            <a href="https://vk.com/club228933906" target="_blank" rel="noopener"><img src="./images/vk.jpg" height="50" width="50" alt="VK"></a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Контакты</h3>
                        <p style="margin-bottom: 15px;">
                            <a href="https://yandex.ru/maps/29397/berezovskyi/house/ulitsa_akademika_korolyova_8a/YkkYcQNpSUUFQFtsfXVxcX5qYA==/" target="_blank" rel="noopener" class="footer-link" style="font-size: 1.2rem; font-weight: 500; line-height: 1.4;">
                                <i class="fas fa-map-marker-alt"></i> ул. Академика Королёва, 8А, Берёзовский
                            </a>
                        </p>
                        <p style="margin-bottom: 15px;">
                            <a href="tel:+79221477081" class="footer-link" style="font-size: 1.2rem; font-weight: 500;">
                                <i class="fas fa-phone"></i> +7 (922) 147-70-81
                            </a>
                        </p>
                        <p style="margin-bottom: 15px;">
                            <a href="mailto:walentina.com18@mail.ru" class="footer-link" style="font-size: 1.2rem; font-weight: 500;">
                                <i class="fas fa-envelope"></i> walentina.com18@mail.ru
                            </a>
                        </p> 
                        <!-- <p style="font-size: 1.2rem;"><i class="fas fa-clock"></i> Круглосуточно</p> -->

                        <div class="footer-map-container" style="margin-top: 20px; border-radius: 8px; overflow: hidden; height: 220px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                            <iframe 
                                src="https://yandex.ru/map-widget/v1/?um=constructor%3A&amp;source=constructorStatic&amp;id=YkkYcQNpSUUFQFtsfXVxcX5qYA%3D%3D&amp;ll=60.749002%2C56.900295&amp;z=16.69&amp;pt=60.749002%2C56.900295,pm2rdl" 
                                width="100%" 
                                height="100%" 
                                frameborder="0" 
                                allowfullscreen="true" 
                                style="position:relative; border:0;">
                            </iframe>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Быстрые ссылки</h3>
                        <p style="margin-bottom: 12px;"><a href="#home" style="font-size: 1.2rem;"><i class="fas fa-chevron-right"></i> Главная</a></p>
                        <p style="margin-bottom: 12px;"><a href="#menu" style="font-size: 1.2rem;"><i class="fas fa-chevron-right"></i> Меню</a></p>
                        <p style="margin-bottom: 12px;"><a href="#promotions" style="font-size: 1.2rem;"><i class="fas fa-chevron-right"></i> Акции</a></p>
                    </div>
                </div>
                
                <div class="copyright">
                    &copy; 2026 День / Ночь. Все права защищены.
                </div>
            </div>
        </section>
    `;
}