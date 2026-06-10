import { supabase } from '../supabaseClient.js';
import { BaseService } from '../core/BaseService.js';
import { parseMoney } from '../utils/numberUtils.js';
import { getMonthRange } from '../utils/dateUtils.js';

export class RenovacionService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
    }

    async registrar(socioId, planAnterior, planNuevo, monto) {
        const validPlans = ['Mensual', 'Quincenal', 'Diario'];
        if (planNuevo && !validPlans.includes(planNuevo)) {
            return this.handleError(new Error('Plan no válido. Use: Mensual, Quincenal o Diario'), null);
        }
        if (planAnterior && !validPlans.includes(planAnterior)) {
            return this.handleError(new Error('Plan anterior no válido. Use: Mensual, Quincenal o Diario'), null);
        }
        const insertData = {
            socio_id: socioId,
            plan_anterior: planAnterior,
            plan_nuevo: planNuevo,
            monto: parseMoney(monto),
            fecha: this.today()
        };

        const { data, error } = await supabase.from('historial_renovaciones').insert([insertData]).select().single();
        if (error) return this.handleError(error, null);

        this.emit('renovacion:created', data);
        return {
            id: data.id,
            socioId: data.socio_id,
            planAnterior: data.plan_anterior,
            planNuevo: data.plan_nuevo,
            monto: parseMoney(data.monto),
            fecha: data.fecha
        };
    }

    async getHistorial(socioId) {
        const { data, error } = await supabase.from('historial_renovaciones')
            .select('*')
            .eq('socio_id', socioId)
            .order('fecha', { ascending: false });

        if (error) return this.handleError(error, []);
        return data.map(r => ({
            id: r.id,
            socioId: r.socio_id,
            planAnterior: r.plan_anterior,
            planNuevo: r.plan_nuevo,
            monto: parseMoney(r.monto),
            fecha: r.fecha
        }));
    }

    async getTasaRenovacion(mes, anio) {
        const { startStr, endStr } = getMonthRange(mes, anio);

        const { data: renewals, error: rErr } = await supabase.from('historial_renovaciones')
            .select('socio_id')
            .gte('fecha', startStr)
            .lte('fecha', endStr);

        const { data: vencidos, error: vErr } = await supabase.from('socios')
            .select('id')
            .gte('fecha_vencimiento', startStr)
            .lte('fecha_vencimiento', endStr);

        if (rErr) {
            this.logError('getTasaRenovacion renewals', rErr);
            return 0;
        }
        if (vErr) {
            this.logError('getTasaRenovacion vencidos', vErr);
            return 0;
        }

        const renewIds = new Set(renewals.map(r => r.socio_id));
        const vencidoIds = new Set(vencidos.map(v => v.id));
        const renovaron = [...renewIds].filter(id => vencidoIds.has(id)).length;
        const totalVencidos = vencidoIds.size;

        if (totalVencidos === 0) return 'N/A';

        return Math.min(100, Math.round((renovaron / totalVencidos) * 100));
    }
}
