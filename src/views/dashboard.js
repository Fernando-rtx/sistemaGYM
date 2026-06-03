import { getSocios, getResumenCaja, getCheckinsHoy, calcularRachas, sociosNuevosHoy, sociosPorVencer, updateSocio, calcularVencimiento, addTransaccion, formatFecha, getSettings, getCheckins, getTransacciones } from '../js/dataStore.js';

export const render = () => {
    return `
        <div class="dashboard-grid-premium" id="dashboardContainer">
            <!-- Rendered in JS -->
        </div>

        <style>
            .dashboard-grid-premium {
                display: flex;
                flex-direction: column;
                gap: 24px;
                padding-bottom: 24px;
            }
            .card {
                background: var(--color-bg-base);
                border: 1px solid rgba(255,255,255,0.03);
                border-radius: var(--border-radius-lg);
            }
            /* Custom Scrollbar for Alerts */
            .alerts-container::-webkit-scrollbar {
                width: 6px;
            }
            .alerts-container::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.1); 
            }
            .alerts-container::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.1); 
                border-radius: 4px;
            }
            .alerts-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.2); 
            }
            
            /* Responsive adjust */
            @media (max-width: 1024px) {
                .top-row { grid-template-columns: 1fr !important; }
                .bottom-row { grid-template-columns: 1fr !important; }
            }
        </style>
    `;
};

export const init = async () => {
    // 1. Paralelizar todas las consultas independientes
    const [
        settings,
        socios,
        caja,
        checkinsHoy,
        checkins,
        trans,
        nuevosHoy,
        porVencer
    ] = await Promise.all([
        getSettings(),
        getSocios(),
        getResumenCaja(),
        getCheckinsHoy(),
        getCheckins(),
        getTransacciones(),
        sociosNuevosHoy(),
        sociosPorVencer(3)
    ]);
    
    // 2. Dependencias que reutilizan datos ya descargados
    const rachas = await calcularRachas(checkins);
    
    const activos = socios.filter(s => s.estado === 'Activo').length;
    const vencidos = socios.filter(s => s.estado === 'Vencido');
    
    const hoy = new Date();
    
    // 3. Calcular ausentes (>5 dias) con complejidad O(N + M) en vez de O(N * M)
    const ultimoCheckinMap = new Map();
    for (const c of checkins) {
        if (!ultimoCheckinMap.has(c.socioId)) {
            ultimoCheckinMap.set(c.socioId, new Date(c.fecha + "T00:00:00"));
        }
    }

    const ausentes = socios.filter(s => {
        if(s.estado === 'Vencido') return false;
        
        let diffDiasAusente = 999;
        if(ultimoCheckinMap.has(s.id)) {
            const ultimo = ultimoCheckinMap.get(s.id);
            diffDiasAusente = (hoy - ultimo) / (1000 * 60 * 60 * 24);
        } else {
            const fRegStr = s.fechaRegistro ? s.fechaRegistro : (hoy.toISOString().split('T')[0]);
            const fReg = new Date(fRegStr + "T00:00:00");
            diffDiasAusente = (hoy - fReg) / (1000 * 60 * 60 * 24);
        }
        return diffDiasAusente > 5;
    });

    // Calcular ingresos del mes
    const mesActual = hoy.getMonth();
    const anoActual = hoy.getFullYear();
    const ingresosMesNum = trans.filter(t => {
        if(t.tipo !== 'ingreso') return false;
        const d = new Date(t.fecha + "T00:00:00");
        return d.getMonth() === mesActual && d.getFullYear() === anoActual;
    }).reduce((acc, t) => acc + t.monto, 0);
    const ingresosMes = ingresosMesNum.toFixed(2);

    // Racha Récord
    const rachaRecord = rachas.length > 0 ? rachas[0].racha : 0;

    // Fecha Panel
    const fechaHoyFormato = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();

    // Alertas HTML
    const allAlerts = [...vencidos.map(v => ({...v, alertType: 'Vencido'})), ...porVencer.map(p => ({...p, alertType: 'PorRenovar'}))];
    allAlerts.sort((a,b) => new Date(a.fechaVencimiento + "T00:00:00") - new Date(b.fechaVencimiento + "T00:00:00"));
    
    const alertasHtml = allAlerts.length > 0 ? allAlerts.map(v => {
        const fVenc = new Date((v.fechaVencimiento || hoy.toISOString().split('T')[0]) + "T00:00:00");
        const diffDias = Math.floor((hoy - fVenc) / (1000*60*60*24));
        const textVencimiento = diffDias > 0 ? `Venció hace ${diffDias} días` : (diffDias < 0 ? `Vence en ${Math.abs(diffDias)} días` : 'Vence hoy');
        
        const badgeStyle = v.alertType === 'Vencido' 
            ? 'color: var(--color-danger); border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.05);' 
            : 'color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.05);';
            
        const phoneClean = v.telefono ? v.telefono.replace(/[^0-9]/g, '') : '';
        const waLink = phoneClean ? `https://wa.me/${phoneClean}?text=${encodeURIComponent('Hola '+v.nombre+', te contactamos de NEXFIT.\n\nNotamos que tu membresía ' + textVencimiento.toLowerCase() + '. ¡Te invitamos a renovar para seguir entrenando juntos!')}` : '#';
        
        return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.02); gap: 10px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 44px; height: 44px; background: rgba(148, 255, 0, 0.1); color: var(--color-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0;">${v.nombre.substring(0,2).toUpperCase()}</div>
                <div>
                    <div style="font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">${v.nombre}</div>
                    <div style="color: var(--color-text-secondary); font-size: 12px; margin-top: 4px;">${textVencimiento} · Plan ${v.membresia}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="${badgeStyle} font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 12px; display: flex; align-items: center; gap: 4px; letter-spacing: 1px;">
                    <span style="font-size: 8px;">●</span> ${v.alertType === 'Vencido' ? 'VENCIDO' : 'POR RENOVAR'}
                </div>
                <a href="${waLink}" target="${phoneClean ? '_blank' : '_self'}" title="${phoneClean ? 'Enviar WhatsApp' : 'Sin número'}" class="btn btn-outline" style="padding: 8px; border-radius: 8px; color: var(--color-text-primary); border-color: rgba(255,255,255,0.1); ${!phoneClean ? 'opacity: 0.3; pointer-events: none;' : ''}">
                    <span class="material-icons-round" style="font-size: 18px;">chat</span>
                </a>
                <button class="btn btn-primary btn-renovar" data-socio-id="${v.id}" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: 1px;">RENOVAR</button>
            </div>
        </div>`;
    }).join('') : '<div style="padding: 40px; text-align: center; color: var(--color-text-secondary); font-size: 14px;">🎉 No hay alertas de renovación pendientes. Todo al día.</div>';

    // Top Rachas HTML
    const rachasHtml = rachas.length > 0 ? rachas.slice(0, 5).map((r, index) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.02);">
            <div style="display: flex; align-items: center; gap: 20px;">
                <div style="font-size: 20px; font-weight: 900; color: var(--color-primary); width: 24px; text-align: center;">${index + 1}</div>
                <div>
                    <div style="font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">${r.nombre}</div>
                    <div style="color: var(--color-text-secondary); font-size: 12px; margin-top: 4px;">Plan ${socios.find(s=>s.id===r.socioId)?.membresia || ''}</div>
                </div>
            </div>
            <div style="color: var(--color-primary); font-weight: 800; font-size: 15px;">
                🔥 ${r.racha}
            </div>
        </div>
    `).join('') : '<div style="padding: 20px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">Sin rachas. ¡Invita a tus socios a entrenar!</div>';

    // Inyectar HTML
    const container = document.getElementById('dashboardContainer');
    if(container) {
        container.innerHTML = `
            <div class="top-row" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;">
                <!-- Panel de Control Principal -->
                <div class="main-panel card" style="background: linear-gradient(135deg, rgba(148, 255, 0, 0.03) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(148, 255, 0, 0.1); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
                    <!-- Decorativo -->
                    <div style="position: absolute; top: -50%; left: -10%; width: 50%; height: 200%; background: radial-gradient(circle, rgba(148, 255, 0, 0.05) 0%, rgba(0,0,0,0) 70%); pointer-events: none;"></div>
                    
                    <div style="padding: 24px; position: relative; z-index: 1;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--color-primary); letter-spacing: 2px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 6px; height: 6px; background: var(--color-primary); border-radius: 50%; box-shadow: 0 0 8px var(--color-primary);"></span>
                            PANEL DE CONTROL · ${fechaHoyFormato}
                        </div>
                        <h1 style="color: var(--color-primary); font-size: 36px; font-weight: 900; margin: 0 0 16px 0; letter-spacing: -1px; text-shadow: 0 0 20px rgba(148,255,0,0.2);">${settings.brandName.toUpperCase()}</h1>
                        <p style="color: var(--color-text-secondary); font-size: 14px; line-height: 1.6; max-width: 450px; margin: 0;">Resumen operativo del gimnasio. Atiende renovaciones, registra asistencias y mantén el ritmo en una sola vista.</p>
                    </div>
                    
                    <div style="display: flex; gap: 32px; padding: 24px; border-top: 1px solid rgba(255,255,255,0.03); background: rgba(0,0,0,0.2); position: relative; z-index: 1; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">CHECK-INS HOY</div>
                            <div style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${checkinsHoy.length}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">SOCIOS TOTALES</div>
                            <div style="font-size: 28px; font-weight: 800;">${socios.length}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">INGRESOS DEL MES</div>
                            <div style="font-size: 28px; font-weight: 800;">$${ingresosMes}</div>
                        </div>
                        <div style="flex: 1; min-width: 100px;">
                            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">RACHA RÉCORD</div>
                            <div style="font-size: 28px; font-weight: 800;">${rachaRecord} <span style="font-size:12px; font-weight:600; color:var(--color-text-secondary);">DÍAS</span></div>
                        </div>
                    </div>
                </div>

                <!-- Metric Cards 2x2 -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="card" style="border-left: 4px solid var(--color-success); padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">bolt</span> ACTIVOS</div>
                        <div style="font-size: 36px; font-weight: 800; color: var(--color-success); margin: 8px 0 4px 0;">${activos}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">de ${socios.length} socios</div>
                    </div>
                    <div class="card" style="border-left: 4px solid #f59e0b; padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">notifications</span> POR RENOVAR</div>
                        <div style="font-size: 36px; font-weight: 800; color: #f59e0b; margin: 8px 0 4px 0;">${porVencer.length}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">≤ 3 días para vencer</div>
                    </div>
                    <div class="card" style="border-left: 4px solid var(--color-danger); padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">schedule</span> VENCIDOS</div>
                        <div style="font-size: 36px; font-weight: 800; color: var(--color-danger); margin: 8px 0 4px 0;">${vencidos.length}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">requieren acción</div>
                    </div>
                    <div class="card" style="border-left: 4px solid #6b7280; padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-size: 11px; font-weight: 800; letter-spacing: 1px;"><span class="material-icons-round" style="font-size:16px;">person_off</span> AUSENTES</div>
                        <div style="font-size: 36px; font-weight: 800; color: #9ca3af; margin: 8px 0 4px 0;">${ausentes.length}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 500;">+5 días sin asistir</div>
                    </div>
                </div>
            </div>

            <!-- Bottom Row 2:1 -->
            <div class="bottom-row" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;">
                <!-- Alertas de Renovación -->
                <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px;">ALERTAS DE RENOVACIÓN <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">${allAlerts.length} pendientes</span></div>
                        <button class="btn btn-outline" style="font-size:11px; padding: 6px 12px; letter-spacing:1px; border-radius: 6px; font-weight: 700;">VER TODOS</button>
                    </div>
                    <div class="alerts-container" style="display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 520px; padding-right: 8px;">
                        ${alertasHtml}
                    </div>
                </div>

                <!-- Right Column: Asistencia y Rachas -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 24px;">ASISTENCIA SEMANAL <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">últimos 7 días</span></div>
                        <div style="height: 180px; width: 100%;">
                            <canvas id="weeklyChart"></canvas>
                        </div>
                    </div>
                    <div class="card" style="padding: 24px; flex: 1;">
                        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 24px;">TOP RACHAS <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary); margin-left: 8px;">consecutivos</span></div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${rachasHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Dibujar gráfico
    const allCheckins = checkins;
    const ctx = document.getElementById('weeklyChart');
    if (ctx && window.Chart) {
        // Preparar últimos 7 días
        const dias = [];
        const conteos = [];
        let maxIndex = 0;
        let maxVal = -1;
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const nameDay = d.toLocaleDateString('es-ES', {weekday: 'short'}).toUpperCase();
            dias.push(nameDay);
            const sum = allCheckins.filter(c => c.fecha === dateStr).length;
            conteos.push(sum);
            if (sum >= maxVal) { // Keep the latest highest day
                maxVal = sum;
                maxIndex = 6 - i;
            }
        }

        // Si todos son 0, highlight current day (last index 6)
        if (maxVal === 0) maxIndex = 6;
        
        const backgroundColors = conteos.map((_, i) => i === maxIndex ? '#94ff00' : 'rgba(255,255,255,0.1)');
        
        new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: dias,
                datasets: [{
                    label: 'Check-ins',
                    data: conteos,
                    backgroundColor: backgroundColors,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { display: false, beginAtZero: true }, // Ocultar eje Y para limpieza
                    x: { 
                        grid: { display: false }, 
                        ticks: { color: '#aaa', font: { size: 10, weight: 'bold' } },
                        border: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#fff',
                        bodyColor: '#94ff00',
                        displayColors: false,
                        cornerRadius: 8,
                        padding: 10
                    }
                }
            }
        });
    }

    // Attach renovar handlers
    document.querySelectorAll('.btn-renovar').forEach(btn => {
        btn.addEventListener('click', () => {
            const socioId = btn.getAttribute('data-socio-id');
            openRenovarModal(socioId);
        });
    });
};

async function openRenovarModal(socioId) {
    const socios = await getSocios();
    const socio = socios.find(s => s.id === socioId);
    if (!socio) return;
    
    const settings = await getSettings();
    const precios = settings.precios || { Mensual: 20, Quincenal: 10, Diario: 3 };
    
    const modalHtml = `
        <div class="modal-header">
            <h3 class="modal-title">RENOVAR MEMBRESÍA</h3>
            <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: rgba(148,255,0,0.1); color: var(--color-primary); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; margin-bottom: 10px;">${socio.nombre.substring(0,2).toUpperCase()}</div>
            <h3 style="font-size: 18px; font-weight: 800;">${socio.nombre}</h3>
            <p style="color: var(--color-text-secondary); font-size: 13px;">Plan actual: ${socio.membresia}</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <div class="plan-card selected" data-plan="Mensual" data-precio="${precios.Mensual}" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 800;">MENSUAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$${precios.Mensual.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Quincenal" data-precio="${precios.Quincenal}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 800;">QUINCENAL</div>
                <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$${precios.Quincenal.toFixed(2)}</div>
            </div>
            <div class="plan-card" data-plan="Diario" data-precio="${precios.Diario}" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 800;">DIARIO</div>
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
    
    document.getElementById('btnConfirmarRenovar').addEventListener('click', async () => {
        const nuevaFecha = calcularVencimiento(selectedPlan);
        await updateSocio(socioId, {
            membresia: selectedPlan,
            precio: selectedPrecio,
            fechaVencimiento: nuevaFecha,
            estado: 'Activo',
        });
        await addTransaccion({
            tipo: 'ingreso',
            concepto: `Renovación ${selectedPlan} - ${socio.nombre}`,
            monto: selectedPrecio,
        });
        window.closeModal();
        window.showToast(`Membresía de ${socio.nombre} renovada con éxito`, 'success');
        await init(); // Re-render dashboard
    });
}
