export function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal-overlay';
    modal.innerHTML = `
        <div class="booking-modal-content error">
            <div class="booking-modal-icon error">!</div>
            <p class="error-message">${message}</p>
            <button class="btn booking-modal-close error">Понятно</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('.booking-modal-close').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}
