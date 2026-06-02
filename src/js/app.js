import { initDataStore, getSettings, getCurrentUser, loginUsuario, logoutUsuario } from './dataStore.js';

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

// Global navigation function (used by topbar buttons)
window.navigateTo = (viewName) => {
    // Control de roles
    const user = getCurrentUser();
    if (viewName === 'configuracion' && user && user.role === 'Empleado') {
        window.showToast('Acceso denegado: Requiere nivel Administrador', 'danger');
        return;
    }

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderLeft = 'none';
        b.style.backgroundColor = 'transparent';
    });
    
    const targetBtn = document.querySelector(`.nav-btn[data-view="${viewName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
        targetBtn.style.borderLeft = '3px solid var(--color-primary)';
        targetBtn.style.backgroundColor = 'rgba(148, 255, 0, 0.1)';
    }
    
    loadView(viewName);
};

// Apply settings to the UI
const applySettings = (settings) => {
    if (settings.brandColor) {
        document.documentElement.style.setProperty('--color-primary', settings.brandColor);
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
    
    const titles = {
        'dashboard': 'Panel General',
        'socios': 'Socios',
        'checkin': 'Check-in',
        'ventas': 'Ventas del Día',
        'configuracion': 'Configuración del Sistema'
    };
    viewTitle.textContent = titles[viewName] || 'Vista';
    
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
        void container.offsetWidth;
        
        if (typeof viewModule.init === 'function') {
            await viewModule.init();
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
            navBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderLeft = 'none';
                b.style.backgroundColor = 'transparent';
            });
            
            const current = e.currentTarget;
            current.classList.add('active');
            current.style.borderLeft = '3px solid var(--color-primary)';
            current.style.backgroundColor = 'rgba(148, 255, 0, 0.1)';
            
            const view = current.getAttribute('data-view');
            loadView(view);
        });
    });
};

// Close modal when clicking on overlay
const setupModalOverlay = () => {
    const modal = document.getElementById('globalModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.closeModal();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize centralized data store
    await initDataStore();
    
    // Apply saved settings
    const settings = await getSettings();
    applySettings(settings);
    
    updateDate();
    setupNavigation();
    setupModalOverlay();
    
    // Autenticación Flow
    const overlay = document.getElementById('loginOverlay');
    const navConfig = document.getElementById('navConfiguracion');
    
    const applyAuthUI = () => {
        const user = getCurrentUser();
        if (!user) {
            overlay.style.display = 'flex';
        } else {
            overlay.style.display = 'none';
            document.getElementById('sidebarUserName').textContent = user.nombre;
            document.getElementById('sidebarUserRole').textContent = user.role;
            document.getElementById('sidebarAvatar').innerHTML = `<span style="font-size:16px; font-weight:700;">${user.nombre.substring(0,2).toUpperCase()}</span>`;
            
            if (user.role === 'Empleado' && navConfig) {
                navConfig.style.display = 'none';
            } else if (navConfig) {
                navConfig.style.display = 'flex';
            }
        }
    };

    document.getElementById('btnLoginSubmit').addEventListener('click', () => {
        const u = document.getElementById('loginUser').value.trim();
        const p = document.getElementById('loginPass').value.trim();
        if (loginUsuario(u, p)) {
            window.showToast('Sesión iniciada correctamente', 'success');
            applyAuthUI();
            loadView('dashboard');
        } else {
            window.showToast('Usuario o contraseña incorrectos', 'danger');
        }
    });

    document.getElementById('userProfileBtn').addEventListener('click', () => {
        logoutUsuario();
        window.location.reload();
    });

    applyAuthUI();

    // Load view only if logged in
    if(getCurrentUser()) {
        loadView('dashboard');
    }

    // Quick check-in button
    const btnCheckinRapido = document.getElementById('btnCheckinRapido');
    if (btnCheckinRapido) {
        btnCheckinRapido.addEventListener('click', async () => {
            const { getSocios, addCheckin } = await import('./dataStore.js');
            const socios = getSocios();
            
            const modalHtml = `
                <div class="modal-header">
                    <h3 class="modal-title">CHECK-IN RÁPIDO</h3>
                    <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
                </div>
                <div style="margin-bottom: 15px;">
                    <input type="text" id="quickSearchSocio" placeholder="🔍 Buscar socio por nombre..." style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
                </div>
                <div id="quickSociosList" style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;"></div>
            `;
            window.openModal(modalHtml);

            const listEl = document.getElementById('quickSociosList');
            const searchEl = document.getElementById('quickSearchSocio');

            const renderList = (filter = '') => {
                const filtered = socios.filter(s => s.nombre.toLowerCase().includes(filter.toLowerCase())).slice(0, 8);
                listEl.innerHTML = filtered.map(s => `
                    <div class="quick-socio-item" data-id="${s.id}" data-nombre="${s.nombre}" style="display: flex; align-items: center; gap: 12px; background: var(--color-bg-base); padding: 12px; border-radius: var(--border-radius-sm); cursor: pointer; transition: all 0.2s;">
                        <div style="width: 36px; height: 36px; background: var(--color-bg-surface-hover); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">${s.nombre.substring(0,2).toUpperCase()}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 500;">${s.nombre}</div>
                            <div style="font-size: 12px; color: var(--color-text-secondary);">${s.membresia}</div>
                        </div>
                        <span class="material-icons-round" style="color: var(--color-primary);">login</span>
                    </div>
                `).join('');

                document.querySelectorAll('.quick-socio-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const id = item.getAttribute('data-id');
                        const nombre = item.getAttribute('data-nombre');
                        addCheckin(id, nombre);
                        window.closeModal();
                        window.showToast(`Check-in registrado para ${nombre}`, 'success');
                    });
                });
            };

            renderList();
            searchEl.addEventListener('input', (e) => renderList(e.target.value));
            searchEl.focus();
        });
    }
});
