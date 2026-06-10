import { supabase } from '../supabaseClient.js';

const SESSION_KEY = 'gym_sesion';

export class AuthService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async login(username, password) {
        // Try Supabase Auth first
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username,
                password
            });
            if (data?.user) {
                const session = {
                    id: data.user.id,
                    username: data.user.email,
                    nombre: data.user.user_metadata?.nombre || data.user.email,
                    role: data.user.user_metadata?.role || 'Admin'
                };
                this._saveSession(session);
                this._emit('auth:login', session);
                return true;
            }
        } catch (e) {
            // Fallback to local auth if Supabase Auth fails
        }

        // Legacy local auth fallback
        const user = this._matchLocalUser(username, password);
        if (user) {
            this._saveSession(user);
            this._emit('auth:login', user);
            return true;
        }
        return false;
    }

    logout() {
        try {
            supabase.auth.signOut();
        } catch (e) { /* ignore */ }
        localStorage.removeItem(SESSION_KEY);
        this._emit('auth:logout');
    }

    getCurrentUser() {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role !== 'Empleado';
    }

    _saveSession(user) {
        const safeUser = (({ password, ...rest }) => rest)(user);
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    }

    _emit(event, data) {
        if (this.eventBus) this.eventBus.emit(event, data);
    }

    _matchLocalUser(username, password) {
        const users = [
            { id: 'usr-1', username: 'fernando', password: '123', role: 'Creador', nombre: 'Fernando' },
            { id: 'usr-2', username: 'admin', password: '123', role: 'Admin', nombre: 'Administrador' },
            { id: 'usr-3', username: 'empleado', password: '123', role: 'Empleado', nombre: 'Recepcionista' },
        ];
        const user = users.find(u => u.username === username && u.password === password);
        return user || null;
    }
}
