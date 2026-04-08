export function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal-overlay';
    modal.innerHTML = `
        <div class="booking-modal-content error">
            <div class="booking-modal-icon error">!</div>
            <h2>Ошибка бронирования</h2>
            <p class="error-message">${message}</p>
            <button class="btn booking-modal-close error">Понятно</button>
        </div>
    `;

    document.body.appendChild(modal);

    const style = document.createElement('style');
    style.textContent = `
        .booking-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); display: flex; align-items: center;
            justify-content: center; z-index: 1000; backdrop-filter: blur(5px);
        }
        .booking-modal-content.error {
            background: #1a1a1a; border: 1px solid #442222; padding: 40px;
            border-radius: 20px; text-align: center; max-width: 400px; width: 90%;
            color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes modalPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .booking-modal-icon.error {
            width: 60px; height: 60px; background: #dc3545; color: white;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 32px; font-weight: bold; margin: 0 auto 20px;
        }
        .error-message { color: #ccc; margin: 20px 0 30px; line-height: 1.5; }
        .booking-modal-close.error { 
            width: 100%; padding: 12px; cursor: pointer; background: #dc3545; border: none; color: #fff; border-radius: 8px;
            transition: background 0.2s;
        }
        .booking-modal-close.error:hover { background: #bb2d3b; }
    `;
    document.head.appendChild(style);

    const closeModal = () => modal.remove();
    modal.querySelector('.booking-modal-close').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}