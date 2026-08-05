export function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>День / Ночь</h3>
                    <p>Элитный бар в центре города с авторскими коктейлями и изысканной кухней. Место, где рождаются впечатления.</p>
                    <div class="social-icons">
                        <a href="https://max.ru/join/60fU0xcnTe71N0qXPIUnQasK6-zqJxQw1x2peKOTLOM"><img src="./images/Max.jpg" height="45" width="45" alt="Max"></a>
                        <a href="https://t.me/+7Oql1LJggm8yZmZi"><img src="./images/telegram.jpg" height="45" width="45" alt="Telegram"></a>
                        <a href="https://vk.com/club228933906"><img src="./images/vk.jpg" height="50" width="50" alt="VK"></a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3>Контакты</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ул. Академика Королёва, 8А, Берёзовский</p>
                    <p><i class="fas fa-phone"></i> +7-(922)-147-70-81</p>
                    <p><i class="fas fa-envelope"></i> walentina.com18@mail.ru</p> 
                    <p><i class="fas fa-clock"></i> Круглосуточно</p>
                </div>
                
                <div class="footer-section">
                    <h3>Быстрые ссылки</h3>
                    <a href="#home"><i class="fas fa-chevron-right"></i> Главная</a>
                    <a href="#menu"><i class="fas fa-chevron-right"></i> Меню</a>
                    <a href="#promotions"><i class="fas fa-chevron-right"></i> Акции</a>
                </div>
            </div>
            
            <div class="copyright">
                &copy; 2026 День / Ночь. Все права защищены.
            </div>
        </div>
    `;
}