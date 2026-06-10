import { BaseView } from '../js/core/BaseView.js';

export class ReportesView extends BaseView {
    constructor(container, services, eventBus) {
        super(container, services, eventBus);
        this.charts = {};
        this.filtros = {};
    }

    getDefaultDesde() {
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        return d.toISOString().split('T')[0];
    }

    getDefaultHasta() {
        return new Date().toISOString().split('T')[0];
    }

    getRangeLabel() {
        const { fechaInicio, fechaFin } = this.filtros;
        if (!fechaInicio && !fechaFin) return 'ÚLTIMOS 6 MESES';
        const fmt = (s) => {
            const d = new Date(s + 'T00:00:00');
            return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        };
        return `${fmt(fechaInicio)} — ${fmt(fechaFin)}`;
    }

    render() {
        return `
            <div class="reportes-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 class="view-title" style="margin: 0; font-size: 24px; font-weight: 700;">Reportes y Estadísticas</h2>
                <button class="btn btn-primary" id="btnExportarPDF">
                    <span class="material-icons-round">picture_as_pdf</span> EXPORTAR REPORTE (PDF)
                </button>
            </div>

            <div class="filtro-fechas" style="display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; color: var(--color-text-secondary); font-weight: 600;">DESDE</label>
                    <input type="date" id="filtroFechaInicio" style="background: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 10px 14px; border-radius: var(--border-radius-md); font-size: 14px;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 12px; color: var(--color-text-secondary); font-weight: 600;">HASTA</label>
                    <input type="date" id="filtroFechaFin" style="background: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 10px 14px; border-radius: var(--border-radius-md); font-size: 14px;">
                </div>
                <button class="btn btn-primary" id="btnAplicarFiltro" style="padding: 10px 24px; justify-content: center;">
                    <span class="material-icons-round" aria-hidden="true" style="font-size: 18px;">filter_alt</span> APLICAR
                </button>
                <span id="txtRangoLabel" style="font-size: 13px; color: var(--color-text-secondary); align-self: center; margin-left: 4px;"></span>
            </div>

            <div class="reportes-grid">
                <!-- Tarjeta 1: Gráfico de Ingresos Mensuales -->
                <div class="card chart-card">
                    <h3>INGRESOS HISTÓRICOS</h3>
                    <div class="chart-container" style="position: relative; height:250px; width:100%;">
                        <canvas id="chartIngresos"></canvas>
                    </div>
                </div>

                <!-- Tarjeta 2: Gráfico de Nuevos Socios por Mes -->
                <div class="card chart-card">
                    <h3>NUEVAS ALTAS DE SOCIOS</h3>
                    <div class="chart-container" style="position: relative; height:250px; width:100%;">
                        <canvas id="chartSocios"></canvas>
                    </div>
                </div>

                <!-- Tarjeta 3: Distribución de Membresías -->
                <div class="card chart-card">
                    <h3>DISTRIBUCIÓN DE MEMBRESÍAS</h3>
                    <div class="chart-container" style="position: relative; height:250px; width:100%;">
                        <canvas id="chartMembresias"></canvas>
                    </div>
                </div>

                <!-- Tarjeta 4: Productos Más Vendidos -->
                <div class="card chart-card">
                    <h3>PRODUCTOS MÁS VENDIDOS</h3>
                    <div class="chart-container" style="position: relative; height:250px; width:100%;">
                        <canvas id="chartProductos"></canvas>
                    </div>
                </div>
            </div>

            <!-- Resumen de Métricas -->
            <div class="metricas-resumen" style="margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                <div class="card metrica-box">
                    <div style="color: var(--color-text-secondary); font-size: 13px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">TASA DE RENOVACIÓN</div>
                    <div style="font-size: 32px; font-weight: 800; color: var(--color-primary);" id="txtTasaRenovacion">0.0%</div>
                    <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">Socios activos que renovaron su plan</div>
                </div>
                <div class="card metrica-box">
                    <div style="color: var(--color-text-secondary); font-size: 13px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">TICKETS DE CAJA EMITIDOS</div>
                    <div style="font-size: 32px; font-weight: 800; color: #00e5ff;" id="txtTotalTickets">0</div>
                    <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">Total transacciones históricas registradas</div>
                </div>
                <div class="card metrica-box">
                    <div style="color: var(--color-text-secondary); font-size: 13px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">VALOR MEDIO DE TRANSACCIÓN</div>
                    <div style="font-size: 32px; font-weight: 800; color: #ff007f;" id="txtValorMedio">$0.00</div>
                    <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">Promedio de monto por ingreso</div>
                </div>
            </div>

            <style>
                .reportes-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .chart-card h3 {
                    margin-bottom: 16px;
                    color: var(--color-text-secondary);
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                @media (max-width: 768px) {
                    .reportes-grid { grid-template-columns: 1fr; }
                    .metricas-resumen { grid-template-columns: 1fr; gap: 16px; }
                    .reportes-header { flex-direction: column; align-items: stretch !important; gap: 15px; }
                }
            </style>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();

        const btnExportar = this.$('#btnExportarPDF');
        if (btnExportar) {
            this.bindEvent(btnExportar, 'click', () => {
                this.exportarReporte();
            });
        }

        const inputDesde = this.$('#filtroFechaInicio');
        const inputHasta = this.$('#filtroFechaFin');
        if (inputDesde) inputDesde.value = this.getDefaultDesde();
        if (inputHasta) inputHasta.value = this.getDefaultHasta();

        const btnAplicar = this.$('#btnAplicarFiltro');
        if (btnAplicar) {
            this.bindEvent(btnAplicar, 'click', async () => {
                this.filtros = {
                    fechaInicio: inputDesde?.value || '',
                    fechaFin: inputHasta?.value || ''
                };
                if (!this.filtros.fechaInicio || !this.filtros.fechaFin) {
                    this.filtros = {};
                }
                await this.generarGraficos();
            });
        }

        // Cargar datos y renderizar gráficos
        await this.generarGraficos();
    }

    async generarGraficos() {
        Object.values(this.charts).forEach(c => c?.destroy());
        const data = await this.services.reporte.generarDatos(this.filtros);
        const { ingresosPorMes, sociosPorMes, membresias, topProductos, metricas, primaryColor } = data;

        const rangeLabel = this.getRangeLabel();
        const txtRango = this.$('#txtRangoLabel');
        if (txtRango) txtRango.textContent = rangeLabel;

        const headings = this.container.querySelectorAll('.chart-card h3');
        if (headings.length >= 1) headings[0].innerHTML = `INGRESOS <span style="color: var(--color-text-secondary); font-weight: 400;">${rangeLabel}</span>`;
        if (headings.length >= 2) headings[1].innerHTML = `ALTAS DE SOCIOS <span style="color: var(--color-text-secondary); font-weight: 400;">${rangeLabel}</span>`;

        this.renderIngresosChart(ingresosPorMes, primaryColor);
        this.renderSociosChart(sociosPorMes, primaryColor);
        this.renderMembresiasChart(membresias);
        this.renderProductosChart(topProductos, primaryColor);
        this.renderMetricas(metricas);
    }

    renderIngresosChart(ingresosPorMes, color) {
        const ctx = this.$('#chartIngresos')?.getContext('2d');
        if (!ctx) return;

        const { labels, data } = ingresosPorMes;

        this.charts.ingresos = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Ingresos ($)',
                    data,
                    borderColor: color,
                    backgroundColor: color + '1A', // opacity 10%
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: this.getChartOptions()
        });
    }

    renderSociosChart(sociosPorMes, color) {
        const ctx = this.$('#chartSocios')?.getContext('2d');
        if (!ctx) return;

        const { labels, data } = sociosPorMes;

        this.charts.socios = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Nuevos Socios',
                    data,
                    backgroundColor: color,
                    borderRadius: 6
                }]
            },
            options: this.getChartOptions()
        });
    }

    renderMembresiasChart(membresias) {
        const ctx = this.$('#chartMembresias')?.getContext('2d');
        if (!ctx) return;

        const planes = membresias;

        this.charts.membresias = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Mensual', 'Quincenal', 'Diario'],
                datasets: [{
                    data: [planes.Mensual, planes.Quincenal, planes.Diario],
                    backgroundColor: ['#94ff00', '#00e5ff', '#ff007f'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#8c8f9f', font: { family: 'Inter', size: 12 } }
                    }
                }
            }
        });
    }

    renderProductosChart(topProductos, color) {
        const ctx = this.$('#chartProductos')?.getContext('2d');
        if (!ctx) return;

        const labels = topProductos.labels;
        const data = topProductos.data;

        this.charts.productos = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.length > 0 ? labels : ['Ninguno'],
                datasets: [{
                    label: 'Unidades Vendidas',
                    data: data.length > 0 ? data : [0],
                    backgroundColor: '#ffaa00',
                    borderRadius: 6
                }]
            },
            options: this.getChartOptions()
        });
    }

    renderMetricas(metricas) {
        const txtTasa = this.$('#txtTasaRenovacion');
        if (txtTasa) txtTasa.textContent = metricas.tasaRenovacion;

        const txtTotal = this.$('#txtTotalTickets');
        if (txtTotal) txtTotal.textContent = metricas.totalTickets;

        const txtPromedio = this.$('#txtValorMedio');
        if (txtPromedio) txtPromedio.textContent = metricas.valorMedio;
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#8c8f9f', font: { family: 'Inter', size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8c8f9f', font: { family: 'Inter', size: 11 } }
                }
            }
        };
    }

    async exportarReporte() {
        const settings = await this.services.settings.get();
        const gymName = settings.brandName || 'NEXFIT';
        const brandColor = settings.brandColor || '#94ff00';

        const printWin = window.open('', '_blank', 'width=800,height=900');
        
        // Capturar imágenes base64 de los gráficos
        const imgIngresos = this.charts.ingresos?.toBase64Image() || '';
        const imgSocios = this.charts.socios?.toBase64Image() || '';
        const imgMembresias = this.charts.membresias?.toBase64Image() || '';
        const imgProductos = this.charts.productos?.toBase64Image() || '';

        const tasaRenovacion = this.$('#txtTasaRenovacion')?.textContent || '0.0%';
        const totalTickets = this.$('#txtTotalTickets')?.textContent || '0';
        const valorMedio = this.$('#txtValorMedio')?.textContent || '$0.00';

        printWin.document.write(`
            <html>
            <head>
                <title>Reporte de Rendimiento - ${gymName}</title>
                <style>
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        color: #1f2937;
                        padding: 40px;
                        background: #ffffff;
                    }
                    .header {
                        border-bottom: 2px solid ${brandColor};
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 800;
                        color: #111827;
                    }
                    .header p {
                        margin: 5px 0 0 0;
                        color: #6b7280;
                    }
                    .metrics-container {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .metric-box {
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: center;
                    }
                    .metric-title {
                        font-size: 12px;
                        font-weight: 700;
                        color: #6b7280;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        margin-bottom: 10px;
                    }
                    .metric-value {
                        font-size: 24px;
                        font-weight: 800;
                        color: #111827;
                    }
                    .charts-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 30px;
                    }
                    .chart-card {
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: center;
                    }
                    .chart-card h3 {
                        margin-top: 0;
                        margin-bottom: 15px;
                        font-size: 14px;
                        color: #374151;
                        border-bottom: 1px solid #f3f4f6;
                        padding-bottom: 10px;
                    }
                    .chart-img {
                        max-width: 100%;
                        height: 200px;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>REPORTE DE RENDIMIENTO</h1>
                        <p>${gymName.toUpperCase()} GYM</p>
                    </div>
                    <div style="text-align: right; color: #6b7280; font-size: 14px;">
                        Fecha: ${new Date().toLocaleDateString('es-ES')}<br>
                        Generado automáticamente
                    </div>
                </div>

                <div class="metrics-container">
                    <div class="metric-box">
                        <div class="metric-title">Tasa de Renovación</div>
                        <div class="metric-value">${tasaRenovacion}</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-title">Transacciones Registradas</div>
                        <div class="metric-value">${totalTickets}</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-title">Ticket Medio</div>
                        <div class="metric-value">${valorMedio}</div>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Ingresos Históricos</h3>
                        ${imgIngresos ? `<img class="chart-img" src="${imgIngresos}"/>` : '<p>Gráfico no disponible</p>'}
                    </div>
                    <div class="chart-card">
                        <h3>Nuevas Altas de Socios</h3>
                        ${imgSocios ? `<img class="chart-img" src="${imgSocios}"/>` : '<p>Gráfico no disponible</p>'}
                    </div>
                    <div class="chart-card">
                        <h3>Distribución de Membresías</h3>
                        ${imgMembresias ? `<img class="chart-img" src="${imgMembresias}"/>` : '<p>Gráfico no disponible</p>'}
                    </div>
                    <div class="chart-card">
                        <h3>Productos Más Vendidos</h3>
                        ${imgProductos ? `<img class="chart-img" src="${imgProductos}"/>` : '<p>Gráfico no disponible</p>'}
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 500);
                    }
                <\/script>
            </body>
            </html>
        `);
        printWin.document.close();
    }

    destroy() {
        Object.values(this.charts).forEach(c => c?.destroy());
        super.destroy();
    }
}
