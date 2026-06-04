export class Transaccion {
    constructor({ id, tipo, concepto, monto, fecha, hora, createdAt }) {
        this.id = id;
        this.tipo = tipo;
        this.concepto = concepto;
        this.monto = parseFloat(monto || 0);
        this.fecha = fecha;
        this.hora = hora;
        this.createdAt = createdAt;
    }

    get esIngreso() {
        return this.tipo === 'ingreso';
    }

    static fromSupabase(row) {
        return new Transaccion({
            id: row.id,
            tipo: row.tipo,
            concepto: row.concepto,
            monto: row.monto,
            fecha: row.fecha,
            hora: row.hora,
            createdAt: row.created_at
        });
    }

    toSupabase() {
        const data = {
            tipo: this.tipo,
            concepto: this.concepto,
            monto: this.monto,
            fecha: this.fecha,
            hora: this.hora
        };
        if (this.id) data.id = this.id;
        return data;
    }
}
