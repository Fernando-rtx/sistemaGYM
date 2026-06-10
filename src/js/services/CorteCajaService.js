import { supabase } from '../supabaseClient.js';
import { BaseService } from '../core/BaseService.js';
import { parseMoney, safeInt } from '../utils/numberUtils.js';

export class CorteCajaService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
    }

    async guardarCorte(resumen) {
        const hoy = this.today();

        // Validate numeric fields
        const ingresos = parseMoney(resumen.ingresos);
        const salidas = parseMoney(resumen.salidas);
        const total = parseMoney(resumen.total);
        const numTransacciones = safeInt(resumen.numTransacciones);

        if (!isFinite(ingresos) || !isFinite(salidas) || !isFinite(total) || !isFinite(numTransacciones)) {
            return this.handleError(new Error('Los valores del resumen deben ser números finitos'), null);
        }

        // Prevent duplicate date
        const { data: existing } = await supabase.from('cortes_caja').select('id').eq('fecha', hoy).maybeSingle();
        if (existing) {
            return this.handleError(new Error('Ya existe un corte de caja para hoy'), null);
        }

        const insertData = {
            fecha: hoy,
            ingresos,
            salidas,
            total,
            num_transacciones: numTransacciones
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
