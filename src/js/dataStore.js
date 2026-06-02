/**
 * dataStore.js — Capa de datos centralizada para el Sistema GYM
 * Toda la persistencia se maneja a través de localStorage.
 */

// ==================== KEYS ====================
const KEYS = {
    SOCIOS: 'gym_socios',
    CHECKINS: 'gym_checkins',
    TRANSACCIONES: 'gym_transacciones',
    SETTINGS: 'gym_settings',
    INVENTARIO: 'gym_inventario',
    USUARIOS: 'gym_usuarios',
    SESION: 'gym_sesion',
};

// ==================== HELPERS ====================
const _get = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) || null;
    } catch (e) {
        return null;
    }
};

const _set = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const _genId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

const _today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const _now = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ==================== DEFAULTS ====================
const DEFAULT_SETTINGS = {
    brandName: 'NEXFIT',
    brandColor: '#94ff00',
    precios: {
        Mensual: 20,
        Quincenal: 10,
        Diario: 3,
    },
};

const DEFAULT_SOCIOS = [
    { id: _genId(), nombre: 'Carlos Mendoza', edad: 28, telefono: '7777-1234', membresia: 'Mensual', precio: 20, fechaRegistro: '2026-05-01', fechaVencimiento: '2026-05-18', estado: 'Vencido', deuda: 0 },
    { id: _genId(), nombre: 'María Fernanda López', edad: 24, telefono: '7777-5678', membresia: 'Mensual', precio: 20, fechaRegistro: '2026-05-10', fechaVencimiento: '2026-06-09', estado: 'Activo', deuda: 0 },
    { id: _genId(), nombre: 'Roberto Castillo', edad: 35, telefono: '7777-9012', membresia: 'Mensual', precio: 20, fechaRegistro: '2026-01-15', fechaVencimiento: '2026-12-15', estado: 'Activo', deuda: 15 },
    { id: _genId(), nombre: 'Miguel Vargas', edad: 22, telefono: '7777-3456', membresia: 'Mensual', precio: 20, fechaRegistro: '2026-05-03', fechaVencimiento: '2026-06-03', estado: 'Vencido', deuda: 0 },
    { id: _genId(), nombre: 'Sofía Méndez', edad: 29, telefono: '7777-7890', membresia: 'Quincenal', precio: 10, fechaRegistro: '2026-05-17', fechaVencimiento: '2026-06-01', estado: 'Vencido', deuda: 0 },
];

const DEFAULT_INVENTARIO = [
    { id: _genId(), nombre: 'Botella de Agua', precio: 0.50, stock: 50, icono: 'water_drop', color: '#3b82f6' },
    { id: _genId(), nombre: 'Powerade', precio: 0.75, stock: 30, icono: 'sports_bar', color: '#ef4444' },
    { id: _genId(), nombre: 'Hi Energy', precio: 0.50, stock: 20, icono: 'bolt', color: '#94ff00' },
    { id: _genId(), nombre: 'Monster Blanco', precio: 2.50, stock: 15, icono: 'local_drink', color: '#ffffff' },
];

const DEFAULT_USUARIOS = [
    { id: 'usr-1', username: 'fernando', password: '123', role: 'Creador', nombre: 'Fernando' },
    { id: 'usr-2', username: 'admin', password: '123', role: 'Admin', nombre: 'Administrador' },
    { id: 'usr-3', username: 'empleado', password: '123', role: 'Empleado', nombre: 'Recepcionista' },
];

// ==================== INIT ====================
export const initDataStore = () => {
    if (!_get(KEYS.SETTINGS)) _set(KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (!_get(KEYS.SOCIOS)) _set(KEYS.SOCIOS, DEFAULT_SOCIOS);
    if (!_get(KEYS.CHECKINS)) _set(KEYS.CHECKINS, []);
    if (!_get(KEYS.TRANSACCIONES)) _set(KEYS.TRANSACCIONES, []);
    if (!_get(KEYS.INVENTARIO)) _set(KEYS.INVENTARIO, DEFAULT_INVENTARIO);
    if (!_get(KEYS.USUARIOS)) _set(KEYS.USUARIOS, DEFAULT_USUARIOS);
};

// ==================== SETTINGS ====================
export const getSettings = () => _get(KEYS.SETTINGS) || DEFAULT_SETTINGS;

export const saveSettings = (newSettings) => {
    const current = getSettings();
    const merged = { ...current, ...newSettings };
    _set(KEYS.SETTINGS, merged);
    return merged;
};

// ==================== SOCIOS ====================
export const getSocios = () => _get(KEYS.SOCIOS) || [];

export const addSocio = (socio) => {
    const socios = getSocios();
    const newSocio = {
        id: _genId(),
        fechaRegistro: _today(),
        estado: 'Activo',
        deuda: 0,
        ...socio,
    };
    socios.unshift(newSocio);
    _set(KEYS.SOCIOS, socios);
    return newSocio;
};

export const updateSocio = (id, updates) => {
    const socios = getSocios();
    const idx = socios.findIndex(s => s.id === id);
    if (idx === -1) return null;
    socios[idx] = { ...socios[idx], ...updates };
    _set(KEYS.SOCIOS, socios);
    return socios[idx];
};

export const deleteSocio = (id) => {
    const socios = getSocios().filter(s => s.id !== id);
    _set(KEYS.SOCIOS, socios);
};

export const getSocioById = (id) => getSocios().find(s => s.id === id) || null;

/**
 * Calcula la fecha de vencimiento basada en el plan.
 * @param {string} plan - 'Mensual', 'Quincenal', o 'Diario'
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const calcularVencimiento = (plan) => {
    const d = new Date();
    switch (plan) {
        case 'Mensual': d.setDate(d.getDate() + 30); break;
        case 'Quincenal': d.setDate(d.getDate() + 15); break;
        case 'Diario': d.setDate(d.getDate() + 1); break;
        default: d.setDate(d.getDate() + 30);
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Formatea una fecha YYYY-MM-DD a formato legible "DD Mon"
 */
export const formatFecha = (dateStr) => {
    if (!dateStr || dateStr === 'Próximo mes') return dateStr;
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parseInt(parts[2])} ${meses[parseInt(parts[1]) - 1]}`;
};

// ==================== CHECK-INS ====================
export const getCheckins = () => _get(KEYS.CHECKINS) || [];

export const addCheckin = (socioId, nombre) => {
    const checkins = getCheckins();
    const record = {
        id: _genId(),
        socioId,
        nombre,
        fecha: _today(),
        hora: _now(),
    };
    checkins.unshift(record);
    _set(KEYS.CHECKINS, checkins);
    return record;
};

export const getCheckinsHoy = () => {
    const hoy = _today();
    return getCheckins().filter(c => c.fecha === hoy);
};

/**
 * Calcula las rachas de asistencia consecutiva para cada socio.
 * Retorna un array ordenado por racha descendente.
 */
export const calcularRachas = () => {
    const checkins = getCheckins();
    const socioMap = {};

    // Agrupar fechas únicas por socio
    checkins.forEach(c => {
        if (!socioMap[c.socioId]) {
            socioMap[c.socioId] = { nombre: c.nombre, fechas: new Set() };
        }
        socioMap[c.socioId].fechas.add(c.fecha);
    });

    const rachas = [];
    Object.keys(socioMap).forEach(socioId => {
        const { nombre, fechas } = socioMap[socioId];
        const sortedDates = [...fechas].sort().reverse();

        let racha = 0;
        const hoy = new Date(_today());

        for (let i = 0; i < sortedDates.length; i++) {
            const expected = new Date(hoy);
            expected.setDate(expected.getDate() - i);
            const expectedStr = `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, '0')}-${String(expected.getDate()).padStart(2, '0')}`;

            if (sortedDates.includes(expectedStr)) {
                racha++;
            } else {
                break;
            }
        }

        if (racha > 0) {
            rachas.push({ socioId, nombre, racha });
        }
    });

    return rachas.sort((a, b) => b.racha - a.racha).slice(0, 5);
};

// ==================== TRANSACCIONES ====================
export const getTransacciones = () => _get(KEYS.TRANSACCIONES) || [];

export const addTransaccion = (transaccion) => {
    const trans = getTransacciones();
    const record = {
        id: _genId(),
        fecha: _today(),
        hora: _now(),
        ...transaccion,
    };
    trans.unshift(record);
    _set(KEYS.TRANSACCIONES, trans);
    return record;
};

export const getTransaccionesHoy = () => {
    const hoy = _today();
    return getTransacciones().filter(t => t.fecha === hoy);
};

/**
 * Calcula el resumen de caja del día actual.
 */
export const getResumenCaja = () => {
    const transHoy = getTransaccionesHoy();
    const ingresos = transHoy.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
    const salidas = transHoy.filter(t => t.tipo === 'salida').reduce((sum, t) => sum + t.monto, 0);
    return {
        ingresos,
        salidas,
        total: ingresos - salidas,
        numTransacciones: transHoy.length,
    };
};

/**
 * Cuenta socios registrados hoy.
 */
export const sociosNuevosHoy = () => {
    const hoy = _today();
    return getSocios().filter(s => s.fechaRegistro === hoy).length;
};

/**
 * Cuenta socios cuya membresía vence dentro de los próximos N días.
 */
export const sociosPorVencer = (dias = 7) => {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);

    return getSocios().filter(s => {
        if (s.estado !== 'Activo') return false;
        const venc = new Date(s.fechaVencimiento);
        return venc >= hoy && venc <= limite;
    });
};

// ==================== INVENTARIO ====================
export const getInventario = () => _get(KEYS.INVENTARIO) || [];

export const addProducto = (producto) => {
    const inv = getInventario();
    const newProd = {
        id: _genId(),
        stock: 0,
        icono: 'inventory_2',
        color: '#ffffff',
        ...producto,
    };
    inv.push(newProd);
    _set(KEYS.INVENTARIO, inv);
    return newProd;
};

export const updateProducto = (id, updates) => {
    const inv = getInventario();
    const idx = inv.findIndex(p => p.id === id);
    if (idx === -1) return null;
    inv[idx] = { ...inv[idx], ...updates };
    _set(KEYS.INVENTARIO, inv);
    return inv[idx];
};

export const deleteProducto = (id) => {
    const inv = getInventario().filter(p => p.id !== id);
    _set(KEYS.INVENTARIO, inv);
};

// ==================== USUARIOS / SESIÓN ====================
export const getUsuarios = () => _get(KEYS.USUARIOS) || [];

export const loginUsuario = (username, password) => {
    const usuarios = getUsuarios();
    const user = usuarios.find(u => u.username === username && u.password === password);
    if (user) {
        _set(KEYS.SESION, user);
        return true;
    }
    return false;
};

export const logoutUsuario = () => {
    localStorage.removeItem(KEYS.SESION);
};

export const getCurrentUser = () => _get(KEYS.SESION);


