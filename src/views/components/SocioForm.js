import { Socio } from '../../js/models/Socio.js';
import { getPlanes } from '../../js/utils/planSelector.js';
import { PLAN_DIAS } from '../../js/utils/constants.js';

export class SocioForm {
    constructor(services, eventBus) {
        this.services = services;
        this.eventBus = eventBus;
    }

    async open(socioId = null, onSaveSuccess = null) {
        const settings = await this.services.settings.get();
        const precios = settings.precios || { Mensual: 20.00, Quincenal: 10.00, Diario: 3.00 };
        const isEdit = !!socioId;
        
        let socio = null;
        let currentPrefix = '+503';
        let currentNum = '';

        if (isEdit) {
            socio = await this.services.socio.getById(socioId);
            if (!socio) {
                this.services.toast.danger('Socio no encontrado');
                return;
            }
            const parts = (socio.telefono || '').split(' ');
            if (parts.length > 1 && parts[0].startsWith('+')) {
                currentPrefix = parts[0];
                currentNum = parts.slice(1).join('').replace(/[^0-9]/g, '');
            } else {
                currentNum = (socio.telefono || '').replace(/[^0-9]/g, '');
            }
        }

        const todayStr = new Date().toISOString().split('T')[0];

        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title" style="font-size: 18px; font-weight: 900; letter-spacing: 0.5px;">
                    ${isEdit ? 'EDITAR SOCIO' : 'NUEVO SOCIO'}
                </h3>
                <button class="btn-close" id="btnCloseSocioForm"><span class="material-icons-round">close</span></button>
            </div>
            
            <div class="form-group" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">NOMBRE COMPLETO</label>
                <input type="text" id="inpSocioNombre" value="${isEdit ? socio.nombre : ''}" placeholder="Ej. María Fernanda Castillo" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; width: 100%; box-sizing: border-box; outline: none; transition: border-color 0.2s;">
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">EDAD</label>
                    <input type="number" id="inpSocioEdad" value="${isEdit && socio.edad ? socio.edad : ''}" placeholder="25" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; outline: none; width: 100%; box-sizing: border-box; transition: border-color 0.2s;">
                </div>
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">TELÉFONO</label>
                    <div style="display: flex; gap: 8px;">
                        <select id="inpSocioTelPrefix" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 8px; border-radius: var(--border-radius-md); font-size: 14px; outline: none; transition: border-color 0.2s; cursor: pointer;">
                            <option value="+503" ${currentPrefix === '+503' ? 'selected' : ''}>🇸🇻 +503</option>
                            <option value="+52" ${currentPrefix === '+52' ? 'selected' : ''}>🇲🇽 +52</option>
                            <option value="+1" ${currentPrefix === '+1' ? 'selected' : ''}>🇺🇸 +1</option>
                            <option value="+504" ${currentPrefix === '+504' ? 'selected' : ''}>🇭🇳 +504</option>
                            <option value="+502" ${currentPrefix === '+502' ? 'selected' : ''}>🇬🇹 +502</option>
                            <option value="+505" ${currentPrefix === '+505' ? 'selected' : ''}>🇳🇮 +505</option>
                            <option value="+506" ${currentPrefix === '+506' ? 'selected' : ''}>🇨🇷 +506</option>
                            <option value="+507" ${currentPrefix === '+507' ? 'selected' : ''}>🇵🇦 +507</option>
                        </select>
                        <input type="text" id="inpSocioTel" value="${currentNum}" placeholder="12345678" maxlength="8" style="flex: 1; background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; outline: none; width: 100%; box-sizing: border-box; transition: border-color 0.2s;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                </div>
            </div>
            
            <div class="form-group" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">NOTAS INTERNAS</label>
                <textarea id="inpSocioNotas" placeholder="Notas opcionales sobre el socio..." style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; width: 100%; min-height: 60px; box-sizing: border-box; outline: none; font-family: inherit; resize: vertical;">${isEdit && socio.notas ? socio.notas : ''}</textarea>
            </div>

            ${!isEdit ? `
            <div class="form-group" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">PLAN CONTRATADO</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px;">
                    <div class="plan-card-ns selected" data-plan="Mensual" data-precio="${precios.Mensual}" data-dias="${PLAN_DIAS.Mensual}" style="border: 2px solid var(--color-primary); padding: 16px; border-radius: var(--border-radius-md); cursor: pointer; background-color: color-mix(in srgb, var(--color-primary) 5%, transparent); transition: all 0.2s; position: relative;">
                        <span class="material-icons-round check-icon-ns" style="position: absolute; top: 12px; right: 12px; color: var(--color-primary); font-size: 20px;">check_circle</span>
                        <div class="plan-name-ns" style="font-size: 12px; margin-bottom: 4px; color: var(--color-text-primary); font-weight: 900;">PLAN MENSUAL</div>
                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 12px; font-weight: 500;">${PLAN_DIAS.Mensual} días de acceso</div>
                        <div class="plan-price-ns" style="font-size: 24px; font-weight: 900; color: var(--color-primary);">$${precios.Mensual.toFixed(2)} <span style="font-size: 10px; font-weight: 700; color: var(--color-text-secondary);">USD</span></div>
                    </div>
                    <div class="plan-card-ns" data-plan="Quincenal" data-precio="${precios.Quincenal}" data-dias="${PLAN_DIAS.Quincenal}" style="border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: var(--border-radius-md); cursor: pointer; transition: all 0.2s; position: relative; opacity: 0.6;">
                        <span class="material-icons-round check-icon-ns" style="position: absolute; top: 12px; right: 12px; color: transparent; font-size: 20px;">check_circle</span>
                        <div class="plan-name-ns" style="font-size: 12px; margin-bottom: 4px; color: var(--color-text-secondary); font-weight: 900;">PLAN QUINCENAL</div>
                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 12px; font-weight: 500;">${PLAN_DIAS.Quincenal} días de acceso</div>
                        <div class="plan-price-ns" style="font-size: 24px; font-weight: 900; color: var(--color-text-primary);">$${precios.Quincenal.toFixed(2)} <span style="font-size: 10px; font-weight: 700; color: var(--color-text-secondary);">USD</span></div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">FECHA DE INICIO</label>
                    <input type="date" id="inpFechaInicio" value="${todayStr}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; font-weight: 600; outline: none; width: 100%; box-sizing: border-box; cursor: pointer;">
                </div>
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 11px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px;">VENCIMIENTO (AUTO)</label>
                    <input type="text" id="inpFechaVencimiento" readonly style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: var(--color-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 14px; font-weight: 800; outline: none; width: 100%; box-sizing: border-box; text-transform: uppercase;">
                </div>
            </div>
            ` : ''}

            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-outline" id="btnCancelSocioForm" style="padding: 12px 24px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">CANCELAR</button>
                <button class="btn btn-primary" id="btnGuardarSocio" style="padding: 12px 24px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                    <span class="material-icons-round" style="font-size: 18px;">check</span> 
                    ${isEdit ? 'GUARDAR CAMBIOS' : 'REGISTRAR'}
                </button>
            </div>
        `;

        this.services.modal.open(modalHtml);

        const btnClose = document.getElementById('btnCloseSocioForm');
        const btnCancel = document.getElementById('btnCancelSocioForm');
        const btnSave = document.getElementById('btnGuardarSocio');

        const cleanup = () => this.services.modal.close();

        if (btnClose) btnClose.addEventListener('click', cleanup);
        if (btnCancel) btnCancel.addEventListener('click', cleanup);

        if (!isEdit) {
            const fechaInicioInp = document.getElementById('inpFechaInicio');
            const fechaVencInp = document.getElementById('inpFechaVencimiento');
            const planCards = document.querySelectorAll('.plan-card-ns');

            const updateVencimiento = () => {
                const dateVal = fechaInicioInp.value;
                const selectedCard = document.querySelector('.plan-card-ns.selected');
                const dias = selectedCard ? parseInt(selectedCard.getAttribute('data-dias')) : PLAN_DIAS.Mensual;
                
                if (!dateVal) return;
                const d = new Date(dateVal + "T00:00:00");
                d.setDate(d.getDate() + dias);
                
                const str = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                fechaVencInp.value = str;
            };

            fechaInicioInp.addEventListener('change', updateVencimiento);

            planCards.forEach(card => {
                card.addEventListener('click', function() {
                    planCards.forEach(c => {
                        c.classList.remove('selected');
                        c.style.border = '1px solid rgba(255,255,255,0.1)';
                        c.style.backgroundColor = 'transparent';
                        c.style.opacity = '0.6';
                        c.querySelector('.plan-name-ns').style.color = 'var(--color-text-secondary)';
                        c.querySelector('.plan-price-ns').style.color = 'var(--color-text-primary)';
                        c.querySelector('.check-icon-ns').style.color = 'transparent';
                    });
                    this.classList.add('selected');
                    this.style.border = '2px solid var(--color-primary)';
                    this.style.backgroundColor = 'color-mix(in srgb, var(--color-primary) 5%, transparent)';
                    this.style.opacity = '1';
                    this.querySelector('.plan-name-ns').style.color = 'var(--color-text-primary)';
                    this.querySelector('.plan-price-ns').style.color = 'var(--color-primary)';
                    this.querySelector('.check-icon-ns').style.color = 'var(--color-primary)';
                    updateVencimiento();
                });
            });

            updateVencimiento();
        }

        if (btnSave) {
            btnSave.addEventListener('click', async () => {
                const nombre = document.getElementById('inpSocioNombre').value.trim();
                if (!nombre) {
                    this.services.toast.danger('El nombre es obligatorio');
                    return;
                }

                btnSave.disabled = true;
                const originalText = btnSave.innerHTML;
                btnSave.innerHTML = '<span class="material-icons-round" style="font-size: 18px; animation: spin 1s linear infinite;">autorenew</span> GUARDANDO...';

                try {
                    const prefijo = document.getElementById('inpSocioTelPrefix').value;
                    const numeroTel = document.getElementById('inpSocioTel').value.trim();
                    const telefono = numeroTel ? `${prefijo} ${numeroTel}` : '';
                    const edad = document.getElementById('inpSocioEdad').value ? parseInt(document.getElementById('inpSocioEdad').value) : null;

                    const notas = document.getElementById('inpSocioNotas')?.value || '';

                    if (isEdit) {
                        const ok = await this.services.socio.update(socioId, { nombre, telefono, edad, notas });
                        if (ok) {
                            this.services.toast.success('Socio actualizado correctamente');
                            cleanup();
                            if (onSaveSuccess) onSaveSuccess(socioId);
                        } else {
                            this.services.toast.danger('Error al actualizar el socio');
                        }
                    } else {
                        const selectedCard = document.querySelector('.plan-card-ns.selected');
                        const plan = selectedCard ? selectedCard.getAttribute('data-plan') : 'Mensual';
                        const precio = selectedCard ? parseFloat(selectedCard.getAttribute('data-precio')) : precios.Mensual;
                    const dias = selectedCard ? parseInt(selectedCard.getAttribute('data-dias')) : PLAN_DIAS.Mensual;
                    
                    const fechaInicio = document.getElementById('inpFechaInicio').value;
                        const dVenc = new Date(fechaInicio + "T00:00:00");
                        dVenc.setDate(dVenc.getDate() + dias);
                        const fechaVencimiento = dVenc.toISOString().split('T')[0];

                        const nuevoSocio = await this.services.socio.create({
                            nombre,
                            telefono,
                            edad,
                            notas,
                            membresia: plan,
                            precio,
                            fechaRegistro: fechaInicio,
                            fechaVencimiento: fechaVencimiento,
                            estado: 'Activo'
                        });

                        if (nuevoSocio) {
                            await this.services.transaccion.crear({
                                tipo: 'ingreso',
                                concepto: `Membresía ${plan} - ${nombre}`,
                                monto: precio
                            });

                            await this.services.renovacion.registrar(nuevoSocio.id, 'Ninguno', plan, precio);

                            this.services.toast.success('Socio registrado con éxito');
                            cleanup();

                            if (onSaveSuccess) onSaveSuccess(nuevoSocio, true);
                        } else {
                            this.services.toast.danger('Error al registrar el socio');
                        }
                    }
                } finally {
                    if (document.getElementById('btnGuardarSocio')) {
                        btnSave.disabled = false;
                        btnSave.innerHTML = originalText;
                    }
                }
            });
        }
    }
}
