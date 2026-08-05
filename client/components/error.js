const styleElement = document.createElement('style');
styleElement.textContent = `
    .error-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); display: flex; align-items: center;
        justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
        transition: background 0.3s ease;
    }
    .error-modal-content {
        background: #1a1a1a; border: 1px solid rgba(220, 53, 69, 0.4); padding: 30px 40px;
        border-radius: 20px; text-align: center; max-width: 400px; width: 90%;
        color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        animation: modalScale 0.3s ease-out;
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    .error-modal-icon {
        width: 60px; height: 60px; background: #dc3545; color: white;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 30px; margin: 0 auto 20px; font-weight: bold;
    }
    .error-modal-text { color: #ccc; margin: 15px 0 25px; line-height: 1.5; font-size: 15px; }
    .error-modal-btn { 
        width: 100%; padding: 12px; cursor: pointer; background: #dc3545; border: none; color: #fff; border-radius: 8px;
        font-size: 16px; font-weight: 600; transition: opacity 0.2s, background-color 0.3s;
    }
    .error-modal-btn:hover { opacity: 0.9; }

    /* Светлая тема */
    body.light-theme .error-modal-overlay {
        background: rgba(0, 0, 0, 0.4);
    }
    body.light-theme .error-modal-content {
        background: #ffffff;
        color: #222222;
        border-color: rgba(220, 53, 69, 0.3);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }
    body.light-theme .error-modal-text {
        color: #555555;
    }
`;
document.head.appendChild(styleElement);

export function showErrorModal(message) {
    hideErrorModal();

    const modal = document.createElement('div');
    modal.className = 'error-modal-overlay';
    modal.innerHTML = `
        <div class="error-modal-content">
            <div class="error-modal-icon">✕</div>
            <h2>Ошибка</h2>
            <p class="error-modal-text">${message}</p>
            <button class="btn error-modal-btn">Понятно</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.error-modal-btn');

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

    // Подписываемся на события клавиатуры с небольшой задержкой (150ms),
    // чтобы событие Enter от сабмита формы не закрывало окно мгновенно
    setTimeout(() => {
        closeBtn.focus();
        window.addEventListener('keydown', handleKeyDown);
    }, 150);
}

export function hideErrorModal() {
    const modal = document.querySelector('.error-modal-overlay');
    if (modal) modal.remove();
}

export function initErrorModal() {}