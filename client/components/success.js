const styleElement = document.createElement('style');
styleElement.textContent = `
    .success-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); display: flex; align-items: center;
        justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
        transition: background 0.3s ease;
    }
    .success-modal-content {
        background: #1a1a1a; border: 1px solid rgba(40, 167, 69, 0.4); padding: 40px;
        border-radius: 20px; text-align: center; max-width: 400px; width: 90%;
        color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        animation: modalScale 0.3s ease-out;
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    @keyframes modalScale { 
        from { transform: scale(0.8); opacity: 0; } 
        to { transform: scale(1); opacity: 1; } 
    }
    .success-modal-icon {
        width: 60px; height: 60px; background: #28a745; color: white;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 30px; margin: 0 auto 20px; font-weight: bold;
    }
    .success-message { color: #ccc; margin: 20px 0 30px; line-height: 1.5; font-size: 15px; }
    .success-btn { 
        width: 100%; padding: 12px; cursor: pointer; background: #28a745; border: none; color: #fff; border-radius: 8px;
        font-size: 16px; font-weight: 600; transition: opacity 0.2s, background-color 0.3s;
    }
    .success-btn:hover { opacity: 0.9; }

    /* Светлая тема */
    body.light-theme .success-modal-overlay {
        background: rgba(0, 0, 0, 0.4);
    }
    body.light-theme .success-modal-content {
        background: #ffffff;
        color: #222222;
        border-color: rgba(40, 167, 69, 0.3);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }
    body.light-theme .success-message {
        color: #555555;
    }
`;
document.head.appendChild(styleElement);

export function showSuccess(title, message) {
    hideSuccessModal();

    const modal = document.createElement('div');
    modal.className = 'success-modal-overlay';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-modal-icon">✔</div>
            <h2>${title}</h2>
            <p class="success-message">${message}</p>
            <button class="btn success-btn">Отлично</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.success-btn');

    const closeModal = () => {
        window.removeEventListener('keydown', handleKeyDown);
        modal.remove();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        }
    };

    closeBtn.onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    // Задержка перед навешиванием слушателя keydown,
    // чтобы событие Enter от сабмита формы не захлопывало модалку мгновенно
    setTimeout(() => {
        closeBtn.focus();
        window.addEventListener('keydown', handleKeyDown);
    }, 150);
}

export function showSuccessModal(title, message) {
    showSuccess(title, message);
}

export function hideSuccessModal() {
    const modal = document.querySelector('.success-modal-overlay');
    if (modal) modal.remove();
}