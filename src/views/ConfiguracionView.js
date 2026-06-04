import { BaseView } from '../js/core/BaseView.js';

export class ConfiguracionView extends BaseView {
    render() {
        return `
            <div class="config-container">
                <div class="card" style="max-width: 600px;">
                    <h3 style="margin-bottom: 30px; color: var(--color-text-secondary);">IDENTIDAD DEL GIMNASIO</h3>
                    
                    <div class="form-group">
                        <label>Nombre del Gimnasio</label>
                        <input type="text" id="inpGymName" class="form-input" placeholder="Ej. NEXFIT" value="NEXFIT">
                    </div>

                    <div class="form-group">
                        <label>Color Principal (Acento)</label>
                        <div class="color-picker-container">
                            <input type="color" id="inpBrandColor" class="color-input" value="#94ff00">
                            <span class="color-hex" id="hexDisplay">#94FF00</span>
                        </div>
                    </div>

                    <button class="btn btn-primary" id="btnGuardarConfig" style="margin-top: 20px;">
                        <span class="material-icons-round">save</span> GUARDAR CAMBIOS
                    </button>
                </div>

                <div class="card" style="max-width: 600px; margin-top: 24px;">
                    <h3 style="margin-bottom: 30px; color: var(--color-text-secondary);">PRECIOS DE PLANES</h3>
                    <div class="form-group">
                        <label>Plan Mensual ($)</label>
                        <input type="number" id="precioMensual" class="form-input" min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Plan Quincenal ($)</label>
                        <input type="number" id="precioQuincenal" class="form-input" min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Plan Diario ($)</label>
                        <input type="number" id="precioDiario" class="form-input" min="0" step="0.01">
                    </div>
                    <button class="btn btn-primary" id="btnGuardarPrecios" style="margin-top: 10px;">
                        <span class="material-icons-round">save</span> GUARDAR PRECIOS
                    </button>
                </div>

                <div class="card" style="max-width: 600px; margin-top: 24px;">
                    <h3 style="margin-bottom: 20px; color: var(--color-text-secondary);">INFORMACIÓN DEL SISTEMA</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px;">
                        <span style="color: var(--color-text-secondary);">Versión:</span>
                        <span>2.0.0-prod</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px;">
                        <span style="color: var(--color-text-secondary);">Estado de Red:</span>
                        <span class="text-success" style="display: flex; align-items: center; gap: 5px;">
                            <span style="width: 8px; height: 8px; background: var(--color-success); border-radius: 50%; display: inline-block;"></span>
                            Conectada
                        </span>
                    </div>
                    <button class="btn btn-outline" id="btnReset" style="margin-top: 10px; width: 100%; justify-content: center;">
                        <span class="material-icons-round">restart_alt</span> RESTAURAR VALORES POR DEFECTO
                    </button>
                </div>
            </div>

            <style>
                .form-group {
                    margin-bottom: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-size: 13px;
                    color: var(--color-text-secondary);
                    font-weight: 500;
                }
                .form-input {
                    background-color: var(--color-bg-base);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: var(--color-text-primary);
                    padding: 12px 16px;
                    border-radius: var(--border-radius-md);
                    font-size: 15px;
                    outline: none;
                    transition: border-color var(--transition-fast);
                }
                .form-input:focus {
                    border-color: var(--color-primary);
                }
                
                .color-picker-container {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background-color: var(--color-bg-base);
                    padding: 10px;
                    border-radius: var(--border-radius-md);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .color-input {
                    -webkit-appearance: none;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    cursor: pointer;
                    background: none;
                }
                .color-input::-webkit-color-swatch-wrapper { padding: 0; }
                .color-input::-webkit-color-swatch { border: none; border-radius: 8px; }
                
                .color-hex {
                    font-family: monospace;
                    font-size: 15px;
                    text-transform: uppercase;
                }
            </style>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();

        const inpName = this.$('#inpGymName');
        const inpColor = this.$('#inpBrandColor');
        const hexDisplay = this.$('#hexDisplay');
        const btnGuardarConfig = this.$('#btnGuardarConfig');

        const precioMensual = this.$('#precioMensual');
        const precioQuincenal = this.$('#precioQuincenal');
        const precioDiario = this.$('#precioDiario');
        const btnGuardarPrecios = this.$('#btnGuardarPrecios');

        const btnReset = this.$('#btnReset');

        // Cargar ajustes actuales
        const settings = await this.services.settings.get();
        if (inpName) inpName.value = settings.brandName || 'NEXFIT';
        if (inpColor) inpColor.value = settings.brandColor || '#94ff00';
        if (hexDisplay) hexDisplay.textContent = (settings.brandColor || '#94ff00').toUpperCase();

        const precios = settings.precios || { Mensual: 20, Quincenal: 10, Diario: 3 };
        if (precioMensual) precioMensual.value = precios.Mensual;
        if (precioQuincenal) precioQuincenal.value = precios.Quincenal;
        if (precioDiario) precioDiario.value = precios.Diario;

        // Preview de color en vivo
        if (inpColor) {
            this.bindEvent(inpColor, 'input', (e) => {
                if (hexDisplay) hexDisplay.textContent = e.target.value.toUpperCase();
            });
        }

        // Guardar ajustes de identidad
        if (btnGuardarConfig) {
            this.bindEvent(btnGuardarConfig, 'click', async () => {
                const name = inpName.value.trim() || 'NEXFIT';
                const color = inpColor.value || '#94ff00';

                const updated = await this.services.settings.save({
                    brandName: name,
                    brandColor: color,
                    precios: {
                        Mensual: parseFloat(precioMensual.value || 20),
                        Quincenal: parseFloat(precioQuincenal.value || 10),
                        Diario: parseFloat(precioDiario.value || 3)
                    }
                });

                if (updated) {
                    this.services.toast.success('Configuración guardada exitosamente');
                    // Emitir evento para actualizar marca de inmediato
                    this.eventBus.emit('settings:updated', updated);
                } else {
                    this.services.toast.danger('No se pudo guardar la configuración');
                }
            });
        }

        // Guardar precios
        if (btnGuardarPrecios) {
            this.bindEvent(btnGuardarPrecios, 'click', async () => {
                const updated = await this.services.settings.save({
                    brandName: inpName.value.trim() || 'NEXFIT',
                    brandColor: inpColor.value || '#94ff00',
                    precios: {
                        Mensual: parseFloat(precioMensual.value || 20),
                        Quincenal: parseFloat(precioQuincenal.value || 10),
                        Diario: parseFloat(precioDiario.value || 3)
                    }
                });

                if (updated) {
                    this.services.toast.success('Precios actualizados');
                    this.eventBus.emit('settings:updated', updated);
                } else {
                    this.services.toast.danger('Error al guardar precios');
                }
            });
        }

        // Reset
        if (btnReset) {
            this.bindEvent(btnReset, 'click', async () => {
                const confirmHtml = `
                    <div class="modal-header">
                        <h3 class="modal-title" style="color: var(--color-danger);">RESTABLECER AJUSTES</h3>
                        <button class="btn-close" id="btnCloseConfirmReset"><span class="material-icons-round">close</span></button>
                    </div>
                    <div style="padding: 10px; text-align: center;">
                        <p style="margin-bottom: 24px; color: var(--color-text-secondary); line-height: 1.5;">
                            ¿Estás seguro de que deseas restaurar los ajustes por defecto?<br>
                            Esto devolverá el nombre del gimnasio a "NEXFIT", el color a verde neón y los precios a sus valores predeterminados.
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button class="btn btn-outline" id="btnCancelReset" style="flex: 1; padding: 12px;">CANCELAR</button>
                            <button class="btn btn-primary" id="btnConfirmReset" style="flex: 1; padding: 12px; background: var(--color-danger); border-color: var(--color-danger); color: white;">RESTABLECER</button>
                        </div>
                    </div>
                `;
                this.services.modal.open(confirmHtml);

                document.getElementById('btnCloseConfirmReset').addEventListener('click', () => this.services.modal.close());
                document.getElementById('btnCancelReset').addEventListener('click', () => this.services.modal.close());
                document.getElementById('btnConfirmReset').addEventListener('click', async () => {
                    this.services.modal.close();
                    
                    const defaultSettings = {
                        brandName: 'NEXFIT',
                        brandColor: '#94ff00',
                        precios: { Mensual: 20, Quincenal: 10, Diario: 3 }
                    };

                    const updated = await this.services.settings.save(defaultSettings);
                    if (updated) {
                        this.services.toast.success('Ajustes restablecidos');
                        if (inpName) inpName.value = 'NEXFIT';
                        if (inpColor) inpColor.value = '#94ff00';
                        if (hexDisplay) hexDisplay.textContent = '#94FF00';
                        if (precioMensual) precioMensual.value = 20;
                        if (precioQuincenal) precioQuincenal.value = 10;
                        if (precioDiario) precioDiario.value = 3;

                        this.eventBus.emit('settings:updated', updated);
                    } else {
                        this.services.toast.danger('No se pudo restablecer la configuración');
                    }
                });
            });
        }
    }
}
