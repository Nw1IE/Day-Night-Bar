// Функция показа ошибки
export function showErrorModal(message) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');

    if (errorModal && errorMessage) {
        errorMessage.textContent = message;
        errorModal.style.display = 'flex';
    } else {
        alert(message);
    }
}

// Функция скрытия ошибки
export function hideErrorModal() {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.style.display = 'none';
    }
}

// Авто-инициализация событий для модалки ошибок
export function initErrorModal() {
    const errorModal = document.getElementById('errorModal');
    const closeBtn = errorModal?.querySelector('.close-modal') || document.getElementById('closeErrorModal');

    // Закрытие по крестику
    closeBtn?.addEventListener('click', hideErrorModal);

    // Закрытие по клику вне окна
    window.addEventListener('click', (e) => {
        if (e.target === errorModal) {
            hideErrorModal();
        }
    });
}