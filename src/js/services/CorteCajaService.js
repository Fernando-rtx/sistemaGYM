import { supabase } from '../supabaseClient.js';

export class CorteCajaService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async guardarCorte(resumen) {
        const insertData = {
            fecha: new Date().toISOString().split('T')[0],
            ingresos: parseFloat(resumen.ingresos || 0),
            salidas: parseFloat(resumen.salidas || 0),
            total: parseFloat(resumen.total || 0),
            num_transacciones: parseInt(resumen.numTransacciones || 0)
        };

        const { data, error } = await supabase.from('cortes_caja').insert([insertData]).select().single();
        if (error) {
            console.error('Error saving cash register cut:', error);
            return null;
        }

        if (this.eventBus) {
            this.eventBus.emit('corte:created', data);
        }
        return data;
    }

    async getHistorial() {
        const { data, error } = await supabase.from('cortes_caja')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(30);
            
        if (error) {
            console.error('Error fetching cash register cuts:', error);
            return [];
        }

        return data.map(c => ({
            id: c.id,
            fecha: c.fecha,
            ingresos: parseFloat(c.ingresos),
            salidas: parseFloat(c.salidas),
            total: parseFloat(c.total),
            numTransacciones: c.num_transacciones,
            createdAt: c.created_at
        }));
    }
}
