import { EventBus } from './core/EventBus.js';
import { Router } from './core/Router.js';
import { ToastManager } from './core/ToastManager.js';
import { ModalManager } from './core/ModalManager.js';
import { ErrorHandler } from './core/ErrorHandler.js';

import { AuthService } from './services/AuthService.js';
import { SocioService } from './services/SocioService.js';
import { CheckinService } from './services/CheckinService.js';
import { TransaccionService } from './services/TransaccionService.js';
import { InventarioService } from './services/InventarioService.js';
import { SettingsService } from './services/SettingsService.js';
import { RenovacionService } from './services/RenovacionService.js';
import { CorteCajaService } from './services/CorteCajaService.js';
import { DashboardService } from './services/DashboardService.js';
import { ReporteService } from './services/ReporteService.js';

import { DashboardView } from '../views/DashboardView.js';
import { SociosView } from '../views/SociosView.js';
import { CheckinView } from '../views/CheckinView.js';
import { VentasView } from '../views/VentasView.js';
import { ConfiguracionView } from '../views/ConfiguracionView.js';
import { ReportesView } from '../views/ReportesView.js';

import { MAX_QUICK_SEARCH } from './utils/constants.js';

// Setup Toast and Modal Managers
const toastManager = new ToastManager();
const modalManager = new ModalManager();
const errorHandler = new ErrorHandler(toastManager);

// Setup EventBus
const eventBus = new EventBus();

// Setup Services Map
const services = {
    eventBus,
    toast: toastManager,
    modal: modalManager,
    auth: new AuthService(eventBus),
    socio: new SocioService(eventBus),
    checkin: new CheckinService(eventBus),
    transaccion: new TransaccionService(eventBus),
    inventario: new InventarioService(eventBus),
    settings: new SettingsService(eventBus),
    renovacion: new RenovacionService(eventBus),
    corteCaja: new CorteCajaService(eventBus),
    dashboard: new DashboardService(eventBus),
    reporte: new ReporteService(eventBus)
};
services.dashboard.setServices(services);
services.reporte.setServices(services);

// Router initialization
let router = null;

// Apply Visual Settings (Color primary and Brand logo/name text)
const applySettings = (settings) => {
    if (settings.brandColor) {
        document.documentElement.style.setProperty('--color-primary', settings.brandColor);
    }
    if (settings.brandName) {
        const brandEls = document.querySelectorAll('.brand-name');
        brandEls.forEach(el => {
            el.textContent = settings.brandName.toUpperCase();
        });
        
        const logoEl = document.querySelector('.brand-logo');
        if (logoEl) {
            logoEl.textContent = settings.brandName.trim().charAt(0).toUpperCase();
        }

        const brandDisplay = document.getElementById('gymNameDisplay');
        if (brandDisplay) {
            brandDisplay.textContent = settings.brandName;
        }
    }
};

// Global routing function
window.navigateTo = async (viewName) => {
    const user = services.auth.getCurrentUser();
    if (!user) return;

    if (viewName === 'configuracion' && !services.auth.isAdmin()) {
        toastManager.danger('Acceso denegado: Requiere nivel Administrador');
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
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
        targetBtn.classList.add('active');
        targetBtn.style.borderLeft = `3px solid ${primaryColor}`;
        targetBtn.style.backgroundColor = `color-mix(in srgb, ${primaryColor} 10%, transparent)`;
    }

    // Close mobile sidebar
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');

    // Update Topbar View Title
    const viewTitle = document.getElementById('viewTitle');
    const titles = {
        'dashboard': 'Panel General',
        'socios': 'Socios',
        'checkin': 'Check-in',
        'ventas': 'Ventas y Caja',
        'reportes': 'Reportes y Estadísticas',
        'configuracion': 'Configuración del Sistema'
    };
    if (viewTitle) {
        viewTitle.textContent = titles[viewName] || 'Vista';
    }

    await router.navigate(viewName);
};

// Update date in topbar
const updateDate = () => {
    const dateDisplay = document.getElementById('currentDate');
    if (!dateDisplay) return;
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date().toLocaleDateString('es-ES', options).toUpperCase();
    dateDisplay.textContent = 'HOY - ' + date;
};

// Authentication Layout Updates
const applyAuthUI = () => {
    const user = services.auth.getCurrentUser();
    const loginOverlay = document.getElementById('loginOverlay');
    const navConfig = document.getElementById('navConfiguracion');

    if (!user) {
        if (loginOverlay) loginOverlay.style.display = 'flex';
    } else {
        if (loginOverlay) loginOverlay.style.display = 'none';
        
        const userNameDisplay = document.getElementById('sidebarUserName');
        const userRoleDisplay = document.getElementById('sidebarUserRole');
        const avatarDisplay = document.getElementById('sidebarAvatar');

        if (userNameDisplay) userNameDisplay.textContent = user.nombre;
        if (userRoleDisplay) userRoleDisplay.textContent = user.role;
        if (avatarDisplay) {
            avatarDisplay.innerHTML = `<span style="font-size:16px; font-weight:700;">${user.nombre.substring(0,2).toUpperCase()}</span>`;
        }

        if (user.role === 'Empleado' && navConfig) {
            navConfig.style.display = 'none';
        } else if (navConfig) {
            navConfig.style.display = 'flex';
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial settings fetch
    const settings = await services.settings.get();
    applySettings(settings);

    updateDate();

    // 2. Setup Router
    const viewContainer = document.getElementById('viewContainer');
    router = new Router(viewContainer, services, eventBus);
    window.router = router;

    router.register('dashboard', DashboardView);
    router.register('socios', SociosView);
    router.register('checkin', CheckinView);
    router.register('ventas', VentasView);
    router.register('configuracion', ConfiguracionView);
    router.register('reportes', ReportesView);

    // 3. React to updates
    eventBus.on('settings:updated', (newSettings) => {
        applySettings(newSettings);
        // Refresh current view if needed
        const current = router.getCurrentView();
        if (current && typeof current.init === 'function') {
            current.init();
        }
    });

    // 4. Navigation Events
    const navBtns = document.querySelectorAll('.nav-menu .nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            window.navigateTo(view);
        });
    });

    // Mobile Sidebar controls
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
        });
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // 5. Auth form controls
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');
    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener('click', async () => {
            const u = document.getElementById('loginUser').value.trim();
            const p = document.getElementById('loginPass').value.trim();
            
            const success = await services.auth.login(u, p);
            if (success) {
                toastManager.success('Sesión iniciada correctamente');
                applyAuthUI();
                await window.navigateTo('dashboard');
            } else {
                toastManager.danger('Usuario o contraseña incorrectos');
            }
        });
    }

    const loginPassField = document.getElementById('loginPass');
    if (loginPassField) {
        loginPassField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                btnLoginSubmit.click();
            }
        });
    }

    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', () => {
            modalManager.confirm(
                'CERRAR SESIÓN',
                '¿Estás seguro de que deseas cerrar la sesión?',
                () => {
                    services.auth.logout();
                    window.location.reload();
                },
                'CANCELAR',
                'CERRAR SESIÓN',
                true
            );
        });
    }

    // Initial check
    applyAuthUI();
    if (services.auth.getCurrentUser()) {
        await window.navigateTo('dashboard');
    }

    // Quick Checkin button
    const btnCheckinRapido = document.getElementById('btnCheckinRapido');
    if (btnCheckinRapido) {
        btnCheckinRapido.addEventListener('click', async () => {
            const socios = await services.socio.getAll();
            
            const modalHtml = `
                <div class="modal-header">
                    <h3 class="modal-title">CHECK-IN RÁPIDO</h3>
                    <button class="btn-close" id="btnCloseQuickCheckin"><span class="material-icons-round" aria-hidden="true">close</span></button>
                </div>
                <div style="margin-bottom: 15px;">
                    <input type="text" id="quickSearchSocio" placeholder="🔍 Buscar socio por nombre..." style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
                </div>
                <div id="quickSociosList" style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;"></div>
            `;
            modalManager.open(modalHtml);

            const listEl = document.getElementById('quickSociosList');
            const searchEl = document.getElementById('quickSearchSocio');
            const btnClose = document.getElementById('btnCloseQuickCheckin');

            if (btnClose) {
                btnClose.addEventListener('click', () => modalManager.close());
            }

            const renderList = (filter = '') => {
                const filtered = socios.filter(s => s.nombre.toLowerCase().includes(filter.toLowerCase())).slice(0, MAX_QUICK_SEARCH);
                listEl.innerHTML = filtered.map(s => `
                    <div class="quick-socio-item" data-id="${s.id}" data-nombre="${s.nombre}" style="display: flex; align-items: center; gap: 12px; background: var(--color-bg-base); padding: 12px; border-radius: var(--border-radius-sm); cursor: pointer; transition: all 0.2s;">
                        <div style="width: 36px; height: 36px; background: var(--color-bg-surface-hover); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">${s.nombre.substring(0,2).toUpperCase()}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 500;">${s.nombre}</div>
                            <div style="font-size: 12px; color: var(--color-text-secondary);">${s.membresia}</div>
                        </div>
                        <span class="material-icons-round" aria-hidden="true" style="color: var(--color-primary);">login</span>
                    </div>
                `).join('');

                document.querySelectorAll('.quick-socio-item').forEach(item => {
                    item.addEventListener('click', async () => {
                        const id = item.getAttribute('data-id');
                        const nombre = item.getAttribute('data-nombre');
                        const socio = socios.find(s => s.id === id);
                        
                        if (socio && (socio.estado !== 'Activo' || socio.estaVencido)) {
                            toastManager.danger(`Acceso denegado. Membresía de ${nombre} está vencida/inactiva`);
                            return;
                        }

                        const diasRestantes = socio.diasRestantes;
                        const checkinObj = await services.checkin.registrar(id, nombre);
                        modalManager.close();
                        
                        if (checkinObj) {
                            if (diasRestantes <= 5 && diasRestantes >= 0) {
                                toastManager.warning(`Check-in registrado. AVISO: Membresía vence en ${diasRestantes} días`);
                            } else {
                                toastManager.success(`Check-in registrado para ${nombre}`);
                            }
                        } else {
                            toastManager.danger('Error al registrar check-in');
                        }
                    });
                });
            };

            renderList();
            let quickSearchTimer;
            searchEl.addEventListener('input', (e) => {
                clearTimeout(quickSearchTimer);
                quickSearchTimer = setTimeout(() => renderList(e.target.value), 300);
            });
            searchEl.focus();
        });
    }
});
