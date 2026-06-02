var e=()=>`
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
                <h3 style="margin-bottom: 20px; color: var(--color-text-secondary);">INFORMACIÓN DEL SISTEMA</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px;">
                    <span style="color: var(--color-text-secondary);">Versión:</span>
                    <span>1.0.2-prod</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="color: var(--color-text-secondary);">Estado de Red:</span>
                    <span class="text-success" style="display: flex; align-items: center; gap: 5px;">
                        <span style="width: 8px; height: 8px; background: var(--color-success); border-radius: 50%; display: inline-block;"></span>
                        Conectada y Sincronizada
                    </span>
                </div>
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
    `,t=()=>{let e=document.getElementById(`inpGymName`),t=document.getElementById(`inpBrandColor`),n=document.getElementById(`hexDisplay`),r=document.getElementById(`btnGuardarConfig`),i=localStorage.getItem(`gym_settings`);if(i)try{let r=JSON.parse(JSON.parse(i));r.brandName&&(e.value=r.brandName),r.brandColor&&(t.value=r.brandColor,n.textContent=r.brandColor.toUpperCase())}catch{}t.addEventListener(`input`,e=>{n.textContent=e.target.value.toUpperCase()}),r.addEventListener(`click`,()=>{let n={brandName:e.value||`NEXFIT`,brandColor:t.value};localStorage.setItem(`gym_settings`,JSON.stringify(JSON.stringify(n))),document.documentElement.style.setProperty(`--color-primary`,n.brandColor),document.querySelectorAll(`.brand-name`).forEach(e=>e.textContent=n.brandName);let i=r.innerHTML;r.innerHTML=`<span class="material-icons-round">check</span> GUARDADO EXITOSAMENTE`,r.style.backgroundColor=`var(--color-success)`,setTimeout(()=>{r.innerHTML=i,r.style.backgroundColor=``},2e3)})};export{t as init,e as render};