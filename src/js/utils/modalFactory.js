export class ModalFactory {
    constructor(modalManager) {
        this.modal = modalManager;
    }

    openForm({ title, content, onConfirm, confirmText = 'GUARDAR', cancelText = 'Cancelar', confirmClass = 'btn-primary', width = 'auto' }) {
        const html = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="btn-close" id="mfClose"><span class="material-icons-round">close</span></button>
            </div>
            <div style="${width !== 'auto' ? `max-width:${width};` : ''}">
                ${content}
            </div>
            <div class="modal-footer" style="display:flex; gap:8px; justify-content:flex-end; margin-top:20px;">
                <button class="btn btn-outline" id="mfCancel">${cancelText}</button>
                <button class="btn ${confirmClass}" id="mfConfirm">${confirmText}</button>
            </div>
        `;
        this.modal.open(html);

        return new Promise((resolve) => {
            const cleanup = () => {
                document.getElementById('mfClose')?.removeEventListener('click', onCancel);
                document.getElementById('mfCancel')?.removeEventListener('click', onCancel);
                document.getElementById('mfConfirm')?.removeEventListener('click', onConfirm);
            };

            const onCancel = () => {
                cleanup();
                this.modal.close();
                resolve(false);
            };

            const onConfirmClick = async () => {
                const result = await onConfirm();
                if (result !== false) {
                    cleanup();
                    this.modal.close();
                    resolve(result);
                }
            };

            setTimeout(() => {
                document.getElementById('mfClose')?.addEventListener('click', onCancel);
                document.getElementById('mfCancel')?.addEventListener('click', onCancel);
                document.getElementById('mfConfirm')?.addEventListener('click', onConfirmClick);
            }, 0);
        });
    }

    close() {
        this.modal.close();
    }

    confirm({ title, message, confirmText = 'SÍ', cancelText = 'Cancelar', confirmClass = 'btn-danger' }) {
        return this.openForm({
            title,
            confirmText,
            cancelText,
            confirmClass,
            content: `<p style="color:var(--color-text-secondary);">${message}</p>`,
            onConfirm: async () => true
        });
    }
}
