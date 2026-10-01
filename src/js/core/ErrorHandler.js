export class ErrorHandler {
    constructor(toastManager, eventBus) {
        this.toast = toastManager;
        this.eventBus = eventBus;
        this._handlers = [];
        this._appErrorHandler = null;
        this._setupGlobalHandlers();
        this._subscribeToAppErrors();
    }

    _subscribeToAppErrors() {
        if (!this.eventBus) return;
        this._appErrorHandler = ({ context, error, source }) => {
            this.toast?.danger(`Error en ${source || 'aplicación'}: ${context}`);
        };
        this.eventBus.on('app:error', this._appErrorHandler);
    }

    _setupGlobalHandlers() {
        if (this._handlers.length > 0) return;

        const errorHandler = (event) => {
            console.error('[Global] Uncaught error:', event.error || event.message);
            this.toast?.danger('Error inesperado. Revisa la consola.');
        };
        const rejectionHandler = (event) => {
            console.error('[Global] Unhandled rejection:', event.reason);
            this.toast?.danger('Error en operación asíncrona. Revisa la consola.');
        };

        window.addEventListener('error', errorHandler);
        window.addEventListener('unhandledrejection', rejectionHandler);

        this._handlers.push({ type: 'error', handler: errorHandler });
        this._handlers.push({ type: 'unhandledrejection', handler: rejectionHandler });
    }

    subscribe() {
        if (!this.eventBus) return;
        const handler = ({ context, error, source }) => {
            this.toast?.danger(`[${source}] ${context}`);
            console.error(`[ErrorHandler] [${source}] ${context}:`, error);
        };
        this.eventBus.on('app:error', handler);
    }

    destroy() {
        this._handlers.forEach(({ type, handler }) => {
            window.removeEventListener(type, handler);
        });
        this._handlers = [];
        if (this._appErrorHandler && this.eventBus) {
            this.eventBus.off('app:error', this._appErrorHandler);
            this._appErrorHandler = null;
        }
    }
}
