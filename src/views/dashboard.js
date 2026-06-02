export const render = () => {
    return `
        <div class="dashboard-grid">
            <div class="stats-cards">
                <div class="card stat-card">
                    <h3>INGRESOS HOY</h3>
                    <div class="stat-value">$145.00</div>
                    <div class="stat-trend success">+12% vs ayer</div>
                </div>
                <div class="card stat-card">
                    <h3>SOCIOS ACTIVOS</h3>
                    <div class="stat-value">124</div>
                    <div class="stat-trend success">+3 nuevos</div>
                </div>
                <div class="card stat-card">
                    <h3>POR VENCER (7D)</h3>
                    <div class="stat-value">18</div>
                    <div class="stat-trend danger">Requiere atención</div>
                </div>
            </div>

            <div class="dashboard-main">
                <div class="card">
                    <div class="card-header">
                        <h3>ALERTAS DE RENOVACIÓN</h3>
                        <button class="btn btn-outline" onclick="window.showToast('Cargando historial de alertas...', 'info')">VER TODOS</button>
                    </div>
                    <div class="alerts-list">
                        <div class="alert-item">
                            <div class="alert-avatar">MV</div>
                            <div class="alert-info">
                                <h4>Miguel Vargas</h4>
                                <span>Vence mañana</span>
                            </div>
                            <button class="btn btn-primary" style="padding: 5px 15px;" onclick="window.showToast('Procesando renovación para Miguel...', 'success')">Renovar</button>
                        </div>
                        <div class="alert-item">
                            <div class="alert-avatar">SM</div>
                            <div class="alert-info">
                                <h4>Sofía Méndez</h4>
                                <span>Venció ayer</span>
                            </div>
                            <button class="btn btn-primary" style="padding: 5px 15px;" onclick="window.showToast('Procesando renovación para Sofía...', 'success')">Renovar</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3>TOP RACHAS (ASISTENCIA)</h3>
                    </div>
                    <div class="streaks-list">
                        <div class="streak-item">
                            <span>1. Fernando Aguilar</span>
                            <div class="streak-count">🔥 19 días</div>
                        </div>
                        <div class="streak-item">
                            <span>2. Camila Sánchez</span>
                            <div class="streak-count">🔥 14 días</div>
                        </div>
                        <div class="streak-item">
                            <span>3. Javier Morales</span>
                            <div class="streak-count">🔥 12 días</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .dashboard-grid {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            .stats-cards {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
            }
            .stat-card {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .stat-card h3 {
                font-size: 14px;
                color: var(--color-text-secondary);
                letter-spacing: 1px;
            }
            .stat-value {
                font-size: 36px;
                font-weight: 700;
                color: var(--color-text-primary);
            }
            .stat-trend {
                font-size: 13px;
                font-weight: 500;
            }
            .success { color: var(--color-success); }
            .danger { color: var(--color-danger); }
            
            .dashboard-main {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 24px;
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            .alerts-list, .streaks-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .alert-item {
                display: flex;
                align-items: center;
                gap: 16px;
                background-color: var(--color-bg-base);
                padding: 12px;
                border-radius: var(--border-radius-sm);
            }
            .alert-avatar {
                width: 40px; height: 40px;
                background-color: var(--color-bg-surface-hover);
                color: var(--color-text-primary);
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-weight: 600;
            }
            .alert-info { flex: 1; }
            .alert-info h4 { font-size: 15px; margin-bottom: 4px; }
            .alert-info span { font-size: 13px; color: var(--color-text-secondary); }
            
            .streak-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background-color: var(--color-bg-base);
                border-radius: var(--border-radius-sm);
                font-weight: 500;
            }
            .streak-count {
                color: var(--color-primary);
            }
        </style>
    `;
};

export const init = () => {
    // Aquí iría la lógica del dashboard, como animar números
};
