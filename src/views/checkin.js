import { getSocios, addCheckin, getSettings, formatFecha } from '../js/dataStore.js';

export const render = () => {
    return `
        <div class="checkin-container">
            <div class="card scanner-card">
                <h3>ESCANEAR CÓDIGO QR</h3>
                <div class="qr-placeholder" id="qr-reader" style="width: 100%; border: none; min-height: 250px;">
                    <span class="material-icons-round" style="font-size: 120px; color: var(--color-primary);">qr_code_scanner</span>
                    <p style="margin-top: 20px; color: var(--color-text-secondary);">Acerca el código del socio a la cámara</p>
                </div>
                <button class="btn btn-primary btn-large" id="btnActivarCamara">
                    <span class="material-icons-round">camera_alt</span> ACTIVAR CÁMARA
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
                        <div class="ticket-row"><span>Vencimiento:</span> <strong id="tktVenc">---</strong></div>
                        <div class="ticket-row"><span>Fecha:</span> <strong id="tktFecha">---</strong></div>
                        <div class="ticket-divider"></div>
                        <div class="ticket-status" id="tktStatus">ESPERANDO...</div>
                    </div>
                </div>
                <div class="ticket-actions">
                    <button class="btn btn-outline" style="width: 100%;" id="btnImprimir"><span class="material-icons-round">print</span> IMPRIMIR</button>
                    <button class="btn btn-primary" style="width: 100%;" id="btnWhatsapp"><span class="material-icons-round">send</span> WHATSAPP</button>
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
            .ticket-status.denied { color: #ef4444; }
            
            .ticket-actions {
                display: flex;
                gap: 16px;
            }
            
            /* Carrusel Responsivo para Celulares */
            @media (max-width: 768px) {
                .checkin-container {
                    display: flex !important;
                    flex-direction: row !important;
                    overflow-x: auto !important;
                    scroll-snap-type: x mandatory !important;
                    gap: 20px !important;
                    padding-bottom: 20px !important;
                    scroll-behavior: smooth !important;
                }
                .checkin-container::-webkit-scrollbar {
                    display: none; /* Ocultar barra de scroll para estética nativa */
                }
                .scanner-card, .ticket-card {
                    min-width: 100% !important;
                    scroll-snap-align: center !important;
                }
            }
        </style>
    `;
};

let html5QrcodeScanner = null;
let isProcessingScan = false;

export const init = async () => {
    // Limpiar instancia anterior si el usuario navegó a otra vista y volvió
    if (html5QrcodeScanner) {
        try { await html5QrcodeScanner.clear(); } catch(e) {}
        html5QrcodeScanner = null;
    }
    isProcessingScan = false;

    // Sync gym name to ticket
    const settings = await getSettings();
    const brandTicket = document.querySelector('.brand-name-ticket');
    if (brandTicket) brandTicket.textContent = (settings.brandName || 'NEXFIT') + ' GYM';

    const btnCamara = document.getElementById('btnActivarCamara');
    const ticketContainer = document.getElementById('ticketContainer');
    let lastCheckedSocio = null;

    const procesarEscaneo = async (qrCodeMessage) => {
        if (isProcessingScan) return;
        isProcessingScan = true;

        const socios = await getSocios();
        const socio = socios.find(s => s.id === qrCodeMessage);
        
        if (!socio) {
            window.showToast('Código no reconocido', 'danger');
            setTimeout(() => { isProcessingScan = false; }, 2000);
            return;
        }

        lastCheckedSocio = socio;
        ticketContainer.style.opacity = '1';
        ticketContainer.style.pointerEvents = 'auto';
        
        document.getElementById('tktSocio').textContent = socio.nombre;
        document.getElementById('tktPlan').textContent = `Plan ${socio.membresia}`;
        document.getElementById('tktVenc').textContent = formatFecha(socio.fechaVencimiento);
        
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('tktFecha').textContent = new Date().toLocaleDateString('es-ES', dateOptions);
        
        const hoy = new Date();
        const fVenc = new Date((socio.fechaVencimiento || hoy.toISOString().split('T')[0]) + "T00:00:00");
        const diasRestantes = Math.ceil((fVenc - hoy) / (1000 * 60 * 60 * 24));

        const statusEl = document.getElementById('tktStatus');
        if (socio.estado === 'Activo') {
            await addCheckin(socio.id, socio.nombre);
            
            if (diasRestantes <= 5 && diasRestantes >= 0) {
                const diasText = diasRestantes === 0 ? 'HOY' : `EN ${diasRestantes} DÍAS`;
                statusEl.innerHTML = `✅ ACCESO PERMITIDO<br><span style="font-size: 14px; color: #f59e0b;">⚠️ VENCE ${diasText}</span>`;
                statusEl.className = 'ticket-status success';
                window.showToast(`Acceso concedido. Recuerda a ${socio.nombre} que su plan vence ${diasText.toLowerCase()}`, 'warning');
            } else {
                statusEl.textContent = '✅ ¡ACCESO PERMITIDO!';
                statusEl.className = 'ticket-status success';
                window.showToast(`Acceso concedido a ${socio.nombre}`, 'success');
            }
        } else {
            statusEl.textContent = '❌ ACCESO DENEGADO';
            statusEl.className = 'ticket-status denied';
            window.showToast(`Membresía de ${socio.nombre} vencida. No se registró la asistencia.`, 'danger');
        }
        
        // Auto-scroll en celulares hacia el ticket
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                ticketContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }, 100);
        }
        
        // Pausar escáner (sólo lógicamente, sin tocar hardware para evitar NotReadableError en Android)
        setTimeout(() => {
            isProcessingScan = false;
        }, 4000);
    };

    if (btnCamara) {
        btnCamara.addEventListener('click', () => {
            if (html5QrcodeScanner) return; // ya activo
            
            document.getElementById('qr-reader').innerHTML = ''; // Clear placeholder
            btnCamara.style.display = 'none';

            html5QrcodeScanner = new window.Html5QrcodeScanner(
                "qr-reader", { fps: 10, qrbox: 250 }, false);
            
            html5QrcodeScanner.render(
                (decodedText) => procesarEscaneo(decodedText),
                (err) => { /* ignore */ }
            );
        });
    }

    // Print button
    document.getElementById('btnImprimir').addEventListener('click', () => {
        const ticketEl = document.querySelector('.ticket');
        if (!ticketEl) return;
        const printWin = window.open('', '_blank', 'width=400,height=600');
        printWin.document.write(`
            <html><head><title>Ticket</title>
            <style>
                body { font-family: 'Inter', Arial, sans-serif; padding: 20px; }
                .ticket-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
                .ticket-row span { color: #666; }
                .ticket-header { text-align: center; margin-bottom: 20px; }
                .ticket-header h2 { font-size: 22px; margin-bottom: 4px; }
                .ticket-header p { color: #666; font-size: 13px; }
                .ticket-divider { border-top: 2px dashed #ccc; margin: 15px 0; }
                .ticket-status { text-align: center; font-weight: 800; font-size: 18px; margin-top: 10px; }
            </style></head><body>
            ${ticketEl.innerHTML}
            <script>window.onload = function() { window.print(); window.close(); }<\/script>
            </body></html>
        `);
        printWin.document.close();
    });

    // WhatsApp button
    document.getElementById('btnWhatsapp').addEventListener('click', () => {
        if (!lastCheckedSocio) {
            window.showToast('Primero escanea un socio', 'info');
            return;
        }
        const socio = lastCheckedSocio;
        const msg = encodeURIComponent(
            `🏋️ *${settings.brandName || 'NEXFIT'} GYM*\n` +
            `Comprobante de Ingreso\n\n` +
            `Socio: ${socio.nombre}\n` +
            `Plan: ${socio.membresia}\n` +
            `Fecha: ${new Date().toLocaleDateString('es-ES')}\n` +
            `Estado: ${socio.estado === 'Activo' ? '✅ Acceso Permitido' : '❌ Membresía Vencida'}`
        );
        const tel = socio.telefono ? socio.telefono.replace(/[^0-9]/g, '') : '';
        const url = tel ? `https://wa.me/${tel}?text=${msg}` : `https://wa.me/?text=${msg}`;
        window.open(url, '_blank');
    });
};
