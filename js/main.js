import { renderMenuItems, renderPromotions, updateAnnouncementUI } from './Modules/renderModule.js';
import { initPublicEvents } from './Modules/publicModule.js';
import { initAdmin } from './Modules/adminModule.js';

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    document.getElementById('promoDate').min = today;

    renderMenuItems('all');
    renderPromotions();
    updateAnnouncementUI();

    initPublicEvents();
    initAdmin();
});