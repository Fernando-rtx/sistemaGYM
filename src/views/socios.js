import { getSocios, addSocio, updateSocio, deleteSocio, addCheckin, calcularVencimiento, formatFecha, addTransaccion, getSettings, getCheckins, getCurrentUser } from '../js/dataStore.js';

export const render = () => {
    return `
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

        tbody.innerHTML = filtrados.map(s => `
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
                    <span class="status-badge ${s.estado === 'Activo' ? 'status-activo' : 'status-vencido'}">
                        ${s.estado.toUpperCase()}
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
        `).join('');

        // Contadores
        filterBtns[0].textContent = `TODOS (${countTodos})`;
        filterBtns[1].textContent = `ACTIVOS (${countActivos})`;
        filterBtns[2].textContent = `POR RENOVAR (${countVencer})`;
        filterBtns[3].textContent = `VENCIDOS (${countVencidos})`;
        filterBtns[4].textContent = `AUSENTES (${countAusentes})`;

        // Attach row action handlers
        document.querySelectorAll('.btn-checkin-row').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const nombre = btn.getAttribute('data-nombre');
                addCheckin(id, nombre);
                window.showToast(`Check-in registrado para ${nombre}`, 'success');
            });
        });

        document.querySelectorAll('.btn-edit-row').forEach(btn => {
            btn.addEventListener('click', () => {
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

        // Row click for Profile
        document.querySelectorAll('.socio-row').forEach(row => {
            row.addEventListener('click', (e) => {
                // Ignore clicks on buttons
                if(e.target.closest('button')) return;
                const id = row.getAttribute('data-id');
                openProfileModal(id);
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
            const newSocio = addSocio({
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
            renderTable();
        });
    }

    // Profile Modal
    function openProfileModal(id) {
        const socio = socios.find(s => s.id === id);
        if (!socio) return;
        
        // Calcular info membresía
        const fReg = new Date(socio.fechaRegistro);
        const fVenc = new Date(socio.fechaVencimiento);
        const hoy = new Date();
        const totalDias = Math.max(1, Math.ceil((fVenc - fReg) / (1000 * 60 * 60 * 24)));
        const diasPasados = Math.max(0, Math.ceil((hoy - fReg) / (1000 * 60 * 60 * 24)));
        let porcentaje = (diasPasados / totalDias) * 100;
        if(porcentaje > 100) porcentaje = 100;
        
        // Heatmap últimos 30 días
        const checkins = getCheckins().filter(c => c.socioId === id);
        const setFechas = new Set(checkins.map(c => c.fecha));
        let heatmapHtml = '';
        for(let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const vino = setFechas.has(dateStr);
            heatmapHtml += `<div style="width: 15px; height: 15px; border-radius: 3px; background-color: ${vino ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'};" title="${dateStr}${vino?' (Asistió)':''}"></div>`;
        }

        const modalHtml = `
            <div class="modal-header">
                <h3 class="modal-title">PERFIL DEL SOCIO</h3>
                <button class="btn-close" onclick="window.closeModal()"><span class="material-icons-round">close</span></button>
            </div>
            
            <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 25px;">
                <div style="width: 80px; height: 80px; background: var(--color-bg-base); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700;">\${socio.nombre.substring(0,2).toUpperCase()}</div>
                <div style="flex: 1;">
                    <h2 style="margin: 0; font-size: 20px; display: flex; align-items: center; gap: 10px;">\${socio.nombre} <span class="status-badge \${socio.estado === 'Activo' ? 'status-activo' : 'status-vencido'}" style="font-size:10px;">\${socio.estado.toUpperCase()}</span></h2>
                    <div style="color: var(--color-text-secondary); font-size: 14px; margin-top: 5px;">\${socio.edad ? socio.edad + ' años • ' : ''}\${socio.telefono || 'Sin teléfono'}</div>
                </div>
                <div id="qrcode-\${socio.id}" style="background: white; padding: 5px; border-radius: 5px;"></div>
            </div>

            <div style="background: var(--color-bg-base); padding: 20px; border-radius: var(--border-radius-md); margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
                    <span style="color: var(--color-text-secondary);">Plan \${socio.membresia}</span>
                    <span style="\${porcentaje >= 100 ? 'color: var(--color-danger);' : ''}">Vence: \${formatFecha(socio.fechaVencimiento)}</span>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: \${porcentaje}%; background: \${porcentaje >= 100 ? 'var(--color-danger)' : 'var(--color-primary)'}; border-radius: 4px;"></div>
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <h4 style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 10px;">ASISTENCIA (ÚLTIMOS 30 DÍAS)</h4>
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                    \${heatmapHtml}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: var(--color-text-secondary);">Total de visitas: <strong style="color:var(--color-text-primary);">\${checkins.length}</strong></div>
            </div>

            <div style="display: flex; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <button class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="window.closeModal()">CERRAR</button>
                <button class="btn btn-primary btn-checkin-row" data-id="\${socio.id}" data-nombre="\${socio.nombre}" style="flex: 1; justify-content: center;">
                    <span class="material-icons-round">login</span> CHECK-IN
                </button>
            </div>
        `;
        
        window.openModal(modalHtml);

        // Generar QR
        setTimeout(() => {
            if (window.QRCode) {
                new window.QRCode(document.getElementById(`qrcode-${socio.id}`), {
                    text: socio.id,
                    width: 70,
                    height: 70,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : window.QRCode.CorrectLevel.L
                });
            }
        }, 100);

        // Bind check-in button inside modal
        const btnCheck = document.querySelector('#globalModal .btn-checkin-row');
        if (btnCheck) {
            btnCheck.addEventListener('click', () => {
                addCheckin(socio.id, socio.nombre);
                window.closeModal();
                window.showToast(`Check-in registrado para ${socio.nombre}`, 'success');
                renderTable(); // Update main view
            });
        }
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
