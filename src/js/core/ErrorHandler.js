export class ErrorHandler {
    constructor(toastManager) {
        this.toast = toastManager;
        this._setupGlobalHandlers();
    }

    _setupGlobalHandlers() {
        window.addEventListener('error', (event) => {
            console.error('[Global] Uncaught error:', event.error || event.message);
            this.toast?.danger('Error inesperado. Revisa la consola.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('[Global] Unhandled rejection:', event.reason);
            this.toast?.danger('Error en operación asíncrona. Revisa la consola.');
        });
    }
}
