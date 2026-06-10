import { BaseService } from '../core/BaseService.js';
import { getLastNMonths, getMonthRange } from '../utils/dateUtils.js';

export class ReporteService extends BaseService {
    setServices(services) {
        this.services = services;
    }

    async generarDatos(filtros = {}) {
        const { fechaInicio, fechaFin } = filtros;

        const safe = (promise, fallback) =>
            promise.catch(err => {
                console.error('Reporte fetch error:', err);
                return fallback;
            });

        let [socios, transacciones, settings] = await Promise.all([
            safe(this.services.socio.getAll(), []),
            safe(this.services.transaccion.getAll(), []),
            safe(this.services.settings.get(), { brandColor: '#94ff00' })
        ]);

        if (fechaInicio && fechaFin) {
            transacciones = transacciones.filter(t => {
                if (!t.createdAt) return false;
                const d = new Date(t.createdAt);
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return dateStr >= fechaInicio && dateStr <= fechaFin;
            });
            socios = socios.filter(s => {
                return s.fechaRegistro && s.fechaRegistro >= fechaInicio && s.fechaRegistro <= fechaFin;
            });
        }

        const primaryColor = settings.brandColor || '#94ff00';
        const months = fechaInicio && fechaFin
            ? this._getMonthsInRange(new Date(fechaInicio + 'T00:00:00'), new Date(fechaFin + 'T00:00:00'))
            : getLastNMonths(6);

        const ingresosPorMes = this._agruparIngresos(transacciones, months);
        const sociosPorMes = this._agruparSocios(socios, months);
        const membresias = this._distribuirMembresias(socios);
        const topProductos = this._topProductos(transacciones);
        const metricas = this._calcularMetricas(socios, transacciones);

        return { ingresosPorMes, sociosPorMes, membresias, topProductos, metricas, primaryColor, settings };
    }

    _getMonthsInRange(startDate, endDate) {
        const months = [];
        const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        while (current <= endDate) {
            const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
            const label = current.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            months.push({ key, label, mes: current.getMonth() + 1, anio: current.getFullYear() });
            current.setMonth(current.getMonth() + 1);
        }
        return months;
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
        const planes = { Mensual: 0, Quincenal: 0, Diario: 0, Otros: 0 };
        socios.forEach(s => {
            if (planes[s.membresia] !== undefined) {
                planes[s.membresia]++;
            } else {
                planes.Otros++;
            }
        });
        return planes;
    }

    _topProductos(transacciones) {
        const productosVendidos = {};
        transacciones.forEach(t => {
            if (t.tipo === 'ingreso' && t.concepto && t.concepto.includes('Venta')) {
                const parts = t.concepto.split(':');
                if (parts.length > 1) {
                    const items = parts[1].trim().split(',');
                    items.forEach(item => {
                        try {
                            const match = item.trim().match(/(.+)\s+x(\d+)/);
                            if (match) {
                                const name = match[1].trim();
                                const qty = parseInt(match[2]);
                                productosVendidos[name] = (productosVendidos[name] || 0) + qty;
                            }
                        } catch (e) {
                            // skip unparseable item
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
