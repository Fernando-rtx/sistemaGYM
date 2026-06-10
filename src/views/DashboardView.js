import { BaseView } from '../js/core/BaseView.js';
import { calcularVencimiento } from '../js/utils/planSelector.js';
import { escapeHtml } from '../js/utils/escapeHtml.js';

export class DashboardView extends BaseView {
    constructor(container, services, eventBus) {
        super(container, services, eventBus);
        this.chart = null;
    }

    render() {
        return `
            <div class="dashboard-grid-premium" id="dashboardContainer">
                <div style="padding: 40px; text-align: center; color: var(--color-text-secondary);">
                    <span class="material-icons-round" style="font-size: 48px; animation: spin 1.5s linear infinite;">autorenew</span>
                    <p style="margin-top: 10px;">Cargando Dashboard...</p>
                </div>
            </div>
        `;
    }

    async init() {
        await this.loadDashboardData();
        this.subscribe('checkin:created', () => { this.loadDashboardData().catch(e => console.error(e)); });
        this.subscribe('socio:updated', () => { this.loadDashboardData().catch(e => console.error(e)); });
        this.subscribe('settings:changed', () => { this.loadDashboardData().catch(e => console.error(e)); });
    }

    async loadDashboardData() {
        const container = this.$('#dashboardContainer');
        if (!container) return;

        const {
            settings, socios, checkinsHoy, checkins,
            nuevosHoy, porVencer, rachas, activos, vencidos,
            ausentes, alertas, rachaRecord, ingresosMes, totalSocios
        } = await this.services.dashboard.getDashboardData();

        const hoy = new Date();
        const hoyPlano = new Date();
        hoyPlano.setHours(0,0,0,0);

        // Fecha Panel
        const fechaHoyFormato = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();

        // Alertas HTML: solo mostrar los próximos a vencer (<= 6 días y activos/no vencidos)
        // El usuario especificó: no quiere que salgan los vencidos en alertas de renovación
        const allAlerts = porVencer.filter(p => !p.estaVencido).map(p => ({ ...p, alertType: 'PorRenovar' }));
        allAlerts.sort((a,b) => new Date(a.fechaVencimiento + "T00:00:00") - new Date(b.fechaVencimiento + "T00:00:00"));
        
        const gymName = settings.brandName || 'NEXFIT';

        const alertasHtml = allAlerts.length > 0 ? allAlerts.map(v => {
            const fVenc = new Date(v.fechaVencimiento + "T00:00:00");
            const diffDias = Math.ceil((fVenc - hoyPlano) / (1000 * 60 * 60 * 24));
            const textVencimiento = diffDias > 0 ? `Vence en ${diffDias} días` : (diffDias === 0 ? 'Vence hoy' : `Venció hace ${Math.abs(diffDias)} días`);
            
            const phoneClean = v.telefono ? v.telefono.replace(/[^0-9]/g, '') : '';
            const safeName = escapeHtml(v.nombre);
            const safeMembresia = escapeHtml(v.membresia);
            const safeId = escapeHtml(v.id);
            const waText = `Hola ${safeName}, te contactamos de ${gymName.toUpperCase()}.\n\nNotamos que tu membresía ${textVencimiento.toLowerCase()}. ¡Te invitamos a renovar para seguir entrenando juntos!`;
            const waLink = phoneClean ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(waText)}` : '#';
            
            return `
                <div class="dash-alert-item">
                    <div class="dash-alert-left">
                        <div class="dash-alert-avatar">${escapeHtml(v.nombre.substring(0,2).toUpperCase())}</div>
                        <div>
                            <div class="dash-alert-name">${safeName}</div>
                            <div class="dash-alert-meta">${textVencimiento} · Plan ${safeMembresia}</div>
                        </div>
                    </div>
                    <div class="dash-alert-actions">
                        <div class="dash-alert-badge">
                            <span style="font-size: 8px;">●</span> POR RENOVAR
                        </div>
                        <a href="${waLink}" target="${phoneClean ? '_blank' : '_self'}" title="${phoneClean ? 'Enviar WhatsApp' : 'Sin número'}" class="btn btn-outline" style="padding: 8px; border-radius: 8px; color: var(--color-text-primary); border-color: rgba(255,255,255,0.1); ${!phoneClean ? 'opacity: 0.3; pointer-events: none;' : ''}">
                            <span class="material-icons-round">chat</span>
                        </a>
                        <button class="btn btn-primary btn-renovar" data-socio-id="${safeId}" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: 1px;">RENOVAR</button>
                    </div>
                </div>
            `;
        }).join('') : '<div class="dash-empty-state"><span class="material-icons-round">celebration</span><p>No hay alertas de renovación pendientes. Todo al día.</p></div>';

        const rachasHtml = rachas.length > 0 ? rachas.slice(0, 5).map((r, index) => `
            <div class="dash-streak-item">
                <div class="dash-streak-left">
                    <div class="dash-streak-rank">${index + 1}</div>
                    <div>
                        <div class="dash-streak-name">${escapeHtml(r.nombre)}</div>
                        <div class="dash-streak-plan">Plan ${escapeHtml(socios.find(s=>s.id===r.socioId)?.membresia || '')}</div>
                    </div>
                </div>
                <div class="dash-streak-value">
                    <span class="material-icons-round" style="font-size:16px;">local_fire_department</span> ${escapeHtml(String(r.racha))}
                </div>
            </div>
        `).join('') : '<div class="dash-empty-state"><span class="material-icons-round">emoji_events</span><p>Sin rachas aún. ¡Motiva a tus socios a entrenar seguido!</p></div>';

        container.innerHTML = `
            <div class="top-row">
                <!-- Panel de Control Principal -->
                <div class="dash-panel-control card">
                    <div class="dash-panel-glow"></div>
                    
                    <div class="dash-panel-content">
                        <div class="dash-panel-badge">PANEL DE CONTROL · ${fechaHoyFormato}</div>
                        <h1 class="dash-panel-title">${gymName.toUpperCase()}</h1>
                        <p class="dash-panel-desc">Resumen operativo del gimnasio. Atiende renovaciones, registra asistencias y mantén el ritmo en una sola vista.</p>
                    </div>
                    
                    <div class="dash-panel-stats">
                        <div class="dash-stat">
                            <div class="dash-stat-label">CHECK-INS HOY</div>
                            <div class="dash-stat-value accent">${checkinsHoy.length}</div>
                        </div>
                        <div class="dash-stat">
                            <div class="dash-stat-label">SOCIOS TOTALES</div>
                            <div class="dash-stat-value">${socios.length}</div>
                        </div>
                        <div class="dash-stat">
                            <div class="dash-stat-label">INGRESOS DEL MES</div>
                            <div class="dash-stat-value">$${Number(ingresosMes).toFixed(2)}</div>
                        </div>
                        <div class="dash-stat">
                            <div class="dash-stat-label">RACHA RÉCORD</div>
                            <div class="dash-stat-value">${rachaRecord} <span style="font-size:12px; font-weight:600; color:var(--color-text-secondary);">DÍAS</span></div>
                        </div>
                    </div>
                </div>

                <!-- Metric Cards 2x2 -->
                <div class="dash-metric-grid">
                    <div class="card dash-metric-card success">
                        <div class="dash-metric-header"><span class="material-icons-round">bolt</span> ACTIVOS</div>
                        <div class="dash-metric-number green">${activos}</div>
                        <div class="dash-metric-sub">de ${socios.length} socios</div>
                    </div>
                    <div class="card dash-metric-card warning">
                        <div class="dash-metric-header"><span class="material-icons-round">notifications</span> POR RENOVAR</div>
                        <div class="dash-metric-number amber">${allAlerts.length}</div>
                        <div class="dash-metric-sub">≤ 6 días para vencer</div>
                    </div>
                    <div class="card dash-metric-card danger">
                        <div class="dash-metric-header"><span class="material-icons-round">schedule</span> VENCIDOS</div>
                        <div class="dash-metric-number red">${vencidos}</div>
                        <div class="dash-metric-sub">requieren acción</div>
                    </div>
                    <div class="card dash-metric-card muted">
                        <div class="dash-metric-header"><span class="material-icons-round">person_off</span> AUSENTES</div>
                        <div class="dash-metric-number gray">${ausentes}</div>
                        <div class="dash-metric-sub">+5 días sin asistir</div>
                    </div>
                </div>
            </div>

            <!-- Bottom Row 2:1 -->
            <div class="bottom-row">
                <!-- Alertas de Renovación -->
                <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
                    <div class="dash-section-header">
                        <div class="dash-section-title">ALERTAS DE RENOVACIÓN <span class="dash-section-count">${allAlerts.length} pendientes</span></div>
                        <button class="btn btn-outline" id="btnDashboardVerTodosSocios" style="font-size:11px; padding: 6px 12px; letter-spacing:1px; border-radius: 6px; font-weight: 700;">VER TODOS</button>
                    </div>
                    <div class="dash-alert-container">
                        ${alertasHtml}
                    </div>
                </div>

                <!-- Right Column: Asistencia y Rachas -->
                <div class="dash-right-col">
                    <div class="card dash-card-hover" style="padding: 24px;">
                        <div class="dash-section-header" style="margin-bottom: 24px;">
                            <div class="dash-section-title">ASISTENCIA SEMANAL <span class="dash-section-count">últimos 7 días</span></div>
                        </div>
                        <div class="dash-chart-container">
                            <canvas id="weeklyChart"></canvas>
                        </div>
                    </div>
                    <div class="card dash-card-hover" style="padding: 24px; flex: 1;">
                        <div class="dash-section-header" style="margin-bottom: 24px;">
                            <div class="dash-section-title">TOP RACHAS <span class="dash-section-count">consecutivos</span></div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${rachasHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Renderizar Chart si existe
        const ctx = this.$('#weeklyChart');
        if (ctx && window.Chart) {
            const dias = [];
            const conteos = [];
            let maxIndex = 0;
            let maxVal = -1;

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const nameDay = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
                dias.push(nameDay);
                const sum = checkins.filter(c => c.fecha === dateStr).length;
                conteos.push(sum);
                if (sum >= maxVal) {
                    maxVal = sum;
                    maxIndex = 6 - i;
                }
            }

            const rootStyles = getComputedStyle(document.documentElement);
            const chartPrimary = rootStyles.getPropertyValue('--color-primary').trim() || '#94ff00';

            if (maxVal === 0) maxIndex = 6;
            const backgroundColors = conteos.map((_, i) => i === maxIndex ? chartPrimary : 'rgba(255,255,255,0.1)');

            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dias,
                    datasets: [{
                        label: 'Check-ins',
                        data: conteos,
                        backgroundColor: backgroundColors,
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { display: false, beginAtZero: true },
                        x: { 
                            grid: { display: false }, 
                            ticks: { color: '#aaa', font: { size: 10, weight: 'bold' } },
                            border: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1e1e1e',
                            titleColor: '#fff',
                            bodyColor: chartPrimary,
                            displayColors: false,
                            cornerRadius: 8,
                            padding: 10
                        }
                    }
                }
            });
        }

        // Attach action handlers
        const verTodosBtn = this.$('#btnDashboardVerTodosSocios');
        if (verTodosBtn) {
            this.bindEvent(verTodosBtn, 'click', () => {
                if (window.navigateTo) window.navigateTo('socios');
            });
        }

        this.$$('.btn-renovar').forEach(btn => {
            this.bindEvent(btn, 'click', () => {
                const socioId = btn.getAttribute('data-socio-id');
                this.openRenovarModal(socioId);
            });
        });
    }

    async openRenovarModal(socioId) {
        const socio = await this.services.socio.getById(socioId);
        if (!socio) return;
        
        const settings = await this.services.settings.get();
        const precios = settings.precios || { Mensual: 20, Quincenal: 10, Diario: 3 };
        
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">RENOVAR MEMBRESÍA</h3>
                <button class="btn-close" id="btnCloseRenovarModal"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; background: color-mix(in srgb, var(--color-primary) 10%, transparent); color: var(--color-primary); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; margin-bottom: 10px;">${escapeHtml(socio.nombre.substring(0,2).toUpperCase())}</div>
                <h3 style="font-size: 18px; font-weight: 800;">${escapeHtml(socio.nombre)}</h3>
                <p style="color: var(--color-text-secondary); font-size: 13px;">Plan actual: ${escapeHtml(socio.membresia)}</p>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <div class="plan-card selected" data-plan="Mensual" data-precio="${precios.Mensual}" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: color-mix(in srgb, var(--color-primary) 5%, transparent); transition: all 0.2s;">
                    <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 800;">MENSUAL</div>
                    <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$${precios.Mensual.toFixed(2)}</div>
                </div>
                <div class="plan-card" data-plan="Quincenal" data-precio="${precios.Quincenal}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                    <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 800;">QUINCENAL</div>
                    <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${precios.Quincenal.toFixed(2)}</div>
                </div>
                <div class="plan-card" data-plan="Diario" data-precio="${precios.Diario}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                    <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 800;">DIARIO</div>
                    <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${precios.Diario.toFixed(2)}</div>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" id="btnCancelRenovar">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmarRenovar" style="flex: 1; justify-content: center;">RENOVAR</button>
            </div>
        `;
        this.services.modal.open(modalHtml);
        
        let selectedPlan = 'Mensual';
        let selectedPrecio = precios.Mensual;
        
        const planCards = document.querySelectorAll('.plan-card');
        planCards.forEach(card => {
            card.addEventListener('click', function() {
                planCards.forEach(c => {
                    c.classList.remove('selected');
                    c.style.border = '1px solid rgba(255,255,255,0.1)';
                    c.style.backgroundColor = 'transparent';
                    c.style.opacity = '0.5';
                    c.querySelector('.plan-name').style.color = 'var(--color-text-secondary)';
                    c.querySelector('.plan-price').style.color = 'var(--color-text-primary)';
                });
                this.classList.add('selected');
                this.style.border = '2px solid var(--color-primary)';
                this.style.backgroundColor = 'color-mix(in srgb, var(--color-primary) 5%, transparent)';
                this.style.opacity = '1';
                this.querySelector('.plan-name').style.color = 'var(--color-primary)';
                this.querySelector('.plan-price').style.color = 'var(--color-primary)';
                selectedPlan = this.getAttribute('data-plan');
                selectedPrecio = parseFloat(this.getAttribute('data-precio'));
            });
        });

        const btnClose = document.getElementById('btnCloseRenovarModal');
        const btnCancel = document.getElementById('btnCancelRenovar');
        const btnConfirm = document.getElementById('btnConfirmarRenovar');

        const cleanup = () => this.services.modal.close();

        if (btnClose) btnClose.addEventListener('click', cleanup);
        if (btnCancel) btnCancel.addEventListener('click', cleanup);

        if (btnConfirm) {
            btnConfirm.addEventListener('click', async () => {
                btnConfirm.disabled = true;
                const originalText = btnConfirm.textContent;
                btnConfirm.innerHTML = '<span class="material-icons-round" style="font-size: 18px; animation: spin 1s linear infinite;">autorenew</span> RENOVANDO...';

                try {
                    const planAnterior = socio.membresia;
                    const nuevaFecha = calcularVencimiento(selectedPlan);
                    
                    await this.services.socio.update(socioId, {
                        membresia: selectedPlan,
                        precio: selectedPrecio,
                        fechaVencimiento: nuevaFecha,
                        estado: 'Activo'
                    });
                    
                    await this.services.transaccion.crear({
                        tipo: 'ingreso',
                        concepto: `Renovación ${selectedPlan} - ${escapeHtml(socio.nombre)}`,
                        monto: selectedPrecio
                    });

                    await this.services.renovacion.registrar(socioId, planAnterior, selectedPlan, selectedPrecio);
                    
                    cleanup();
                    this.services.toast.success(`Membresía de ${escapeHtml(socio.nombre)} renovada con éxito`);
                    await this.loadDashboardData();
                } finally {
                    if (document.getElementById('btnConfirmarRenovar')) {
                        btnConfirm.disabled = false;
                        btnConfirm.innerHTML = originalText;
                    }
                }
            });
        }
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        super.destroy();
    }
}
