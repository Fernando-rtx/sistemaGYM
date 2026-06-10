import { supabase } from '../supabaseClient.js';
import { Socio } from '../models/Socio.js';
import { BaseService } from '../core/BaseService.js';

export class SocioService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
    }

    async getAll() {
        const { data, error } = await supabase.from('socios').select('*').order('created_at', { ascending: false });
        if (error) return this.handleError(error, []);
        return data.map(s => Socio.fromSupabase(s));
    }

    async getById(id) {
        const { data, error } = await supabase.from('socios').select('*').eq('id', id).single();
        if (error || !data) return null;
        return Socio.fromSupabase(data);
    }

    async sincronizarEstados() {
        const hoyStr = this.today();
        const { data, error } = await supabase.from('socios')
            .select('id')
            .eq('estado', 'Activo')
            .lt('fecha_vencimiento', hoyStr);
        if (error) {
            this.logError('sincronizarEstados', error);
            return;
        }
        for (const s of data || []) {
            await supabase.from('socios').update({ estado: 'Vencido' }).eq('id', s.id);
        }
    }

    async create(socioData) {
        const socio = new Socio(socioData);
        const { data, error } = await supabase.from('socios').insert([socio.toSupabase()]).select().single();
        if (error) return this.handleError(error, null);
        const newSocio = Socio.fromSupabase(data);
        this.emit('socio:created', newSocio);
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
        if (changes.notas !== undefined) updateData.notas = changes.notas;
        if (changes.fecha_congelado !== undefined) updateData.fecha_congelado = changes.fecha_congelado;
        if (changes.dias_congelado !== undefined) updateData.dias_congelado = changes.dias_congelado;
        if (changes.foto_url !== undefined) updateData.foto_url = changes.foto_url;

        const { data, error } = await supabase.from('socios').update(updateData).eq('id', id).select().single();
        if (error) return this.handleError(error, null);
        const updatedSocio = Socio.fromSupabase(data);
        this.emit('socio:updated', updatedSocio);
        return updatedSocio;
    }

    async freeze(id) {
        const socio = await this.getById(id);
        if (!socio) return null;
        const hoy = this.today();
        const updated = await this.update(id, {
            estado: 'Congelado',
            fecha_congelado: hoy,
            dias_congelado: Math.max(0, socio.diasRestantes)
        });
        return updated;
    }

    async unfreeze(id) {
        const socio = await this.getById(id);
        if (!socio) return null;
        const diasCongelado = socio.dias_congelado || 0;
        const hoy = new Date();
        const nuevoVenc = new Date();
        nuevoVenc.setDate(hoy.getDate() + diasCongelado);
        const vencStr = `${nuevoVenc.getFullYear()}-${String(nuevoVenc.getMonth() + 1).padStart(2, '0')}-${String(nuevoVenc.getDate()).padStart(2, '0')}`;
        const updated = await this.update(id, {
            estado: 'Activo',
            fecha_congelado: null,
            dias_congelado: 0,
            fechaVencimiento: vencStr
        });
        return updated;
    }

    async uploadPhoto(socioId, file) {
        const ext = file.name.split('.').pop() || 'jpg';
        const filePath = `${socioId}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('socios').upload(filePath, file, { upsert: true });
        if (uploadError) return this.handleError(uploadError, null);
        const { data: { publicUrl } } = supabase.storage.from('socios').getPublicUrl(filePath);
        const updated = await this.update(socioId, { foto_url: publicUrl });
        return updated ? publicUrl : null;
    }

    async delete(id) {
        const { error } = await supabase.from('socios').delete().eq('id', id);
        if (error) return this.handleError(error, false);
        this.emit('socio:deleted', id);
        return true;
    }

    async getPorVencer(dias = 6) {
        const hoy = new Date();
        const limite = new Date();
        limite.setDate(hoy.getDate() + dias);

        const hoyStr = this.today();
        const limiteStr = `${limite.getFullYear()}-${String(limite.getMonth() + 1).padStart(2, '0')}-${String(limite.getDate()).padStart(2, '0')}`;

        const { data, error } = await supabase.from('socios')
            .select('*')
            .eq('estado', 'Activo')
            .gte('fecha_vencimiento', hoyStr)
            .lte('fecha_vencimiento', limiteStr);

        if (error) return this.handleError(error, []);
        return data.map(s => Socio.fromSupabase(s));
    }

    async getNuevosHoy() {
        const hoyStr = this.today();
        const { count, error } = await supabase.from('socios').select('*', { count: 'exact', head: true }).eq('fecha_registro', hoyStr);
        if (error) return this.handleError(error, 0);
        return count;
    }
}
