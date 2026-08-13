export function renderAnnouncement() {
    const container = document.getElementById('announcement-container');
    if (!container) return;

    container.innerHTML = `
        <section class="announcement-wrapper">
            <section class="container">
                <section class="announcement" id="announcement">
                    🎉 Счастливые часы! Скидка 20% на все коктейли с 18:00 до 21:00 каждый день!
                </section>
            </section>
        </section>
    `;
}