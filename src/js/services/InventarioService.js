import { supabase } from '../supabaseClient.js';
import { Producto } from '../models/Producto.js';
import { BaseService } from '../core/BaseService.js';

export class InventarioService extends BaseService {
    constructor(eventBus) {
        super(eventBus);
    }

    async getAll() {
        const { data, error } = await supabase.from('inventario').select('*').order('nombre', { ascending: true });
        if (error) return this.handleError(error, []);
        return data.map(p => Producto.fromSupabase(p));
    }

    async create(productoData) {
        const prod = new Producto(productoData);
        const { data, error } = await supabase.from('inventario').insert([prod.toSupabase()]).select().single();
        if (error) return this.handleError(error, null);
        const newProd = Producto.fromSupabase(data);
        this.emit('producto:created', newProd);
        return newProd;
    }

    async update(id, changes) {
        const { data, error } = await supabase.from('inventario').update(changes).eq('id', id).select().single();
        if (error) return this.handleError(error, null);
        const updatedProd = Producto.fromSupabase(data);
        this.emit('producto:updated', updatedProd);
        return updatedProd;
    }

    async delete(id) {
        const { error } = await supabase.from('inventario').delete().eq('id', id);
        if (error) return this.handleError(error, false);
        this.emit('producto:deleted', id);
        return true;
    }

    async restarStock(id, cantidad) {
        const { data: current, error: getErr } = await supabase.from('inventario').select('stock').eq('id', id).single();
        if (getErr || !current) return false;

        const newStock = Math.max(0, current.stock - cantidad);
        const { data, error } = await supabase.from('inventario').update({ stock: newStock }).eq('id', id).select().single();
        if (error) return false;

        const updatedProd = Producto.fromSupabase(data);
        this.emit('producto:updated', updatedProd);
        return true;
    }
}
