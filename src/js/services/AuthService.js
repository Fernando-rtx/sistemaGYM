// Every visitor gets a fictional demo identity; no credentials are requested.
export class AuthService {
    constructor(eventBus) { this.eventBus = eventBus; }
    getCurrentUser() { return {id: 'demo-visitor', nombre: 'Visitante demo', role: 'Admin'}; }
    isAdmin() { return true; }
}
