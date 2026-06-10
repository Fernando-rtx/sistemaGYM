import { BaseService } from '../core/BaseService.js';

export class DashboardService extends BaseService {
    setServices(services) {
        this.services = services;
    }

    async getDashboardData() {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const anoActual = hoy.getFullYear();

        const safe = (promise, fallback) =>
            promise.catch(err => {
                console.error('Dashboard fetch error:', err);
                return fallback;
            });

        const [
            settings,
            socios,
            caja,
            checkinsHoy,
            checkins,
            nuevosHoy,
            porVencer,
            ingresosMes
        ] = await Promise.all([
            safe(this.services.settings.get(), null),
            safe(this.services.socio.getAll(), []),
            safe(this.services.transaccion.getResumenCaja(), { ingresos: 0, salidas: 0, total: 0, numTransacciones: 0 }),
            safe(this.services.checkin.getHoy(), []),
            safe(this.services.checkin.getAll(), []),
            safe(this.services.socio.getNuevosHoy(), 0),
            safe(this.services.socio.getPorVencer(6), []),
            safe(this.services.transaccion.getIngresosMes(mesActual, anoActual), 0)
        ]);

        const rachas = await safe(this.services.checkin.calcularRachas(checkins || []), []);

        const activos = (socios || []).filter(s => s.estado === 'Activo' && !s.estaVencido);
        const vencidos = (socios || []).filter(s => s.estaVencido);
        const ausentes = (socios || []).filter(s => this.services.checkin.esAusente(s, checkins || []));
        const alertas = (porVencer || []).filter(p => !p.estaVencido)
            .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));

        return {
            settings,
            socios: socios || [],
            caja,
            checkinsHoy: checkinsHoy || [],
            checkins: checkins || [],
            nuevosHoy,
            porVencer: porVencer || [],
            rachas,
            activos: activos.length,
            vencidos: vencidos.length,
            ausentes: ausentes.length,
            alertas,
            rachaRecord: (rachas || []).length > 0 ? rachas[0].racha : 0,
            ingresosMes,
            totalSocios: (socios || []).length
        };
    }
}
