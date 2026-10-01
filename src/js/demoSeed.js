// Entirely fictional records. Dates are relative to the first visit.
const date = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function createDemoData() {
    const names = ['Camila Rodríguez', 'Diego Hernández', 'Valeria López', 'Andrés Martínez',
        'Sofía Morales', 'Mateo Flores', 'Lucía Castro', 'Gabriel Rivera', 'Daniela Pérez',
        'Carlos Méndez', 'Mariana Torres', 'Javier Santos', 'Ana Rivas', 'Pablo Castillo',
        'Elena Ramírez', 'Luis Molina'];
    const remaining = [18, 23, 3, 27, -6, 12, 5, 19, -2, 4, 15, 21, -10, 8, 26, 11];
    const socios = names.map((nombre, i) => ({
        id: `demo${String(i + 1).padStart(2, '0')}`, nombre, telefono: '', edad: 22 + i, activo: true,
        membresia: i % 4 === 0 ? 'Quincenal' : 'Mensual',
        precio: i % 4 === 0 ? 10 : 20,
        fecha_registro: date(i === 15 ? 0 : -30 - i * 8),
        fecha_vencimiento: date(remaining[i]),
        estado: i === 14 ? 'Congelado' : remaining[i] < 0 ? 'Vencido' : 'Activo',
        deuda: i === 4 ? 5 : 0, notas: 'Registro ficticio de la demo.',
        fecha_congelado: i === 14 ? date(-2) : null,
        dias_congelado: i === 14 ? 26 : 0, foto_url: null,
        created_at: `${date(-30 - i * 8)}T09:00:00`
    }));
    const checkins = [];
    for (let ago = 0; ago < 14; ago++) {
        socios.slice(0, ago === 0 ? 3 : 5 + ago % 4).forEach((socio, i) => {
            if (socio.estado !== 'Activo') return;
            checkins.push({ id: `demo-checkin-${ago}-${i}`, socio_id: socio.id,
                fecha: date(-ago), hora: `0${6 + i % 3}:${String(10 + i * 7).padStart(2, '0')}`,
                created_at: `${date(-ago)}T08:${String(i * 7).padStart(2, '0')}:00` });
        });
    }
    const inventario = [
        {id: 'demo-prod-1', nombre: 'Agua 600 ml', precio: 0.75, stock: 28, icono: 'water_drop', color: '#38bdf8'},
        {id: 'demo-prod-2', nombre: 'Bebida isotónica', precio: 1.50, stock: 16, icono: 'local_drink', color: '#f59e0b'},
        {id: 'demo-prod-3', nombre: 'Barra de proteína', precio: 2.25, stock: 12, icono: 'fitness_center', color: '#94ff00'},
        {id: 'demo-prod-4', nombre: 'Toalla deportiva', precio: 4, stock: 5, icono: 'checkroom', color: '#a78bfa'}
    ];
    const transacciones = [];
    for (let ago = 0; ago < 6; ago++) {
        const d = new Date();
        d.setDate(5);
        d.setMonth(d.getMonth() - ago);
        const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-05`;
        transacciones.push({id: `demo-trans-m${ago}`, tipo: 'ingreso', concepto: 'Membresías de ejemplo',
            monto: 160 + (5 - ago) * 25, fecha, hora: '10:00', created_at: `${fecha}T10:00:00`});
    }
    [
        ['ingreso', 'Renovación de muestra · Mensual', 20],
        ['ingreso', 'Venta de Agua 600 ml (x2)', 1.50],
        ['ingreso', 'Venta de Barra de proteína (x1)', 2.25],
        ['egreso', 'Suministros de muestra', 6]
    ].forEach(([tipo, concepto, monto], i) => transacciones.push({
        id: `demo-trans-hoy-${i}`, tipo, concepto, monto, fecha: date(),
        hora: `08:${String(i * 10).padStart(2, '0')}`, created_at: `${date()}T08:${String(i * 10).padStart(2, '0')}:00`
    }));
    return {
        socios, checkins, inventario, transacciones,
        ajustes: [{id: 1, brand_name: 'sistemaGYM', brand_color: '#94ff00',
            precios: {Diario: 3, Mensual: 20, Quincenal: 10}}],
        historial_renovaciones: [{id: 'demo-renovacion-1', socio_id: socios[0].id,
            plan_anterior: 'Mensual', plan_nuevo: 'Mensual', monto: 20, fecha: date(), created_at: `${date()}T08:00:00`}],
        cortes_caja: []
    };
}
