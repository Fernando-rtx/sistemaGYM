const DEFAULT_USUARIOS = [
    { id: 'usr-1', username: 'fernando', password: '123', role: 'Creador', nombre: 'Fernando' },
    { id: 'usr-2', username: 'admin', password: '123', role: 'Admin', nombre: 'Administrador' },
    { id: 'usr-3', username: 'empleado', password: '123', role: 'Empleado', nombre: 'Recepcionista' },
];

export class AuthService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async getUsuarios() {
        return DEFAULT_USUARIOS;
    }

    async login(username, password) {
        const user = DEFAULT_USUARIOS.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('gym_sesion', JSON.stringify(user));
            if (this.eventBus) {
                this.eventBus.emit('auth:login', user);
            }
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('gym_sesion');
        if (this.eventBus) {
            this.eventBus.emit('auth:logout');
        }
    }

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('gym_sesion')) || null;
        } catch (e) {
            return null;
        }
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role !== 'Empleado';
    }
}
