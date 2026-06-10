import { DIAS_POR_VENCER } from '../utils/constants.js';

export class Socio {
    constructor({ id, nombre, telefono, edad, membresia, precio, fechaRegistro, fechaVencimiento, estado, deuda, createdAt }) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono || '';
        this.edad = edad || null;
        this.membresia = membresia;
        this.precio = parseFloat(precio || 0);
        this.fechaRegistro = fechaRegistro;
        this.fechaVencimiento = fechaVencimiento;
        this.estado = estado || 'Activo';
        this.deuda = parseFloat(deuda || 0);
        this.createdAt = createdAt;
    }

    get estaVencido() {
        if (!this.fechaVencimiento) return true;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fVenc = new Date(this.fechaVencimiento + "T00:00:00");
        return fVenc < hoy;
    }

    get diasRestantes() {
        if (!this.fechaVencimiento) return 0;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fVenc = new Date(this.fechaVencimiento + "T00:00:00");
        return Math.ceil((fVenc - hoy) / (1000 * 60 * 60 * 24));
    }

    get estaPorVencer() {
        const dias = this.diasRestantes;
        return dias <= DIAS_POR_VENCER && dias >= 0;
    }

    get iniciales() {
        if (!this.nombre) return '';
        const parts = this.nombre.trim().split(/\s+/);
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return this.nombre.substring(0, 2).toUpperCase();
    }

    get telefonoLimpio() {
        return this.telefono ? this.telefono.replace(/[^0-9]/g, '') : '';
    }

    static fromSupabase(row) {
        return new Socio({
            id: row.id,
            nombre: row.nombre,
            telefono: row.telefono,
            edad: row.edad,
            membresia: row.membresia,
            precio: row.precio,
            fechaRegistro: row.fecha_registro,
            fechaVencimiento: row.fecha_vencimiento,
            estado: row.estado,
            deuda: row.deuda,
            createdAt: row.created_at
        });
    }

    toSupabase() {
        const data = {
            nombre: this.nombre,
            telefono: this.telefono,
            edad: this.edad,
            membresia: this.membresia,
            precio: this.precio,
            fecha_registro: this.fechaRegistro,
            fecha_vencimiento: this.fechaVencimiento,
            estado: this.estado,
            deuda: this.deuda
        };
        if (this.id) data.id = this.id;
        return data;
    }

    static formatFecha(dateStr) {
        if (!dateStr || dateStr === 'Próximo mes') return dateStr;
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parseInt(parts[2])} ${meses[parseInt(parts[1]) - 1]}`;
    }

    static calcularVencimiento(plan) {
        const d = new Date();
        switch (plan) {
            case 'Mensual': d.setDate(d.getDate() + 30); break;
            case 'Quincenal': d.setDate(d.getDate() + 15); break;
            case 'Diario': d.setDate(d.getDate() + 1); break;
            default: d.setDate(d.getDate() + 30);
        }
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
}
