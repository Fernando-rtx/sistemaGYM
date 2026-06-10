export class ModalManager {
    constructor() {
        this.modal = document.getElementById('globalModal');
        this._setupOverlayClick();
        this._setupEscapeKey();
    }

    _setupOverlayClick() {
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }

    _setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    open(contentHtml) {
        if (!this.modal) return;
        this.modal.innerHTML = `
            <div class="modal-content">
                ${contentHtml}
            </div>
        `;
        this.modal.classList.add('active');
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    }

    confirm(title, message, onConfirm, cancelText = 'CANCELAR', confirmText = 'CONFIRMAR', isDanger = false) {
        const confirmBtnClass = isDanger ? 'background-color: var(--color-danger);' : '';
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="btn-close" id="btnConfirmClose"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <span class="material-icons-round" style="font-size: 48px; color: ${isDanger ? 'var(--color-danger)' : 'var(--color-primary)'};">${isDanger ? 'warning' : 'help_outline'}</span>
                <p style="margin-top: 15px; font-size: 16px;">${message}</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" id="btnConfirmCancel">${cancelText}</button>
                <button class="btn btn-primary" id="btnConfirmOk" style="flex: 1; justify-content: center; ${confirmBtnClass}">${confirmText}</button>
            </div>
        `;
        this.open(modalHtml);

        const closeBtn = document.getElementById('btnConfirmClose');
        const cancelBtn = document.getElementById('btnConfirmCancel');
        const okBtn = document.getElementById('btnConfirmOk');

        const cleanup = () => {
            this.close();
        };

        if (closeBtn) closeBtn.addEventListener('click', cleanup);
        if (cancelBtn) cancelBtn.addEventListener('click', cleanup);
        
        if (okBtn) {
            okBtn.addEventListener('click', async () => {
                cleanup();
                if (onConfirm) {
                    try {
                        await onConfirm();
                    } catch (e) {
                        console.error('Error executing confirm callback:', e);
                    }
                }
            });
        }
    }
}

export const modalManager = new ModalManager();
