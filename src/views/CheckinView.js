import { BaseView } from '../js/core/BaseView.js';
import { Socio } from '../js/models/Socio.js';
import { escapeHtml } from '../js/utils/escapeHtml.js';

export class CheckinView extends BaseView {
    constructor(container, services, eventBus) {
        super(container, services, eventBus);
        this.html5QrcodeScanner = null;
        this.isProcessingScan = false;
        this.lastCheckedSocio = null;
    }

    render() {
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
                        display: none;
                    }
                    .scanner-card, .ticket-card {
                        min-width: 100% !important;
                        scroll-snap-align: center !important;
                    }
                }
            </style>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();

        const settings = await this.services.settings.get();
        const brandTicket = this.$('.brand-name-ticket');
        if (brandTicket) {
            brandTicket.textContent = (settings.brandName || 'NEXFIT') + ' GYM';
        }

        const btnCamara = this.$('#btnActivarCamara');
        const btnImprimir = this.$('#btnImprimir');
        const btnWhatsapp = this.$('#btnWhatsapp');

        if (btnCamara) {
            this.bindEvent(btnCamara, 'click', () => {
                if (this.html5QrcodeScanner) return; // Ya activo
                
                const qrReader = this.$('#qr-reader');
                if (qrReader) qrReader.innerHTML = ''; // Limpiar placeholder
                btnCamara.style.display = 'none';

                if (window.Html5QrcodeScanner) {
                    this.html5QrcodeScanner = new window.Html5QrcodeScanner(
                        "qr-reader", { fps: 10, qrbox: 250 }, false);
                    
                    this.html5QrcodeScanner.render(
                        (decodedText) => this.procesarEscaneo(decodedText),
                        (err) => { /* ignore */ }
                    );
                } else {
                    this.services.toast.danger('Librería QR no cargada');
                }
            });
        }

        if (btnImprimir) {
            this.bindEvent(btnImprimir, 'click', () => {
                if (!this.lastCheckedSocio) {
                    this.services.toast.info('Primero escanea un socio');
                    return;
                }
                const socio = this.lastCheckedSocio;
                const fecha = new Date();
                const dateStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                const settings = this.services.settings ? { brandName: 'NEXFIT' } : {};
                const gymName = 'NEXFIT';
                const printWin = window.open('', '_blank', 'width=400,height=600');
                printWin.document.write(`
                    <html><head><title>Ticket - ${escapeHtml(gymName)}</title>
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
                        <div class="ticket">
                            <div class="ticket-header">
                                <h2>${escapeHtml(gymName)} GYM</h2>
                                <p>Comprobante de Ingreso</p>
                            </div>
                            <div class="ticket-body">
                                <div class="ticket-row"><span>Socio:</span> <strong>${escapeHtml(socio.nombre)}</strong></div>
                                <div class="ticket-row"><span>Plan:</span> <strong>${escapeHtml(socio.membresia)}</strong></div>
                                <div class="ticket-row"><span>Vencimiento:</span> <strong>${escapeHtml(Socio.formatFecha(socio.fechaVencimiento))}</strong></div>
                                <div class="ticket-row"><span>Fecha:</span> <strong>${escapeHtml(dateStr)}</strong></div>
                                <div class="ticket-divider"></div>
                                <div class="ticket-status ${socio.estado === 'Activo' && !socio.estaVencido ? 'success' : 'denied'}">${socio.estado === 'Activo' && !socio.estaVencido ? '✅ ACCESO PERMITIDO' : '❌ ACCESO DENEGADO'}</div>
                            </div>
                        </div>
                    <script>window.onload = function() { window.print(); window.close(); }<\/script>
                    </body></html>
                `);
                printWin.document.close();
            });
        }

        if (btnWhatsapp) {
            this.bindEvent(btnWhatsapp, 'click', async () => {
                if (!this.lastCheckedSocio) {
                    this.services.toast.info('Primero escanea un socio');
                    return;
                }
                const currentSettings = await this.services.settings.get();
                const gymName = currentSettings.brandName || 'NEXFIT';
                const socio = this.lastCheckedSocio;
                
                const msg = encodeURIComponent(
                    `🏋️ *${gymName.toUpperCase()} GYM*\n` +
                    `Comprobante de Ingreso\n\n` +
                    `Socio: ${socio.nombre}\n` +
                    `Plan: ${socio.membresia}\n` +
                    `Fecha: ${new Date().toLocaleDateString('es-ES')}\n` +
                    `Estado: ${socio.estado === 'Activo' && !socio.estaVencido ? '✅ Acceso Permitido' : '❌ Membresía Vencida'}`
                );
                
                const tel = socio.telefonoLimpio;
                const url = tel ? `https://wa.me/${tel}?text=${msg}` : `https://wa.me/?text=${msg}`;
                window.open(url, '_blank');
            });
        }
    }

    async procesarEscaneo(qrCodeMessage) {
        if (this.isProcessingScan) return;
        this.isProcessingScan = true;

        try {
            const socios = await this.services.socio.getAll();
            const socio = socios.find(s => s.id === qrCodeMessage);
            
            if (!socio) {
                this.services.toast.danger('Código no reconocido');
                return;
            }

            this.lastCheckedSocio = socio;
            const ticketContainer = this.$('#ticketContainer');
            if (ticketContainer) {
                ticketContainer.style.opacity = '1';
                ticketContainer.style.pointerEvents = 'auto';
            }
            
            const tktSocio = this.$('#tktSocio');
            const tktPlan = this.$('#tktPlan');
            const tktVenc = this.$('#tktVenc');
            const tktFecha = this.$('#tktFecha');

            if (tktSocio) tktSocio.textContent = socio.nombre;
            if (tktPlan) tktPlan.textContent = `Plan ${socio.membresia}`;
            if (tktVenc) tktVenc.textContent = Socio.formatFecha(socio.fechaVencimiento);
            
            if (tktFecha) {
                const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                tktFecha.textContent = new Date().toLocaleDateString('es-ES', dateOptions);
            }
            
            const diasRestantes = socio.diasRestantes;
            const statusEl = this.$('#tktStatus');

            if (statusEl) {
                if (socio.estado === 'Activo' && !socio.estaVencido) {
                    await this.services.checkin.registrar(socio.id, socio.nombre);
                    
                    if (diasRestantes <= 5 && diasRestantes >= 0) {
                        const diasText = diasRestantes === 0 ? 'HOY' : `EN ${diasRestantes} DÍAS`;
                        statusEl.innerHTML = `✅ ACCESO PERMITIDO<br><span style="font-size: 14px; color: #f59e0b;">⚠️ VENCE ${escapeHtml(diasText)}</span>`;
                        statusEl.className = 'ticket-status success';
                        this.services.toast.warning(`Acceso concedido. Recuerda a ${escapeHtml(socio.nombre)} que su plan vence ${diasText.toLowerCase()}`);
                    } else {
                        statusEl.textContent = '✅ ¡ACCESO PERMITIDO!';
                        statusEl.className = 'ticket-status success';
                        this.services.toast.success(`Acceso concedido a ${escapeHtml(socio.nombre)}`);
                    }
                } else {
                    statusEl.textContent = '❌ ACCESO DENEGADO';
                    statusEl.className = 'ticket-status denied';
                    this.services.toast.danger(`Membresía de ${escapeHtml(socio.nombre)} vencida. No se registró la asistencia.`);
                }
            }
            
            if (window.innerWidth <= 768 && ticketContainer) {
                this._scrollTimeout = setTimeout(() => {
                    ticketContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }, 100);
            }
        } catch (e) {
            console.error('Error processing scan:', e);
            this.services.toast.danger('Error al procesar el escaneo');
        } finally {
            setTimeout(() => {
                this.isProcessingScan = false;
            }, 4000);
        }
    }

    destroy() {
        if (this.html5QrcodeScanner) {
            try {
                if (typeof this.html5QrcodeScanner.clear === 'function') {
                    this.html5QrcodeScanner.clear();
                }
            } catch (e) {
                console.error('Error clearing QR scanner', e);
            }
            try {
                if (typeof this.html5QrcodeScanner.stop === 'function') {
                    this.html5QrcodeScanner.stop();
                }
            } catch (e) {
                console.error('Error stopping QR scanner', e);
            }
            this.html5QrcodeScanner = null;
        }
        if (this._scrollTimeout) {
            clearTimeout(this._scrollTimeout);
            this._scrollTimeout = null;
        }
        if (window.innerWidth <= 768) {
            const ticketContainer = this.$('#ticketContainer');
            if (ticketContainer) {
                ticketContainer.style.opacity = '';
                ticketContainer.style.pointerEvents = '';
            }
        }
        super.destroy();
    }
}
