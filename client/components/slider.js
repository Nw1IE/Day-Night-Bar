export function renderSlider() {
    const sliderContainer = document.getElementById('slider-container');
    if (!sliderContainer) return;

    sliderContainer.innerHTML = `
        <section class="cocktail-slider-section">
            <section class="container">
                <section class="slider-header">
                    <h2 class="section-title">Наши шедевры</h2>
                    <section class="slider-nav">
                        <button class="nav-btn prev" id="prevBtn"><i class="fas fa-chevron-left"></i></button>
                        <button class="nav-btn next" id="nextBtn"><i class="fas fa-chevron-right"></i></button>
                    </section>
                </section>
                
                <section class="slider-container">
                    <section class="slider-track" id="sliderTrack">
                        <article class="slide">
                            <img src="./images/1.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Мартини</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/2.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Апероль Спритц</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/3.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Виски</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/4.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Уиски Сауэр</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/5.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Космополитен</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/6.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Экзотический Мартини</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/7.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Космополитен</h3></section>
                        </article>
                        <article class="slide">
                            <img src="./images/8.jpg" width="300" height="400" alt="Коктейль">
                            <section class="slide-info"><h3>Яблочный Мартини</h3></section>
                        </article>
                    </section>
                </section>
            </section>
        </section>
    `;
}