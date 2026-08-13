export function createDeleteModalMarkup() {
    return `
    <section id="deleteConfirmModal" class="custom-modal">
        <div class="custom-modal-content">
            <div class="custom-modal-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 class="custom-modal-title">Удалить позицию?</h3>
            <p class="custom-modal-desc">Это действие необратимо. Вы действительно хотите удалить этот элемент?</p>
            <div class="custom-modal-actions">
                <button id="cancelDeleteBtn" class="modal-btn cancel-btn">Отмена</button>
                <button id="confirmDeleteBtn" class="modal-btn delete-btn">Удалить</button>
            </div>
        </div>
    </section>
    `;
}

export function openDeleteModal(onConfirm) {
    if (!document.getElementById('deleteConfirmModal')) {
        document.body.insertAdjacentHTML('beforeend', createDeleteModalMarkup());
    }

    const modal = document.getElementById('deleteConfirmModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');

    modal.classList.add('active');

    const newConfirm = confirmBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    confirmBtn.replaceWith(newConfirm);
    cancelBtn.replaceWith(newCancel);

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        modal.classList.remove('active');
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
}
