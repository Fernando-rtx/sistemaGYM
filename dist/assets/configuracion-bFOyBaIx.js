import{h as e,y as t}from"./index-DcmvT0CB.js";var n=()=>`
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
    `,r=async()=>{let n=document.getElementById(`inpGymName`),i=document.getElementById(`inpBrandColor`),a=document.getElementById(`hexDisplay`),o=document.getElementById(`btnGuardarConfig`),s=document.getElementById(`precioMensual`),c=document.getElementById(`precioQuincenal`),l=document.getElementById(`precioDiario`),u=await e();n.value=u.brandName||`NEXFIT`,i.value=u.brandColor||`#94ff00`,a.textContent=(u.brandColor||`#94ff00`).toUpperCase();let d=u.precios||{Mensual:20,Quincenal:10,Diario:3};s.value=d.Mensual,c.value=d.Quincenal,l.value=d.Diario,i.addEventListener(`input`,e=>{a.textContent=e.target.value.toUpperCase()}),o.addEventListener(`click`,async()=>{await t({brandName:n.value||`NEXFIT`,brandColor:i.value}),document.documentElement.style.setProperty(`--color-primary`,i.value),document.querySelectorAll(`.brand-name`).forEach(e=>e.textContent=n.value);let e=o.innerHTML;o.innerHTML=`<span class="material-icons-round">check</span> GUARDADO`,o.style.backgroundColor=`var(--color-success)`,setTimeout(()=>{o.innerHTML=e,o.style.backgroundColor=``},2e3)}),document.getElementById(`btnGuardarPrecios`).addEventListener(`click`,async()=>{await t({precios:{Mensual:parseFloat(s.value)||20,Quincenal:parseFloat(c.value)||10,Diario:parseFloat(l.value)||3}}),window.showToast(`Precios actualizados`,`success`)}),document.getElementById(`btnReset`).addEventListener(`click`,()=>{window.openModal(`
            <div class="modal-header">
                <h3 class="modal-title">RESTAURAR VALORES</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <span class="material-icons-round" style="font-size: 48px; color: var(--color-warning);">warning</span>
                <p style="margin-top: 15px;">Esto restaurará el nombre, color y precios a sus valores originales.</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmReset" style="flex: 1; justify-content: center;">RESTAURAR</button>
            </div>
        `),document.getElementById(`btnConfirmReset`).addEventListener(`click`,async()=>{await t({brandName:`NEXFIT`,brandColor:`#94ff00`,precios:{Mensual:20,Quincenal:10,Diario:3}}),document.documentElement.style.setProperty(`--color-primary`,`#94ff00`),document.querySelectorAll(`.brand-name`).forEach(e=>e.textContent=`NEXFIT`),window.closeModal(),window.showToast(`Valores restaurados`,`success`),await r()})})};export{r as init,n as render};