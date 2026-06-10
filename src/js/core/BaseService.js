import { todayStr } from '../utils/dateUtils.js';

export class BaseService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    today() {
        return todayStr();
    }

    emit(event, payload) {
        if (this.eventBus) {
            this.eventBus.emit(event, payload);
        }
    }

    logError(context, error) {
        console.error(`[${this.constructor.name}] ${context}:`, error);
    }

    handleError(error, fallback = null) {
        if (error) {
            this.logError('Operation failed', error);
        }
        return fallback;
    }
}
