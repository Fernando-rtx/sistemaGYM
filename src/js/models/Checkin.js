export class Checkin {
    constructor({ id, socioId, nombreSocio, fecha, hora, createdAt }) {
        this.id = id;
        this.socioId = socioId;
        this.nombreSocio = nombreSocio || 'Socio';
        this.fecha = fecha;
        this.hora = hora;
        this.createdAt = createdAt;
    }

    static fromSupabase(row) {
        return new Checkin({
            id: row.id,
            socioId: row.socio_id,
            nombreSocio: row.socios ? row.socios.nombre : (row.nombre_socio || 'Socio'),
            fecha: row.fecha,
            hora: row.hora,
            createdAt: row.created_at
        });
    }
}
