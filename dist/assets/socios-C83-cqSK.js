var e=()=>`
        <div class="socios-header">
            <div class="filters">
                <input type="text" class="search-input" placeholder="🔍 Buscar socio...">
                <div class="status-filters">
                    <button class="filter-btn active">TODOS (25)</button>
                    <button class="filter-btn text-success">ACTIVOS (18)</button>
                    <button class="filter-btn text-danger">VENCIDOS (7)</button>
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
    `,t=()=>{let e=[{id:`001`,nombre:`Carlos Mendoza`,membresia:`Mensual`,vencimiento:`18 May`,estado:`Vencido`},{id:`002`,nombre:`María Fernanda López`,membresia:`Mensual`,vencimiento:`09 Jun`,estado:`Activo`},{id:`003`,nombre:`Roberto Castillo`,membresia:`Anual`,vencimiento:`15 Dic`,estado:`Activo`}],t=document.getElementById(`sociosTbody`);t&&(t.innerHTML=e.map(e=>`
        <tr>
            <td style="color: var(--color-text-secondary);">#${e.id}</td>
            <td>
                <div style="display: flex; align-items: center;">
                    <span class="avatar-sm">${e.nombre.substring(0,2).toUpperCase()}</span>
                    ${e.nombre}
                </div>
            </td>
            <td>${e.membresia}</td>
            <td>${e.vencimiento}</td>
            <td>
                <span class="status-badge ${e.estado===`Activo`?`status-activo`:`status-vencido`}">
                    ${e.estado.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;">CHECK-IN</button>
            </td>
        </tr>
    `).join(``))};export{t as init,e as render};