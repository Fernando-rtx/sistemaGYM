import { BaseService } from '../core/BaseService.js';

export class DashboardService extends BaseService {
    setServices(services) {
        this.services = services;
    }

    async getDashboardData() {
        const [
            settings,
            socios,
            caja,
            checkinsHoy,
            checkins,
            nuevosHoy,
            porVencer
        ] = await Promise.all([
            this.services.settings.get(),
            this.services.socio.getAll(),
            this.services.transaccion.getResumenCaja(),
            this.services.checkin.getHoy(),
            this.services.checkin.getAll(),
            this.services.socio.getNuevosHoy(),
            this.services.socio.getPorVencer(6)
        ]);

        const rachas = await this.services.checkin.calcularRachas(checkins);

        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anoActual = hoy.getFullYear();

        const activos = socios.filter(s => s.estado === 'Activo' && !s.estaVencido);
        const vencidos = socios.filter(s => s.estaVencido);
        const ausentes = socios.filter(s => this.services.checkin.esAusente(s, checkins));
        const alertas = porVencer.filter(p => !p.estaVencido)
            .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));

        const ingresosMes = socios.reduce((sum, s) => sum + parseFloat(s.precio || 0), 0);

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
