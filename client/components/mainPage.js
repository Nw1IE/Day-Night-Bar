export function renderHero() {
    const heroContainer = document.getElementById('hero-container');
    if (!heroContainer) return;

    heroContainer.innerHTML = `
        <section class="hero" id="home">
            <section class="container hero-content">
                <h1>День / Ночь</h1>
                <p class="White">Элитный бар в центре города с авторскими коктейлями, изысканной кухней и неповторимой атмосферой. У нас вы найдете идеальное сочетание вкуса, стиля и комфорта для настоящих ценителей.</p>
                <section class="hero-actions">
                    <a href="#footer-container" class="btn">Связаться с нами</a>
                    <a href="#menu" class="btn btn-outline">Посмотреть меню</a>
                </section>
            </section>
        </section>
    `;
}