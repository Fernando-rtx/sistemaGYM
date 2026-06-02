var e=()=>`
        <div class="checkin-container">
            <div class="card scanner-card">
                <h3>ESCANEAR CÓDIGO QR</h3>
                <div class="qr-placeholder">
                    <span class="material-icons-round" style="font-size: 120px; color: var(--color-primary);">qr_code_scanner</span>
                    <p style="margin-top: 20px; color: var(--color-text-secondary);">Acerca el código del socio a la cámara</p>
                </div>
                <button class="btn btn-primary btn-large" id="btnSimularCheckin">
                    SIMULAR ESCANEO
                </button>
            </div>

            <div class="card ticket-card" id="ticketContainer" style="opacity: 0.3; pointer-events: none;">
                <div class="ticket">
                    <div class="ticket-header">
                        <h2 class="brand-name-ticket">NEXFIT GYM</h2>
                        <p>Comprobante de Ingreso</p>
                    </div>
                    <div class="ticket-body">
                        <div class="ticket-row"><span>Socio:</span> <strong id="tktSocio">---</strong></div>
                        <div class="ticket-row"><span>Plan:</span> <strong id="tktPlan">---</strong></div>
                        <div class="ticket-row"><span>Fecha:</span> <strong id="tktFecha">---</strong></div>
                        <div class="ticket-divider"></div>
                        <div class="ticket-status success" id="tktStatus">ESPERANDO...</div>
                    </div>
                </div>
                <div class="ticket-actions">
                    <button class="btn btn-outline" style="width: 100%;"><span class="material-icons-round">print</span> IMPRIMIR</button>
                    <button class="btn btn-primary" style="width: 100%;"><span class="material-icons-round">send</span> WHATSAPP</button>
                </div>
            </div>
        </div>

        <style>
            .checkin-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                max-width: 1000px;
                margin: 0 auto;
            }
            .scanner-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 30px;
                padding: 40px;
            }
            .qr-placeholder {
                width: 250px;
                height: 250px;
                border: 2px dashed rgba(255,255,255,0.2);
                border-radius: var(--border-radius-lg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .btn-large {
                width: 100%;
                justify-content: center;
                padding: 16px;
                font-size: 16px;
            }
            
            /* Ticket Styles */
            .ticket-card {
                display: flex;
                flex-direction: column;
                gap: 20px;
                transition: opacity var(--transition-fast);
            }
            .ticket {
                background-color: #ffffff;
                color: #000000;
                border-radius: var(--border-radius-sm);
                padding: 30px;
                position: relative;
            }
            .ticket::before, .ticket::after {
                content: '';
                position: absolute;
                top: 50%;
                width: 20px; height: 20px;
                background-color: var(--color-bg-surface);
                border-radius: 50%;
            }
            .ticket::before { left: -10px; }
            .ticket::after { right: -10px; }
            
            .ticket-header { text-align: center; margin-bottom: 24px; }
            .ticket-header h2 { font-weight: 800; font-size: 24px; margin-bottom: 4px; }
            .ticket-header p { color: #666; font-size: 14px; }
            
            .ticket-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 15px;
            }
            .ticket-row span { color: #666; }
            .ticket-divider {
                border-top: 2px dashed #ccc;
                margin: 20px 0;
            }
            .ticket-status {
                text-align: center;
                font-weight: 800;
                font-size: 20px;
            }
            .ticket-status.success { color: #10b981; }
            
            .ticket-actions {
                display: flex;
                gap: 16px;
            }
        </style>
    `,t=()=>{let e=localStorage.getItem(`gym_settings`);if(e)try{let t=JSON.parse(JSON.parse(e));t.brandName&&(document.querySelector(`.brand-name-ticket`).textContent=t.brandName+` GYM`)}catch{}let t=document.getElementById(`btnSimularCheckin`),n=document.getElementById(`ticketContainer`);t&&t.addEventListener(`click`,()=>{t.innerHTML=`<span class="material-icons-round">hourglass_empty</span> ESCANEANDO...`,setTimeout(()=>{t.innerHTML=`SIMULAR ESCANEO`,n.style.opacity=`1`,n.style.pointerEvents=`auto`,document.getElementById(`tktSocio`).textContent=`Fernando Aguilar`,document.getElementById(`tktPlan`).textContent=`Plan Mensual`;let e={day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`};document.getElementById(`tktFecha`).textContent=new Date().toLocaleDateString(`es-ES`,e),document.getElementById(`tktStatus`).textContent=`¡ACCESO PERMITIDO!`},800)})};export{t as init,e as render};