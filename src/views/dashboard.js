import { getSocios, getResumenCaja, getCheckinsHoy, calcularRachas, sociosNuevosHoy, sociosPorVencer, updateSocio, calcularVencimiento, addTransaccion, formatFecha, getSettings, getCheckins } from '../js/dataStore.js';

export const render = () => {
    return `
        <div class="dashboard-grid">
            <div class="stats-cards">
                <div class="card stat-card">
                    <h3>INGRESOS HOY</h3>
                    <div class="stat-value" id="dashIngresos">$0.00</div>
                    <div class="stat-trend" id="dashIngresosTrend">Actualizado hoy</div>
                </div>
                <div class="card stat-card">
                    <h3>SOCIOS ACTIVOS</h3>
                    <div class="stat-value" id="dashActivos">0</div>
                    <div class="stat-trend success" id="dashNuevos">+0 nuevos hoy</div>
                </div>
                <div class="card stat-card">
                    <h3>POR VENCER (7D)</h3>
                    <div class="stat-value" id="dashVencer">0</div>
                    <div class="stat-trend danger">Requiere atención</div>
                </div>
            </div>

            <div class="dashboard-main">
                <div class="card">
                    <div class="card-header">
                        <h3>ALERTAS DE RENOVACIÓN</h3>
                        <span id="alertCount" style="font-size: 13px; color: var(--color-text-secondary);"></span>
                    </div>
                    <div class="alerts-list" id="alertsList">
                        <!-- Generado en JS -->
                    </div>
                </div>

                <div class="card" style="grid-column: span 2;">
                    <div class="card-header">
                        <h3>ASISTENCIA SEMANAL</h3>
                    </div>
                    <div style="height: 250px; width: 100%;">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3>TOP RACHAS (ASISTENCIA)</h3>
                    </div>
                    <div class="streaks-list" id="streaksList">
                        <!-- Generado en JS -->
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>CHECK-INS HOY</h3>
                    <span id="checkinCount" style="font-size: 13px; color: var(--color-text-secondary);"></span>
                </div>
                <div id="checkinsList" style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <!-- Generado en JS -->
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
                color: var(--color-text-secondary);
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
                font-weight: 600; font-size: 13px; flex-shrink: 0;
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
            .checkin-chip {
                background-color: var(--color-bg-base);
                padding: 8px 14px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 500;
                display: flex; align-items: center; gap: 8px;
            }
            .checkin-chip .material-icons-round { font-size: 16px; color: var(--color-success); }
        </style>
    `;
};

export const init = () => {
    const socios = getSocios();
    const caja = getResumenCaja();
    const checkinsHoy = getCheckinsHoy();
    const rachas = calcularRachas();
    const nuevosHoy = sociosNuevosHoy();
    const porVencer = sociosPorVencer(7);
    
    const activos = socios.filter(s => s.estado === 'Activo').length;
    const vencidos = socios.filter(s => s.estado === 'Vencido');
    
    // Stats cards
    const elIngresos = document.getElementById('dashIngresos');
    const elActivos = document.getElementById('dashActivos');
    const elVencer = document.getElementById('dashVencer');
    const elNuevos = document.getElementById('dashNuevos');
    const elIngresosTrend = document.getElementById('dashIngresosTrend');
    
    if (elIngresos) elIngresos.textContent = '$' + caja.ingresos.toFixed(2);
    if (elActivos) elActivos.textContent = activos;
    if (elVencer) elVencer.textContent = vencidos.length + porVencer.length;
    if (elNuevos) {
        elNuevos.textContent = `+${nuevosHoy} nuevos hoy`;
        elNuevos.className = nuevosHoy > 0 ? 'stat-trend success' : 'stat-trend';
    }
    if (elIngresosTrend) {
        if (caja.numTransacciones > 0) {
            elIngresosTrend.textContent = `${caja.numTransacciones} transacciones hoy`;
            elIngresosTrend.className = 'stat-trend success';
        }
    }
    
    // Alertas de renovación
    const alertsList = document.getElementById('alertsList');
    const alertCount = document.getElementById('alertCount');
    const allAlerts = [...vencidos, ...porVencer];
    
    if (alertCount) alertCount.textContent = `${allAlerts.length} alertas`;
    
    if (alertsList && allAlerts.length > 0) {
        alertsList.innerHTML = allAlerts.slice(0, 5).map(v => `
            <div class="alert-item">
                <div class="alert-avatar">${v.nombre.substring(0,2).toUpperCase()}</div>
                <div class="alert-info">
                    <h4>${v.nombre}</h4>
                    <span>${v.estado === 'Vencido' ? '❌ Vencido: ' : '⚠️ Vence: '}${formatFecha(v.fechaVencimiento)}</span>
                </div>
                <button class="btn btn-primary btn-renovar" data-socio-id="${v.id}" style="padding: 5px 15px;">Renovar</button>
            </div>
        `).join('');
        
        // Attach renovar handlers
        document.querySelectorAll('.btn-renovar').forEach(btn => {
            btn.addEventListener('click', () => {
                const socioId = btn.getAttribute('data-socio-id');
                openRenovarModal(socioId);
            });
        });
    } else if (alertsList) {
        alertsList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary);">🎉 No hay alertas pendientes.</div>';
    }
    
    // Rachas
    const streaksList = document.getElementById('streaksList');
    if (streaksList) {
        if (rachas.length > 0) {
            streaksList.innerHTML = rachas.map((r, i) => `
                <div class="streak-item">
                    <span>${i + 1}. ${r.nombre}</span>
                    <div class="streak-count">🔥 ${r.racha} días</div>
                </div>
            `).join('');
        } else {
            streaksList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary);">Sin datos de asistencia aún. Registra check-ins para ver rachas.</div>';
        }
    }
    
    // Check-ins de hoy
    const checkinsList = document.getElementById('checkinsList');
    const checkinCount = document.getElementById('checkinCount');
    
    if (checkinCount) checkinCount.textContent = `${checkinsHoy.length} ingresos`;
    
    if (checkinsList) {
        if (checkinsHoy.length > 0) {
            checkinsList.innerHTML = checkinsHoy.slice(0, 10).map(c => `
                <div class="checkin-chip">
                    <span class="material-icons-round">check_circle</span>
                    ${c.nombre} <span style="color: var(--color-text-secondary); font-size: 12px;">${c.hora}</span>
                </div>
            `).join('');
        } else {
            checkinsList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary); width: 100%;">Ningún ingreso registrado hoy.</div>';
        }
    }

    // Dibujar gráfico
    const allCheckins = getCheckins();
    const ctx = document.getElementById('weeklyChart');
    if (ctx && window.Chart) {
        // Preparar últimos 7 días
        const dias = [];
        const conteos = [];
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
            const nameDay = d.toLocaleDateString('es-ES', {weekday: 'short'}).toUpperCase();
            dias.push(nameDay);
            const sum = allCheckins.filter(c => c.fecha === dateStr).length;
            conteos.push(sum);
        }
        
        new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: dias,
                datasets: [{
                    label: 'Check-ins',
                    data: conteos,
                    backgroundColor: '#94ff00',
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { stepSize: 1, color: '#aaa' } },
                    x: { grid: { display: false }, ticks: { color: '#aaa' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
};

function openRenovarModal(socioId) {
    const socios = getSocios();
    const socio = socios.find(s => s.id === socioId);
    if (!socio) return;
    
    const settings = getSettings();
    const precios = settings.precios || { Mensual: 20, Quincenal: 10, Diario: 3 };
    
    const modalHtml = `
        <div class="modal-header">
            <h3 class="modal-title">RENOVAR MEMBRESÍA</h3>
            <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: var(--color-bg-base); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; margin-bottom: 10px;">${socio.nombre.substring(0,2).toUpperCase()}</div>
            <h3 style="font-size: 18px;">${socio.nombre}</h3>
            <p style="color: var(--color-text-secondary); font-size: 13px;">Plan actual: ${socio.membresia}</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <div class="plan-card selected" data-plan="Mensual" data-precio="${precios.Mensual}" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 600;">MENSUAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$${precios.Mensual.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Quincenal" data-precio="${precios.Quincenal}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">QUINCENAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${precios.Quincenal.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Diario" data-precio="${precios.Diario}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">DIARIO</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${precios.Diario.toFixed(2)}</div>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
            <button class="btn btn-primary" id="btnConfirmarRenovar" style="flex: 1; justify-content: center;">RENOVAR</button>
        </div>
    `;
    window.openModal(modalHtml);
    
    let selectedPlan = 'Mensual';
    let selectedPrecio = precios.Mensual;
    
    // Plan selection
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            planCards.forEach(c => {
                c.classList.remove('selected');
                c.style.border = '1px solid rgba(255,255,255,0.1)';
                c.style.backgroundColor = 'transparent';
                c.style.opacity = '0.5';
                c.querySelector('.plan-name').style.color = 'var(--color-text-secondary)';
                c.querySelector('.plan-price').style.color = 'var(--color-text-primary)';
            });
            this.classList.add('selected');
            this.style.border = '2px solid var(--color-primary)';
            this.style.backgroundColor = 'rgba(148, 255, 0, 0.05)';
            this.style.opacity = '1';
            this.querySelector('.plan-name').style.color = 'var(--color-primary)';
            this.querySelector('.plan-price').style.color = 'var(--color-primary)';
            selectedPlan = this.getAttribute('data-plan');
            selectedPrecio = parseFloat(this.getAttribute('data-precio'));
        });
    });
    
    document.getElementById('btnConfirmarRenovar').addEventListener('click', () => {
        const nuevaFecha = calcularVencimiento(selectedPlan);
        updateSocio(socioId, {
            membresia: selectedPlan,
            precio: selectedPrecio,
            fechaVencimiento: nuevaFecha,
            estado: 'Activo',
        });
        addTransaccion({
            tipo: 'ingreso',
            concepto: `Renovación ${selectedPlan} - ${socio.nombre}`,
            monto: selectedPrecio,
        });
        window.closeModal();
        window.showToast(`Membresía de ${socio.nombre} renovada con éxito`, 'success');
        init(); // Re-render dashboard
    });
}
