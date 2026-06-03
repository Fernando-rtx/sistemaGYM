import { supabase } from './supabaseClient.js';

// ==================== HELPERS ====================
const _today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const _now = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ==================== INIT ====================
export const initDataStore = async () => {
    // Ya no es estrictamente necesario inicializar localStorage,
    // pero podemos asegurar que exista el registro de ajustes en Supabase.
    const { data, error } = await supabase.from('ajustes').select('*').limit(1);
    if (data && data.length === 0) {
        // En teoría el script inicial ya lo hizo, pero por si acaso:
        await supabase.from('ajustes').insert([{
            brand_name: 'NEXFIT',
            brand_color: '#94ff00',
            precios: { Mensual: 20, Quincenal: 10, Diario: 3 }
        }]);
    }
};

// ==================== SETTINGS ====================
export const getSettings = async () => {
    const { data, error } = await supabase.from('ajustes').select('*').limit(1).single();
    if (error || !data) {
        return {
            brandName: 'NEXFIT',
            brandColor: '#94ff00',
            precios: { Mensual: 20, Quincenal: 10, Diario: 3 }
        };
    }
    return {
        id: data.id,
        brandName: data.brand_name,
        brandColor: data.brand_color,
        precios: data.precios
    };
};

export const saveSettings = async (newSettings) => {
    const current = await getSettings();
    const updates = {
        brand_name: newSettings.brandName || current.brandName,
        brand_color: newSettings.brandColor || current.brandColor,
        precios: newSettings.precios || current.precios
    };
    
    if (current.id) {
        await supabase.from('ajustes').update(updates).eq('id', current.id);
    } else {
        await supabase.from('ajustes').insert([updates]);
    }
    return { ...current, ...newSettings };
};

// ==================== SOCIOS ====================
export const getSocios = async () => {
    const { data, error } = await supabase.from('socios').select('*').order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data.map(s => ({
        id: s.id,
        nombre: s.nombre,
        telefono: s.telefono,
        edad: s.edad,
        membresia: s.membresia,
        precio: s.precio,
        fechaRegistro: s.fecha_registro,
        fechaVencimiento: s.fecha_vencimiento,
        estado: s.estado,
        deuda: s.deuda
    }));
};

export const addSocio = async (socio) => {
    const insertData = {
        nombre: socio.nombre,
        telefono: socio.telefono,
        edad: socio.edad,
        membresia: socio.membresia,
        precio: socio.precio,
        fecha_registro: socio.fechaRegistro || _today(),
        fecha_vencimiento: socio.fechaVencimiento,
        estado: socio.estado || 'Activo',
        deuda: socio.deuda || 0
    };
    
    const { data, error } = await supabase.from('socios').insert([insertData]).select().single();
    if (error) { console.error(error); return null; }
    
    return {
        id: data.id,
        nombre: data.nombre,
        telefono: data.telefono,
        edad: data.edad,
        membresia: data.membresia,
        precio: data.precio,
        fechaRegistro: data.fecha_registro,
        fechaVencimiento: data.fecha_vencimiento,
        estado: data.estado,
        deuda: data.deuda
    };
};

export const updateSocio = async (id, updates) => {
    const updateData = {};
    if (updates.nombre !== undefined) updateData.nombre = updates.nombre;
    if (updates.telefono !== undefined) updateData.telefono = updates.telefono;
    if (updates.edad !== undefined) updateData.edad = updates.edad;
    if (updates.membresia !== undefined) updateData.membresia = updates.membresia;
    if (updates.precio !== undefined) updateData.precio = updates.precio;
    if (updates.fechaRegistro !== undefined) updateData.fecha_registro = updates.fechaRegistro;
    if (updates.fechaVencimiento !== undefined) updateData.fecha_vencimiento = updates.fechaVencimiento;
    if (updates.estado !== undefined) updateData.estado = updates.estado;
    if (updates.deuda !== undefined) updateData.deuda = updates.deuda;

    const { data, error } = await supabase.from('socios').update(updateData).eq('id', id).select().single();
    if (error) { console.error(error); return null; }
    return data;
};

export const deleteSocio = async (id) => {
    const socio = await getSocioById(id);
    if (socio) {
        const concepto = `Membresía ${socio.membresia} - ${socio.nombre}`;
        const hoy = _today();
        // Intentar eliminar la transacción de registro si se hizo hoy (evita alterar caja si fue un error)
        await supabase.from('transacciones').delete().match({ 
            concepto: concepto, 
            fecha: hoy, 
            monto: socio.precio 
        });
    }

    const { error } = await supabase.from('socios').delete().eq('id', id);
    if (error) console.error(error);
};

export const getSocioById = async (id) => {
    const { data, error } = await supabase.from('socios').select('*').eq('id', id).single();
    if (error) return null;
    return {
        id: data.id,
        nombre: data.nombre,
        telefono: data.telefono,
        edad: data.edad,
        membresia: data.membresia,
        precio: data.precio,
        fechaRegistro: data.fecha_registro,
        fechaVencimiento: data.fecha_vencimiento,
        estado: data.estado,
        deuda: data.deuda
    };
};

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

export const formatFecha = (dateStr) => {
    if (!dateStr || dateStr === 'Próximo mes') return dateStr;
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parseInt(parts[2])} ${meses[parseInt(parts[1]) - 1]}`;
};

// ==================== CHECK-INS ====================
export const getCheckins = async () => {
    const { data, error } = await supabase.from('checkins').select(`*, socios(nombre)`).order('created_at', { ascending: false });
    if (error) return [];
    return data.map(c => ({
        id: c.id,
        socioId: c.socio_id,
        nombre: c.socios?.nombre || 'Desconocido',
        fecha: c.fecha,
        hora: c.hora
    }));
};

export const addCheckin = async (socioId, nombre) => {
    const insertData = {
        socio_id: socioId,
        fecha: _today(),
        hora: _now()
    };
    const { data, error } = await supabase.from('checkins').insert([insertData]).select().single();
    if (error) { console.error(error); return null; }
    
    return {
        id: data.id,
        socioId: data.socio_id,
        nombre: nombre,
        fecha: data.fecha,
        hora: data.hora
    };
};

export const getCheckinsHoy = async () => {
    const hoy = _today();
    const { data, error } = await supabase.from('checkins').select(`*, socios(nombre)`).eq('fecha', hoy);
    if (error) return [];
    return data.map(c => ({
        id: c.id,
        socioId: c.socio_id,
        nombre: c.socios?.nombre || 'Desconocido',
        fecha: c.fecha,
        hora: c.hora
    }));
};

export const calcularRachas = async (checkinsList = null) => {
    const checkins = checkinsList || await getCheckins();
    const socioMap = {};

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
export const getTransacciones = async () => {
    const { data, error } = await supabase.from('transacciones').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
};

export const addTransaccion = async (transaccion) => {
    const insertData = {
        tipo: transaccion.tipo,
        concepto: transaccion.concepto,
        monto: transaccion.monto,
        fecha: transaccion.fecha || _today(),
        hora: transaccion.hora || _now()
    };
    const { data, error } = await supabase.from('transacciones').insert([insertData]).select().single();
    if (error) { console.error(error); return null; }
    return data;
};

export const getTransaccionesHoy = async () => {
    const hoy = _today();
    const { data, error } = await supabase.from('transacciones').select('*').eq('fecha', hoy);
    if (error) return [];
    return data;
};

export const getResumenCaja = async () => {
    const transHoy = await getTransaccionesHoy();
    const ingresos = transHoy.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + parseFloat(t.monto), 0);
    const salidas = transHoy.filter(t => t.tipo === 'salida').reduce((sum, t) => sum + parseFloat(t.monto), 0);
    return {
        ingresos,
        salidas,
        total: ingresos - salidas,
        numTransacciones: transHoy.length,
    };
};

export const sociosNuevosHoy = async () => {
    const hoy = _today();
    const { count, error } = await supabase.from('socios').select('*', { count: 'exact', head: true }).eq('fecha_registro', hoy);
    if (error) return 0;
    return count;
};

export const sociosPorVencer = async (dias = 7) => {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);

    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    const limiteStr = `${limite.getFullYear()}-${String(limite.getMonth() + 1).padStart(2, '0')}-${String(limite.getDate()).padStart(2, '0')}`;

    const { data, error } = await supabase.from('socios')
        .select('*')
        .eq('estado', 'Activo')
        .gte('fecha_vencimiento', hoyStr)
        .lte('fecha_vencimiento', limiteStr);
        
    if (error) return [];
    
    return data.map(s => ({
        id: s.id,
        nombre: s.nombre,
        telefono: s.telefono,
        edad: s.edad,
        membresia: s.membresia,
        precio: s.precio,
        fechaRegistro: s.fecha_registro,
        fechaVencimiento: s.fecha_vencimiento,
        estado: s.estado,
        deuda: s.deuda
    }));
};

// ==================== INVENTARIO ====================
export const getInventario = async () => {
    const { data, error } = await supabase.from('inventario').select('*');
    if (error) return [];
    return data;
};

export const addProducto = async (producto) => {
    const { data, error } = await supabase.from('inventario').insert([producto]).select().single();
    if (error) return null;
    return data;
};

export const updateProducto = async (id, updates) => {
    const { data, error } = await supabase.from('inventario').update(updates).eq('id', id).select().single();
    if (error) return null;
    return data;
};

export const deleteProducto = async (id) => {
    await supabase.from('inventario').delete().eq('id', id);
};

// ==================== USUARIOS / SESIÓN ====================
// Por el momento, mantenemos un hardcode de login para no romper el portal existente,
// o podríamos usar Supabase Auth si se configuran los usuarios.
// Dado el plan, mantendremos este mock temporal mientras se adaptan las vistas.
const DEFAULT_USUARIOS = [
    { id: 'usr-1', username: 'fernando', password: '123', role: 'Creador', nombre: 'Fernando' },
    { id: 'usr-2', username: 'admin', password: '123', role: 'Admin', nombre: 'Administrador' },
    { id: 'usr-3', username: 'empleado', password: '123', role: 'Empleado', nombre: 'Recepcionista' },
];

export const getUsuarios = async () => {
    return DEFAULT_USUARIOS;
};

export const loginUsuario = async (username, password) => {
    const user = DEFAULT_USUARIOS.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('gym_sesion', JSON.stringify(user));
        return true;
    }
    return false;
};

export const logoutUsuario = () => {
    localStorage.removeItem('gym_sesion');
};

export const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem('gym_sesion')) || null;
    } catch (e) {
        return null;
    }
};
