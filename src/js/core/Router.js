export class Router {
    constructor(container, services, eventBus) {
        this.container = container;
        this.services = services;
        this.eventBus = eventBus;
        this.routes = new Map();
        this.currentView = null;
        this.currentViewName = null;
        this._navigating = false;
    }

    register(name, ViewClass) {
        this.routes.set(name, ViewClass);
    }

    async init() {
        window.addEventListener('hashchange', () => this._onHashChange());

        const hash = window.location.hash.replace('#', '');
        const initialView = hash && this.routes.has(hash) ? hash : 'dashboard';
        await this.navigate(initialView);
    }

    _onHashChange() {
        if (this._navigating) return;
        const viewName = window.location.hash.replace('#', '');
        if (viewName && viewName !== this.currentViewName && this.routes.has(viewName)) {
            this.navigate(viewName);
        }
    }

    async navigate(viewName) {
        if (!this.routes.has(viewName)) {
            console.error(`Route "${viewName}" not registered.`);
            return;
        }

        this._navigating = true;

        const user = this.services?.auth?.getCurrentUser();
        if (!user) {
            console.warn('Router: no authenticated user, skipping navigation');
            this._navigating = false;
            return;
        }

        const ViewClass = this.routes.get(viewName);
        if (typeof ViewClass !== 'function') {
            console.error(`Route "${viewName}" is not a valid view class.`);
            this._navigating = false;
            return;
        }

        this.eventBus.emit('navigation:before', { viewName });

        if (this.currentView) {
            if (typeof this.currentView.destroy === 'function') {
                this.currentView.destroy();
            }
        }

        this.currentView = new ViewClass(this.container, this.services, this.eventBus);

        this.container.innerHTML = this.currentView.render();

        try {
            await this.currentView.init();
        } catch (err) {
            console.error(`Error initializing view "${viewName}":`, err);
            if (this.currentView && typeof this.currentView.destroy === 'function') {
                this.currentView.destroy();
            }
            this.currentView = null;
            this._navigating = false;
            return;
        }

        this.currentViewName = viewName;
        window.location.hash = viewName;

        this.eventBus.emit('navigation:after', { viewName });

        this._navigating = false;
    }

    getCurrentView() {
        return this.currentView;
    }
}
