import { Socio } from '../../js/models/Socio.js';

export class SocioProfile {
    constructor(container, services, eventBus, onBack) {
        this.container = container;
        this.services = services;
        this.eventBus = eventBus;
        this.onBack = onBack;
        this.socio = null;
        this.checkins = [];
        this.renewals = [];
    }

    async loadSocio(id) {
        this.socio = await this.services.socio.getById(id);
        if (!this.socio) {
            this.container.innerHTML = '<div class="card" style="text-align:center; padding:50px;">Socio no encontrado</div>';
            return;
        }
        
        const allCheckins = await this.services.checkin.getAll();
        this.checkins = allCheckins.filter(c => c.socioId === id);
        
        this.renewals = await this.services.renovacion.getHistorial(id);
        
        await this.render();
    }

    async render() {
        if (!this.socio) return;

        const hoy = new Date();
        const fReg = new Date(this.socio.fechaRegistro + "T00:00:00");
        const fVenc = new Date(this.socio.fechaVencimiento + "T00:00:00");

        const diasComoSocio = Math.max(0, Math.floor((hoy - fReg) / (1000 * 60 * 60 * 24)));
        const totalDiasPlan = Math.max(1, Math.ceil((fVenc - fReg) / (1000 * 60 * 60 * 24)));
        const diasRestantes = Math.ceil((fVenc - hoy) / (1000 * 60 * 60 * 24));
        
        let porcentaje = ((totalDiasPlan - Math.max(0, diasRestantes)) / totalDiasPlan) * 100;
        porcentaje = Math.min(100, Math.max(0, porcentaje));

        let rachaActual = 0;
        let ultimaVisitaFormateada = '-';
        const isAusenteBadge = this.services.checkin.esAusente(this.socio, this.checkins);

        if (this.checkins.length > 0) {
            ultimaVisitaFormateada = Socio.formatFecha(this.checkins[0].fecha);
            
            let currentCheckDate = new Date();
            let checkSet = new Set(this.checkins.map(c => c.fecha));
            const todayStr = new Date().toISOString().split('T')[0];
            
            if (!checkSet.has(todayStr)) {
                currentCheckDate.setDate(currentCheckDate.getDate() - 1);
            }
            
            while (true) {
                const dateStr = currentCheckDate.toISOString().split('T')[0];
                if (checkSet.has(dateStr)) {
                    rachaActual++;
                    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        // Attendance heatmap
        let heatmapHtml = '';
        const setFechas = new Set(this.checkins.map(c => c.fecha));
        let diasAsistidos30 = 0;
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const vino = setFechas.has(dateStr);
            if (vino) diasAsistidos30++;
            heatmapHtml += `<div class="heatmap-cell" style="background-color: ${vino ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)'};" title="${dateStr}${vino ? ' (Asistió)' : ''}"></div>`;
        }

        // Checkins list
        const checkinsHtml = this.checkins.slice(0, 5).map(c => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; background: rgba(16, 185, 129, 0.1); color: var(--color-success); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span class="material-icons-round" style="font-size: 16px;">login</span>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">Check-in</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">${Socio.formatFecha(c.fecha)} · ${c.hora.substring(0, 5)}</div>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--color-success); font-weight: 600;">Acceso concedido</div>
            </div>
        `).join('');

        // Renewals list
        const renewalsHtml = this.renewals.slice(0, 5).map(r => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; background: rgba(148, 255, 0, 0.1); color: var(--color-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span class="material-icons-round" style="font-size: 16px;">autorenew</span>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">Renovación: ${r.planNuevo}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">${Socio.formatFecha(r.fecha)} (Plan anterior: ${r.planAnterior})</div>
                    </div>
                </div>
                <div style="font-size: 14px; color: var(--color-primary); font-weight: 700;">$${r.monto.toFixed(2)}</div>
            </div>
        `).join('');

        const settings = await this.services.settings.get();
        const brandName = settings.brandName || 'NEXFIT';

        const user = this.services.auth.getCurrentUser();
        const isAdmin = user && user.role !== 'Empleado';

        this.container.innerHTML = `
            <div class="profile-nav" style="display: flex; align-items: center; margin-bottom: 24px; gap: 16px;">
                <button class="btn btn-outline" id="btnVolverSocios" style="padding: 8px 16px; font-weight: 600;">
                    <span class="material-icons-round" style="font-size: 18px; margin-right: 4px;">arrow_back</span> VOLVER
                </button>
                <div style="color: var(--color-text-secondary); font-size: 13px; font-weight: 600; letter-spacing: 1px;">
                    SOCIOS / <span style="color: var(--color-text-primary);">${this.socio.nombre.toUpperCase()}</span>
                </div>
            </div>

            <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 24px; flex-wrap: wrap; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="width: 80px; height: 80px; background: color-mix(in srgb, var(--color-primary) 10%, transparent); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: var(--color-primary);">${this.socio.iniciales}</div>
                    <div>
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${this.socio.nombre.toUpperCase()}</h1>
                        <div style="display: flex; gap: 16px; color: var(--color-text-secondary); font-size: 13px; margin-top: 8px; align-items: center; flex-wrap: wrap;">
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">person</span> ${this.socio.edad ? this.socio.edad + ' años' : '-'}</span>
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">phone</span> ${this.socio.telefono || 'Sin teléfono'}</span>
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">calendar_today</span> Socio desde ${Socio.formatFecha(this.socio.fechaRegistro)}</span>
                            <span class="status-badge ${this.socio.estaVencido ? 'status-vencido' : (isAusenteBadge ? 'status-ausente' : 'status-activo')}" style="padding: 2px 8px;">
                                ${this.socio.estaVencido ? 'VENCIDO' : (isAusenteBadge ? 'AUSENTE' : 'ACTIVO')}
                            </span>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-outline" id="btnDeudaProfile">
                        <span class="material-icons-round" style="font-size:18px;">payments</span> DEUDA: $${this.socio.deuda.toFixed(2)}
                    </button>
                    <button class="btn btn-outline" id="btnVerQrProfile"><span class="material-icons-round" style="font-size:18px;">qr_code</span> VER QR</button>
                    ${isAdmin ? `<button class="btn btn-outline danger" id="btnEliminarProfile"><span class="material-icons-round" style="font-size:18px;">delete</span> ELIMINAR</button>` : ''}
                    <button class="btn btn-outline" id="btnRenovarProfile"><span class="material-icons-round" style="font-size:18px;">autorenew</span> RENOVAR PLAN</button>
                    <button class="btn btn-primary" id="btnCheckinProfile"><span class="material-icons-round" style="font-size:18px;">flash_on</span> CHECK-IN</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px;">
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">RACHA ACTUAL</div>
                    <div style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${rachaActual} <span style="font-size: 14px; font-weight: 500; color: var(--color-text-secondary);">días</span></div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">ASISTENCIAS TOTALES</div>
                    <div style="font-size: 28px; font-weight: 800;">${this.checkins.length}</div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">DÍAS COMO SOCIO</div>
                    <div style="font-size: 28px; font-weight: 800;">${diasComoSocio}</div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">ÚLTIMA VISITA</div>
                    <div style="font-size: 20px; font-weight: 800; margin-top: 8px;">${ultimaVisitaFormateada}</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;" class="profile-layout-grid">
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">ESTADO DEL PLAN <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">Plan ${this.socio.membresia} · $${(this.socio.precio || 0).toFixed(2)}</span></div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: var(--color-text-secondary); letter-spacing: 1px; margin-bottom: 8px;">
                            <span>INICIO · ${(Socio.formatFecha(this.socio.fechaRegistro) || '').toUpperCase()}</span>
                            <span>VENCE · ${(Socio.formatFecha(this.socio.fechaVencimiento) || '').toUpperCase()}</span>
                        </div>
                        
                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
                            <div style="height: 100%; width: ${porcentaje}%; background: ${porcentaje >= 100 ? 'var(--color-danger)' : 'var(--color-primary)'}; border-radius: 3px; transition: width 0.5s ease;"></div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
                            <span style="${this.socio.estaVencido ? 'color: var(--color-danger);' : ''}">${diasRestantes > 0 ? diasRestantes + ' días restantes' : 'Plan Vencido'}</span>
                            <span style="color: var(--color-text-secondary); font-weight: 500;">${Math.floor(porcentaje)}% transcurrido</span>
                        </div>
                    </div>

                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">ASISTENCIA · ÚLTIMOS 30 DÍAS <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">${diasAsistidos30} días</span></div>
                        <div class="heatmap-grid">
                            ${heatmapHtml}
                        </div>
                    </div>

                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">HISTORIAL DE RENOVACIONES</div>
                        <div style="max-height: 250px; overflow-y: auto;">
                            ${this.renewals.length === 0 ? `
                                <div style="text-align: center; color: var(--color-text-secondary); padding: 30px;">Sin renovaciones registradas.</div>
                            ` : renewalsHtml}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <div class="card" style="padding: 24px; min-height: 350px; display: flex; flex-direction: column;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">ÚLTIMAS VISITAS <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">${this.checkins.length} visitas</span></div>
                        <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto;">
                            ${this.checkins.length === 0 ? `
                                <div style="text-align: center; color: var(--color-text-secondary); margin-top: 60px;">
                                    <div style="font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px; font-size: 13px;">SIN ASISTENCIAS</div>
                                    <div style="font-size: 12px;">Registra el primer check-in.</div>
                                </div>
                            ` : checkinsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupBindings();
    }

    setupBindings() {
        const btnVolver = this.container.querySelector('#btnVolverSocios');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                if (this.onBack) this.onBack();
            });
        }

        const btnCheckin = this.container.querySelector('#btnCheckinProfile');
        if (btnCheckin) {
            btnCheckin.addEventListener('click', async () => {
                if (this.socio.estaVencido) {
                    this.services.toast.danger(`Acceso denegado. La membresía de ${this.socio.nombre} está vencida.`, 4000);
                    return;
                }
                const ch = await this.services.checkin.registrar(this.socio.id, this.socio.nombre);
                if (ch) {
                    const statusMsg = this.socio.estaPorVencer 
                        ? `Check-in registrado. ¡AVISO! Vence en ${this.socio.diasRestantes} días.`
                        : `Check-in registrado con éxito para ${this.socio.nombre}.`;
                    
                    if (this.socio.estaPorVencer) {
                        this.services.toast.warning(statusMsg, 5000);
                    } else {
                        this.services.toast.success(statusMsg, 3000);
                    }
                    await this.loadSocio(this.socio.id);
                }
            });
        }

        const btnRenovar = this.container.querySelector('#btnRenovarProfile');
        if (btnRenovar) {
            btnRenovar.addEventListener('click', () => {
                this.openRenewalModal();
            });
        }

        const btnDeuda = this.container.querySelector('#btnDeudaProfile');
        if (btnDeuda) {
            btnDeuda.addEventListener('click', () => {
                this.openDebtModal();
            });
        }

        const btnVerQr = this.container.querySelector('#btnVerQrProfile');
        if (btnVerQr) {
            btnVerQr.addEventListener('click', () => {
                this.openQrModal();
            });
        }

        const btnEliminar = this.container.querySelector('#btnEliminarProfile');
        if (btnEliminar) {
            btnEliminar.addEventListener('click', () => {
                this.services.modal.confirm(
                    'ELIMINAR SOCIO',
                    `¿Estás seguro de que deseas eliminar a ${this.socio.nombre.toUpperCase()}? Esta acción no se puede deshacer y eliminará sus asistencias.`,
                    async () => {
                        const ok = await this.services.socio.delete(this.socio.id);
                        if (ok) {
                            this.services.toast.success('Socio eliminado correctamente');
                            if (this.onBack) this.onBack();
                        } else {
                            this.services.toast.danger('No se pudo eliminar al socio');
                        }
                    },
                    'CANCELAR',
                    'ELIMINAR',
                    true
                );
            });
        }
    }

    openRenewalModal() {
        const settings = this.services.settings.get();
        this.services.settings.get().then(sets => {
            const precios = sets.precios;
            const modalHtml = `
                <div class="modal-header">
                    <h3 class="modal-title">RENOVAR MEMBRESÍA</h3>
                    <button class="btn-close" id="btnCloseRenewal"><span class="material-icons-round">close</span></button>
                </div>
                <div style="padding: 10px 0;">
                    <p style="margin-bottom: 20px; font-size: 14px; color: var(--color-text-secondary);">Selecciona el plan para renovar la suscripción de <b>${this.socio.nombre}</b>.</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                        <div class="plan-card-ns selected" data-plan="Mensual" data-precio="${precios.Mensual}" data-dias="30" style="border: 2px solid var(--color-primary); padding: 16px; border-radius: var(--border-radius-md); cursor: pointer; background-color: color-mix(in srgb, var(--color-primary) 5%, transparent); position: relative;">
                            <span class="material-icons-round check-icon-ns" style="position: absolute; top: 12px; right: 12px; color: var(--color-primary); font-size: 20px;">check_circle</span>
                            <div class="plan-name-ns" style="font-size: 12px; margin-bottom: 4px; font-weight: 900; color: var(--color-text-primary);">PLAN MENSUAL</div>
                            <div class="plan-price-ns" style="font-size: 24px; font-weight: 900; color: var(--color-primary);">$${precios.Mensual.toFixed(2)}</div>
                        </div>
                        <div class="plan-card-ns" data-plan="Quincenal" data-precio="${precios.Quincenal}" data-dias="15" style="border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: var(--border-radius-md); cursor: pointer; position: relative; opacity: 0.6;">
                            <span class="material-icons-round check-icon-ns" style="position: absolute; top: 12px; right: 12px; color: transparent; font-size: 20px;">check_circle</span>
                            <div class="plan-name-ns" style="font-size: 12px; margin-bottom: 4px; font-weight: 900; color: var(--color-text-secondary);">PLAN QUINCENAL</div>
                            <div class="plan-price-ns" style="font-size: 24px; font-weight: 900; color: var(--color-text-primary);">$${precios.Quincenal.toFixed(2)}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800;">FECHA DE INICIO</label>
                            <input type="date" id="renFechaInicio" value="${new Date().toISOString().split('T')[0]}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px; border-radius: var(--border-radius-md); font-size: 14px; outline: none; width:100%; box-sizing:border-box;">
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                            <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800;">VENCIMIENTO (CALCULADO)</label>
                            <input type="text" id="renFechaVenc" readonly style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: var(--color-primary); padding: 12px; border-radius: var(--border-radius-md); font-size: 14px; font-weight: 800; outline: none; width:100%; box-sizing:border-box;">
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-outline" id="btnCancelRen">CANCELAR</button>
                    <button class="btn btn-primary" id="btnSaveRen" style="display: flex; align-items: center; gap: 6px;"><span class="material-icons-round">check</span> CONFIRMAR RENOVACIÓN</button>
                </div>
            `;
            
            this.services.modal.open(modalHtml);

            const mClose = document.getElementById('btnCloseRenewal');
            const mCancel = document.getElementById('btnCancelRen');
            const mSave = document.getElementById('btnSaveRen');
            const mCards = document.querySelectorAll('.plan-card-ns');
            const rStart = document.getElementById('renFechaInicio');
            const rEnd = document.getElementById('renFechaVenc');

            const updVenc = () => {
                const start = rStart.value;
                const sel = document.querySelector('.plan-card-ns.selected');
                const dias = sel ? parseInt(sel.getAttribute('data-dias')) : 30;
                if (!start) return;
                const d = new Date(start + "T00:00:00");
                d.setDate(d.getDate() + dias);
                rEnd.value = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
            };

            rStart.addEventListener('change', updVenc);

            mCards.forEach(c => {
                c.addEventListener('click', function() {
                    mCards.forEach(x => {
                        x.classList.remove('selected');
                        x.style.border = '1px solid rgba(255,255,255,0.1)';
                        x.style.backgroundColor = 'transparent';
                        x.style.opacity = '0.6';
                        x.querySelector('.plan-name-ns').style.color = 'var(--color-text-secondary)';
                        x.querySelector('.plan-price-ns').style.color = 'var(--color-text-primary)';
                        x.querySelector('.check-icon-ns').style.color = 'transparent';
                    });
                    this.classList.add('selected');
                    this.style.border = '2px solid var(--color-primary)';
                    this.style.backgroundColor = 'color-mix(in srgb, var(--color-primary) 5%, transparent)';
                    this.style.opacity = '1';
                    this.querySelector('.plan-name-ns').style.color = 'var(--color-text-primary)';
                    this.querySelector('.plan-price-ns').style.color = 'var(--color-primary)';
                    this.querySelector('.check-icon-ns').style.color = 'var(--color-primary)';
                    updVenc();
                });
            });

            updVenc();

            const cleanup = () => this.services.modal.close();

            if (mClose) mClose.addEventListener('click', cleanup);
            if (mCancel) mCancel.addEventListener('click', cleanup);

            if (mSave) {
                mSave.addEventListener('click', async () => {
                    const sel = document.querySelector('.plan-card-ns.selected');
                    const plan = sel ? sel.getAttribute('data-plan') : 'Mensual';
                    const price = sel ? parseFloat(sel.getAttribute('data-precio')) : 20.00;
                    const dias = sel ? parseInt(sel.getAttribute('data-dias')) : 30;
                    const startVal = rStart.value;

                    const dVenc = new Date(startVal + "T00:00:00");
                    dVenc.setDate(dVenc.getDate() + dias);
                    const vencVal = dVenc.toISOString().split('T')[0];

                    const oldPlan = this.socio.membresia;
                    
                    // Update socio plan
                    const updated = await this.services.socio.update(this.socio.id, {
                        membresia: plan,
                        precio: price,
                        fechaRegistro: startVal,
                        fechaVencimiento: vencVal,
                        estado: 'Activo'
                    });

                    if (updated) {
                        // Register transaction
                        await this.services.transaccion.crear({
                            tipo: 'ingreso',
                            concepto: `Renovación Membresía ${plan} - ${this.socio.nombre}`,
                            monto: price
                        });

                        // Register renewal history
                        await this.services.renovacion.registrar(this.socio.id, oldPlan, plan, price);

                        this.services.toast.success('Membresía renovada con éxito');
                        cleanup();
                        await this.loadSocio(this.socio.id);
                    } else {
                        this.services.toast.danger('Ocurrió un error al renovar');
                    }
                });
            }
        });
    }

    openDebtModal() {
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">GESTIÓN DE DEUDA</h3>
                <button class="btn-close" id="btnCloseDebt"><span class="material-icons-round">close</span></button>
            </div>
            <div style="padding: 10px 0;">
                <p style="margin-bottom: 20px; font-size: 14px; color: var(--color-text-secondary);">Ajusta la deuda actual de <b>${this.socio.nombre}</b>. Deuda actual: <b style="color:var(--color-danger); font-size:16px;">$${this.socio.deuda.toFixed(2)}</b></p>
                <div class="form-group" style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800;">NUEVO MONTO DE DEUDA</label>
                    <input type="number" id="inpNewDebt" step="0.01" value="${this.socio.deuda}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px; border-radius: var(--border-radius-md); font-size: 14px; outline: none; width:100%; box-sizing:border-box;">
                </div>
            </div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn btn-outline" id="btnCancelDebt">CANCELAR</button>
                <button class="btn btn-primary" id="btnSaveDebt"><span class="material-icons-round" style="font-size:18px; margin-right:4px;">save</span> GUARDAR</button>
            </div>
        `;
        this.services.modal.open(modalHtml);

        const mClose = document.getElementById('btnCloseDebt');
        const mCancel = document.getElementById('btnCancelDebt');
        const mSave = document.getElementById('btnSaveDebt');
        const mInput = document.getElementById('inpNewDebt');

        const cleanup = () => this.services.modal.close();

        if (mClose) mClose.addEventListener('click', cleanup);
        if (mCancel) mCancel.addEventListener('click', cleanup);
        
        if (mSave) {
            mSave.addEventListener('click', async () => {
                const val = parseFloat(mInput.value || 0);
                const updated = await this.services.socio.update(this.socio.id, { deuda: val });
                if (updated) {
                    this.services.toast.success('Deuda actualizada con éxito');
                    cleanup();
                    await this.loadSocio(this.socio.id);
                } else {
                    this.services.toast.danger('Error al actualizar la deuda');
                }
            });
        }
    }

    openQrModal() {
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">CÓDIGO QR - ${this.socio.nombre.toUpperCase()}</h3>
                <button class="btn-close" id="btnCloseQr"><span class="material-icons-round">close</span></button>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <div id="qrcode-large" style="background: white; padding: 15px; border-radius: 8px;"></div>
                <p style="margin-top: 20px; font-size: 14px; color: var(--color-text-secondary); text-align: center;">Este código QR contiene el ID del socio para realizar check-in automático con la cámara.</p>
            </div>
        `;
        this.services.modal.open(modalHtml);

        const mClose = document.getElementById('btnCloseQr');
        if (mClose) mClose.addEventListener('click', () => this.services.modal.close());

        setTimeout(() => {
            if (window.QRCode) {
                new window.QRCode(document.getElementById('qrcode-large'), {
                    text: this.socio.id,
                    width: 200,
                    height: 200,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: window.QRCode.CorrectLevel.H
                });
            }
        }, 100);
    }
}
