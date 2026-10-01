export class Producto {
    constructor({ id, nombre, precio, stock, icono, color }) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio || 0);
        this.stock = parseInt(stock || 0);
        this.icono = icono || 'shopping_bag';
        this.color = color || 'var(--color-primary)';
    }

    get agotado() {
        return this.stock <= 0;
    }

    static fromSupabase(row) {
        return new Producto({
            id: row.id,
            nombre: row.nombre,
            precio: row.precio,
            stock: row.stock,
            icono: row.icono,
            color: row.color
        });
    }

    toSupabase() {
        const data = {
            nombre: this.nombre,
            precio: this.precio,
            stock: this.stock,
            icono: this.icono,
            color: this.color
        };
        if (this.id) data.id = this.id;
        return data;
    }
}
