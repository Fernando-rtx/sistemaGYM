import { supabase } from '../supabaseClient.js';
import { Transaccion } from '../models/Transaccion.js';

export class TransaccionService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async getAll() {
        const { data, error } = await supabase.from('transacciones').select('*').order('created_at', { ascending: false });
        if (error) return [];
        return data.map(t => Transaccion.fromSupabase(t));
    }

    async getHoy() {
        const hoyStr = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase.from('transacciones').select('*').eq('fecha', hoyStr);
        if (error) return [];
        return data.map(t => Transaccion.fromSupabase(t));
    }

    async crear(transaccionData) {
        const trans = new Transaccion(transaccionData);
        if (!trans.fecha) {
            trans.fecha = new Date().toISOString().split('T')[0];
        }
        if (!trans.hora) {
            const d = new Date();
            trans.hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }
        
        const { data, error } = await supabase.from('transacciones').insert([trans.toSupabase()]).select().single();
        if (error) {
            console.error(error);
            return null;
        }

        const newTrans = Transaccion.fromSupabase(data);
        if (this.eventBus) {
            this.eventBus.emit('transaccion:created', newTrans);
        }
        return newTrans;
    }

    async getResumenCaja() {
        const transHoy = await this.getHoy();
        const ingresos = transHoy.filter(t => t.esIngreso).reduce((sum, t) => sum + t.monto, 0);
        const salidas = transHoy.filter(t => !t.esIngreso).reduce((sum, t) => sum + t.monto, 0);
        return {
            ingresos,
            salidas,
            total: ingresos - salidas,
            numTransacciones: transHoy.length
        };
    }

    async getIngresosMes(mes, anio) {
        const startStr = `${anio}-${String(mes).padStart(2, '0')}-01`;
        const end = new Date(anio, mes, 0);
        const endStr = `${anio}-${String(mes).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

        const { data, error } = await supabase.from('transacciones')
            .select('*')
            .eq('tipo', 'ingreso')
            .gte('fecha', startStr)
            .lte('fecha', endStr);
            
        if (error) return 0;
        return data.reduce((sum, t) => sum + parseFloat(t.monto), 0);
    }
}
