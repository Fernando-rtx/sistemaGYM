export class EventBus {
    constructor() {
        this._listeners = new Map();
    }

    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, []);
        }
        this._listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this._listeners.has(event)) return;
        const list = this._listeners.get(event);
        const index = list.indexOf(callback);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this._listeners.has(event)) return;
        const list = this._listeners.get(event);
        [...list].forEach(callback => {
            try {
                callback(data);
            } catch (err) {
                console.error(`Error in event listener for ${event}:`, err);
            }
        });
    }
}

export const eventBus = new EventBus();
