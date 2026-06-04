import { Socio } from '../../js/models/Socio.js';

export class SociosTable {
    constructor(container, services, eventBus, onOpenProfile, onOpenEdit, onOpenDelete, onRegisterCheckin) {
        this.container = container;
        this.services = services;
        this.eventBus = eventBus;
        this.onOpenProfile = onOpenProfile;
        this.onOpenEdit = onOpenEdit;
        this.onOpenDelete = onOpenDelete;
        this.onRegisterCheckin = onRegisterCheckin;
        this.searchQuery = '';
        this.currentFilter = 'TODOS';
        this.socios = [];
        this.checkins = [];
    }

    render() {
        return `
            <div class="socios-header">
                <div class="search-input-container">
                    <span class="material-icons-round">search</span>
                    <input type="text" class="search-input" placeholder="Buscar socio por nombre o ID...">
                </div>
                <div class="filters">
                    <div class="status-filters">
                        <button class="filter-btn active" data-filter="TODOS">TODOS (0)</button>
                        <button class="filter-btn" data-filter="ACTIVO">ACTIVOS (0)</button>
                        <button class="filter-btn" data-filter="POR RENOVAR">POR RENOVAR (0)</button>
                        <button class="filter-btn" data-filter="VENCIDOS">VENCIDOS (0)</button>
                        <button class="filter-btn" data-filter="AUSENTE">AUSENTES (0)</button>
                    </div>
                    <button class="btn btn-primary" id="btnNuevoSocio">
                        <span class="material-icons-round">add</span> NUEVO SOCIO
                    </button>
                </div>
            </div>
            
            <div class="card socios-table-container">
                <div class="table-responsive">
                    <table class="socios-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>SOCIO</th>
                                <th>MEMBRESÍA</th>
                                <th>VENCIMIENTO</th>
                                <th>ESTADO</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody id="sociosTbody">
                            <!-- Filas dinámicas -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();
        
        const searchInput = this.container.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.updateTable();
            });
        }

        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter');
                this.updateTable();
            });
        });

        const btnNuevoSocio = this.container.querySelector('#btnNuevoSocio');
        if (btnNuevoSocio && this.onOpenEdit) {
            btnNuevoSocio.addEventListener('click', () => this.onOpenEdit(null));
        }

        await this.refreshData();
    }

    async refreshData() {
        this.socios = await this.services.socio.getAll();
        this.checkins = await this.services.checkin.getAll();
        await this.updateTable();
    }

    async updateTable() {
        const tbody = this.container.querySelector('#sociosTbody');
        if (!tbody) return;

        let countTodos = 0, countActivos = 0, countVencer = 0, countVencidos = 0, countAusentes = 0;

        const processed = this.socios.map(s => {
            const isVencido = s.estaVencido;
            const isPorVencer = s.estaPorVencer;
            const isAusente = this.services.checkin.esAusente(s, this.checkins);
            const isActivo = s.estado === 'Activo' && !isVencido;

            return { socio: s, isActivo, isVencido, isPorVencer, isAusente };
        });

        processed.forEach(item => {
            countTodos++;
            if (item.isActivo) countActivos++;
            if (item.isVencido) countVencidos++;
            if (item.isPorVencer) countVencer++;
            if (item.isAusente) countAusentes++;
        });

        const filterBtns = this.container.querySelectorAll('.filter-btn');
        if (filterBtns.length === 5) {
            filterBtns[0].textContent = `TODOS (${countTodos})`;
            filterBtns[1].textContent = `ACTIVOS (${countActivos})`;
            filterBtns[2].textContent = `POR RENOVAR (${countVencer})`;
            filterBtns[3].textContent = `VENCIDOS (${countVencidos})`;
            filterBtns[4].textContent = `AUSENTES (${countAusentes})`;
        }

        const filtered = processed.filter(item => {
            const s = item.socio;
            const matchesSearch = s.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) || s.id.includes(this.searchQuery);
            
            let matchesFilter = false;
            if (this.currentFilter === 'TODOS') matchesFilter = true;
            if (this.currentFilter === 'ACTIVO' && item.isActivo) matchesFilter = true;
            if (this.currentFilter === 'VENCIDOS' && item.isVencido) matchesFilter = true;
            if (this.currentFilter === 'POR RENOVAR' && item.isPorVencer) matchesFilter = true;
            if (this.currentFilter === 'AUSENTE' && item.isAusente) matchesFilter = true;

            return matchesSearch && matchesFilter;
        });

        const user = this.services.auth.getCurrentUser();

        tbody.innerHTML = filtered.map(item => {
            const s = item.socio;
            const statusClass = item.isVencido ? 'status-vencido' : (item.isAusente ? 'status-ausente' : 'status-activo');
            const statusLabel = item.isVencido ? 'VENCIDO' : (item.isAusente ? 'AUSENTE' : 'ACTIVO');

            return `
                <tr style="cursor: pointer;" class="socio-row" data-id="${s.id}">
                    <td style="color: var(--color-text-secondary);">#${s.id.substring(0,6)}</td>
                    <td>
                        <div style="display: flex; align-items: center;">
                            <span class="avatar-sm">${s.iniciales}</span>
                            <div>
                                <div>${s.nombre}</div>
                                <div style="font-size: 12px; color: var(--color-text-secondary);">${s.edad ? s.edad + ' años • ' : ''}${s.telefono || 'Sin teléfono'}</div>
                            </div>
                        </div>
                    </td>
                    <td>${s.membresia}</td>
                    <td>${Socio.formatFecha(s.fechaVencimiento)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${statusLabel}
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

        tbody.querySelectorAll('.btn-checkin-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (this.onRegisterCheckin) this.onRegisterCheckin(id);
            });
        });

        tbody.querySelectorAll('.btn-edit-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (this.onOpenEdit) this.onOpenEdit(id);
            });
        });

        tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const nombre = btn.getAttribute('data-nombre');
                if (this.onOpenDelete) this.onOpenDelete(id, nombre);
            });
        });

        tbody.querySelectorAll('.socio-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.closest('.action-btns')) return;
                const id = row.getAttribute('data-id');
                if (this.onOpenProfile) this.onOpenProfile(id);
            });
        });
    }
}
