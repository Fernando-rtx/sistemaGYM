export class Router {
    constructor(container, services, eventBus) {
        this.container = container;
        this.services = services;
        this.eventBus = eventBus;
        this.routes = new Map();
        this.currentView = null;
    }

    register(name, ViewClass) {
        this.routes.set(name, ViewClass);
    }

    async navigate(viewName) {
        if (!this.routes.has(viewName)) {
            console.error(`Route "${viewName}" not registered.`);
            return;
        }

        if (this.currentView) {
            this.currentView.destroy();
        }

        const ViewClass = this.routes.get(viewName);
        this.currentView = new ViewClass(this.container, this.services, this.eventBus);
        
        this.container.innerHTML = `<div class="fade-in">${this.currentView.render()}</div>`;
        
        try {
            await this.currentView.init();
        } catch (err) {
            console.error(`Error initializing view "${viewName}":`, err);
        }

        this.eventBus.emit('router:navigation', viewName);
    }

    getCurrentView() {
        return this.currentView;
    }
}
