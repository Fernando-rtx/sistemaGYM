export class ModalManager {
    constructor() {
        this.modal = document.getElementById('globalModal');
        this._escapeHandler = null;
        this._overlayHandler = null;
        this._confirmCleanup = null;
        this._setupOverlayClick();
        this._setupEscapeKey();
    }

    _setupOverlayClick() {
        if (this.modal) {
            this._overlayHandler = (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            };
            this.modal.addEventListener('click', this._overlayHandler);
        }
    }

    _setupEscapeKey() {
        this._escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
        document.addEventListener('keydown', this._escapeHandler);
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
        this._cleanupConfirmListeners();
        if (this.modal) {
            this.modal.classList.remove('active');
            this.modal.innerHTML = '';
        }
    }

    _cleanupConfirmListeners() {
        if (this._confirmCleanup) {
            this._confirmCleanup();
            this._confirmCleanup = null;
        }
    }

    confirm(title, message, onConfirm, cancelText = 'CANCELAR', confirmText = 'CONFIRMAR', isDanger = false) {
        this._cleanupConfirmListeners();

        const confirmBtnClass = isDanger ? 'btn-danger' : 'btn-primary';

        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title"></h3>
                <button class="btn-close" id="btnConfirmClose"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <span class="material-icons-round" style="font-size: 48px; color: ${isDanger ? 'var(--color-danger)' : 'var(--color-primary)'};">${isDanger ? 'warning' : 'help_outline'}</span>
                <p style="margin-top: 15px; font-size: 16px;"></p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" id="btnConfirmCancel">${cancelText}</button>
                <button class="btn ${confirmBtnClass}" id="btnConfirmOk" style="flex: 1; justify-content: center;">${confirmText}</button>
            </div>
        `;
        this.open(modalHtml);

        const titleEl = this.modal.querySelector('.modal-title');
        const messageEl = this.modal.querySelector('p');
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;

        const closeBtn = this.modal.querySelector('#btnConfirmClose');
        const cancelBtn = this.modal.querySelector('#btnConfirmCancel');
        const okBtn = this.modal.querySelector('#btnConfirmOk');

        const closeHandler = () => this.close();
        const cancelHandler = () => this.close();
        const okHandler = async () => {
            this.close();
            if (onConfirm) {
                try {
                    await onConfirm();
                } catch (e) {
                    console.error('Error executing confirm callback:', e);
                }
            }
        };

        if (closeBtn) closeBtn.addEventListener('click', closeHandler);
        if (cancelBtn) cancelBtn.addEventListener('click', cancelHandler);
        if (okBtn) okBtn.addEventListener('click', okHandler);

        this._confirmCleanup = () => {
            if (closeBtn) closeBtn.removeEventListener('click', closeHandler);
            if (cancelBtn) cancelBtn.removeEventListener('click', cancelHandler);
            if (okBtn) okBtn.removeEventListener('click', okHandler);
        };
    }

    destroy() {
        this._cleanupConfirmListeners();
        if (this._escapeHandler) {
            document.removeEventListener('keydown', this._escapeHandler);
            this._escapeHandler = null;
        }
        if (this._overlayHandler && this.modal) {
            this.modal.removeEventListener('click', this._overlayHandler);
            this._overlayHandler = null;
        }
        this.modal = null;
    }
}
