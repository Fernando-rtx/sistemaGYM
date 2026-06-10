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
        this._page = 1;
        this._pageSize = 20;
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
                        <button class="filter-btn" data-filter="CONGELADOS">CONGELADOS (0)</button>
                    </div>
                    <button class="btn btn-primary" id="btnNuevoSocio">
                        <span class="material-icons-round">add</span> NUEVO SOCIO
                    </button>
                    <button class="btn btn-outline" id="btnExportarCSV">
                        <span class="material-icons-round" style="font-size: 18px;">file_download</span> EXPORTAR CSV
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

            <div class="pagination-container">
                <!-- Rendered by _renderPagination -->
            </div>

            <style>
                .socios-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .search-input-container {
                    display: flex;
                    align-items: center;
                    background-color: var(--color-bg-base);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--border-radius-md);
                    padding: 0 16px;
                    width: 350px;
                    max-width: 100%;
                    gap: 12px;
                    transition: border-color var(--transition-fast);
                }
                .search-input-container:focus-within {
                    border-color: var(--color-primary);
                }
                .search-input-container .material-icons-round {
                    color: var(--color-text-secondary);
                }
                .search-input {
                    background: transparent;
                    border: none;
                    color: var(--color-text-primary);
                    padding: 12px 0;
                    font-size: 14px;
                    width: 100%;
                    outline: none;
                }
                .filters {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .status-filters {
                    display: flex;
                    gap: 4px;
                    background-color: var(--color-bg-base);
                    padding: 4px;
                    border-radius: var(--border-radius-md);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .filter-btn {
                    background: transparent;
                    border: none;
                    color: var(--color-text-secondary);
                    padding: 8px 16px;
                    border-radius: var(--border-radius-sm);
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                .filter-btn:hover {
                    color: var(--color-text-primary);
                }
                .filter-btn.active {
                    background-color: var(--color-bg-surface-hover);
                    color: var(--color-text-primary);
                }
                
                .socios-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .socios-table th {
                    text-align: left;
                    padding: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    color: var(--color-text-secondary);
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .socios-table td {
                    padding: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
                    vertical-align: middle;
                    font-size: 14px;
                }
                .socios-table tbody tr {
                    transition: background-color var(--transition-fast);
                }
                .socios-table tbody tr:hover {
                    background-color: rgba(255, 255, 255, 0.02);
                }
                
                .avatar-sm {
                    width: 36px;
                    height: 36px;
                    background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
                    color: var(--color-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 800;
                    margin-right: 12px;
                    flex-shrink: 0;
                }
                
                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    display: inline-block;
                }
                .status-activo {
                    background-color: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .status-vencido {
                    background-color: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .status-ausente {
                    background-color: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }
                .status-congelado {
                    background-color: rgba(234, 179, 8, 0.15);
                    color: #eab308;
                    border: 1px solid rgba(234, 179, 8, 0.3);
                }
                
                .action-btns {
                    display: flex;
                    gap: 8px;
                }
                .btn-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    background-color: rgba(255, 255, 255, 0.05);
                    color: var(--color-text-secondary);
                }
                .btn-icon:hover {
                    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
                    color: var(--color-primary);
                }
                .btn-icon.danger {
                    background-color: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }
                .btn-icon.danger:hover {
                    background-color: #ef4444;
                    color: white;
                }
                
                .pagination-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 0;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .pagination-info {
                    color: var(--color-text-secondary);
                    font-size: 13px;
                }
                .pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .page-btn {
                    min-width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: transparent;
                    color: var(--color-text-secondary);
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all var(--transition-fast);
                    padding: 0 8px;
                }
                .page-btn:hover:not(:disabled) {
                    background-color: rgba(255, 255, 255, 0.05);
                    color: var(--color-text-primary);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .page-btn.active {
                    background-color: var(--color-primary);
                    color: white;
                    border-color: var(--color-primary);
                }
                .page-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .page-ellipsis {
                    color: var(--color-text-secondary);
                    padding: 0 4px;
                    font-size: 13px;
                }

                @media (max-width: 900px) {
                    .socios-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .search-input-container {
                        width: 100%;
                    }
                    .status-filters {
                        flex-wrap: wrap;
                    }
                }
            </style>
        `;
    }

    async init() {
        this.container.innerHTML = this.render();
        
        const searchInput = this.container.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this._searchTimer);
                this._searchTimer = setTimeout(() => {
                    this.searchQuery = e.target.value;
                    this._page = 1;
                    this.updateTable();
                }, 300);
            });
        }

        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter');
                this._page = 1;
                this.updateTable();
            });
        });

        const btnNuevoSocio = this.container.querySelector('#btnNuevoSocio');
        if (btnNuevoSocio && this.onOpenEdit) {
            btnNuevoSocio.addEventListener('click', () => this.onOpenEdit(null));
        }

        const btnCSV = this.container.querySelector('#btnExportarCSV');
        if (btnCSV) {
            btnCSV.addEventListener('click', () => {
                this.exportToCSV(this.socios, `socios_${new Date().toISOString().split('T')[0]}.csv`);
            });
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

        let countTodos = 0, countActivos = 0, countVencer = 0, countVencidos = 0, countAusentes = 0, countCongelados = 0;

        const processed = this.socios.map(s => {
            const isVencido = s.estaVencido;
            const isPorVencer = s.estaPorVencer;
            const isAusente = this.services.checkin.esAusente(s, this.checkins);
            const isActivo = s.estado === 'Activo' && !isVencido;
            const isCongelado = s.estaCongelado;

            return { socio: s, isActivo, isVencido, isPorVencer, isAusente, isCongelado };
        });

        processed.forEach(item => {
            countTodos++;
            if (item.isActivo) countActivos++;
            if (item.isVencido) countVencidos++;
            if (item.isPorVencer) countVencer++;
            if (item.isAusente) countAusentes++;
            if (item.isCongelado) countCongelados++;
        });

        const filterBtns = this.container.querySelectorAll('.filter-btn');
        if (filterBtns.length === 6) {
            filterBtns[0].textContent = `TODOS (${countTodos})`;
            filterBtns[1].textContent = `ACTIVOS (${countActivos})`;
            filterBtns[2].textContent = `POR RENOVAR (${countVencer})`;
            filterBtns[3].textContent = `VENCIDOS (${countVencidos})`;
            filterBtns[4].textContent = `AUSENTES (${countAusentes})`;
            filterBtns[5].textContent = `CONGELADOS (${countCongelados})`;
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
            if (this.currentFilter === 'CONGELADOS' && item.isCongelado) matchesFilter = true;

            return matchesSearch && matchesFilter;
        });

        const totalPages = Math.ceil(filtered.length / this._pageSize) || 1;
        if (this._page > totalPages) this._page = totalPages;
        const start = (this._page - 1) * this._pageSize;
        const pageItems = filtered.slice(start, start + this._pageSize);

        const user = this.services.auth.getCurrentUser();

        if (pageItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--color-text-secondary); font-size: 14px;">No se encontraron socios con los filtros actuales</td></tr>';
            this._renderPagination(filtered.length);
            return;
        }

        tbody.innerHTML = pageItems.map(item => {
            const s = item.socio;
            let statusClass, statusLabel;
            if (item.isCongelado) {
                statusClass = 'status-congelado';
                statusLabel = 'CONGELADO';
            } else if (item.isVencido) {
                statusClass = 'status-vencido';
                statusLabel = 'VENCIDO';
            } else if (item.isAusente) {
                statusClass = 'status-ausente';
                statusLabel = 'AUSENTE';
            } else {
                statusClass = 'status-activo';
                statusLabel = 'ACTIVO';
            }

            const avatarHtml = s.foto_url
                ? `<img src="${s.foto_url}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;margin-right:12px;flex-shrink:0;">`
                : `<span class="avatar-sm">${s.iniciales}</span>`;

            return `
                <tr style="cursor: pointer;" class="socio-row" data-id="${s.id}">
                    <td style="color: var(--color-text-secondary);">#${s.id.substring(0,6)}</td>
                    <td>
                        <div style="display: flex; align-items: center;">
                            ${avatarHtml}
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

        this._renderPagination(filtered.length);
    }

    _renderPagination(totalItems) {
        const container = this.container.querySelector('.pagination-container');
        if (!container) return;

        const totalPages = Math.ceil(totalItems / this._pageSize) || 1;
        const currentPage = this._page;
        const start = totalItems > 0 ? (currentPage - 1) * this._pageSize + 1 : 0;
        const end = Math.min(currentPage * this._pageSize, totalItems);

        let html = '';

        html += `<div class="pagination-info">Mostrando ${start}-${end} de ${totalItems} socios</div>`;

        html += '<div class="pagination-controls">';

        html += `<button class="page-btn" data-page="1" ${currentPage === 1 ? 'disabled' : ''}>«</button>`;
        html += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;

        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 2) {
                startPage = 2;
                endPage = 4;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }

            if (startPage > 2) pages.push('...');
            for (let i = startPage; i <= endPage; i++) pages.push(i);
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        pages.forEach(p => {
            if (p === '...') {
                html += '<span class="page-ellipsis">...</span>';
            } else {
                html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
            }
        });

        html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
        html += `<button class="page-btn" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''}>»</button>`;

        html += '</div>';

        container.innerHTML = html;

        container.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                this._page = parseInt(btn.getAttribute('data-page'));
                this.updateTable();
            });
        });
    }

    exportToCSV(data, filename) {
        const headers = ['ID', 'Nombre', 'Teléfono', 'Edad', 'Membresía', 'Precio', 'Fecha Registro', 'Fecha Vencimiento', 'Estado'];
        const rows = data.map(s => [
            s.id,
            s.nombre,
            s.telefono || '',
            s.edad || '',
            s.membresia,
            s.precio.toFixed(2),
            s.fechaRegistro || '',
            s.fechaVencimiento || '',
            s.estado
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
        this.services.toast.success(`CSV exportado: ${filename}`);
    }
}
