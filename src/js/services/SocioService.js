import { supabase } from '../supabaseClient.js';
import { Socio } from '../models/Socio.js';

export class SocioService {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    async getAll() {
        const { data, error } = await supabase.from('socios').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error(error);
            return [];
        }
        
        const hoyStr = new Date().toISOString().split('T')[0];
        
        const socios = [];
        for (const s of data) {
            let estadoReal = s.estado;
            if (estadoReal === 'Activo' && s.fecha_vencimiento < hoyStr) {
                estadoReal = 'Vencido';
                await supabase.from('socios').update({ estado: 'Vencido' }).eq('id', s.id);
            }
            socios.push(Socio.fromSupabase({ ...s, estado: estadoReal }));
        }
        
        return socios;
    }

    async getById(id) {
        const { data, error } = await supabase.from('socios').select('*').eq('id', id).single();
        if (error || !data) return null;
        
        let estadoReal = data.estado;
        const hoyStr = new Date().toISOString().split('T')[0];
        if (estadoReal === 'Activo' && data.fecha_vencimiento < hoyStr) {
            estadoReal = 'Vencido';
            await supabase.from('socios').update({ estado: 'Vencido' }).eq('id', data.id);
        }
        
        return Socio.fromSupabase({ ...data, estado: estadoReal });
    }

    async create(socioData) {
        const socio = new Socio(socioData);
        const { data, error } = await supabase.from('socios').insert([socio.toSupabase()]).select().single();
        if (error) {
            console.error(error);
            return null;
        }
        const newSocio = Socio.fromSupabase(data);
        if (this.eventBus) {
            this.eventBus.emit('socio:created', newSocio);
        }
        return newSocio;
    }

    async update(id, changes) {
        const updateData = {};
        if (changes.nombre !== undefined) updateData.nombre = changes.nombre;
        if (changes.telefono !== undefined) updateData.telefono = changes.telefono;
        if (changes.edad !== undefined) updateData.edad = changes.edad;
        if (changes.membresia !== undefined) updateData.membresia = changes.membresia;
        if (changes.precio !== undefined) updateData.precio = changes.precio;
        if (changes.fechaRegistro !== undefined) updateData.fecha_registro = changes.fechaRegistro;
        if (changes.fechaVencimiento !== undefined) updateData.fecha_vencimiento = changes.fechaVencimiento;
        if (changes.estado !== undefined) updateData.estado = changes.estado;
        if (changes.deuda !== undefined) updateData.deuda = changes.deuda;

        const { data, error } = await supabase.from('socios').update(updateData).eq('id', id).select().single();
        if (error) {
            console.error(error);
            return null;
        }
        const updatedSocio = Socio.fromSupabase(data);
        if (this.eventBus) {
            this.eventBus.emit('socio:updated', updatedSocio);
        }
        return updatedSocio;
    }

    async delete(id) {
        const socio = await this.getById(id);
        if (socio) {
            const concepto = `Membresía ${socio.membresia} - ${socio.nombre}`;
            const hoyStr = new Date().toISOString().split('T')[0];
            await supabase.from('transacciones').delete().match({ 
                concepto: concepto, 
                fecha: hoyStr, 
                monto: socio.precio 
            });
        }

        const { error } = await supabase.from('socios').delete().eq('id', id);
        if (error) {
            console.error(error);
            return false;
        }
        if (this.eventBus) {
            this.eventBus.emit('socio:deleted', id);
        }
        return true;
    }

    async getPorVencer(dias = 6) {
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
        return data.map(s => Socio.fromSupabase(s));
    }

    async getNuevosHoy() {
        const hoyStr = new Date().toISOString().split('T')[0];
        const { count, error } = await supabase.from('socios').select('*', { count: 'exact', head: true }).eq('fecha_registro', hoyStr);
        if (error) return 0;
        return count;
    }
}
