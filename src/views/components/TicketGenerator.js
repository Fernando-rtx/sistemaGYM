import html2canvas from 'html2canvas';

export class TicketGenerator {
    constructor(services) {
        this.services = services;
    }

    async open(socioInfo) {
        const settings = await this.services.settings.get();
        const gymName = settings.brandName || 'NEXFIT';

        // Formatear fechas a DD/MM/YYYY
        const formatD = (dateStr) => {
            if (!dateStr) return '';
            const parts = dateStr.split('-');
            return `${parseInt(parts[2])}/${parseInt(parts[1])}/${parts[0]}`;
        };

        const modalHtml = `
            <div class="modal-header" style="justify-content: center; position: relative;">
                <h3 class="modal-title" style="letter-spacing: 1px;">TICKET GENERADO</h3>
                <button class="btn-close" id="btnCloseTicketModal" style="position: absolute; right: 0;"><span class="material-icons-round">close</span></button>
            </div>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; display: flex; justify-content: center; margin-bottom: 20px;">
                <div id="ticketCaptureArea" style="background: white; color: black; padding: 30px; width: 300px; font-family: monospace; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; font-family: 'Inter', sans-serif;">${gymName.toUpperCase()}</h2>
                        <div style="font-size: 12px; color: #555; margin-top: 4px;">Comprobante de Inscripción</div>
                    </div>
                    
                    <div style="border-top: 1px dashed #ccc; margin: 15px 0;"></div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span style="color: #666;">Fecha:</span>
                        <span style="font-weight: bold;">${formatD(socioInfo.fechaRegistro)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span style="color: #666;">Socio:</span>
                        <span style="font-weight: bold;">${socioInfo.nombre}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span style="color: #666;">Plan:</span>
                        <span style="font-weight: bold;">Plan ${socioInfo.plan}</span>
                    </div>
                    
                    <div style="border-top: 1px dashed #ccc; margin: 15px 0;"></div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span style="color: #666;">Válido desde:</span>
                        <span style="font-weight: bold;">${formatD(socioInfo.fechaRegistro)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span style="color: #666;">Vencimiento:</span>
                        <span style="font-weight: bold;">${formatD(socioInfo.fechaVencimiento)}</span>
                    </div>
                    
                    <div style="border-top: 2px solid black; margin: 15px 0;"></div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <span style="font-weight: 900; font-size: 18px;">TOTAL:</span>
                        <span style="font-weight: 900; font-size: 18px;">$${parseFloat(socioInfo.precio || 0).toFixed(2)}</span>
                    </div>
                    
                    <div style="text-align: center; font-size: 10px; color: #888; line-height: 1.4;">
                        ¡Gracias por tu preferencia!<br>
                        Este comprobante es para control interno.
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-outline" id="btnCancelTicket" style="padding: 12px 24px;">CERRAR</button>
                <button class="btn btn-outline" id="btnSendWaTicket" style="padding: 12px 24px; display: flex; align-items: center; gap: 8px;">
                    <span class="material-icons-round" style="font-size: 18px;">chat</span> ENVIAR POR WA
                </button>
                <button class="btn btn-primary" id="btnDownloadTicket" style="padding: 12px 24px; display: flex; align-items: center; gap: 8px;">
                    <span class="material-icons-round" style="font-size: 18px;">check</span> DESCARGAR IMAGEN
                </button>
            </div>
        `;

        this.services.modal.open(modalHtml);

        let preGeneratedFile = null;
        let preGeneratedBlob = null;

        setTimeout(async () => {
            try {
                const ticketEl = document.getElementById('ticketCaptureArea');
                if (!ticketEl) return;
                const canvas = await html2canvas(ticketEl, { scale: 2, backgroundColor: '#ffffff' });
                canvas.toBlob((blob) => {
                    preGeneratedBlob = blob;
                    const fileName = `Ticket_${socioInfo.nombre.replace(/\s+/g, '_')}.png`;
                    preGeneratedFile = new File([blob], fileName, { type: 'image/png' });
                }, 'image/png');
            } catch (e) {
                console.error('Error pre-generando ticket', e);
            }
        }, 500);

        const btnClose = document.getElementById('btnCloseTicketModal');
        const btnCancel = document.getElementById('btnCancelTicket');
        const btnDownload = document.getElementById('btnDownloadTicket');
        const btnSendWa = document.getElementById('btnSendWaTicket');

        const cleanup = () => this.services.modal.close();

        if (btnClose) btnClose.addEventListener('click', cleanup);
        if (btnCancel) btnCancel.addEventListener('click', cleanup);

        if (btnDownload) {
            btnDownload.addEventListener('click', () => {
                if (!preGeneratedBlob) {
                    this.services.toast.info('Generando imagen, intenta de nuevo en un segundo...');
                    return;
                }
                const a = document.createElement('a');
                a.href = URL.createObjectURL(preGeneratedBlob);
                a.download = preGeneratedFile.name;
                a.click();
            });
        }

        if (btnSendWa) {
            btnSendWa.addEventListener('click', async () => {
                if (!preGeneratedFile) {
                    this.services.toast.info('Generando imagen, intenta de nuevo en un segundo...');
                    return;
                }

                const phone = socioInfo.telefono ? socioInfo.telefono.replace(/[^0-9]/g, '') : '';
                const msg = `¡Hola ${socioInfo.nombre}! Te enviamos desde ${gymName.toUpperCase()} tu comprobante de inscripción.`;

                // 1. Intentar usar Web Share API (Nativo en celulares, puede compartir archivos)
                if (navigator.canShare && navigator.canShare({ files: [preGeneratedFile] })) {
                    try {
                        await navigator.share({
                            files: [preGeneratedFile],
                            title: `Comprobante de Inscripción - ${gymName}`,
                            text: msg
                        });
                        return; // Completado en dispositivo móvil
                    } catch (err) {
                        console.log('Share cancelado o no soportado', err);
                    }
                }

                // 2. Fallback para PC: Copiar al portapapeles y Descargar
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': preGeneratedBlob })
                    ]);
                } catch (e) {
                    console.log('Clipboard fallback falló', e);
                }

                // Forzar descarga siempre
                const a = document.createElement('a');
                a.href = URL.createObjectURL(preGeneratedBlob);
                a.download = preGeneratedFile.name;
                a.click();

                // 3. Mostrar modal de instrucciones para pegar en WhatsApp
                const waUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

                const instructionModal = `
                    <div class="modal-header">
                        <h3 class="modal-title" style="color: var(--color-primary);">¡IMAGEN LISTA!</h3>
                        <button class="btn-close" id="btnCloseInstruction"><span class="material-icons-round">close</span></button>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                            <div style="text-align: center;">
                                <span class="material-icons-round" style="font-size: 32px; color: var(--color-text-secondary);">content_copy</span>
                                <div style="font-size: 12px; margin-top: 8px;">1. Copiado</div>
                            </div>
                            <span class="material-icons-round" style="color: var(--color-text-secondary); align-self: center;">arrow_forward</span>
                            <div style="text-align: center;">
                                <span class="material-icons-round" style="font-size: 32px; color: var(--color-success);">chat</span>
                                <div style="font-size: 12px; margin-top: 8px;">2. Abre WhatsApp</div>
                            </div>
                            <span class="material-icons-round" style="color: var(--color-text-secondary); align-self: center;">arrow_forward</span>
                            <div style="text-align: center;">
                                <span class="material-icons-round" style="font-size: 32px; color: var(--color-primary);">content_paste</span>
                                <div style="font-size: 12px; margin-top: 8px;">3. Pega (Ctrl+V)</div>
                            </div>
                        </div>
                        <p style="margin-bottom: 24px; color: var(--color-text-secondary); line-height: 1.5;">
                            WhatsApp Web no permite adjuntar imágenes de forma automática.<br><br>
                            Hemos <b>copiado el recibo</b> a tu portapapeles y también lo hemos <b>descargado</b>.<br><br>
                            Haz clic en Abrir WhatsApp y presiona <b>Ctrl + V</b> en el chat para enviar la imagen.
                        </p>
                        <button class="btn btn-primary" id="btnOpenWaTab" style="width: 100%; padding: 16px; font-size: 16px; justify-content: center;">
                            <span class="material-icons-round">open_in_new</span> ABRIR WHATSAPP
                        </button>
                    </div>
                `;

                this.services.modal.open(instructionModal);

                const btnCloseInst = document.getElementById('btnCloseInstruction');
                const btnOpenWa = document.getElementById('btnOpenWaTab');

                if (btnCloseInst) btnCloseInst.addEventListener('click', cleanup);
                if (btnOpenWa) {
                    btnOpenWa.addEventListener('click', () => {
                        window.open(waUrl, '_blank');
                        cleanup();
                    });
                }
            });
        }
    }
}
