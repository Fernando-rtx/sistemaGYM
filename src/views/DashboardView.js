import { BaseView } from '../js/core/BaseView.js';
import { calcularVencimiento } from '../js/utils/planSelector.js';

export class DashboardView extends BaseView {
    constructor(container, services, eventBus) {
        super(container, services, eventBus);
        this.chart = null;
    }

    render() {
        return `
            <div class="dashboard-grid-premium" id="dashboardContainer">
                <div style="padding: 40px; text-align: center; color: var(--color-text-secondary);">
                    <span class="material-icons-round style="font-size: 48px; animation: spin 1.5s linear infinite;">autorenew</span>
                    <p style="margin-top: 10px;">Cargando Dashboard...</p>
                </div>
            </div>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();
        await this.loadDashboardData();
        this.subscribe('checkin:created', () => this.loadDashboardData());
        this.subscribe('socio:updated', () => this.loadDashboardData());
        this.subscribe('settings:changed', () => this.loadDashboardData());
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
            
            const badgeStyle = 'color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.05);';
            const phoneClean = v.telefono ? v.telefono.replace(/[^0-9]/g, '') : '';
            const waText = `Hola ${v.nombre}, te contactamos de ${gymName.toUpperCase()}.\n\nNotamos que tu membresía ${textVencimiento.toLowerCase()}. ¡Te invitamos a renovar para seguir entrenando juntos!`;
            const waLink = phoneClean ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(waText)}` : '#';
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.02); gap: 10px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 44px; height: 44px; background: color-mix(in srgb, var(--color-primary) 10%, transparent); color: var(--color-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0;">${v.nombre.substring(0,2).toUpperCase()}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">${v.nombre}</div>
                            <div style="color: var(--color-text-secondary); font-size: 12px; margin-top: 4px;">${textVencimiento} · Plan ${v.membresia}</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="${badgeStyle} font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 12px; display: flex; align-items: center; gap: 4px; letter-spacing: 1px;">
                            <span style="font-size: 8px;">●</span> POR RENOVAR
                        </div>
                        <a href="${waLink}" target="${phoneClean ? '_blank' : '_self'}" title="${phoneClean ? 'Enviar WhatsApp' : 'Sin número'}" class="btn btn-outline" style="padding: 8px; border-radius: 8px; color: var(--color-text-primary); border-color: rgba(255,255,255,0.1); ${!phoneClean ? 'opacity: 0.3; pointer-events: none;' : ''}">
                            <span class="material-icons-round" style="font-size: 18px;">chat</span>
                        </a>
                        <button class="btn btn-primary btn-renovar" data-socio-id="${v.id}" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: 1px;">RENOVAR</button>
                    </div>
                </div>
            `;
        }).join('') : '<div style="padding: 40px; text-align: center; color: var(--color-text-secondary); font-size: 14px;">🎉 No hay alertas de renovación pendientes. Todo al día.</div>';

        const rachasHtml = rachas.length > 0 ? rachas.slice(0, 5).map((r, index) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.02);">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="font-size: 20px; font-weight: 900; color: var(--color-primary); width: 24px; text-align: center;">${index + 1}</div>
                    <div>
                        <div style="font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">${r.nombre}</div>
                        <div style="color: var(--color-text-secondary); font-size: 12px; margin-top: 4px;">Plan ${socios.find(s=>s.id===r.socioId)?.membresia || ''}</div>
                    </div>
                </div>
                <div style="color: var(--color-primary); font-weight: 800; font-size: 15px;">
                    🔥 ${r.racha}
                </div>
            </div>
        `).join('') : '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">Sin rachas. ¡Invita a tus socios a entrenar!</div>';

        container.innerHTML = `
            <div class="top-row" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;">
                <!-- Panel de Control Principal -->
                <div class="main-panel card" style="background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 3%, transparent) 0%, rgba(0,0,0,0) 100%); border: 1px solid color-mix(in srgb, var(--color-primary) 10%, transparent); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -50%; left: -10%; width: 50%; height: 200%; background: radial-gradient(circle, color-mix(in srgb, var(--color-primary) 5%, transparent) 0%, rgba(0,0,0,0) 70%); pointer-events: none;"></div>
                    
                    <div style="padding: 24px; position: relative; z-index: 1;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--color-primary); letter-spacing: 2px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 6px; height: 6px; background: var(--color-primary); border-radius: 50%; box-shadow: 0 0 8px var(--color-primary);"></span>
                            PANEL DE CONTROL · ${fechaHoyFormato}
                        </div>
                        <h1 style="color: var(--color-primary); font-size: 36px; font-weight: 900; margin: 0 0 16px 0; letter-spacing: -1px; text-shadow: 0 0 20px color-mix(in srgb, var(--color-primary) 20%, transparent);">${gymName.toUpperCase()}</h1>
                        <p style="color: var(--color-text-secondary); font-size: 14px; line-height: 1.6; max-width: 450px; margin: 0;">Resumen operativo del gimnasio. Atiende renovaciones, registra asistencias y mantén el ritmo en una sola vista.</p>
                    </div>
                    
                    <div style="display: flex; gap: 32px; padding: 24px; border-top: 1px solid rgba(255,255,255,0.03); background: rgba(0,0,0,0.2); position: relative; z-index: 1; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">CHECK-INS HOY</div>
                            <div style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${checkinsHoy.length}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">SOCIOS TOTALES</div>
                            <div style="font-size: 28px; font-weight: 800;">${socios.length}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">INGRESOS DEL MES</div>
                            <div style="font-size: 28px; font-weight: 800;">$${Number(ingresosMes).toFixed(2)}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">RACHA RÉCORD</div>
                            <div style="font-size: 28px; font-weight: 800;">${rachaRecord} <span style="font-size:12px; font-weight:600; color:var(--color-text-secondary);">DÍAS</span></div>
                        </div>
                    </div>
                </div>

                <!-- Metric Cards 2x2 -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 16px; align-content: start;">
                    <div class="card" style="border-left: 4px solid var(--color-success); padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">bolt</span> ACTIVOS</div>
                        <div style="font-size: 36px; font-weight: 800; color: var(--color-success); margin: 8px 0 4px 0;">${activos}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">de ${socios.length} socios</div>
                    </div>
                    <div class="card" style="border-left: 4px solid #f59e0b; padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">notifications</span> POR RENOVAR</div>
                        <div style="font-size: 36px; font-weight: 800; color: #f59e0b; margin: 8px 0 4px 0;">${allAlerts.length}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">≤ 6 días para vencer</div>
                    </div>
                    <div class="card" style="border-left: 4px solid var(--color-danger); padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">schedule</span> VENCIDOS</div>
                        <div style="font-size: 36px; font-weight: 800; color: var(--color-danger); margin: 8px 0 4px 0;">${vencidos}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">requieren acción</div>
                    </div>
                    <div class="card" style="border-left: 4px solid #6b7280; padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">person_off</span> AUSENTES</div>
                        <div style="font-size: 36px; font-weight: 800; color: #9ca3af; margin: 8px 0 4px 0;">${ausentes}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">+5 días sin asistir</div>
                    </div>
                </div>
            </div>

            <!-- Bottom Row 2:1 -->
            <div class="bottom-row" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;">
                <!-- Alertas de Renovación -->
                <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px;">ALERTAS DE RENOVACIÓN <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">${allAlerts.length} pendientes</span></div>
                        <button class="btn btn-outline" id="btnDashboardVerTodosSocios" style="font-size:11px; padding: 6px 12px; letter-spacing:1px; border-radius: 6px; font-weight: 700;">VER TODOS</button>
                    </div>
                    <div class="alerts-container" style="display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 520px; padding-right: 8px;">
                        ${alertasHtml}
                    </div>
                </div>

                <!-- Right Column: Asistencia y Rachas -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 24px;">ASISTENCIA SEMANAL <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">últimos 7 días</span></div>
                        <div style="height: 180px; width: 100%;">
                            <canvas id="weeklyChart"></canvas>
                        </div>
                    </div>
                    <div class="card" style="padding: 24px; flex: 1;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 24px;">TOP RACHAS <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">consecutivos</span></div>
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
                if (window.router) window.router.navigate('socios');
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
                <div style="width: 60px; height: 60px; background: color-mix(in srgb, var(--color-primary) 10%, transparent); color: var(--color-primary); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; margin-bottom: 10px;">${socio.nombre.substring(0,2).toUpperCase()}</div>
                <h3 style="font-size: 18px; font-weight: 800;">${socio.nombre}</h3>
                <p style="color: var(--color-text-secondary); font-size: 13px;">Plan actual: ${socio.membresia}</p>
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
                        concepto: `Renovación ${selectedPlan} - ${socio.nombre}`,
                        monto: selectedPrecio
                    });

                    await this.services.renovacion.registrar(socioId, planAnterior, selectedPlan, selectedPrecio);
                    
                    cleanup();
                    this.services.toast.success(`Membresía de ${socio.nombre} renovada con éxito`);
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
