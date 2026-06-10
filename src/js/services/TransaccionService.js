import { supabase } from '../supabaseClient.js';
import { Transaccion } from '../models/Transaccion.js';
import { BaseService } from '../core/BaseService.js';
import { toDateStr, getMonthRange } from '../utils/dateUtils.js';
import { parseMoney } from '../utils/numberUtils.js';

export class TransaccionService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
    }

    async getAll(page = 1, pageSize = 100) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        const { data, error } = await supabase.from('transacciones').select('*').order('created_at', { ascending: false }).range(start, end);
        if (error) return this.handleError(error, []);
        return data.map(t => Transaccion.fromSupabase(t));
    }

    async getHoy() {
        const hoyStr = this.today();
        const { data, error } = await supabase.from('transacciones').select('*').eq('fecha', hoyStr);
        if (error) return this.handleError(error, []);
        return data.map(t => Transaccion.fromSupabase(t));
    }

    async crear(transaccionData) {
        const validTipos = ['ingreso', 'egreso'];
        if (!validTipos.includes(transaccionData.tipo)) {
            return this.handleError(new Error('Tipo debe ser "ingreso" o "egreso"'), null);
        }
        if (!transaccionData.monto || parseFloat(transaccionData.monto) <= 0) {
            return this.handleError(new Error('El monto debe ser mayor a 0'), null);
        }
        if (!transaccionData.concepto || !transaccionData.concepto.trim()) {
            return this.handleError(new Error('El concepto no puede estar vacío'), null);
        }
        const trans = new Transaccion(transaccionData);
        if (!trans.fecha) trans.fecha = this.today();
        if (!trans.hora) {
            const d = new Date();
            trans.hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }

        const { data, error } = await supabase.from('transacciones').insert([trans.toSupabase()]).select().single();
        if (error) return this.handleError(error, null);

        const newTrans = Transaccion.fromSupabase(data);
        this.emit('transaccion:created', newTrans);
        return newTrans;
    }

    async getResumenCaja() {
        const transHoy = await this.getHoy();
        if (!transHoy.length) return { ingresos: 0, salidas: 0, total: 0, numTransacciones: 0 };
        const ingresos = transHoy.filter(t => t.esIngreso).reduce((sum, t) => sum + t.monto, 0);
        const salidas = transHoy.filter(t => !t.esIngreso).reduce((sum, t) => sum + t.monto, 0);
        return { ingresos, salidas, total: ingresos - salidas, numTransacciones: transHoy.length };
    }

    async getIngresosMes(mes, anio) {
        const { startStr, endStr } = getMonthRange(mes, anio);
        const { data, error } = await supabase.from('transacciones')
            .select('monto')
            .eq('tipo', 'ingreso')
            .gte('fecha', startStr)
            .lte('fecha', endStr);

        if (error) return this.handleError(error, 0);
        return data.reduce((sum, t) => sum + parseMoney(t.monto), 0);
    }
}
