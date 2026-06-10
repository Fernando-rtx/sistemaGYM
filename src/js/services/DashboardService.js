import { BaseService } from '../core/BaseService.js';

export class DashboardService extends BaseService {
    setServices(services) {
        this.services = services;
    }

    async getDashboardData() {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const anoActual = hoy.getFullYear();

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
            this.services.settings.get(),
            this.services.socio.getAll(),
            this.services.transaccion.getResumenCaja(),
            this.services.checkin.getHoy(),
            this.services.checkin.getAll(),
            this.services.socio.getNuevosHoy(),
            this.services.socio.getPorVencer(6),
            this.services.transaccion.getIngresosMes(mesActual, anoActual)
        ]);

        const rachas = await this.services.checkin.calcularRachas(checkins);

        const activos = socios.filter(s => s.estado === 'Activo' && !s.estaVencido);
        const vencidos = socios.filter(s => s.estaVencido);
        const ausentes = socios.filter(s => this.services.checkin.esAusente(s, checkins));
        const alertas = porVencer.filter(p => !p.estaVencido)
            .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));

        return {
            settings,
            socios,
            caja,
            checkinsHoy,
            checkins,
            nuevosHoy,
            porVencer,
            rachas,
            activos: activos.length,
            vencidos: vencidos.length,
            ausentes: ausentes.length,
            alertas,
            rachaRecord: rachas.length > 0 ? rachas[0].racha : 0,
            ingresosMes,
            totalSocios: socios.length
        };
    }
}
