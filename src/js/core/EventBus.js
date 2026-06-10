export class EventBus {
    constructor(maxListeners = 20) {
        this._listeners = new Map();
        this._maxListeners = maxListeners;
    }

    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, []);
        }
        const list = this._listeners.get(event);
        if (list.length >= this._maxListeners) {
            console.warn(`EventBus: Event "${event}" has exceeded ${this._maxListeners} listeners. Potential memory leak.`);
        }
        list.push(callback);
    }

    off(event, callback) {
        if (!this._listeners.has(event)) {
            console.warn(`EventBus: Cannot off() — event "${event}" has no listeners.`);
            return;
        }
        const list = this._listeners.get(event);
        const index = list.indexOf(callback);
        if (index === -1) {
            console.warn(`EventBus: Cannot off() — callback not found for event "${event}".`);
            return;
        }
        list.splice(index, 1);
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
