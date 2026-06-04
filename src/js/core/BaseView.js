export class BaseView {
    constructor(container, services, eventBus) {
        this.container = container;
        this.services = services;
        this.eventBus = eventBus;
        this._eventBindings = [];
        this._subscriptions = [];
    }

    render() {
        return '';
    }

    async init() {
        // Abstract
    }

    destroy() {
        this._eventBindings.forEach(({ el, event, handler }) => {
            if (el) {
                try {
                    el.removeEventListener(event, handler);
                } catch (e) {}
            }
        });
        this._eventBindings = [];

        this._subscriptions.forEach(({ event, callback }) => {
            if (this.eventBus) {
                try {
                    this.eventBus.off(event, callback);
                } catch (e) {}
            }
        });
        this._subscriptions = [];
        
        this.container.innerHTML = '';
    }

    $(selector) {
        return this.container.querySelector(selector);
    }

    $$(selector) {
        return this.container.querySelectorAll(selector);
    }

    bindEvent(el, event, handler) {
        if (!el) return;
        el.addEventListener(event, handler);
        this._eventBindings.push({ el, event, handler });
    }

    subscribe(event, callback) {
        if (!this.eventBus) return;
        this.eventBus.on(event, callback);
        this._subscriptions.push({ event, callback });
    }
}
