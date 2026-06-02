import { getSocios, addSocio, updateSocio, deleteSocio, addCheckin, calcularVencimiento, formatFecha, addTransaccion, getSettings, getCheckins, getCurrentUser } from '../js/dataStore.js';

export const render = () => {
    return `
        <div id="sociosMainView">
            <div class="socios-header">
                <div class="filters">
                    <input type="text" class="search-input" placeholder="🔍 Buscar socio...">
                    <div class="status-filters" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="filter-btn active">TODOS (0)</button>
                        <button class="filter-btn text-success">ACTIVOS (0)</button>
                        <button class="filter-btn text-warning" style="color: #eab308;">POR RENOVAR (0)</button>
                        <button class="filter-btn text-danger">VENCIDOS (0)</button>
                        <button class="filter-btn" style="color: #a8a29e;">AUSENTES (0)</button>
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
                    </tbody>
                </table>
            </div>
        </div>

        <div id="sociosProfileView" style="display: none;">
            <!-- Profile content will be injected here -->
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
            .status-ausente { background-color: rgba(255, 255, 255, 0.1); color: var(--color-text-secondary); }
            
            .avatar-sm {
                display: inline-flex; width: 30px; height: 30px;
                background-color: var(--color-bg-surface-hover);
                align-items: center; justify-content: center;
                border-radius: 50%; margin-right: 12px;
                font-size: 12px; font-weight: 600;
            }
            .action-btns { display: flex; gap: 6px; }
            .btn-icon {
                background: transparent; border: 1px solid rgba(255,255,255,0.1);
                color: var(--color-text-secondary); cursor: pointer;
                width: 32px; height: 32px; border-radius: 8px;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s;
            }
            .btn-icon:hover { border-color: var(--color-primary); color: var(--color-primary); }
            .btn-icon.danger:hover { border-color: var(--color-danger); color: var(--color-danger); }
            
            /* Profile View Specific Styles */
            .profile-stat-card {
                background: var(--color-bg-surface);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: var(--border-radius-md);
                padding: 20px;
            }
            .heatmap-grid {
                display: grid;
                grid-template-columns: repeat(15, 1fr);
                gap: 6px;
            }
            .heatmap-cell {
                aspect-ratio: 1;
                border-radius: 4px;
            }
        </style>
    `;
};

export const init = () => {
    let socios = getSocios();
    let currentFilter = 'TODOS';
    let searchQuery = '';

    const tbody = document.getElementById('sociosTbody');
    const searchInput = document.querySelector('.search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const settings = getSettings();
    const precios = settings.precios || { Mensual: 20, Quincenal: 10, Diario: 3 };

    const renderTable = () => {
        socios = getSocios(); // Refresh
        if (!tbody) return;
        
        const checkins = getCheckins();
        const hoy = new Date();
        
        let countTodos = 0, countActivos = 0, countVencer = 0, countVencidos = 0, countAusentes = 0;

        let filtrados = socios.filter(s => {
            const matchesSearch = s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery);
            
            // Cálculos para contadores
            const isActivo = s.estado === 'Activo';
            const isVencido = s.estado === 'Vencido';
            
            const fVenc = new Date(s.fechaVencimiento);
            const diffDiasVenc = (fVenc - hoy) / (1000 * 60 * 60 * 24);
            const isPorVencer = isActivo && diffDiasVenc >= 0 && diffDiasVenc <= 3;
            
            const checksSocio = checkins.filter(c => c.socioId === s.id);
            let diffDiasAusente = 999;
            if(checksSocio.length > 0) {
                const ultimo = new Date(checksSocio[0].fecha + "T00:00:00");
                diffDiasAusente = (hoy - ultimo) / (1000 * 60 * 60 * 24);
            } else {
                const fReg = new Date(s.fechaRegistro + "T00:00:00");
                diffDiasAusente = (hoy - fReg) / (1000 * 60 * 60 * 24);
            }
            const isAusente = diffDiasAusente > 5;

            // Increment counters
            countTodos++;
            if(isActivo) countActivos++;
            if(isVencido) countVencidos++;
            if(isPorVencer) countVencer++;
            if(isAusente) countAusentes++;

            let matchesFilter = false;
            if (currentFilter === 'TODOS') matchesFilter = true;
            if (currentFilter === 'ACTIVO' && isActivo) matchesFilter = true;
            if (currentFilter === 'VENCIDO' && isVencido) matchesFilter = true;
            if (currentFilter === 'POR RENOVAR' && isPorVencer) matchesFilter = true;
            if (currentFilter === 'AUSENTE' && isAusente) matchesFilter = true;

            return matchesSearch && matchesFilter;
        });

        const user = getCurrentUser();

        tbody.innerHTML = filtrados.map(s => {
            // Recalcular estado local para el badge (si es ausente lo mostramos en gris)
            const checksSocio = checkins.filter(c => c.socioId === s.id);
            let dAusente = 999;
            if(checksSocio.length > 0) {
                dAusente = (hoy - new Date(checksSocio[0].fecha + "T00:00:00")) / (1000 * 60 * 60 * 24);
            }
            const isAusenteBadge = dAusente > 5 && s.estado !== 'Vencido';

            return `
            <tr style="cursor: pointer;" class="socio-row" data-id="${s.id}">
                <td style="color: var(--color-text-secondary);">#${s.id.substring(0,6)}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <span class="avatar-sm">${s.nombre.substring(0,2).toUpperCase()}</span>
                        <div>
                            <div>${s.nombre}</div>
                            <div style="font-size: 12px; color: var(--color-text-secondary);">${s.edad ? s.edad + ' años • ' : ''}${s.telefono || 'Sin teléfono'}</div>
                        </div>
                    </div>
                </td>
                <td>${s.membresia}</td>
                <td>${formatFecha(s.fechaVencimiento)}</td>
                <td>
                    <span class="status-badge ${s.estado === 'Vencido' ? 'status-vencido' : (isAusenteBadge ? 'status-ausente' : 'status-activo')}">
                        ${s.estado === 'Vencido' ? 'VENCIDO' : (isAusenteBadge ? 'AUSENTE' : 'ACTIVO')}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon btn-checkin-row" data-id="${s.id}" data-nombre="${s.nombre}" title="Check-in">
                            <span class="material-icons-round" style="font-size: 16px;">login</span>
                        </button>
                        <button class="btn-icon btn-edit-row" data-id="${s.id}" title="Editar">
                            <span class="material-icons-round" style="font-size: 16px;">edit</span>
                        </button>
                        ${user && user.role !== 'Empleado' ? `
                        <button class="btn-icon danger btn-delete-row" data-id="${s.id}" data-nombre="${s.nombre}" title="Eliminar">
                            <span class="material-icons-round" style="font-size: 16px;">delete</span>
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
            `;
        }).join('');

        // Contadores
        filterBtns[0].textContent = `TODOS (${countTodos})`;
        filterBtns[1].textContent = `ACTIVOS (${countActivos})`;
        filterBtns[2].textContent = `POR RENOVAR (${countVencer})`;
        filterBtns[3].textContent = `VENCIDOS (${countVencidos})`;
        filterBtns[4].textContent = `AUSENTES (${countAusentes})`;

        // Attach row action handlers
        document.querySelectorAll('.btn-checkin-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const nombre = btn.getAttribute('data-nombre');
                addCheckin(id, nombre);
                window.showToast(`Check-in registrado para ${nombre}`, 'success');
                renderTable(); // Update table stats
            });
        });

        document.querySelectorAll('.btn-edit-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                openEditModal(id);
            });
        });

        document.querySelectorAll('.btn-delete-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const nombre = btn.getAttribute('data-nombre');
                openDeleteModal(id, nombre);
            });
        });

        // Row click for Profile Full View
        document.querySelectorAll('.socio-row').forEach(row => {
            row.addEventListener('click', (e) => {
                // Ignore clicks on buttons
                if(e.target.closest('button') || e.target.closest('.action-btns')) return;
                const id = row.getAttribute('data-id');
                openProfileView(id);
            });
        });
    };

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTable();
        });
    }

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const text = e.currentTarget.textContent;
            if (text.includes('TODOS')) currentFilter = 'TODOS';
            else if (text.includes('ACTIVOS')) currentFilter = 'ACTIVO';
            else if (text.includes('POR RENOVAR')) currentFilter = 'POR RENOVAR';
            else if (text.includes('VENCIDOS')) currentFilter = 'VENCIDO';
            else if (text.includes('AUSENTES')) currentFilter = 'AUSENTE';
            renderTable();
        });
    });

    renderTable();

    // New Socio Button
    document.getElementById('btnNuevoSocio').addEventListener('click', () => {
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">NUEVO SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Nombre completo</label>
                <input type="text" id="inpSocioNombre" placeholder="Nombre del socio" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Teléfono</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="inpSocioEdad" placeholder="Edad" style="flex: 1; background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; outline: none;">
                    <input type="tel" id="inpSocioTel" placeholder="7777-1234" style="flex: 2; background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; outline: none;">
                </div>
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Plan de Membresía</label>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
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
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnGuardarSocio" style="flex: 1; justify-content: center;">REGISTRAR</button>
            </div>
        `;
        window.openModal(modalHtml);
        setupPlanSelection();

        document.getElementById('btnGuardarSocio').addEventListener('click', () => {
            const nombre = document.getElementById('inpSocioNombre').value.trim();
            if (!nombre) { window.showToast('El nombre es obligatorio', 'danger'); return; }
            const telefono = document.getElementById('inpSocioTel').value.trim();
            const selectedCard = document.querySelector('.plan-card.selected');
            const plan = selectedCard ? selectedCard.getAttribute('data-plan') : 'Mensual';
            const precio = selectedCard ? parseFloat(selectedCard.getAttribute('data-precio')) : precios.Mensual;

            const edad = document.getElementById('inpSocioEdad').value ? parseInt(document.getElementById('inpSocioEdad').value) : null;
            addSocio({
                nombre,
                telefono,
                edad,
                membresia: plan,
                precio,
                fechaVencimiento: calcularVencimiento(plan),
            });

            addTransaccion({
                tipo: 'ingreso',
                concepto: `Membresía ${plan} - ${nombre}`,
                monto: precio,
            });

            window.closeModal();
            window.showToast(`${nombre} registrado con éxito`, 'success');
            renderTable();
        });
    });

    // Edit Modal
    function openEditModal(id) {
        const socio = socios.find(s => s.id === id);
        if (!socio) return;
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">EDITAR SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Nombre completo</label>
                <input type="text" id="editNombre" value="${socio.nombre}" style="background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; width: 100%; box-sizing: border-box; outline: none;">
            </div>
            <div class="form-group" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Teléfono / Edad</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="editEdad" value="${socio.edad || ''}" placeholder="Edad" style="flex: 1; background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; outline: none;">
                    <input type="tel" id="editTel" value="${socio.telefono || ''}" placeholder="7777-1234" style="flex: 2; background-color: var(--color-bg-base); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-primary); padding: 12px 16px; border-radius: var(--border-radius-md); font-size: 15px; outline: none;">
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnUpdateSocio" style="flex: 1; justify-content: center;">GUARDAR</button>
            </div>
        `;
        window.openModal(modalHtml);
        document.getElementById('btnUpdateSocio').addEventListener('click', () => {
            const nombre = document.getElementById('editNombre').value.trim();
            const telefono = document.getElementById('editTel').value.trim();
            const edad = document.getElementById('editEdad').value ? parseInt(document.getElementById('editEdad').value) : null;
            if (!nombre) { window.showToast('El nombre es obligatorio', 'danger'); return; }
            updateSocio(id, { nombre, telefono, edad });
            window.closeModal();
            window.showToast('Socio actualizado', 'success');
            renderTable();
            
            // If profile is open, refresh it
            const profileView = document.getElementById('sociosProfileView');
            if (profileView && profileView.style.display === 'block') {
                openProfileView(id);
            }
        });
    }

    // Delete Modal
    function openDeleteModal(id, nombre) {
        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">ELIMINAR SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            <div style="text-align: center; padding: 20px 0;">
                <span class="material-icons-round" style="font-size: 48px; color: var(--color-danger);">warning</span>
                <p style="margin-top: 15px; font-size: 16px;">¿Estás seguro de eliminar a <strong>${nombre}</strong>?</p>
                <p style="color: var(--color-text-secondary); font-size: 13px; margin-top: 8px;">Esta acción no se puede deshacer.</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CANCELAR</button>
                <button class="btn btn-primary" id="btnConfirmDelete" style="flex: 1; justify-content: center; background-color: var(--color-danger);">ELIMINAR</button>
            </div>
        `;
        window.openModal(modalHtml);
        document.getElementById('btnConfirmDelete').addEventListener('click', () => {
            deleteSocio(id);
            window.closeModal();
            window.showToast(`${nombre} eliminado`, 'success');
            
            // Go back if profile is open
            const profileView = document.getElementById('sociosProfileView');
            if (profileView && profileView.style.display === 'block') {
                document.getElementById('sociosProfileView').style.display = 'none';
                document.getElementById('sociosMainView').style.display = 'block';
            }
            renderTable();
        });
    }

    // Full Page Profile View
    function openProfileView(id) {
        const socio = socios.find(s => s.id === id);
        if (!socio) return;
        
        // Hide Main View, Show Profile View
        document.getElementById('sociosMainView').style.display = 'none';
        const profileView = document.getElementById('sociosProfileView');
        profileView.style.display = 'block';
        profileView.innerHTML = '<div style="text-align:center; padding: 50px;">Cargando perfil...</div>';
        
        const hoy = new Date();
        const fReg = new Date(socio.fechaRegistro + "T00:00:00");
        const fVenc = new Date(socio.fechaVencimiento + "T00:00:00");
        
        // 1. Estadísticas básicas
        const diasComoSocio = Math.max(0, Math.floor((hoy - fReg) / (1000 * 60 * 60 * 24)));
        const totalDiasPlan = Math.max(1, Math.ceil((fVenc - fReg) / (1000 * 60 * 60 * 24)));
        const diasRestantes = Math.ceil((fVenc - hoy) / (1000 * 60 * 60 * 24));
        let porcentaje = ((totalDiasPlan - Math.max(0, diasRestantes)) / totalDiasPlan) * 100;
        if(porcentaje > 100) porcentaje = 100;
        if(porcentaje < 0) porcentaje = 0;

        // 2. Historial de checkins
        const checkins = getCheckins().filter(c => c.socioId === id).sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
        let rachaActual = 0;
        let ultimaVisitaFormateada = '-';
        let isAusenteBadge = false;

        if (checkins.length > 0) {
            ultimaVisitaFormateada = formatFecha(checkins[0].fecha);
            
            // Calc racha actual
            let currentCheckDate = new Date(hoy);
            let checkSet = new Set(checkins.map(c => c.fecha));
            
            // if today is not checked, start from yesterday
            const todayStr = `${currentCheckDate.getFullYear()}-${String(currentCheckDate.getMonth()+1).padStart(2,'0')}-${String(currentCheckDate.getDate()).padStart(2,'0')}`;
            if (!checkSet.has(todayStr)) {
                currentCheckDate.setDate(currentCheckDate.getDate() - 1);
            }
            
            while(true) {
                const dateStr = `${currentCheckDate.getFullYear()}-${String(currentCheckDate.getMonth()+1).padStart(2,'0')}-${String(currentCheckDate.getDate()).padStart(2,'0')}`;
                if(checkSet.has(dateStr)) {
                    rachaActual++;
                    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
                } else {
                    break;
                }
            }

            // Ausente calc
            const diffDiasAusente = (hoy - new Date(checkins[0].fecha + "T00:00:00")) / (1000 * 60 * 60 * 24);
            isAusenteBadge = diffDiasAusente > 5;
        } else {
            const diffDiasAusente = (hoy - fReg) / (1000 * 60 * 60 * 24);
            isAusenteBadge = diffDiasAusente > 5;
        }

        // 3. Heatmap
        let heatmapHtml = '';
        const setFechas = new Set(checkins.map(c => c.fecha));
        let diasAsistidos30 = 0;
        for(let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const vino = setFechas.has(dateStr);
            if (vino) diasAsistidos30++;
            heatmapHtml += `<div class="heatmap-cell" style="background-color: ${vino ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)'};" title="${dateStr}${vino?' (Asistió)':''}"></div>`;
        }

        // Historial list HTML
        const historialHtml = checkins.slice(0, 8).map(c => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; background: rgba(16, 185, 129, 0.1); color: var(--color-success); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span class="material-icons-round" style="font-size: 16px;">login</span>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">Check-in</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">${formatFecha(c.fecha)}</div>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--color-success); font-weight: 600;">Acceso concedido</div>
            </div>
        `).join('');

        const user = getCurrentUser();
        const isAdmin = user && user.role !== 'Empleado';

        const profileHtml = `
            <!-- Navigation Header -->
            <div class="profile-nav" style="display: flex; align-items: center; margin-bottom: 24px; gap: 16px;">
                <button class="btn btn-outline" id="btnVolverSocios" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-secondary); padding: 8px 16px; border-radius: var(--border-radius-sm); font-weight: 600;">
                    <span class="material-icons-round" style="font-size: 18px; margin-right: 4px;">arrow_back</span> VOLVER
                </button>
                <div style="color: var(--color-text-secondary); font-size: 13px; font-weight: 600; letter-spacing: 1px;">
                    CLIENTES / <span style="color: var(--color-text-primary);">${socio.nombre.toUpperCase()}</span>
                </div>
            </div>

            <!-- Top Header Card -->
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 24px; flex-wrap: wrap; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="width: 80px; height: 80px; background: rgba(148, 255, 0, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: var(--color-primary);">${socio.nombre.substring(0,2).toUpperCase()}</div>
                    <div>
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${socio.nombre.toUpperCase()}</h1>
                        <div style="display: flex; gap: 16px; color: var(--color-text-secondary); font-size: 13px; margin-top: 8px; align-items: center; flex-wrap: wrap;">
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">person</span> ${socio.edad ? socio.edad + ' años' : '-'}</span>
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">phone</span> ${socio.telefono || 'Sin teléfono'}</span>
                            <span style="display: flex; align-items: center; gap: 4px;"><span class="material-icons-round" style="font-size:16px;">calendar_today</span> Socio desde ${formatFecha(socio.fechaRegistro)}</span>
                            <span class="status-badge ${socio.estado === 'Vencido' ? 'status-vencido' : (isAusenteBadge ? 'status-ausente' : 'status-activo')}" style="padding: 2px 8px;">
                                ${socio.estado === 'Vencido' ? 'VENCIDO' : (isAusenteBadge ? 'AUSENTE' : 'ACTIVO')}
                            </span>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-outline" id="btnDeudaProfile"><span class="material-icons-round" style="font-size:18px;">add</span> AÑADIR DEUDA</button>
                    <button class="btn btn-outline" id="btnVerQrProfile"><span class="material-icons-round" style="font-size:18px;">qr_code</span> VER QR</button>
                    ${isAdmin ? `<button class="btn btn-outline danger" id="btnEliminarProfile" style="border-color: rgba(239, 68, 68, 0.2); color: var(--color-danger);"><span class="material-icons-round" style="font-size:18px;">delete</span> ELIMINAR</button>` : ''}
                    <button class="btn btn-outline" id="btnRenovarProfile"><span class="material-icons-round" style="font-size:18px;">autorenew</span> RENOVAR PLAN</button>
                    <button class="btn btn-primary" id="btnCheckinProfile"><span class="material-icons-round" style="font-size:18px;">flash_on</span> CHECK-IN</button>
                </div>
            </div>

            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px;">
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">RACHA ACTUAL</div>
                    <div style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${rachaActual} <span style="font-size: 14px; font-weight: 500; color: var(--color-text-secondary);">días</span></div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">ASISTENCIAS TOTALES</div>
                    <div style="font-size: 28px; font-weight: 800;">${checkins.length}</div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">DÍAS COMO SOCIO</div>
                    <div style="font-size: 28px; font-weight: 800;">${diasComoSocio}</div>
                </div>
                <div class="profile-stat-card">
                    <div style="color: var(--color-text-secondary); font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">ÚLTIMA VISITA</div>
                    <div style="font-size: 20px; font-weight: 800; margin-top: 8px;">${ultimaVisitaFormateada}</div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                
                <!-- Left Column -->
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <!-- Plan Status -->
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">ESTADO DEL PLAN <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">Plan ${socio.membresia} · $${socio.precio.toFixed(2)}</span></div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: var(--color-text-secondary); letter-spacing: 1px; margin-bottom: 8px;">
                            <span>INICIO · ${formatFecha(socio.fechaRegistro).toUpperCase()}</span>
                            <span>VENCE · ${formatFecha(socio.fechaVencimiento).toUpperCase()}</span>
                        </div>
                        
                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
                            <div style="height: 100%; width: ${porcentaje}%; background: ${porcentaje >= 100 ? 'var(--color-danger)' : 'var(--color-primary)'}; border-radius: 3px; transition: width 0.5s ease;"></div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
                            <span style="${porcentaje >= 100 ? 'color: var(--color-danger);' : ''}">${diasRestantes > 0 ? diasRestantes + ' días restantes' : 'Plan Vencido'}</span>
                            <span style="color: var(--color-text-secondary); font-weight: 500;">${Math.floor(porcentaje)}% transcurrido</span>
                        </div>
                    </div>

                    <!-- Heatmap -->
                    <div class="card" style="padding: 24px;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">ASISTENCIA · ÚLTIMOS 30 DÍAS <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">${diasAsistidos30} días</span></div>
                        <div class="heatmap-grid">
                            ${heatmapHtml}
                        </div>
                    </div>
                </div>
                
                <!-- Right Column: Historial -->
                <div class="card" style="padding: 24px; min-height: 400px; display: flex; flex-direction: column;">
                    <div style="font-size: 14px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.5px;">HISTORIAL <span style="color: var(--color-text-secondary); font-weight: 400; font-size: 13px; margin-left: 8px;">${checkins.length} visitas</span></div>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; padding-right: 5px;">
                        ${checkins.length === 0 ? `
                            <div style="text-align: center; color: var(--color-text-secondary); margin-top: 60px;">
                                <div style="font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px; font-size: 13px;">SIN ASISTENCIAS</div>
                                <div style="font-size: 12px;">Registra el primer check-in.</div>
                            </div>
                        ` : historialHtml}
                    </div>
                </div>

            </div>
        `;

        profileView.innerHTML = profileHtml;

        // Bindings for Profile Buttons
        document.getElementById('btnVolverSocios').addEventListener('click', () => {
            profileView.style.display = 'none';
            document.getElementById('sociosMainView').style.display = 'block';
            renderTable(); // Update stats in table just in case
        });

        document.getElementById('btnCheckinProfile').addEventListener('click', () => {
            addCheckin(socio.id, socio.nombre);
            window.showToast(`Check-in registrado para ${socio.nombre}`, 'success');
            openProfileView(id); // Reload profile view to show updated stats
        });

        if (isAdmin) {
            const btnDelProf = document.getElementById('btnEliminarProfile');
            if(btnDelProf) {
                btnDelProf.addEventListener('click', () => {
                    openDeleteModal(id, socio.nombre);
                });
            }
        }

        document.getElementById('btnRenovarProfile').addEventListener('click', () => {
            // Re-utilize Edit Plan logic or simply renew for 30 days
            const nuevoVencimiento = calcularVencimiento(socio.membresia);
            updateSocio(socio.id, { fechaVencimiento: nuevoVencimiento, estado: 'Activo' });
            addTransaccion({
                tipo: 'ingreso',
                concepto: `Renovación Membresía ${socio.membresia} - ${socio.nombre}`,
                monto: socio.precio,
            });
            window.showToast('Plan renovado con éxito', 'success');
            openProfileView(id); // Reload
        });

        document.getElementById('btnVerQrProfile').addEventListener('click', () => {
            const qrModalHtml = `
                <div class="modal-header">
                    <h3 class="modal-title">CÓDIGO QR - ${socio.nombre.toUpperCase()}</h3>
                    <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                    <div id="qrcode-large-${socio.id}" style="background: white; padding: 15px; border-radius: 8px;"></div>
                    <p style="margin-top: 20px; font-size: 14px; color: var(--color-text-secondary); text-align: center;">Este código permite el acceso automático por la cámara.</p>
                </div>
            `;
            window.openModal(qrModalHtml);
            
            setTimeout(() => {
                if (window.QRCode) {
                    new window.QRCode(document.getElementById(`qrcode-large-${socio.id}`), {
                        text: socio.id,
                        width: 200,
                        height: 200,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : window.QRCode.CorrectLevel.H
                    });
                }
            }, 100);
        });

        document.getElementById('btnDeudaProfile').addEventListener('click', () => {
            window.showToast('Función de AÑADIR DEUDA en desarrollo', 'info');
            // Here you can open another modal to add a debt
        });
    }

};

function setupPlanSelection() {
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
        });
    });
}
