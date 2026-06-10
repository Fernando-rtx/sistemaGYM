import { supabase } from '../supabaseClient.js';

const SESSION_KEY = 'gym_session';

export class AuthService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async login(username, password) {
        if (!username || !password) return false;

        // 1. Try Supabase Auth (if configured)
        try {
            if (supabase?.auth) {
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
            }
        } catch (e) {
            console.error('Supabase auth error:', e);
        }

        // 2. Fallback: try custom usuarios table
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .or(`username.eq.${username},email.eq.${username}`)
                .maybeSingle();

            if (data && data.password === password) {
                const session = {
                    id: data.id,
                    username: data.username || data.email,
                    nombre: data.nombre || data.username,
                    role: data.role || 'Empleado'
                };
                this._saveSession(session);
                this._emit('auth:login', session);
                return true;
            }
        } catch (e) {
            console.error('Fallback usuarios table error:', e);
        }

        // 3. Dev fallback: local users (remove once DB auth is configured)
        const devUser = this._matchLocalUser(username, password);
        if (devUser) {
            console.warn('[AuthService] Using local dev user fallback. Configure DB auth for production.');
            this._saveSession(devUser);
            this._emit('auth:login', devUser);
            return true;
        }

        return false;
    }

    async logout() {
        try {
            await supabase?.auth?.signOut();
        } catch (e) {
            console.error('Supabase signout error:', e);
        }
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
        return user && ['Admin', 'Creador'].includes(user.role);
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
