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
        const allowed = ['nombre', 'precio', 'stock', 'costo', 'proveedor', 'categoria', 'descripcion'];
        const updateData = {};
        for (const key of allowed) {
            if (changes[key] !== undefined) updateData[key] = changes[key];
        }
        if (Object.keys(updateData).length === 0) return this.handleError(new Error('No hay campos válidos para actualizar'), null);
        const { data, error } = await supabase.from('inventario').update(updateData).eq('id', id).select().single();
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
        if (cantidad <= 0) return false;
        for (let attempt = 0; attempt < 3; attempt++) {
            const { data: product, error: readErr } = await supabase
                .from('inventario')
                .select('stock')
                .eq('id', id)
                .single();
            if (readErr || !product || product.stock < cantidad) return false;
            const { data, error } = await supabase
                .from('inventario')
                .update({ stock: product.stock - cantidad })
                .eq('id', id)
                .eq('stock', product.stock)
                .select()
                .single();
            if (data) {
                const updatedProd = Producto.fromSupabase(data);
                this.emit('producto:updated', updatedProd);
                return true;
            }
        }
        return false;
    }
}
