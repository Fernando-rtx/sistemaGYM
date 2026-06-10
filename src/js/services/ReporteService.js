import { BaseService } from '../core/BaseService.js';
import { getLastNMonths, getMonthRange } from '../utils/dateUtils.js';

export class ReporteService extends BaseService {
    async generarDatos() {
        const [socios, transacciones, settings] = await Promise.all([
            this.services.socio.getAll(),
            this.services.transaccion.getAll(),
            this.services.settings.get()
        ]);

        const primaryColor = settings.brandColor || '#94ff00';
        const months = getLastNMonths(6);

        const ingresosPorMes = this._agruparIngresos(transacciones, months);
        const sociosPorMes = this._agruparSocios(socios, months);
        const membresias = this._distribuirMembresias(socios);
        const topProductos = this._topProductos(transacciones);
        const metricas = this._calcularMetricas(socios, transacciones);

        return { ingresosPorMes, sociosPorMes, membresias, topProductos, metricas, primaryColor, settings };
    }

    _agruparIngresos(transacciones, months) {
        const map = {};
        months.forEach(m => { map[m.key] = 0; });

        transacciones.forEach(t => {
            if (t.tipo === 'ingreso' && t.createdAt) {
                const d = new Date(t.createdAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (map[key] !== undefined) {
                    map[key] += t.monto;
                }
            }
        });

        return {
            labels: months.map(m => m.label),
            data: months.map(m => map[m.key])
        };
    }

    _agruparSocios(socios, months) {
        const map = {};
        months.forEach(m => { map[m.key] = 0; });

        socios.forEach(s => {
            if (s.fechaRegistro) {
                const parts = s.fechaRegistro.split('-');
                if (parts.length === 3) {
                    const key = `${parts[0]}-${parts[1]}`;
                    if (map[key] !== undefined) map[key]++;
                }
            }
        });

        return {
            labels: months.map(m => m.label),
            data: months.map(m => map[m.key])
        };
    }

    _distribuirMembresias(socios) {
        const planes = { Mensual: 0, Quincenal: 0, Diario: 0 };
        socios.forEach(s => {
            if (planes[s.membresia] !== undefined) {
                planes[s.membresia]++;
            } else {
                planes.Mensual++;
            }
        });
        return planes;
    }

    _topProductos(transacciones) {
        const productosVendidos = {};
        transacciones.forEach(t => {
            if (t.tipo === 'ingreso' && t.concepto.includes('Venta')) {
                const parts = t.concepto.split(':');
                if (parts.length > 1) {
                    const items = parts[1].trim().split(',');
                    items.forEach(item => {
                        const match = item.trim().match(/(.+)\s+x(\d+)/);
                        if (match) {
                            const name = match[1].trim();
                            const qty = parseInt(match[2]);
                            productosVendidos[name] = (productosVendidos[name] || 0) + qty;
                        }
                    });
                }
            }
        });

        const sorted = Object.entries(productosVendidos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return { labels: sorted.map(x => x[0]), data: sorted.map(x => x[1]) };
    }

    _calcularMetricas(socios, transacciones) {
        const total = socios.length;
        const activos = socios.filter(s => s.estado === 'Activo' && !s.estaVencido).length;
        const tasa = total > 0 ? ((activos / total) * 100).toFixed(1) : '0.0';

        const ingresos = transacciones.filter(t => t.tipo === 'ingreso');
        const sumaIngresos = ingresos.reduce((sum, t) => sum + t.monto, 0);
        const promedio = ingresos.length > 0 ? (sumaIngresos / ingresos.length).toFixed(2) : '0.00';

        return {
            tasaRenovacion: `${tasa}%`,
            totalTickets: transacciones.length,
            valorMedio: `$${promedio}`
        };
    }
}
