export const render = () => {
    return `
        <div class="socios-header">
            <div class="filters">
                <input type="text" class="search-input" placeholder="🔍 Buscar socio...">
                <div class="status-filters">
                    <button class="filter-btn active" onclick="window.showToast('Filtro aplicado: TODOS', 'success')">TODOS (25)</button>
                    <button class="filter-btn text-success" onclick="window.showToast('Filtro aplicado: ACTIVOS', 'success')">ACTIVOS (18)</button>
                    <button class="filter-btn text-danger" onclick="window.showToast('Filtro aplicado: VENCIDOS', 'success')">VENCIDOS (7)</button>
                </div>
            </div>
            <button class="btn btn-primary" id="btnNuevoSocio">
                <span class="material-icons-round">add</span> NUEVO SOCIO
            </button>
        </div>

        <div class="card socios-table-container">
            <table class="socios-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>MEMBRESÍA</th>
                        <th>VENCIMIENTO</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody id="sociosTbody">
                    <!-- Se llena con JS -->
                </tbody>
            </table>
        </div>

        <style>
            .socios-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .filters {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            .search-input {
                background-color: var(--color-bg-surface);
                border: 1px solid rgba(255,255,255,0.1);
                color: var(--color-text-primary);
                padding: 12px 20px;
                border-radius: var(--border-radius-md);
                width: 300px;
                outline: none;
                transition: border-color var(--transition-fast);
            }
            .search-input:focus { border-color: var(--color-primary); }
            
            .status-filters {
                display: flex;
                gap: 10px;
                background-color: var(--color-bg-surface);
                padding: 4px;
                border-radius: var(--border-radius-md);
            }
            .filter-btn {
                background: transparent; border: none;
                color: var(--color-text-secondary);
                padding: 8px 16px;
                border-radius: var(--border-radius-sm);
                cursor: pointer; font-size: 13px; font-weight: 600;
            }
            .filter-btn.active { background-color: rgba(255,255,255,0.1); color: var(--color-text-primary); }
            .text-success { color: var(--color-success); }
            .text-danger { color: var(--color-danger); }
            
            .socios-table-container {
                padding: 0;
                overflow: hidden;
            }
            .socios-table {
                width: 100%;
                border-collapse: collapse;
            }
            .socios-table th {
                text-align: left;
                padding: 16px 24px;
                color: var(--color-text-secondary);
                font-size: 12px;
                font-weight: 600;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                letter-spacing: 1px;
            }
            .socios-table td {
                padding: 16px 24px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                font-size: 14px;
            }
            .socios-table tbody tr:hover {
                background-color: rgba(255,255,255,0.02);
            }
            .status-badge {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }
            .status-activo { background-color: rgba(16, 185, 129, 0.1); color: var(--color-success); }
            .status-vencido { background-color: rgba(239, 68, 68, 0.1); color: var(--color-danger); }
            
            .avatar-sm {
                display: inline-flex; width: 30px; height: 30px;
                background-color: var(--color-bg-surface-hover);
                align-items: center; justify-content: center;
                border-radius: 50%; margin-right: 12px;
                font-size: 12px; font-weight: 600;
            }
        </style>
    `;
};

export const init = () => {
    // Mock Data
    const socios = [
        { id: '001', nombre: 'Carlos Mendoza', membresia: 'Mensual', vencimiento: '18 May', estado: 'Vencido' },
        { id: '002', nombre: 'María Fernanda López', membresia: 'Mensual', vencimiento: '09 Jun', estado: 'Activo' },
        { id: '003', nombre: 'Roberto Castillo', membresia: 'Anual', vencimiento: '15 Dic', estado: 'Activo' },
    ];

    const btnNuevoSocio = document.getElementById('btnNuevoSocio');
    if (btnNuevoSocio) {
        btnNuevoSocio.addEventListener('click', () => {
            const modalHtml = `
                <div class="modal-header">
                    <h3 class="modal-title">NUEVO SOCIO</h3>
                    <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
                </div>
                <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Nombres</label>
                    <input type="text" class="form-input" placeholder="Nombres del socio" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box;">
                </div>
                <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Apellidos</label>
                    <input type="text" class="form-input" placeholder="Apellidos del socio" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box;">
                </div>
                <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Plan de Membresía</label>
                    <div style="display: flex; gap: 10px; margin-top: 5px;">
                        <!-- MENSUAL -->
                        <div class="plan-card selected" style="flex: 1; border: 2px solid var(--color-primary); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; background-color: rgba(148, 255, 0, 0.05); transition: all 0.2s;">
                            <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-primary); font-weight: 600;">PLAN MENSUAL</div>
                            <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-primary);">$20.00</div>
                        </div>
                        <!-- QUINCENAL -->
                        <div class="plan-card" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                            <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">PLAN QUINCENAL</div>
                            <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$10.00</div>
                        </div>
                        <!-- DIARIO -->
                        <div class="plan-card" style="flex: 1; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: var(--border-radius-md); text-align: center; cursor: pointer; opacity: 0.5; transition: all 0.2s;">
                            <div class="plan-name" style="font-size: 11px; margin-bottom: 5px; color: var(--color-text-secondary); font-weight: 600;">PLAN DIARIO</div>
                            <div class="plan-price" style="font-size: 18px; font-weight: 800; color: var(--color-text-primary);">$3.00</div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                    <button class="btn btn-primary" style="flex: 1; justify-content: center;" onclick="window.closeModal(); window.showToast('Socio registrado con éxito', 'success')">REGISTRAR</button>
                </div>
            `;
            window.openModal(modalHtml);
            
            // Logic for plan selection
            const planCards = document.querySelectorAll('.plan-card');
            planCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Reset all
                    planCards.forEach(c => {
                        c.classList.remove('selected');
                        c.style.border = '1px solid rgba(255,255,255,0.1)';
                        c.style.backgroundColor = 'transparent';
                        c.style.opacity = '0.5';
                        c.querySelector('.plan-name').style.color = 'var(--color-text-secondary)';
                        c.querySelector('.plan-price').style.color = 'var(--color-text-primary)';
                    });
                    
                    // Set active
                    this.classList.add('selected');
                    this.style.border = '2px solid var(--color-primary)';
                    this.style.backgroundColor = 'rgba(148, 255, 0, 0.05)';
                    this.style.opacity = '1';
                    this.querySelector('.plan-name').style.color = 'var(--color-primary)';
                    this.querySelector('.plan-price').style.color = 'var(--color-primary)';
                });
            });
        });
    }

    const tbody = document.getElementById('sociosTbody');
    if (!tbody) return;

    tbody.innerHTML = socios.map(s => `
        <tr>
            <td style="color: var(--color-text-secondary);">#${s.id}</td>
            <td>
                <div style="display: flex; align-items: center;">
                    <span class="avatar-sm">${s.nombre.substring(0,2).toUpperCase()}</span>
                    ${s.nombre}
                </div>
            </td>
            <td>${s.membresia}</td>
            <td>${s.vencimiento}</td>
            <td>
                <span class="status-badge ${s.estado === 'Activo' ? 'status-activo' : 'status-vencido'}">
                    ${s.estado.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="window.showToast('Check-in manual registrado para ${s.nombre}', 'success')">CHECK-IN</button>
            </td>
        </tr>
    `).join('');
};
