export function showSuccess(title, message) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal-overlay';
    modal.innerHTML = `
        <div class="booking-modal-content success-universal">
            <div class="booking-modal-icon">✔</div>
            <h2>${title}</h2>
            <p class="success-message">${message}</p>
            <button class="btn booking-modal-close success-btn">Отлично</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('.booking-modal-close').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}
