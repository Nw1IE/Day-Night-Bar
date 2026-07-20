
/**
 * Единственный компонент, который рисует модалку ошибки во всём приложении.
 * Больше нигде не дублируем showErrorModal — раньше он был одновременно
 * в components/error.js и js/Modules/errorModule.js с разными реализациями
 * (в errorModule.js стили инжектились через <style>, тут — нет, они уже
 * должны лежать в css/components.css как .booking-modal-*).
 */
export function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal-overlay';
    modal.innerHTML = `
        <div class="booking-modal-content error">
            <div class="booking-modal-icon error">!</div>
            <p class="error-message">${escapeHtml(message)}</p>
            <button class="btn booking-modal-close error">Понятно</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('.booking-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onKey); }
    });
}

function escapeHtml(string) {
    const matchHtmlRegExp = /["'&<>]/;
    const str = '' + string;
    const match = matchHtmlRegExp.exec(str);

    if (!match) return str;

    let escape;
    let html = '';
    let index = 0;
    let lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: escape = '&quot;'; break; // "
            case 38: escape = '&amp;'; break;  // &
            case 39: escape = '&#39;'; break;  // '
            case 60: escape = '&lt;'; break;   // <
            case 62: escape = '&gt;'; break;   // >
            default: continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}