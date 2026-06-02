// Global Toast Function
window.showToast = (msg, type = 'info') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = { success: 'check_circle', danger: 'error', info: 'info' };
    toast.innerHTML = `<span class="material-icons-round">${icons[type]}</span> ${msg}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Global Modal Functions
window.openModal = (contentHtml) => {
    const modal = document.getElementById('globalModal');
    if (!modal) return;
    
    modal.innerHTML = `
        <div class="modal-content">
            ${contentHtml}
        </div>
    `;
    modal.classList.add('active');
};

window.closeModal = () => {
    const modal = document.getElementById('globalModal');
    if (modal) modal.classList.remove('active');
};

// Mock Store inicialización (Persistencia local)
const initStore = () => {
    if (!localStorage.getItem('gym_settings')) {
        localStorage.setItem('gym_settings', JSON.stringify({
            brandName: 'NEXFIT',
            brandColor: '#94ff00'
        }));
    }
    // Cargar configuraciones globales
    const settings = JSON.stringify(localStorage.getItem('gym_settings') || '{}');
    try {
        const parsed = JSON.parse(settings);
        const settingsObj = JSON.parse(parsed); // double parse in case of stringified JSON string
        applySettings(settingsObj);
    } catch(e) {
        applySettings({brandName: 'NEXFIT', brandColor: '#94ff00'});
    }
};

const applySettings = (settings) => {
    if (settings.brandColor) {
        document.documentElement.style.setProperty('--color-primary', settings.brandColor);
        // Opcional: calcular color oscuro
    }
    if (settings.brandName) {
        const brandEls = document.querySelectorAll('.brand-name');
        brandEls.forEach(el => el.textContent = settings.brandName);
    }
};

// Date Formatter
const updateDate = () => {
    const dateDisplay = document.getElementById('currentDate');
    if (!dateDisplay) return;
    
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date().toLocaleDateString('es-ES', options).toUpperCase();
    dateDisplay.textContent = '📅 HOY - ' + date;
};

// Simple Router
const loadView = async (viewName) => {
    const container = document.getElementById('viewContainer');
    const viewTitle = document.getElementById('viewTitle');
    
    container.innerHTML = `<div style="text-align: center; color: var(--color-text-secondary); margin-top: 50px;">Cargando...</div>`;
    
    // Cambiar Título del Topbar
    const titles = {
        'dashboard': 'Panel General',
        'socios': 'Socios',
        'checkin': 'Check-in',
        'ventas': 'Ventas del Día',
        'configuracion': 'Configuración del Sistema'
    };
    viewTitle.textContent = titles[viewName] || 'Vista';
    
    // Cargar contenido dinámicamente
    // Para simplificar, insertaremos HTML directamente según la vista
    // En un caso real, esto vendría de módulos separados
    try {
        let viewModule;
        switch(viewName) {
            case 'dashboard': viewModule = await import('../views/dashboard.js'); break;
            case 'socios': viewModule = await import('../views/socios.js'); break;
            case 'checkin': viewModule = await import('../views/checkin.js'); break;
            case 'ventas': viewModule = await import('../views/ventas.js'); break;
            case 'configuracion': viewModule = await import('../views/configuracion.js'); break;
            default: throw new Error('Vista no implementada');
        }
        container.innerHTML = viewModule.render();
        container.className = 'view-container fade-in';
        // Forzar reflow para reiniciar animación
        void container.offsetWidth;
        
        if (typeof viewModule.init === 'function') {
            viewModule.init();
        }
    } catch(e) {
        console.error(e);
        container.innerHTML = `<div style="color: var(--color-danger); text-align: center; margin-top: 50px;">Error al cargar la vista. ¿Está implementada?</div>`;
    }
};

// Navigation Listeners
const setupNavigation = () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            navBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderLeft = 'none';
                b.style.backgroundColor = 'transparent';
            });
            
            // Add active to clicked
            const current = e.currentTarget;
            current.classList.add('active');
            
            // Restablecer estilos JS (en css ya están pero el hover puede molestar)
            current.style.borderLeft = '3px solid var(--color-primary)';
            current.style.backgroundColor = 'rgba(148, 255, 0, 0.1)';
            
            const view = current.getAttribute('data-view');
            loadView(view);
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initStore();
    updateDate();
    setupNavigation();
    
    // Cargar Dashboard por defecto
    loadView('dashboard');
});
