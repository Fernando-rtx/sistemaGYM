import { supabase } from '../supabaseClient.js';
import { BaseService } from '../core/BaseService.js';
import { parseMoney, safeInt } from '../utils/numberUtils.js';

export class CorteCajaService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
    }

    async guardarCorte(resumen) {
        const insertData = {
            fecha: this.today(),
            ingresos: parseMoney(resumen.ingresos),
            salidas: parseMoney(resumen.salidas),
            total: parseMoney(resumen.total),
            num_transacciones: safeInt(resumen.numTransacciones)
        };

        const { data, error } = await supabase.from('cortes_caja').insert([insertData]).select().single();
        if (error) return this.handleError(error, null);

        this.emit('corte:created', data);
        return {
            id: data.id,
            fecha: data.fecha,
            ingresos: parseMoney(data.ingresos),
            salidas: parseMoney(data.salidas),
            total: parseMoney(data.total),
            numTransacciones: data.num_transacciones,
            createdAt: data.created_at
        };
    }

    async getHistorial() {
        const { data, error } = await supabase.from('cortes_caja')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(30);

        if (error) return this.handleError(error, []);

        return data.map(c => ({
            id: c.id,
            fecha: c.fecha,
            ingresos: parseMoney(c.ingresos),
            salidas: parseMoney(c.salidas),
            total: parseMoney(c.total),
            numTransacciones: c.num_transacciones,
            createdAt: c.created_at
        }));
    }
}
