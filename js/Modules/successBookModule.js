export function showSuccessModal(name, date, time, guests, phone) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal-overlay';
    modal.innerHTML = `
        <div class="booking-modal-content">
            <div class="booking-modal-icon">✔</div>
            <h2>Бронирование подтверждено!</h2>
            <p>Спасибо, <strong>${name}</strong>!</p>
            <div class="booking-details">
                <p>Дата: ${date}</p>
                <p>Время: ${time}</p>
                <p>Гости: ${guests}</p>
            </div>
            <p class="booking-footer">Мы свяжемся с вами по номеру <span>${phone}</span> в ближайшее время для уточнения деталей.</p>
            <button class="btn booking-modal-close">Отлично</button>
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
        .booking-modal-content {
            background: #1a1a1a; border: 1px solid #333; padding: 40px;
            border-radius: 20px; text-align: center; max-width: 450px; width: 90%;
            color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            animation: modalScale 0.3s ease-out;
        }
        @keyframes modalScale { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .booking-modal-icon {
            width: 60px; height: 60px; background: #28a745; color: white;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 30px; margin: 0 auto 20px;
        }
        .booking-details {
            background: #252525; padding: 15px; border-radius: 12px; margin: 20px 0;
            display: grid; grid-template-columns: 1fr; gap: 5px; text-align: left;
        }
        .booking-footer { font-size: 0.9em; color: #aaa; margin-bottom: 25px; }
        .booking-footer span { color: #fff; font-weight: bold; }
        .booking-modal-close { width: 100%; padding: 12px; cursor: pointer; }
    `;
    document.head.appendChild(style);

    const closeModal = () => modal.remove();
    modal.querySelector('.booking-modal-close').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}