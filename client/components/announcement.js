export function renderAnnouncement() {
    const container = document.getElementById('announcement-container');
    if (!container) return;

    container.innerHTML = `
        <section class="announcement-wrapper">
            <section class="container">
                <section class="announcement" id="announcement">
                </section>
            </section>
        </section>
    `;
}