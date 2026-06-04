import { supabase } from '../supabaseClient.js';

export class RenovacionService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async registrar(socioId, planAnterior, planNuevo, monto) {
        const insertData = {
            socio_id: socioId,
            plan_anterior: planAnterior,
            plan_nuevo: planNuevo,
            monto: parseFloat(monto || 0),
            fecha: new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase.from('historial_renovaciones').insert([insertData]).select().single();
        if (error) {
            console.error('Error inserting renewal history:', error);
            return null;
        }

        if (this.eventBus) {
            this.eventBus.emit('renovacion:created', data);
        }
        return data;
    }

    async getHistorial(socioId) {
        const { data, error } = await supabase.from('historial_renovaciones')
            .select('*')
            .eq('socio_id', socioId)
            .order('fecha', { ascending: false });
            
        if (error) {
            console.error('Error fetching renewal history:', error);
            return [];
        }
        return data.map(r => ({
            id: r.id,
            socioId: r.socio_id,
            planAnterior: r.plan_anterior,
            planNuevo: r.plan_nuevo,
            monto: parseFloat(r.monto),
            fecha: r.fecha
        }));
    }

    async getTasaRenovacion(mes, anio) {
        const startStr = `${anio}-${String(mes).padStart(2, '0')}-01`;
        const end = new Date(anio, mes, 0);
        const endStr = `${anio}-${String(mes).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

        const { data: renewals, error: rErr } = await supabase.from('historial_renovaciones')
            .select('socio_id')
            .gte('fecha', startStr)
            .lte('fecha', endStr);
            
        const { data: vencidos, error: vErr } = await supabase.from('socios')
            .select('id')
            .gte('fecha_vencimiento', startStr)
            .lte('fecha_vencimiento', endStr);

        if (rErr || vErr) return 0;
        
        const uniqueRenews = new Set(renewals.map(r => r.socio_id)).size;
        const totalVencidos = vencidos.length;
        
        const totalTarget = uniqueRenews + totalVencidos;
        if (totalTarget === 0) return 100;
        
        return Math.min(100, Math.round((uniqueRenews / totalTarget) * 100));
    }
}
