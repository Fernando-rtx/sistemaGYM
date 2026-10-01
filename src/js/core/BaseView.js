export class BaseView {
    constructor(container, services, eventBus) {
        this.container = container;
        this.services = services;
        this.eventBus = eventBus;
        this._cleanups = [];
        this._eventBindings = [];
        this._subscriptions = [];

        if (!this.container) {
            console.warn('BaseView: container is null');
        }
        if (!this.services) {
            console.warn('BaseView: services is null');
        }
    }

    render() {
        return '';
    }

    async init() {
        // Abstract
    }

    destroy() {
        this._cleanups.forEach(fn => {
            try { fn(); } catch (e) {}
        });
        this._cleanups = [];

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

        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    $(selector) {
        return this.container ? this.container.querySelector(selector) : null;
    }

    $$(selector) {
        return this.container ? this.container.querySelectorAll(selector) : null;
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

    addCleanup(fn) {
        this._cleanups.push(fn);
    }
}
